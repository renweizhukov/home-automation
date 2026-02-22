// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 静态信息页：航线介绍 + 购票指南（与查询时间无关）

import { staticRouteInfo, staticTips } from "@/data/flightData";
import { cn } from "@/lib/utils";
import { ExternalLink, Luggage, Plane } from "lucide-react";

export default function Routes() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-primary/80 mb-2 font-medium tracking-wide uppercase">
          <Plane size={13} />
          <span>固定信息</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground mb-2">航线与购票指南</h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          以下信息为航线基本情况，与具体查询日期无关。价格请参考最新查询结果。
        </p>
      </div>

      {/* Route Cards */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="font-display font-bold text-xl text-foreground">直飞航线概览</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {staticRouteInfo.map((route) => (
            <div
              key={route.id}
              className={cn(
                "rounded-xl border p-5 bg-card transition-all hover:border-white/20",
                route.color === "blue"
                  ? "border-blue-500/20 hover:bg-blue-500/5"
                  : "border-teal-500/20 hover:bg-teal-500/5"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-2xl font-mono font-bold",
                        route.color === "blue" ? "text-blue-400" : "text-teal-400"
                      )}
                    >
                      {route.iata}
                    </span>
                    <span className="text-muted-foreground text-sm">{route.destination}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{route.destinationEn}</div>
                </div>
                <a
                  href={route.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors",
                    route.color === "blue"
                      ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      : "border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                  )}
                >
                  购票 <ExternalLink size={10} />
                </a>
              </div>

              {/* Details */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">航空公司</span>
                  <span className="text-foreground font-medium">{route.airline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">航班号</span>
                  <span className="text-foreground font-mono text-xs">{route.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">班次</span>
                  <span
                    className={cn(
                      "font-medium text-xs px-2 py-0.5 rounded",
                      route.frequency.includes("每日")
                        ? "bg-blue-500/15 text-blue-300"
                        : "bg-yellow-500/15 text-yellow-300"
                    )}
                  >
                    {route.frequency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">飞行时长</span>
                  <span className="text-foreground">{route.duration}</span>
                </div>
                <div className="border-t border-white/5 pt-2.5">
                  <div className="text-muted-foreground text-xs mb-1">去程时刻</div>
                  <div className="text-foreground/80 text-xs font-mono">{route.departTime}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">回程时刻</div>
                  <div className="text-foreground/80 text-xs font-mono">{route.returnTime}</div>
                </div>
                <div className="border-t border-white/5 pt-2.5 flex items-start gap-2">
                  <Luggage size={13} className="shrink-0 mt-0.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{route.baggagePolicy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Baggage Comparison */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-accent" />
          <h2 className="font-display font-bold text-xl text-foreground">行李政策对比</h2>
        </div>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-muted/20">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">航空公司 / 舱位</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">随身行李</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">托运行李</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">可改签</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-teal-300">海南航空 · 经济舱</td>
                <td className="px-4 py-3 text-center text-foreground/80">1件</td>
                <td className="px-4 py-3 text-center text-teal-300 font-medium">2件（各23kg）✓</td>
                <td className="px-4 py-3 text-center text-foreground/60">视票价而定</td>
              </tr>
              <tr className="hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-blue-300">达美 · Delta Main</td>
                <td className="px-4 py-3 text-center text-foreground/80">1件</td>
                <td className="px-4 py-3 text-center text-blue-300 font-medium">1件（23kg）✓</td>
                <td className="px-4 py-3 text-center text-green-400">✓ 可改签</td>
              </tr>
              <tr className="hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-muted-foreground">达美 · Basic Economy</td>
                <td className="px-4 py-3 text-center text-foreground/80">1件</td>
                <td className="px-4 py-3 text-center text-red-400">✗ 不含</td>
                <td className="px-4 py-3 text-center text-red-400">✗ 不可改签</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-green-400" />
          <h2 className="font-display font-bold text-xl text-foreground">购票实用建议</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staticTips.map((tip, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-card p-4 hover:border-white/20 transition-colors"
            >
              <div className="text-2xl mb-2">{tip.icon}</div>
              <div className="font-semibold text-sm text-foreground mb-1">{tip.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{tip.content}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground/50 border-t border-white/5 pt-4">
        以上航线信息基于2026年2月查询时的情况，航班时刻和班次可能随季节调整，请以航空公司官网最新公告为准。
      </div>
    </div>
  );
}
