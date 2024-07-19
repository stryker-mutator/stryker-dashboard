declare module '@primer/octicons' {
  interface Octicon {
    toSVG(): string;
  }

  export const copy: Octicon;
  export const check: Octicon;
}
