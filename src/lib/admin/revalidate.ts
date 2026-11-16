import { revalidatePath } from "next/cache";

/** Bust public page caches after admin CMS changes */
export function revalidatePublicContent() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/portfolio");
  revalidatePath("/blog");
  revalidatePath("/services");
  revalidatePath("/about");
  // Machine-readable indexes so a newly published post is listed straight away
  revalidatePath("/sitemap.xml");
  revalidatePath("/api/sitemap");
  revalidatePath("/sitemap.txt");
  revalidatePath("/feed.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llm.txt");
}
