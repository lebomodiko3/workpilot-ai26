import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIOutput } from "@/components/ai-output";
import { runAIFeature } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — WorkPilot AI" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a couple of sentences of meeting notes.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await runAIFeature("meeting", notes);
      setOutput(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="rounded-lg gradient-primary p-2 shadow-elegant">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">Extract key points, decisions, action items, and deadlines.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Raw Notes / Transcript</CardTitle>
            <CardDescription>Paste your meeting notes below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Paste meeting notes, transcript, or bullet points…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                className="font-mono text-xs"
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Summarize Meeting
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <AIOutput content={output} loading={loading} placeholder="Structured summary will appear here." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
