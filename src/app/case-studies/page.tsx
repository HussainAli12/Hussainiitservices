import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortfolioCover, getPortfolioCoverProps } from "@/components/ui/PortfolioCover";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, linkItemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { resolvePortfolioCoverAlt } from "@/lib/seo/portfolio";
import type { DbPortfolio } from "@/lib/types/database";

export const revalidate = 3600;

const title = "Case Studies";
const description =
  "Case studies from Hussaini IT Services: the challenge, what we built and — where measured — the results, for clients in India and the UAE.";

export const metadata = createPageMetadata({ title, description, path: "/case-studies" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Case Studies", path: "/case-studies" },
];

/** A project counts as a case study once its challenge or solution is filled in /admin */
function isCaseStudy(project: DbPortfolio) {
  return Boolean(project.challenge?.trim() || project.solution?.trim());
}

function CaseStudyBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{label}</h4>
      <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export default async function CaseStudiesPage() {
  const portfolio = await fetchPortfolio();
  const studies = portfolio.filter(isCaseStudy);
  const clients = getTrustedClients(portfolio);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/case-studies", type: "CollectionPage" }),
          linkItemListJsonLd(
            title,
            "/case-studies",
            studies.map((project) => ({ name: project.title, path: `/portfolio/${project.slug}` })),
          ),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={breadcrumbs}
          badge="Case studies"
          title="Case studies"
          subtitle="What each client needed, what we built, and — where it was measured — what changed."
        />
        <TrustedBy clients={clients} />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">All case studies</h2>
            {studies.length === 0 ? (
              <p className="text-muted">
                Case studies are on the way. Meanwhile, see our{" "}
                <Link href="/portfolio" className="font-semibold text-accent hover:underline">
                  portfolio
                </Link>
                .
              </p>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {studies.map((project) => (
                  <article key={project.id} className="premium-card flex flex-col overflow-hidden rounded-2xl">
                    <PortfolioCover
                      {...getPortfolioCoverProps(project)}
                      title={resolvePortfolioCoverAlt(project)}
                      className="h-48 w-full border-b border-border sm:h-56"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                        {project.category}
                        {project.client_name ? <span className="ml-2 normal-case tracking-normal text-muted">{project.client_name}</span> : null}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                        <Link href={`/portfolio/${project.slug}`} className="hover:text-accent">
                          {project.title}
                        </Link>
                      </h3>
                      <div className="mt-5 grid flex-1 gap-4">
                        {project.challenge?.trim() && <CaseStudyBlock label="Challenge" body={project.challenge} />}
                        {project.solution?.trim() && <CaseStudyBlock label="Solution" body={project.solution} />}
                        {/* Results only render when filled in /admin — never inferred */}
                        {project.results?.trim() && <CaseStudyBlock label="Results" body={project.results} />}
                      </div>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                      >
                        Read the full case study <ArrowUpRight size={14} aria-hidden />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
