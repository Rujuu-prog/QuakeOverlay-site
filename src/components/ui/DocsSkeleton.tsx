type DocsSkeletonProps = {
  showToc?: boolean;
};

function ShimmerBar({
  width,
  height = "h-4",
  className = "",
}: {
  width: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton-shimmer rounded ${height} ${width} ${className}`}
    />
  );
}

export function DocsSkeleton({ showToc = false }: DocsSkeletonProps) {
  return (
    <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-8">
      <div className={`flex gap-8 ${showToc ? "lg:gap-12" : ""}`}>
        {/* Main content area */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div data-testid="skeleton-breadcrumb" className="mb-6 flex gap-2">
            <ShimmerBar width="w-12" height="h-3" />
            <ShimmerBar width="w-4" height="h-3" />
            <ShimmerBar width="w-24" height="h-3" />
          </div>

          {/* Title */}
          <div data-testid="skeleton-title" className="mb-8">
            <ShimmerBar width="w-2/3" height="h-8" />
          </div>

          {/* Paragraphs */}
          <div data-testid="skeleton-paragraph" className="mb-6 space-y-2">
            <ShimmerBar width="w-full" />
            <ShimmerBar width="w-11/12" />
            <ShimmerBar width="w-4/5" />
          </div>

          <div data-testid="skeleton-paragraph" className="mb-6 space-y-2">
            <ShimmerBar width="w-full" />
            <ShimmerBar width="w-3/4" />
          </div>

          {/* Code block */}
          <div
            data-testid="skeleton-code"
            className="skeleton-shimmer mb-6 h-32 rounded-lg"
          />

          <div data-testid="skeleton-paragraph" className="mb-6 space-y-2">
            <ShimmerBar width="w-full" />
            <ShimmerBar width="w-5/6" />
            <ShimmerBar width="w-2/3" />
          </div>
        </div>

        {/* Table of Contents */}
        {showToc && (
          <aside
            data-testid="skeleton-toc"
            className="hidden w-56 shrink-0 lg:block"
          >
            <ShimmerBar width="w-20" height="h-3" className="mb-4" />
            <div className="space-y-3">
              <ShimmerBar width="w-full" height="h-3" />
              <ShimmerBar width="w-4/5" height="h-3" />
              <ShimmerBar width="w-3/5" height="h-3" />
              <ShimmerBar width="w-full" height="h-3" />
              <ShimmerBar width="w-2/3" height="h-3" />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
