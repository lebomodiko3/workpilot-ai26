import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkPilot AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

type Tool = {
  to: string;
  letter: string;
  icon: typeof Mail;
  title: [string, string];
  desc: string;
};

const tools: Tool[] = [
  { to: "/email", letter: "E", icon: Mail, title: ["Email", "Generator"], desc: "Craft professional communications with precision tone mapping." },
  { to: "/meetings", letter: "M", icon: FileText, title: ["Meeting", "Notes"], desc: "Transform chaotic recordings into structured action items." },
  { to: "/tasks", letter: "T", icon: ListTodo, title: ["Task", "Planner"], desc: "Prioritize and schedule your complex projects intelligently." },
  { to: "/research", letter: "R", icon: Search, title: ["Research", "Assistant"], desc: "Extract structured insights from diverse global data sources." },
  { to: "/chat", letter: "C", icon: MessageSquare, title: ["AI", "Chatbot"], desc: "Real-time collaborative partner for ongoing work tasks." },
];

function Dashboard() {
  return (
    <main className="relative overflow-hidden p-6 md:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#2d2d2d] opacity-20 blur-[120px]" />

      {/* Welcome Banner */}
      <section className="relative z-10 mb-16 max-w-3xl">
        <h1 className="font-display mb-4 text-5xl uppercase leading-tight text-[#f5f5f5] md:text-6xl">
          Welcome to{" "}
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #e85d3a" }}>
            WorkPilot AI
          </span>
        </h1>
        <div className="border-l-8 border-[#e85d3a] bg-[#2d2d2d] p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
          <p className="max-w-xl text-lg font-medium leading-relaxed text-[#f5f5f5] underline decoration-[#e85d3a] decoration-2 underline-offset-4">
            Your integrated AI productivity suite. Select a specialized module below to begin optimizing your workflow.
          </p>
        </div>
      </section>

      {/* Tool Grid: Broken Grid */}
      <div className="relative z-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <Link to={tools[0].to} className="group block border-2 border-[#e85d3a] bg-[#2d2d2d] p-8 transition-transform hover:-translate-y-2">
          <CardInner tool={tools[0]} variant="solid" />
        </Link>

        {/* Card 2: shifted down */}
        <Link
          to={tools[1].to}
          className="group block border-4 border-[#2d2d2d] bg-[#1a1a1a] p-8 shadow-[8px_8px_0px_0px_#e85d3a] transition-all hover:shadow-[12px_12px_0px_0px_#f5f5f5] md:mt-12"
        >
          <CardInner tool={tools[1]} variant="outline" />
        </Link>

        {/* Card 3 */}
        <Link to={tools[2].to} className="group block border-2 border-[#f5f5f5] bg-[#2d2d2d] p-8 transition-transform hover:-translate-x-2">
          <CardInner tool={tools[2]} variant="glow" italic />
        </Link>

        {/* Card 4: overlap up */}
        <Link
          to={tools[3].to}
          className="group block border-2 border-[#e85d3a] bg-[#2d2d2d] p-8 shadow-[12px_-12px_0px_0px_#1a1a1a] transition-transform hover:scale-105 md:-mt-8 md:ml-8"
        >
          <CardInner tool={tools[3]} variant="solid" italic />
        </Link>

        {/* Card 5 */}
        <Link
          to={tools[4].to}
          className="group block border-b-8 border-r-8 border-[#2d2d2d] bg-[#1a1a1a] p-8 transition-colors hover:border-[#e85d3a]"
        >
          <CardInner tool={tools[4]} variant="ghost" />
        </Link>
      </div>

      {/* Disclaimer Footer */}
      <footer className="relative z-10 mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#2d2d2d] pt-8">
        <div className="flex items-center gap-4">
          <span className="bg-[#2d2d2d] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f5f5f5]">
            Advisory
          </span>
          <p className="text-xs font-medium italic text-[#e85d3a] opacity-60">
            AI-generated content may require human verification prior to implementation.
          </p>
        </div>
        <div className="font-display select-none text-4xl text-[#2d2d2d]">V2.0.4</div>
      </footer>
    </main>
  );
}

function CardInner({
  tool,
  variant,
  italic,
}: {
  tool: Tool;
  variant: "solid" | "outline" | "glow" | "ghost";
  italic?: boolean;
}) {
  const Icon = tool.icon;
  const badge = {
    solid: "bg-[#e85d3a] text-[#1a1a1a]",
    outline: "border-2 border-[#e85d3a] text-[#e85d3a]",
    glow: "bg-[#f5f5f5] text-[#1a1a1a]",
    ghost: "bg-[#2d2d2d] text-[#f5f5f5]",
  }[variant];

  return (
    <>
      <div className={`mb-6 flex h-12 w-12 items-center justify-center text-xl font-bold ${badge}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3
        className={`font-display mb-2 text-xl uppercase text-[#f5f5f5] ${italic ? "italic" : ""}`}
      >
        {tool.title[0]}
        <br />
        {tool.title[1]}
      </h3>
      <p className="text-sm leading-snug text-[#e85d3a]">{tool.desc}</p>
    </>
  );
}
