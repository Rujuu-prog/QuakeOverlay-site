import { setRequestLocale } from "next-intl/server";
import { getDocsByLocale, groupDocsByCategory } from "@/lib/docs";
import { Sidebar } from "@/components/docs/Sidebar";
import { DocsSidebarDrawer } from "@/components/docs/DocsSidebarDrawer";

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const docs = await getDocsByLocale(locale);
  const categories = groupDocsByCategory(docs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-20">
            <Sidebar categories={categories} />
          </div>
        </div>

        {/* Mobile sidebar drawer */}
        <div className="fixed bottom-4 right-4 z-30 md:hidden">
          <DocsSidebarDrawer categories={categories} />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
