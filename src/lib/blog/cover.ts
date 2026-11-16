/** Single aspect ratio for blog grid cards, featured card, and article hero. */
export const blogCoverAspectClass = "aspect-video";

export const blogCoverSpec = {
  ratio: "16:9",
  width: 1920,
  height: 1080,
  minWidth: 1280,
  minHeight: 720,
  maxFileSizeKb: 400,
  formats: "JPG or WebP",
} as const;

export const blogCoverUploadHint = `${blogCoverSpec.width}×${blogCoverSpec.height} px (${blogCoverSpec.ratio}), ${blogCoverSpec.formats}, under ${blogCoverSpec.maxFileSizeKb} KB`;
