type ThemeColors =
  | "Default"
  | "Rose"
  | "Blue"
  | "Green"
  | "Orange"
  | "Yellow"
  | "Violet"
  | "Slate";
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
