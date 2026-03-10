"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  children: string;
  language?: string;
};

export function CodeBlock({ children, language }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const shiki = await import("shiki");
        const highlighter = await shiki.createHighlighter({
          themes: ["github-dark"],
          langs: [language || "text"],
        });
        const result = highlighter.codeToHtml(children, {
          lang: language || "text",
          theme: "github-dark",
        });
        if (!cancelled) setHtml(result);
      } catch {
        // Fallback: no highlight
      }
    }

    if (language) {
      highlight();
    }

    return () => {
      cancelled = true;
    };
  }, [children, language]);

  return (
    <div className="group relative my-4 rounded-lg bg-bg-elevated border border-border-default overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-default">
        {language && (
          <span className="text-xs text-text-muted font-mono">{language}</span>
        )}
        {!language && <span />}
        <CopyButton text={children} />
      </div>
      {html ? (
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-sm font-mono text-text-primary">
          <code>{children}</code>
        </pre>
      )}
    </div>
  );
}
