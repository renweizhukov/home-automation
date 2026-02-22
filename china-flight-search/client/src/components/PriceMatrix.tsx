// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 价格矩阵：热力图色彩，金色高亮最低价

import type { PriceMatrix as PriceMatrixType } from "@/data/flightData";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface PriceMatrixProps {
  data: PriceMatrixType;
}

function getPriceClass(price: number | null, allPrices: number[]): string {
  if (price === null) return "price-na";
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  const range = max - min;
  if (range === 0) return "price-mid";
  const ratio = (price - min) / range;
  if (price === min) return "price-best";
  if (ratio < 0.2) return "price-lowest";
  if (ratio < 0.4) return "price-low";
  if (ratio < 0.65) return "price-mid";
  if (ratio < 0.85) return "price-high";
  return "price-highest";
}

export default function PriceMatrix({ data }: PriceMatrixProps) {
  const allPrices = data.prices.flat().filter((p): p is number => p !== null);

  // Group departure dates by month for display
  const groupedDepartures = data.departureTimes.reduce<Record<string, { label: string; idx: number }[]>>(
    (acc, date, idx) => {
      const month = date.split(" ")[0];
      if (!acc[month]) acc[month] = [];
      acc[month].push({ label: date, idx });
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground/70">价格图例（每人）：</span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-best border" />
            最低
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-lowest border" />
            较低
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-low border" />
            偏低
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-mid border" />
            中等
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-high border" />
            偏高
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-highest border" />
            最高
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm price-na border" />
            无数据
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card px-3 py-2.5 text-left text-muted-foreground font-medium border-b border-r border-white/10 whitespace-nowrap min-w-[90px]">
                出发 ↓ / 返回 →
              </th>
              {data.returnTimes.map((ret) => (
                <th
                  key={ret}
                  className="px-2 py-2.5 text-center text-muted-foreground font-medium border-b border-white/10 whitespace-nowrap min-w-[72px]"
                >
                  {ret}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedDepartures).map(([month, dates]) => (
              <>
                <tr key={`month-${month}`}>
                  <td
                    colSpan={data.returnTimes.length + 1}
                    className="sticky left-0 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-white/5"
                  >
                    {month === "Jun" ? "六月" : month === "Jul" ? "七月" : month === "Aug" ? "八月" : month}
                  </td>
                </tr>
                {dates.map(({ label, idx }) => (
                  <tr key={label} className="hover:bg-white/3 transition-colors group">
                    <td className="sticky left-0 z-10 bg-card group-hover:bg-muted/20 px-3 py-2 font-medium text-foreground/80 border-r border-white/10 whitespace-nowrap transition-colors">
                      {label}
                    </td>
                    {data.prices[idx].map((price, retIdx) => {
                      const cls = getPriceClass(price, allPrices);
                      return (
                        <td
                          key={retIdx}
                          className={cn(
                            "px-2 py-2 text-center border border-transparent rounded-sm transition-all",
                            cls,
                            price !== null && "cursor-default hover:scale-105 hover:z-10 hover:shadow-lg"
                          )}
                        >
                          {price !== null ? (
                            <span className="font-mono font-semibold">
                              ${price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {data.note && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200/80">
          <Info size={14} className="shrink-0 mt-0.5 text-yellow-400" />
          <span>{data.note}</span>
        </div>
      )}
    </div>
  );
}
