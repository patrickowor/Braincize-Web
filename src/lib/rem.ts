/** Design px → rem, for the few values that have to be computed at runtime. */
export const rem = (px: number) => `${px / 16}rem`;
