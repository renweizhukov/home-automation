// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 主页：显示最新查询结果（价格矩阵 + 推荐卡片）
// 与静态信息（航线介绍、购票建议）分开，通过侧边栏导航

import ChongqingTable from "@/components/ChongqingTable";
import PriceMatrix from "@/components/PriceMatrix";
import RecommendationCards from "@/components/RecommendationCards";
import { latestQueryResult } from "@/data/flightData";
import { AlertTriangle, CalendarSearch, Clock, Plane, Users } from "lucide-react";

const HERO_BG =
  "https://private-us-east-1.manuscdn.com/sessionFile/NAwke3aUI7ZhtWE5VA4jjd/sandbox/aReKnUrGOaZ2UTA3JMktYh-img-1_1771755430000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvTkF3a2UzYVVJN1podFdFNVZBNGpqZC9zYW5kYm94L2FSZUtuVXJHT2FaMlVUQTNKTWt0WWgtaW1nLTFfMTc3MTc1NTQzMDAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=I2qNy5ocoLq-pojf1q~fwsz-gwfE5fj-d0AjSV93GWK5cwGUk6jqLXX89XcZc5WRe05hObSVaTcYjMDOkhDF4HJf8MjovARiG2PLhzNA7BmjbHZ5Z65gHqwEvufRmEZ3h8td2wK~P58XehUmowuqOS~I-EO45Jh6Lvvu8w5jmJJF3GVF2xdT7DeXL78t96PFslSCnEPFSjRwMzHDdPVgrOCBDmvUtx8u7GgadjiEURWyy5vpWs6gr-h-qo7~ThjrPYzwXhC3-TgbTTDGNe-YnyPhKn1YAgYMLZMrOn4JJuHPrnrxnNUw0pu6K5NvP8wl9eumbpZSDceJ3x2qSWtaIQ__";

const q = latestQueryResult;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: 300 }}
      >
        <img
          src={HERO_BG}
          alt="西雅图飞往中国"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        <div className="relative z-10 px-6 pt-14 pb-10 max-w-4xl">
          <div className="flex items-center gap-2 text-xs text-primary/80 mb-3 font-medium tracking-wide uppercase">
            <Plane size={13} />
            <span>西雅图（SEA）直飞中国</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight mb-2">
            暑假机票比较
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            达美航空直飞上海 · 海南航空直飞重庆 · 找出最便宜的出行日期组合
          </p>
        </div>
      </div>

      {/* Query Meta Banner */}
      <div className="mx-6 -mt-2 mb-6 rounded-xl border border-white/10 bg-card/80 backdrop-blur-sm p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={13} className="text-primary" />
            <span>查询时间：</span>
            <span className="text-foreground font-medium">{q.queryDateLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarSearch size={13} className="text-primary" />
            <span>出发窗口：</span>
            <span className="text-foreground font-medium">{q.searchParams.departWindow}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarSearch size={13} className="text-primary" />
            <span>返回窗口：</span>
            <span className="text-foreground font-medium">{q.searchParams.returnWindow}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={13} className="text-primary" />
            <span className="text-foreground font-medium">{q.searchParams.passengers}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12 space-y-10 max-w-5xl">

        {/* Section 1: Top Recommendations */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-accent" />
            <h2 className="font-display font-bold text-xl text-foreground">综合最优推荐</h2>
            <span className="text-xs text-muted-foreground">按2人总价排序</span>
          </div>
          <RecommendationCards recommendations={q.topRecommendations} />
        </section>

        {/* Section 2: Shanghai Price Matrix */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full bg-primary" />
            <h2 className="font-display font-bold text-xl text-foreground">
              达美航空 · 上海浦东（PVG）价格矩阵
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 ml-4">
            DL 129 每日直飞 · 16:15 SEA 出发 · 每人单价（Delta Main 舱）
          </p>
          <PriceMatrix data={q.shanghaiResults} />
        </section>

        {/* Section 3: Chongqing Results */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full bg-teal-400" />
            <h2 className="font-display font-bold text-xl text-foreground">
              海南航空 · 重庆江北（CKG）价格一览
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 ml-4">
            HU 7986 <span className="text-yellow-400 font-medium">每周四</span>直飞 · 含2件托运行李 · 每人单价
          </p>
          <ChongqingTable results={q.chongqingResults} />
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200/80">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-blue-400" />
            <span>
              海南航空重庆航班<strong className="text-blue-300">仅每周四运营</strong>，
              出发窗口（6月20日–7月15日）内符合条件的周四为：6月25日、7月2日、7月9日；
              返回窗口（8月20日–9月1日）内的周四为：8月20日、8月27日。
            </span>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground/60 border-t border-white/5 pt-4">
          价格数据来源：达美航空官网（灵活日期矩阵）、Kayak（海南航空）。
          所有价格仅供参考，以购票时官网实际显示为准。价格可能随时变动。
        </div>
      </div>
    </div>
  );
}
