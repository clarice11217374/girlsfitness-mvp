/**
 * Download exercise media → public/exercises/ + exerciseMediaManifest.json
 *
 * Priority (per exercise id):
 * 1. Manual file: public/exercises/{id}.mp4 | .gif | .webm | .jpg ...
 * 2. curatedFemaleMedia.json URL override
 * 3. AscendAPI (RAPIDAPI_KEY) — prefers gif/mp4
 * 4. Female gif/mp4: Giphy (GIPHY_API_KEY) → Pexels video (PEXELS_API_KEY)
 * 5. free-exercise-db static jpg (last resort)
 * 6. gallery fallback png
 *
 * Usage: node scripts/fetch-exercise-media.mjs
 *        node scripts/fetch-exercise-media.mjs --manifest-only  (scan manual files only)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import exerciseMediaSearchQueries from "../src/data/exerciseMediaSearchQueries.json" with { type: "json" };
import curatedFemaleMedia from "../src/data/curatedFemaleMedia.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const exercisesDir = path.join(root, "public", "exercises");
const manifestPath = path.join(root, "src", "data", "exerciseMediaManifest.json");

const ASCENDAPI_BASE_URL =
  "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search";
const FREE_DB_JSON =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const FREE_DB_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

const MANUAL_MOTION_EXTENSIONS = [".mp4", ".webm", ".gif"];
const STATIC_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"];
const FEMALE_POSITIVE = [
  "woman",
  "women",
  "female",
  "girl",
  "pilates",
  "yoga",
  "barre",
  "stretching",
  "wellness",
];
const MALE_NEGATIVE = [
  "bodybuilder",
  "bodybuilding",
  "muscle man",
  "bench press man",
  "mr olympia",
  "powerlifting male",
];

const manifestOnly = process.argv.includes("--manifest-only");
const forceRefresh = process.argv.includes("--force");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function firstStringInArray(value) {
  if (!Array.isArray(value)) return undefined;
  return value.find((item) => typeof item === "string" && item.trim().length > 0);
}

function pickGifUrl(exercise) {
  return firstString(
    exercise.gifUrl,
    exercise.gif_url,
    exercise.animationUrl,
    exercise.animatedUrl,
  );
}

function pickImageUrl(exercise) {
  return firstString(
    pickGifUrl(exercise),
    exercise.imageUrl,
    exercise.image_url,
    exercise.image,
    exercise.thumbnail,
    exercise.thumbnailUrl,
    firstStringInArray(exercise.images),
    firstStringInArray(exercise.imageUrls),
  );
}

function pickVideoUrl(exercise) {
  return firstString(
    exercise.videoUrl,
    exercise.video_url,
    exercise.video,
    exercise.videoLink,
    exercise.mp4Url,
    exercise.mp4_url,
    firstStringInArray(exercise.videos),
    firstStringInArray(exercise.videoUrls),
  );
}

function pickResults(payload) {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  for (const key of ["data", "results", "exercises", "items", "response"]) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = pickResults(candidate);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

function buildFemaleSearchQueries(base) {
  const q = base.trim();
  return [
    `woman ${q} workout`,
    `female ${q} exercise`,
    `women ${q} fitness`,
    `pilates ${q} woman`,
    `female dumbbell ${q}`,
    `women stretching ${q}`,
    `${q} woman training`,
  ];
}

function femaleScoreText(text) {
  const lower = (text || "").toLowerCase();
  let score = 0;
  for (const w of FEMALE_POSITIVE) {
    if (lower.includes(w)) score += 2;
  }
  for (const w of MALE_NEGATIVE) {
    if (lower.includes(w)) score -= 4;
  }
  return score;
}

function mediaKindFromUrl(url) {
  const lower = url.toLowerCase();
  if (/\.(mp4|webm|mov)(\?|$)/.test(lower)) return "video";
  if (/\.gif(\?|$)/.test(lower)) return "gif";
  return "image";
}

function extForKind(kind, url) {
  if (kind === "video") return extFromUrl(url, ".mp4");
  if (kind === "gif") return extFromUrl(url, ".gif");
  return extFromUrl(url, ".jpg");
}

function extFromUrl(url, fallback = ".jpg") {
  try {
    const ext = path.extname(new URL(url).pathname);
    if (ext && ext.length <= 5) return ext;
  } catch {
    /* ignore */
  }
  return fallback;
}

async function downloadToFile(url, destPath) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(await response.arrayBuffer()));
}

function galleryFallbackPath(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % 10_007;
  return `/gallery/${(hash % 7) + 1}.png`;
}

function entryFromLocalFile(id, ext) {
  const publicPath = `/exercises/${id}${ext}`;
  if ([".mp4", ".webm", ".mov"].includes(ext)) {
    const posterGif = path.join(exercisesDir, `${id}.gif`);
    const posterJpg = path.join(exercisesDir, `${id}-poster.jpg`);
    return {
      videoUrl: publicPath,
      imageUrl: fs.existsSync(posterGif)
        ? `/exercises/${id}.gif`
        : fs.existsSync(posterJpg)
          ? `/exercises/${id}-poster.jpg`
          : undefined,
      mediaType: "video",
      source: "manual-motion",
    };
  }
  if (ext === ".gif") {
    return { imageUrl: publicPath, mediaType: "gif", source: "manual-motion" };
  }
  return { imageUrl: publicPath, mediaType: "image", source: "manual" };
}

/** User-placed gif/mp4 always win. */
function detectManualMotionMedia(id) {
  for (const ext of MANUAL_MOTION_EXTENSIONS) {
    const filePath = path.join(exercisesDir, `${id}${ext}`);
    if (fs.existsSync(filePath)) return entryFromLocalFile(id, ext);
  }
  return null;
}

function detectExistingStaticFile(id) {
  if (forceRefresh) return null;
  for (const ext of STATIC_EXTENSIONS) {
    const filePath = path.join(exercisesDir, `${id}${ext}`);
    if (fs.existsSync(filePath)) return entryFromLocalFile(id, ext);
  }
  return null;
}

async function saveDownloadedMedia(id, { primaryUrl, posterUrl, kind, source, searchQuery, matchedName }) {
  const ext = extForKind(kind, primaryUrl);
  const filename = `${id}${ext}`;
  await downloadToFile(primaryUrl, path.join(exercisesDir, filename));

  const entry = {
    source,
    searchQuery,
    matchedName,
    mediaType: kind,
  };

  if (kind === "video") {
    entry.videoUrl = `/exercises/${filename}`;
    if (posterUrl) {
      const posterExt = extFromUrl(posterUrl, ".jpg");
      const posterName = `${id}-poster${posterExt}`;
      await downloadToFile(posterUrl, path.join(exercisesDir, posterName));
      entry.imageUrl = `/exercises/${posterName}`;
    }
  } else {
    entry.imageUrl = `/exercises/${filename}`;
  }

  return entry;
}

function rankRemoteCandidate(remote) {
  const videoUrl = remote.videoUrl;
  const imageUrl = remote.imageUrl;
  if (videoUrl) {
    return { kind: "video", primaryUrl: videoUrl, posterUrl: imageUrl, score: 10 + femaleScoreText(remote.title) };
  }
  if (imageUrl) {
    const kind = mediaKindFromUrl(imageUrl);
    const motionBonus = kind === "gif" ? 8 : 0;
    return {
      kind,
      primaryUrl: imageUrl,
      posterUrl: undefined,
      score: motionBonus + femaleScoreText(remote.title) - (kind === "image" ? 2 : 0),
    };
  }
  return null;
}

async function fetchAscendMedia(searchQuery) {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost =
    process.env.RAPIDAPI_HOST || "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com";
  if (!apiKey) return null;

  const queries = [searchQuery, ...buildFemaleSearchQueries(searchQuery)];
  let best = null;

  for (const q of queries) {
    const url = `${ASCENDAPI_BASE_URL}?search=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "content-type": "application/json",
      },
    });
    if (!response.ok) continue;

    const payload = await response.json();
    for (const result of pickResults(payload)) {
      if (!isRecord(result)) continue;
      const gifUrl = pickGifUrl(result);
      const imageUrl = pickImageUrl(result);
      const videoUrl = pickVideoUrl(result);
      const title = firstString(result.name, result.title, result.exerciseName) || "";
      const candidate = rankRemoteCandidate({
        videoUrl,
        imageUrl: gifUrl || imageUrl,
        title,
      });
      if (!candidate) continue;
      candidate.title = title;
      if (!best || candidate.score > best.score) best = candidate;
    }
    await sleep(350);
  }

  return best;
}

function pickBestGiphy(items) {
  let best = null;
  for (const item of items || []) {
    const title = item.title || "";
    const images = item.images || {};
    const url =
      images.downsized?.url ||
      images.fixed_height?.url ||
      images.preview_gif?.url ||
      images.original?.url;
    if (!url) continue;
    const score = femaleScoreText(title) + (url.includes(".gif") ? 5 : 0);
    if (!best || score > best.score) best = { url, title, score };
  }
  return best;
}

async function fetchGiphyFemaleMedia(searchQuery) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) return null;

  const queries = buildFemaleSearchQueries(searchQuery);
  let best = null;

  for (const q of queries) {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=12&rating=g&lang=en`;
    const response = await fetch(url);
    if (!response.ok) continue;
    const payload = await response.json();
    const pick = pickBestGiphy(payload.data);
    if (pick && (!best || pick.score > best.score)) best = pick;
    await sleep(200);
  }

  if (!best) return null;
  return {
    kind: "gif",
    primaryUrl: best.url,
    title: best.title,
    score: best.score,
  };
}

function pickPexelsVideo(video) {
  const files = video?.video_files || [];
  const portrait = files
    .filter((f) => f.width && f.height && f.height >= f.width)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const pick =
    portrait.find((f) => (f.width || 0) >= 720) ||
    portrait[portrait.length - 1] ||
    files.sort((a, b) => (a.width || 0) - (b.width || 0))[0];
  return pick?.link;
}

async function fetchPexelsFemaleMedia(searchQuery) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  const queries = buildFemaleSearchQueries(searchQuery);
  let best = null;

  for (const q of queries) {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=8&orientation=portrait`;
    const response = await fetch(url, { headers: { Authorization: apiKey } });
    if (!response.ok) continue;
    const payload = await response.json();
    for (const video of payload.videos || []) {
      const link = pickPexelsVideo(video);
      if (!link) continue;
      const title = (video.url || "") + " " + (video.user?.name || "");
      const score = femaleScoreText(title) + 6;
      if (!best || score > best.score) {
        best = { kind: "video", primaryUrl: link, title, score };
      }
    }
    await sleep(250);
  }

  return best;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreMatch(searchQuery, exerciseName) {
  const queryTokens = tokenize(searchQuery);
  const nameTokens = new Set(tokenize(exerciseName));
  if (queryTokens.length === 0) return 0;
  let hits = 0;
  for (const t of queryTokens) {
    if (nameTokens.has(t)) hits += 1;
  }
  return hits / queryTokens.length;
}

let freeDbCache = null;

async function loadFreeDb() {
  if (freeDbCache) return freeDbCache;
  const response = await fetch(FREE_DB_JSON);
  if (!response.ok) throw new Error("Failed to load free-exercise-db");
  freeDbCache = await response.json();
  return freeDbCache;
}

async function fetchFreeDbStaticJpg(id, searchQuery) {
  const db = await loadFreeDb();
  let best = null;
  let bestScore = -999;
  for (const ex of db) {
    const matchScore = scoreMatch(searchQuery, ex.name);
    const female = femaleScoreText(ex.name);
    const total = matchScore + female * 0.15;
    if (total > bestScore && matchScore >= 0.4) {
      bestScore = total;
      best = ex;
    }
  }
  if (!best?.images?.length) return null;

  const rel = best.images[0];
  const remoteUrl = `${FREE_DB_IMAGE_BASE}${rel}`;
  return {
    kind: "image",
    primaryUrl: remoteUrl,
    matchedName: best.name,
    title: best.name,
    score: bestScore,
  };
}

async function tryCuratedUrl(id, searchQuery) {
  const raw = curatedFemaleMedia[id];
  if (!raw || typeof raw !== "string" || raw.startsWith("_")) return null;
  const kind = mediaKindFromUrl(raw);
  return saveDownloadedMedia(id, {
    primaryUrl: raw,
    kind,
    source: "curated-female",
    searchQuery,
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function resolveMediaForExercise(id, searchQuery) {
  const manualMotion = detectManualMotionMedia(id);
  if (manualMotion) return manualMotion;

  if (manifestOnly) {
    const staticFile = detectExistingStaticFile(id);
    if (staticFile) return staticFile;
    return {
      imageUrl: galleryFallbackPath(id),
      searchQuery,
      mediaType: "image",
      source: "gallery-fallback",
    };
  }

  const curated = await tryCuratedUrl(id, searchQuery);
  if (curated) return curated;

  const ascend = await fetchAscendMedia(searchQuery);
  if (ascend) {
    return saveDownloadedMedia(id, {
      primaryUrl: ascend.primaryUrl,
      posterUrl: ascend.posterUrl,
      kind: ascend.kind,
      source: "ascendapi-local",
      searchQuery,
      matchedName: ascend.title,
    });
  }

  const giphy = await fetchGiphyFemaleMedia(searchQuery);
  if (giphy) {
    return saveDownloadedMedia(id, {
      primaryUrl: giphy.primaryUrl,
      kind: "gif",
      source: "giphy-female",
      searchQuery,
      matchedName: giphy.title,
    });
  }

  const pexels = await fetchPexelsFemaleMedia(searchQuery);
  if (pexels) {
    return saveDownloadedMedia(id, {
      primaryUrl: pexels.primaryUrl,
      kind: "video",
      source: "pexels-female",
      searchQuery,
      matchedName: pexels.title,
    });
  }

  const freeDb = await fetchFreeDbStaticJpg(id, searchQuery);
  if (freeDb) {
    return saveDownloadedMedia(id, {
      primaryUrl: freeDb.primaryUrl,
      kind: "image",
      source: "free-exercise-db",
      searchQuery,
      matchedName: freeDb.matchedName,
    });
  }

  const legacyStatic = detectExistingStaticFile(id);
  if (legacyStatic) return legacyStatic;

  return {
    imageUrl: galleryFallbackPath(id),
    searchQuery,
    mediaType: "image",
    source: "gallery-fallback",
  };
}

async function main() {
  loadEnvLocal();
  fs.mkdirSync(exercisesDir, { recursive: true });

  const sources = [];
  if (manifestOnly) sources.push("manual-scan");
  else {
    if (process.env.RAPIDAPI_KEY) sources.push("AscendAPI");
    if (process.env.GIPHY_API_KEY) sources.push("Giphy");
    if (process.env.PEXELS_API_KEY) sources.push("Pexels");
    if (!sources.length) sources.push("free-exercise-db (add GIPHY_API_KEY / PEXELS_API_KEY / RAPIDAPI_KEY for better female motion media)");
  }
  console.log("Media fetch:", sources.join(" → "));

  const manifest = {};
  const stats = { manual: 0, motion: 0, static: 0, fallback: 0 };

  for (const [id, searchQuery] of Object.entries(exerciseMediaSearchQueries)) {
    process.stdout.write(`${id}... `);
    try {
      const entry = await resolveMediaForExercise(id, searchQuery);
      manifest[id] = entry;
      const label = entry.videoUrl || entry.imageUrl || "?";
      if (entry.source === "manual" || entry.source === "manual-motion") stats.manual += 1;
      else if (entry.mediaType === "gif" || entry.mediaType === "video") stats.motion += 1;
      else if (entry.source === "gallery-fallback") stats.fallback += 1;
      else stats.static += 1;
      console.log(entry.source, entry.mediaType || "image", label);
    } catch (err) {
      manifest[id] = {
        imageUrl: galleryFallbackPath(id),
        searchQuery,
        mediaType: "image",
        source: "gallery-fallback",
      };
      stats.fallback += 1;
      console.log("error", err.message);
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    `\nManifest → ${manifestPath}\nmanual=${stats.manual} motion=${stats.motion} static=${stats.static} fallback=${stats.fallback}`,
  );
  console.log(
    "Tip: drop high-quality files at public/exercises/{id}.gif or .mp4 then run with --manifest-only",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
