import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkPilot AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Craft professional emails by audience and tone.", color: "from-blue-500/20 to-indigo-500/20" },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into key points, decisions, action items.", color: "from-emerald-500/20 to-teal-500/20" },
  { to: "/tasks", icon: ListTodo, title: "AI Task Planner", desc: "Prioritize and schedule your work intelligently.", color: "from-amber-500/20 to-orange-500/20" },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Structured insights and summaries on any topic.", color: "from-fuchsia-500/20 to-pink-500/20" },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Ask anything — your always-on work copilot.", color: "from-violet-500/20 to-purple-500/20" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="overflow-hidden rounded-2xl border-4 border-neutral-700 gradient-primary p-8 shadow-elegant">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white/15 p-2 backdrop-blur">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-primary-foreground">
              Welcome to WorkPilot AI
            </h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/85">
              Your AI productivity suite for emails, meetings, planning, and research.
              Pick a tool below to get started.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <CardHeader>
                <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${t.color}`}>
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-between text-base">
                  {t.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <AIDisclaimer />
    </div>
  );
}
