import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { companyInfo } from "@/lib/constants";
import {
  careerRoles,
  careerValues,
  formatCareerDate,
  formatCareerSalary,
  formatOfficeAddress,
  hiringSteps,
} from "@/lib/seo/careers";

const applyHref = (title: string) =>
  `mailto:${companyInfo.email}?subject=${encodeURIComponent(`Application: ${title}`)}`;

export function CareersPage() {
  return (
    <>
      <header className="page-top-navy relative bg-navy pb-16 text-white sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            tone="dark"
            className="mb-6"
            items={[
              { name: "Home", path: "/" },
              { name: "Careers", path: "/careers" },
            ]}
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Careers · Ujjain office
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
            Careers at Hussaini IT Services — on-site jobs in Ujjain
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            All hiring is on-site in Ujjain. We want people who will own a client site, a search
            brief, or a pipeline — not sit in a department.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#open-roles"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              See open roles
            </a>
            <a
              href={`mailto:${companyInfo.email}?subject=Career enquiry`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/45"
            >
              Email a CV
            </a>
          </div>
          <p className="mt-10 text-sm text-white/40">
            {careerRoles.length} open roles · Full-time · On-site
          </p>
        </div>
      </header>

      <section className="border-b border-border py-16 sm:py-20 md:py-24" aria-label="How we work">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                How we work
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                A small office in Ujjain. One bar for quality. If you like vague ownership, this
                is not it.
              </p>
            </div>
            <dl className="lg:col-span-8">
              {careerValues.map((value) => (
                <div
                  key={value.title}
                  className="grid gap-2 border-t border-border py-6 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(11rem,14rem)_1fr] sm:gap-8 sm:py-7"
                >
                  <dt className="font-display text-lg font-bold">{value.title}</dt>
                  <dd className="text-sm leading-relaxed text-muted sm:text-base">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="open-roles" className="bg-surface py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Open roles</h2>
            <p className="text-sm text-muted">{formatOfficeAddress()} · applications by email</p>
          </div>

          <ul>
            {careerRoles.map((role) => (
              <li id={role.id} key={role.id} className="scroll-mt-28 border-b border-border">
                <a
                  href={applyHref(role.title)}
                  className="group grid gap-3 py-8 transition-colors sm:grid-cols-[1fr_auto] sm:items-start sm:gap-10 md:py-9"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-xl font-bold tracking-tight group-hover:text-accent sm:text-2xl">
                        {role.title}
                      </h3>
                      <p className="text-sm text-muted">
                        {role.type} · {role.location} · {formatCareerSalary(role.salary)}
                      </p>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                      {role.summary}
                    </p>
                    <p className="mt-3 text-xs tracking-wide text-silver">{role.focus.join("  ·  ")}</p>
                    <p className="mt-3 text-xs text-muted">
                      Posted {formatCareerDate(role.datePosted)} · Open through{" "}
                      {formatCareerDate(role.validThrough)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-accent sm:pt-1">
                    Apply
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      {" "}
                      →
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24" aria-label="Hiring process">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How we hire</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Four steps. No surprise panels. The task is paid because your time is not a free sample.
            </p>
          </div>
          <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-0">
            {hiringSteps.map((step, index) => (
              <li
                key={step.title}
                className="relative md:border-t md:border-border md:pt-6 md:pr-8 last:md:pr-0"
              >
                <span className="text-xs font-semibold tracking-[0.18em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Don&apos;t see the right role?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              Send a short note and your work. We reply to serious applications within a few
              business days.
            </p>
          </div>
          <a
            href={`mailto:${companyInfo.email}?subject=Career enquiry`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
          >
            {companyInfo.email}
          </a>
        </div>
      </section>
    </>
  );
}
