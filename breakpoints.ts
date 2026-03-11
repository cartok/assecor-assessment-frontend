export const BREAKPOINTS = {
  width: [1385, 1280, 1100, 768, 601, 430, 360],
  height: [1000, 750, 500],
} as const

export type WidthBreakpoint = (typeof BREAKPOINTS.width)[number]
export type HeightBreakpoint = (typeof BREAKPOINTS.height)[number]
