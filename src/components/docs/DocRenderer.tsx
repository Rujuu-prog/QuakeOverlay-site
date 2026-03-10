import React from "react";
import Markdoc from "@markdoc/markdoc";
import type { RenderableTreeNode } from "@markdoc/markdoc";
import { generateHeadingId } from "@/lib/docs-utils";
import { CodeBlock } from "./CodeBlock";
import type { ReactNode } from "react";

type DocRendererProps = {
  document: { node: InstanceType<typeof Markdoc.Ast.Node> };
};

function extractChildrenText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children))
    return children.map(extractChildrenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractChildrenText(
      (children as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return "";
}

function Heading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  const text = extractChildrenText(children);
  const id = generateHeadingId(text);
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return <Tag id={id}>{children}</Tag>;
}

function Link({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
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
}

function DocImage({
  src,
  alt,
  title,
}: {
  src: string;
  alt?: string;
  title?: string;
}) {
  const imgElement = (
    <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
  );

  if (title) {
    return (
      <figure>
        {imgElement}
        <figcaption>{title}</figcaption>
      </figure>
    );
  }

  return imgElement;
}

function FenceBlock({
  language,
  content,
}: {
  language?: string;
  content?: string;
}) {
  return <CodeBlock language={language}>{content ?? ""}</CodeBlock>;
}

const config: Parameters<typeof Markdoc.transform>[1] = {
  nodes: {
    heading: {
      render: "Heading",
      attributes: {
        level: { type: Number, required: true },
      },
    },
    fence: {
      render: "FenceBlock",
      attributes: {
        language: { type: String },
        content: { type: String },
      },
    },
    link: {
      render: "Link",
      attributes: {
        href: { type: String },
        title: { type: String },
      },
    },
    image: {
      render: "DocImage",
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        title: { type: String },
      },
    },
  },
};

const components = {
  Heading,
  FenceBlock,
  Link,
  DocImage,
};

export function DocRenderer({ document }: DocRendererProps) {
  const content: RenderableTreeNode = Markdoc.transform(
    document.node,
    config
  );
  const rendered = Markdoc.renderers.react(content, React, { components });

  return <div className="doc-content">{rendered}</div>;
}
