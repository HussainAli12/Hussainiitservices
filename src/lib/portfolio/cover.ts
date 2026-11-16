/** Single aspect ratio for portfolio grid cards and project hero. */
export const portfolioCoverAspectClass = "aspect-video";

export const portfolioCoverSpec = {
  ratio: "16:9",
  width: 1920,
  height: 1080,
  minWidth: 1280,
  minHeight: 720,
  maxFileSizeKb: 400,
  formats: "JPG or WebP",
} as const;

export const portfolioCoverUploadHint = `${portfolioCoverSpec.width}×${portfolioCoverSpec.height} px (${portfolioCoverSpec.ratio}), ${portfolioCoverSpec.formats}, under ${portfolioCoverSpec.maxFileSizeKb} KB`;

export const portfolioGalleryImageSpec = {
  recommendedWidth: 1600,
  recommendedHeight: 1200,
  minWidth: 1000,
  formats: "JPG or WebP",
  maxFileSizeKb: 500,
} as const;

export const portfolioGalleryUploadHint = `${portfolioGalleryImageSpec.recommendedWidth}×${portfolioGalleryImageSpec.recommendedHeight} px (landscape), min ${portfolioGalleryImageSpec.minWidth}px wide, ${portfolioGalleryImageSpec.formats}`;

/** One canvas for every client icon on the homepage logo grid. */
export const clientLogoAspectClass = "aspect-[8/3]";

export const clientLogoSpec = {
  ratio: "8:3",
  width: 640,
  height: 240,
  maxFileSizeKb: 150,
  formats: "PNG or WebP",
  background: "transparent",
} as const;

export const clientLogoUploadHint = `${clientLogoSpec.width}×${clientLogoSpec.height} px (${clientLogoSpec.ratio}), transparent ${clientLogoSpec.formats}, under ${clientLogoSpec.maxFileSizeKb} KB. Center the mark inside the canvas and leave even padding on all sides. Use this exact size for every client.`;
