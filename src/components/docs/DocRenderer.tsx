import { DocumentRenderer } from "@keystatic/core/renderer";
import { generateHeadingId } from "@/lib/docs-utils";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import type { ReactNode } from "react";

type DocRendererProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
};

export function DocRenderer({ document }: DocRendererProps) {
  // Keystatic markdoc content may be wrapped as { node: { children: [...] } }
  // DocumentRenderer expects an array of child nodes
  const nodes = Array.isArray(document)
    ? document
    : document?.node?.children ?? document?.children ?? [];

  return (
    <div className="doc-content">
      <DocumentRenderer
        document={nodes}
        renderers={{
          block: {
            code({ children, language }) {
              return (
                <CodeBlock language={language}>
                  {children as unknown as string}
                </CodeBlock>
              );
            },
            heading({ level, children }) {
              const text = extractChildrenText(children);
              const id = generateHeadingId(text);

              switch (level) {
                case 2:
                  return <h2 id={id}>{children}</h2>;
                case 3:
                  return <h3 id={id}>{children}</h3>;
                case 4:
                  return <h4 id={id}>{children}</h4>;
                case 5:
                  return <h5 id={id}>{children}</h5>;
                case 6:
                  return <h6 id={id}>{children}</h6>;
                default:
                  return <h2 id={id}>{children}</h2>;
              }
            },
            blockquote({ children }) {
              return <blockquote>{children}</blockquote>;
            },
            divider() {
              return <hr />;
            },
          },
          inline: {
            link({ href, children }) {
              const url = href ?? "";
              const isExternal = url.startsWith("http");
              return (
                <a
                  href={url}
                  className="text-accent hover:text-accent-hover underline transition-colors duration-200"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
          },
        }}
      />
    </div>
  );
}

function extractChildrenText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractChildrenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractChildrenText(
      (children as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return "";
}
