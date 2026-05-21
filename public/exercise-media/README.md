# Exercise Media Overrides

If ExerciseDB does not find the right exercise, or the returned GIF is inaccurate, place your own media file in this folder.

Then add a local override in `src/data/exerciseMediaRegistry.ts`:

```ts
localGifUrl: "/exercise-media/hip-circles.gif",
```

Supported override fields are `localGifUrl`, `localImageUrl`, and `localVideoUrl`. Local media is shown before ExerciseDB media in `WorkoutExec`.
