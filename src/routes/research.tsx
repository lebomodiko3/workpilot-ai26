import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIOutput } from "@/components/ai-output";
import { runAIFeature } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkPilot AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (topic.trim().length < 5) {
      toast.error("Describe the topic in a bit more detail.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await runAIFeature("research", topic);
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
          <Search className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Get a structured brief: insights, trade-offs, and next steps.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic or Question</CardTitle>
            <CardDescription>The more specific, the better the brief.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Research topic</Label>
              <Textarea
                placeholder="e.g. Compare leading approaches for vector search at enterprise scale. What are the trade-offs?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={10}
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Research Topic
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <AIOutput content={output} loading={loading} placeholder="Research brief will appear here." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
