const ALLOWED_FONTS = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Lato",
  "Playfair Display",
  "Merriweather",
  "Lora"
];

const DEFAULT_FONT = "Inter";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const isAllowedFont = (font) => ALLOWED_FONTS.includes(font);

const isHexColor = (color) => typeof color === "string" && HEX_COLOR.test(color);

export { ALLOWED_FONTS, DEFAULT_FONT, isAllowedFont, isHexColor };