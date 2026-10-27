import { SiteChrome } from "@/components/layout/SiteChrome";
import { LocalBusinessJsonLd } from "@/components/layout/JsonLd";
import { currentYear, getSiteContent } from "@/lib/content";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [content, year] = await Promise.all([getSiteContent(), currentYear()]);
  return (
    <>
      <SiteChrome content={content} year={year}>
        {children}
      </SiteChrome>
      <LocalBusinessJsonLd content={content} />
    </>
  );
}
