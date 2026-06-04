import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListTodo, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AIOutput } from "@/components/ai-output";
import { runAIFeature } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — WorkPilot AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [context, setContext] = useState("");
  const [hours, setHours] = useState("8");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!tasks.trim()) {
      toast.error("List at least one task.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Available working hours today: ${hours}\nContext: ${context || "standard workday"}\n\nTasks:\n${tasks}`;
      const res = await runAIFeature("tasks", prompt);
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
          <ListTodo className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">Prioritize and schedule your day using Eisenhower-style logic.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Tasks</CardTitle>
            <CardDescription>One per line. Include deadlines if known.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tasks</Label>
              <Textarea
                placeholder={"- Finish Q3 report (due Friday)\n- Review PR #142\n- Call dentist\n- Prepare onboarding deck"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Working hours today</Label>
                <Input type="number" min="1" max="16" value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Context (optional)</Label>
                <Input placeholder="e.g. 2 meetings booked" value={context} onChange={(e) => setContext(e.target.value)} />
              </div>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Plan My Day
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <AIOutput content={output} loading={loading} placeholder="Prioritized plan will appear here." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
