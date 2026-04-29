export const theme = {
  colors: {
    bg: "#F7F5F2",
    card: "#FFFFFF",
    black: "#1A1A1A",
    gray: "#8A8A8A",
    light: "#EFEFEF",
    lime: "#C8F135",
    limeDeep: "#9DC400",
    blue: "#B8E0FF",
    blueDeep: "#6BBFFF",
    white: "#FFFFFF",
  },
  gradients: {
    workout: "linear-gradient(135deg,#FFFFFF 0%,#C8EAFF 45%,#D6F56A 100%)",
    lime: "linear-gradient(135deg,#E8F5C8 0%,#C8F135 100%)",
    blue: "linear-gradient(135deg,#E0F2FF 0%,#B8E0FF 100%)",
    preview: "linear-gradient(160deg,#C8EAFF 0%,#E8F5C8 60%,#FFFFFF 100%)",
    complete: "linear-gradient(160deg,#D6F56A 0%,#C8EAFF 100%)",
    appBg: "linear-gradient(135deg,#ede9e3 0%,#e4e0da 100%)",
  },
} as const;

export function createThemeCssVars(): Record<string, string> {
  return {
    "--bg": theme.colors.bg,
    "--card": theme.colors.card,
    "--black": theme.colors.black,
    "--gray": theme.colors.gray,
    "--light": theme.colors.light,
    "--lime": theme.colors.lime,
    "--lime-deep": theme.colors.limeDeep,
    "--blue": theme.colors.blue,
    "--blue-deep": theme.colors.blueDeep,
    "--white": theme.colors.white,
    "--grad-workout": theme.gradients.workout,
    "--grad-lime": theme.gradients.lime,
    "--grad-blue": theme.gradients.blue,
    "--grad-preview": theme.gradients.preview,
    "--grad-complete": theme.gradients.complete,
    "--grad-app-bg": theme.gradients.appBg,
  };
}
