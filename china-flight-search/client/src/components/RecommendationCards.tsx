// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 推荐卡片：金色奖牌，醒目价格展示

import type { Recommendation } from "@/data/flightData";
import { cn } from "@/lib/utils";
import { AlertTriangle, CalendarDays, ExternalLink, Luggage, Users } from "lucide-react";

interface RecommendationCardsProps {
  recommendations: Recommendation[];
}

const rankColors = [
  "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  "from-slate-400/20 to-slate-500/10 border-slate-400/30",
  "from-amber-700/20 to-amber-800/10 border-amber-700/30",
  "from-blue-500/10 to-blue-600/5 border-blue-500/20",
];

const rankBadgeColors = [
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  "bg-slate-400/20 text-slate-300 border-slate-400/40",
  "bg-amber-700/20 text-amber-400 border-amber-700/40",
  "bg-blue-500/10 text-blue-300 border-blue-500/30",
];

export default function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((rec, i) => (
        <div
          key={rec.rank}
          className={cn(
            "relative rounded-xl border bg-gradient-to-br p-4 transition-all hover:scale-[1.01] hover:shadow-xl",
            rankColors[i] || rankColors[3]
          )}
        >
          {/* Rank badge */}
          <div className="flex items-start justify-between mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                rankBadgeColors[i] || rankBadgeColors[3]
              )}
            >
              <span>{rec.medal}</span>
              <span>第 {rec.rank} 推荐</span>
            </span>
            <a
              href={rec.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              购票 <ExternalLink size={11} />
            </a>
          </div>

          {/* Route & Airline */}
          <div className="mb-3">
            <div className="font-display font-bold text-base text-foreground leading-tight">
              {rec.route}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {rec.airline}（{rec.airlineCode}）
            </div>
          </div>

          {/* Price highlight */}
          <div className="flex items-end gap-3 mb-3">
            <div>
              <div className="text-[11px] text-muted-foreground mb-0.5">每人单价</div>
              <div className="font-mono font-bold text-2xl text-foreground">
                ${rec.pricePerPerson.toLocaleString()}
              </div>
            </div>
            <div className="pb-0.5">
              <div className="text-[11px] text-muted-foreground mb-0.5">2人往返总价</div>
              <div className="font-mono font-semibold text-lg text-accent">
                ≈ ${rec.totalPrice2Pax.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays size={12} className="shrink-0" />
              <span>
                <span className="text-foreground/70">出发：</span>{rec.departDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={12} className="shrink-0" />
              <span>
                <span className="text-foreground/70">返回：</span>{rec.returnDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} className="shrink-0" />
              <span>在华 {rec.daysInChina} 天</span>
            </div>
            <div className="flex items-start gap-2">
              <Luggage size={12} className="shrink-0 mt-0.5" />
              <span>{rec.cabinNote}</span>
            </div>
          </div>

          {/* Warning */}
          {rec.warning && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-yellow-300/80">
              <AlertTriangle size={12} className="shrink-0 text-yellow-400" />
              <span>{rec.warning}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
