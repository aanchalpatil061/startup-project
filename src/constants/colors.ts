export const Colors = {
  // Brand
  primary: '#09090B',
  primaryForeground: '#FAFAFA',

  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#09090B',
  textSecondary: '#71717A',
  textMuted: '#A1A1AA',
  textInverse: '#FAFAFA',

  // Borders
  border: '#E4E4E7',
  borderStrong: '#D4D4D8',

  // Accent
  accent: '#18181B',
  accentForeground: '#FAFAFA',

  // Semantic
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // Skeleton
  skeleton: '#F4F4F5',
  skeletonHighlight: '#E4E4E7',

  // Tabs
  tabActive: '#09090B',
  tabInactive: '#A1A1AA',

  // Score bands
  scoreHigh: '#16A34A',
  scoreMid: '#D97706',
  scoreLow: '#DC2626',

  // Transparent
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.08)',
} as const;

export type ColorKey = keyof typeof Colors;
