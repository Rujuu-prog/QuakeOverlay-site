"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

type CopyButtonProps = {
  text: string;
};

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-200"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
