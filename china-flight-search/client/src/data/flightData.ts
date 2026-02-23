// ============================================================
// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 数据结构：静态信息（航线/购票建议）与查询结果（价格/日期）分离
// ============================================================

export interface QueryResult {
  id: string;               // 查询时间戳，格式 YYYY-MM-DD_HH:MM（PST），同一天多次查询不会冲突
  queryDate: string;        // 查询日期 YYYY-MM-DD
  queryDateLabel: string;   // 显示标签，如「2026年2月22日 08:00 PST」
  isLatest: boolean;
  searchParams: {
    origin: string;
    departWindow: string;   // 出发时间范围
    returnWindow: string;   // 返回时间范围
    passengers: string;
  };
  shanghaiResults: PriceMatrix;
  chongqingResults: ChongqingResult[];
  topRecommendations: Recommendation[];
}

export interface PriceMatrix {
  airline: string;
  flightNumber: string;
  departureTimes: string[];   // 出发日期列
  returnTimes: string[];      // 返回日期列
  prices: (number | null)[][];  // [出发日期索引][返回日期索引]
  note?: string;
}

export interface ChongqingResult {
  departDate: string;
  departDateLabel: string;
  returnDate: string;
  returnDateLabel: string;
  pricePerPerson: number;
  totalPrice: number;
  daysInChina: number;
  departTime: string;
  returnTime: string;
  flightDuration: string;
}

export interface Recommendation {
  rank: number;
  medal: string;
  route: string;
  airline: string;
  airlineCode: string;
  departDate: string;
  returnDate: string;
  pricePerPerson: number;
  totalPrice2Pax: number;
  daysInChina: number;
  cabinNote: string;
  warning?: string;
  bookingUrl: string;
}

// ============================================================
// 静态信息（与查询时间无关）
// ============================================================

export const staticRouteInfo = [
  {
    id: "pvg",
    destination: "上海浦东",
    destinationEn: "Shanghai Pudong",
    iata: "PVG",
    airline: "达美航空",
    airlineEn: "Delta Air Lines",
    flightNumber: "DL 129 / DL 128",
    frequency: "每日1班",
    duration: "约 12h 35m",
    departTime: "16:15 (SEA) → 次日 19:50 (PVG)",
    returnTime: "21:50 (PVG) → 16:25 (SEA)",
    baggagePolicy: "Delta Main：含1件托运行李（23kg）；Basic Economy：不含托运行李",
    bookingUrl: "https://www.delta.com",
    color: "blue",
  },
  {
    id: "ckg",
    destination: "重庆江北",
    destinationEn: "Chongqing Jiangbei",
    iata: "CKG",
    airline: "海南航空",
    airlineEn: "Hainan Airlines",
    flightNumber: "HU 7986 / HU 7985",
    frequency: "每周四1班",
    duration: "约 13h 50m",
    departTime: "11:05–11:40 (SEA) → 次日 16:30 (CKG)",
    returnTime: "12:10 (CKG) → 09:40 (SEA)",
    baggagePolicy: "经济舱含2件托运行李（每件23kg）",
    bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    color: "teal",
  },
];

export const staticTips = [
  {
    icon: "🎫",
    title: "尽早购票",
    content: "暑假机票建议提前 2–3 个月预订，越早价格越稳定。",
  },
  {
    icon: "👦",
    title: "儿童票说明",
    content: "10岁儿童属于「儿童」（2–11岁），需单独购票，国际航班儿童票价通常与成人相同。",
  },
  {
    icon: "📅",
    title: "选择工作日",
    content: "周二、周三、周四出发的票价通常比周末低 $100–200/人。",
  },
  {
    icon: "🧳",
    title: "行李注意",
    content: "达美 Basic Economy 不含托运行李，如需托运建议选 Delta Main 舱或海南航空（含2件）。",
  },
  {
    icon: "💳",
    title: "购票渠道",
    content: "建议直接在航空公司官网购票，价格最准确且售后服务更好。",
  },
  {
    icon: "🔄",
    title: "灵活日期",
    content: "达美官网提供「My dates are flexible」功能，可一次查看前后3天的价格矩阵。",
  },
];

// ============================================================
// 查询结果数据（与查询时间相关）
// ============================================================

// 最新查询：2026年2月23日 08:25 PST
const query_2026_02_23_0825: QueryResult = {
  id: "2026-02-23_08:25",
  queryDate: "2026-02-23",
  queryDateLabel: "2026年2月23日 08:25 PST",
  isLatest: true,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月25日 – 7月23日（周四出发）",
    returnWindow: "2026年8月20日 – 9月17日（周四返回，≥45天间隔）",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [
      "Jun 25", "Jul 2", "Jul 9", "Jul 16",
    ],
    returnTimes: [
      "Aug 20", "Aug 27", "Sep 3", "Sep 10",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 出发日期 → 返回日期间隔：
    // Jun 25→Aug 20 = 56天 ✓, Jun 25→Aug 27 = 63天 ✓, Jun 25→Sep 3 = 70天 ✓, Jun 25→Sep 10 = 77天 ✓
    // Jul 2→Aug 20 = 49天 ✓, Jul 2→Aug 27 = 56天 ✓, Jul 2→Sep 3 = 63天 ✓, Jul 2→Sep 10 = 70天 ✓
    // Jul 9→Aug 20 = 42天 ✗, Jul 9→Aug 27 = 49天 ✓, Jul 9→Sep 3 = 56天 ✓, Jul 9→Sep 10 = 63天 ✓
    // Jul 16→Aug 20 = 35天 ✗, Jul 16→Aug 27 = 42天 ✗, Jul 16→Sep 3 = 49天 ✓, Jul 16→Sep 10 = 56天 ✓
    prices: [
      // Jun 25: Aug20=$1,774, Aug27=$1,774, Sep3=$1,774, Sep10=$1,774
      [1774, 1774, 1774, 1774],
      // Jul 2: Aug20=$1,739, Aug27=$1,739, Sep3=$1,739, Sep10=$1,739
      [1739, 1739, 1739, 1739],
      // Jul 9: Aug20=不满足45天, Aug27=$1,189, Sep3=$1,189, Sep10=$1,189
      [null, 1189, 1189, 1189],
      // Jul 16: Aug20=不满足45天, Aug27=不满足45天, Sep3=$1,189, Sep10=$1,189
      [null, null, 1189, 1189],
    ],
    note: "价格来源：Kayak（2026年2月23日查询），2人经济舱直飞（达美 DL 129/128），每人价格。Jul 9/16 → Sep 3/10 为本次查询最低价 $1,189/人（2人共 $2,378）。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1146,
      totalPrice: 2291,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1242,
      totalPrice: 2483,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1146,
      totalPrice: 2291,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-09-10",
      returnDateLabel: "9月10日（周四）",
      pricePerPerson: 1008,
      totalPrice: 2015,
      daysInChina: 56,
      departTime: "11:33 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-23",
      departDateLabel: "7月23日（周四）",
      returnDate: "2026-09-17",
      returnDateLabel: "9月17日（周四）",
      pricePerPerson: 1008,
      totalPrice: 2015,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月16日（周四）",
      returnDate: "9月10日（周四）",
      pricePerPerson: 1008,
      totalPrice2Pax: 2015,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-09-10/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月23日（周四）",
      returnDate: "9月17日（周四）",
      pricePerPerson: 1008,
      totalPrice2Pax: 2015,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-23/2026-09-17/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1146,
      totalPrice2Pax: 2291,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1146,
      totalPrice2Pax: 2291,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月9日",
      returnDate: "9月3日",
      pricePerPerson: 1189,
      totalPrice2Pax: 2378,
      daysInChina: 56,
      cabinNote: "经济舱直飞（DL 129/128），请在达美官网确认舱位类型",
      warning: "⚠️ 可能为 Basic Economy（不含托运行李、不可改签），购票前请确认",
      bookingUrl: "https://www.kayak.com/flights/SEA-PVG/2026-07-09/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=DL",
    },
  ],
};

// 历史查询：2026年2月22日 13:01 PST
const query_2026_02_22_1301: QueryResult = {
  id: "2026-02-22_13:01",
  queryDate: "2026-02-22",
  queryDateLabel: "2026年2月22日 13:01 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25",
      "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5",
      "Jul 6", "Jul 7", "Jul 8", "Jul 9",
      "Jul 10", "Jul 11", "Jul 12",
      "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 18", "Aug 20", "Aug 21", "Aug 22",
      "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 30", "Aug 31", "Sep 1",
    ],
    prices: [
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1789, 1900, 1989, 1839, null, null, null, null, null, null, null],
      [1789, 1900, 1989, 1839, null, null, null, null, null, null, null],
      [1789, 1900, 1989, 1839, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [1739, 1850, 1939, 1789, null, null, null, null, null, null, null],
      [null, 1739, 1739, 1739, null, null, null, null, null, null, null],
      [null, 1739, 1739, 1739, null, null, null, null, null, null, null],
      [null, null, null, null, 1789, 1789, 1789, 1839, null, null, null],
      [null, null, null, null, 1789, 1789, 1789, 1839, null, null, null],
      [null, null, null, null, 1789, 1789, 1789, 1839, null, null, null],
      [null, null, null, null, 1739, 1739, 1739, 1789, null, null, null],
      [null, null, null, null, 1639, 1639, 1639, 1689, null, null, null],
      [null, null, null, null, 1639, 1639, 1639, 1689, null, null, null],
      [null, null, null, null, 1639, 1639, 1639, 1689, null, null, null],
      [null, null, null, null, 1689, 1689, 1689, 1739, 1693, 1693, null],
      [null, null, null, null, 1689, 1689, 1689, 1739, 1693, 1693, null],
      [null, null, null, null, 1639, 1639, 1639, 1689, 1693, 1693, null],
      [null, null, null, null, 1639, 1639, 1639, 1689, 1643, 1643, 1189],
      [null, null, null, null, 1639, 1639, 1639, 1689, 1643, 1643, 1189],
      [null, null, null, null, 1639, 1639, 1639, 1689, 1643, 1643, 1189],
    ],
    note: "测试查询数据（02:34 PST）",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1146,
      totalPrice: 2291,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1146,
      totalPrice: 2291,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1186,
      totalPrice: 2372,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1241,
      totalPrice: 2481,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日 或 7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1146,
      totalPrice2Pax: 2291,
      daysInChina: 49,
      cabinNote: "经济舱，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1186,
      totalPrice2Pax: 2372,
      daysInChina: 42,
      cabinNote: "经济舱，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月13–15日（周一至三）",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1189,
      totalPrice2Pax: 4756,
      daysInChina: 49,
      cabinNote: "可能为 Basic Economy（不含行李、不可改签）",
      warning: "⚠️ 购票前请确认舱位类型",
      bookingUrl: "https://www.delta.com",
    },
  ],
};

// ============================================================
// 导出
// ============================================================

export const allQueryResults: QueryResult[] = [
  query_2026_02_23_0825,
  query_2026_02_22_1301,
];

export const latestQueryResult = query_2026_02_23_0825;
