import { getExerciseMediaByName } from "@/lib/ascendapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return Response.json(
      {
        success: false,
        message: "Missing required query parameter: name",
      },
      { status: 400 },
    );
  }

  if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
    return Response.json(
      {
        success: false,
        message: "AscendAPI environment variables are not configured",
      },
      { status: 500 },
    );
  }

  try {
    const media = await getExerciseMediaByName(name);
    return Response.json({
      success: true,
      data: media,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Unable to fetch exercise media at this time",
      },
      { status: 502 },
    );
  }
}
