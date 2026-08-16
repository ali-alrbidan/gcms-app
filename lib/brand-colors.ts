import brandColors from '../new brand/brand_colors.json';

export const colors = {
  primaryNavy: brandColors.primary_navy.hex,
  teal: brandColors.teal.hex,
  deepNavy: brandColors.deep_navy.hex,
  offWhite: brandColors.off_white.hex,
  textGray: brandColors.text_gray.hex,
} as const;

export const cssVariables = `
  --primary-navy: ${colors.primaryNavy};
  --teal: ${colors.teal};
  --deep-navy: ${colors.deepNavy};
  --off-white: ${colors.offWhite};
  --text-gray: ${colors.textGray};
  --ink: ${colors.deepNavy};
  --paper: ${colors.offWhite};
  --ink-2: ${colors.primaryNavy};
  --muted: ${colors.textGray};
  --brass: ${colors.teal};
  --brass-dark: #006B70;
`;
