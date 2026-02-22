// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 侧边栏：历史查询记录导航 + 静态信息快捷链接

import { allQueryResults } from "@/data/flightData";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronRight, Clock, Home, Info, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-lg">
            ✈
          </div>
          <div>
            <div className="font-display font-bold text-sm text-foreground leading-tight">西雅图直飞中国</div>
            <div className="text-xs text-muted-foreground">暑假机票比较</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* 主页 */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
            location === "/"
              ? "bg-primary/20 text-primary font-medium"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          <Home size={15} />
          <span>最新查询结果</span>
          {location === "/" && <ChevronRight size={13} className="ml-auto" />}
        </Link>

        {/* 静态信息 */}
        <Link
          href="/routes"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
            location === "/routes"
              ? "bg-primary/20 text-primary font-medium"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          <Info size={15} />
          <span>航线与购票指南</span>
          {location === "/routes" && <ChevronRight size={13} className="ml-auto" />}
        </Link>

        {/* 历史查询记录 */}
        <div className="pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-3 mb-2">
            <Clock size={12} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">历史查询</span>
          </div>

          {allQueryResults.map((query) => (
            <Link
              key={query.id}
              href={query.isLatest ? "/" : `/query/${query.id}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group",
                (query.isLatest && location === "/") || location === `/query/${query.id}`
                  ? "bg-accent/15 text-accent-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <CalendarDays size={14} className="mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-xs leading-tight">
                  {query.queryDateLabel}
                  {query.isLatest && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-accent/30 text-accent font-semibold">
                      最新
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {query.searchParams.departWindow.split("–")[0].trim()} 出发
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          价格仅供参考，以购票时官网为准。
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-card border border-white/10 flex items-center justify-center text-foreground shadow-lg"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 w-64 bg-card border-r border-white/10 transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
