import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  StatusScreen,
  statusPrimaryClassName,
  statusSecondaryClassName,
} from "@/components/sections/status/StatusScreen";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page Not Found",
  description: "This page could not be found on Hussaini IT Services.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <SiteLayout>
      <StatusScreen
        code="404"
        title="This page is not here."
        description="The link may be old, mistyped, or the page was moved. These should get you back on track."
        actions={
          <>
            <Link href="/" className={statusPrimaryClassName()}>
              Go home
            </Link>
            <Link href="/contact" className={statusSecondaryClassName()}>
              Contact us
            </Link>
          </>
        }
      />
    </SiteLayout>
  );
}
