// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 重庆航班表：每周四班次，清晰对比

import type { ChongqingResult } from "@/data/flightData";
import { cn } from "@/lib/utils";

interface ChongqingTableProps {
  results: ChongqingResult[];
}

export default function ChongqingTable({ results }: ChongqingTableProps) {
  const minPrice = Math.min(...results.map((r) => r.pricePerPerson));

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">出发日期</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">返回日期</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">每人单价</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">2人总价</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">在华天数</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">去程时刻</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {results.map((r, i) => {
            const isBest = r.pricePerPerson === minPrice;
            return (
              <tr
                key={i}
                className={cn(
                  "transition-colors hover:bg-white/3",
                  isBest && "bg-accent/5"
                )}
              >
                <td className="px-4 py-3 font-medium text-foreground/90 whitespace-nowrap">
                  {r.departDateLabel}
                  {isBest && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-accent/20 text-accent font-semibold">
                      最低
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {r.returnDateLabel}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "font-mono font-bold",
                    isBest ? "text-accent text-base" : "text-foreground/80"
                  )}>
                    ${r.pricePerPerson.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-foreground/70">
                    ≈ ${r.totalPrice.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {r.daysInChina} 天
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                  {r.departTime}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
