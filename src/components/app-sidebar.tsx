import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Mail, FileText, ListChecks, Search, MessageSquare,
  FolderOpen, Bookmark, FileBarChart, BarChart3, Settings, LifeBuoy, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Smart Email", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "AI Task Planner", url: "/planner", icon: ListChecks },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "AI Chat Assistant", url: "/chat", icon: MessageSquare },
];

const workspace = [
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Saved Work", url: "/saved", icon: Bookmark },
  { title: "Weekly Reports", url: "/reports", icon: FileBarChart },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const account = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: LifeBuoy },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (u: string) => path === u || path.startsWith(u + "/");

  const renderGroup = (label: string, list: typeof items) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {list.map((it) => (
            <SidebarMenuItem key={it.url}>
              <SidebarMenuButton asChild isActive={isActive(it.url)} tooltip={it.title}>
                <Link to={it.url} className="flex items-center gap-2">
                  <it.icon className="h-4 w-4" />
                  <span>{it.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-semibold text-sm">CogniFlow</div>
              <div className="text-[10px] text-muted-foreground">AI Workspace</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Workspace", items)}
        {renderGroup("Library", workspace)}
        {renderGroup("Account", account)}
      </SidebarContent>
    </Sidebar>
  );
}
