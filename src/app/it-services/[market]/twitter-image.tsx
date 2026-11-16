// Twitter card uses the same generated image as Open Graph
import Image from "./opengraph-image";

export { alt, generateStaticParams } from "./opengraph-image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default Image;
