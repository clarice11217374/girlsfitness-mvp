export const theme = {
  colors: {
    bg: "#F0EEF5",
    card: "#FFFFFF",
    black: "#2A2535",
    gray: "#9B93A8",
    light: "#E4E0EE",
    lime: "#F5E8EF",
    limeDeep: "#E0C8D4",
    blue: "#D8E4F0",
    blueDeep: "#4A3F5C",
    white: "#FFFFFF",
  },
  gradients: {
    workout: "linear-gradient(135deg,#C9BFE0 0%,#E0D8F0 100%)",
    lime: "linear-gradient(135deg,#E0C8D4 0%,#F0DCE8 100%)",
    blue: "linear-gradient(135deg,#BFCCE0 0%,#D8E4F0 100%)",
    preview: "linear-gradient(160deg,#F5F3FA 0%,#F5E8EF 58%,#FFFFFF 100%)",
    complete: "linear-gradient(160deg,#C9BFE0 0%,#F0DCE8 100%)",
    appBg: "linear-gradient(135deg,#DBD8E8 0%,#C8C1DC 100%)",
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
