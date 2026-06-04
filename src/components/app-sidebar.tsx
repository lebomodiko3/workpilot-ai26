import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, ListTodo, Search, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListTodo },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r-4 border-[#1b4332] bg-[#0d1b2a] p-8 md:flex">
      <div className="mb-12">
        <Link to="/" className="block">
          <h1 className="font-display text-2xl leading-none text-[#73ffb8]">WORKPILOT</h1>
          <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-[#2dd4a8]">
            PRODUCTIVITY SUITE
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-6">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#73ffb8] opacity-50">
            Workspace
          </p>
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.url;
              return (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    className={`-mx-4 flex items-center gap-3 px-4 py-2 transition-opacity ${
                      active
                        ? "border-l-4 border-[#2dd4a8] bg-[#1b4332] font-semibold text-[#73ffb8]"
                        : "border-l-4 border-transparent text-[#2dd4a8] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="space-y-4 pt-8">
        <ThemeToggle />
        <div className="flex items-center gap-3 border-t border-[#1b4332] pt-4 text-sm text-[#2dd4a8]">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#73ffb8]" />
          <span>System Active</span>
        </div>
      </div>
    </aside>
  );
}
