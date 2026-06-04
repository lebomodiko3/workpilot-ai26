import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIDisclaimer } from "./ai-disclaimer";

export function AIOutput({
  content,
  loading,
  placeholder = "Output will appear here.",
}: {
  content: string;
  loading: boolean;
  placeholder?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Result</h3>
        {content && (
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
        )}
      </div>
      <div className="relative flex-1 overflow-auto rounded-lg border bg-muted/30 p-4 text-sm">
        {loading && !content ? (
          <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking…</span>
          </div>
        ) : content ? (
          <pre className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
            {content}
          </pre>
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
      </div>
      <AIDisclaimer />
    </div>
  );
}
