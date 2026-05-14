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
    duration: "约 12h 30m",
    departTime: "16:20 (SEA) → 次日 19:50 (PVG)",
    returnTime: "17:30 (PVG) → 13:58 (SEA)",
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


// 最新查询：2026年5月14日 08:05 PST
const query_2026_05_14_0805: QueryResult = {
  id: "2026-05-14_08:05",
  queryDate: "2026-05-14",
  queryDateLabel: "2026年5月14日 08:05 PST",
  isLatest: true,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月17日 – 7月7日",
    returnWindow: "2026年8月17日 – 8月23日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 17", "Jun 18", "Jun 19", "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24",
      "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
    ],
    returnTimes: [
      "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月14日查询，每人价格
    // 最低价（≥45天）：$2,661/人（Jun 30/Jul 1→Aug 21），2人共 $5,322
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 17: Aug 17=$3409, Aug 18=$3409, Aug 19=$3587, Aug 20=$3536, Aug 21=$3361, Aug 22=$3637, Aug 23=$3409
      [3409, 3409, 3587, 3536, 3361, 3637, 3409],
      // Jun 18: Aug 17=$3306, Aug 18=$3306, Aug 19=$3306, Aug 20=$3306, Aug 21=$3711, Aug 22=$3394, Aug 23=$3606
      [3306, 3306, 3306, 3306, 3711, 3394, 3606],
      // Jun 19: Aug 17=$3492, Aug 18=$3473, Aug 19=$3473, Aug 20=$3473, Aug 21=$3543, Aug 22=$3543, Aug 23=$3492
      [3492, 3473, 3473, 3473, 3543, 3543, 3492],
      // Jun 20: Aug 17=$3536, Aug 18=$3536, Aug 19=$3657, Aug 20=$3536, Aug 21=$3623, Aug 22=$3727, Aug 23=$3536
      [3536, 3536, 3657, 3536, 3623, 3727, 3536],
      // Jun 21: Aug 17=$3405, Aug 18=$3310, Aug 19=$3473, Aug 20=$3405, Aug 21=$3543, Aug 22=$3405, Aug 23=$3354
      [3405, 3310, 3473, 3405, 3543, 3405, 3354],
      // Jun 22: Aug 17=$3011, Aug 18=$3011, Aug 19=$3587, Aug 20=$3011, Aug 21=$3098, Aug 22=$3405, Aug 23=$3011
      [3011, 3011, 3587, 3011, 3098, 3405, 3011],
      // Jun 23: Aug 17=$2910, Aug 18=$2910, Aug 19=$3306, Aug 20=$3011, Aug 21=$2993, Aug 22=$3394, Aug 23=$2910
      [2910, 2910, 3306, 3011, 2993, 3394, 2910],
      // Jun 24: Aug 17=$3011, Aug 18=$3011, Aug 19=$3307, Aug 20=$3011, Aug 21=$3011, Aug 22=$3377, Aug 23=$3011
      [3011, 3011, 3307, 3011, 3011, 3377, 3011],
      // Jun 25: Aug 17=$3300, Aug 18=$3306, Aug 19=$3306, Aug 20=$3306, Aug 21=$3011, Aug 22=$3394, Aug 23=$3300
      [3300, 3306, 3306, 3306, 3011, 3394, 3300],
      // Jun 26: Aug 17=$2993, Aug 18=$2993, Aug 19=$3377, Aug 20=$3098, Aug 21=$3077, Aug 22=$3405, Aug 23=$2993
      [2993, 2993, 3377, 3098, 3077, 3405, 2993],
      // Jun 27: Aug 17=$3400, Aug 18=$3409, Aug 19=$3473, Aug 20=$3473, Aug 21=$3492, Aug 22=$3543, Aug 23=$3400
      [3400, 3409, 3473, 3473, 3492, 3543, 3400],
      // Jun 28: Aug 17=$3400, Aug 18=$3310, Aug 19=$3377, Aug 20=$3377, Aug 21=$3011, Aug 22=$3405, Aug 23=$3354
      [3400, 3310, 3377, 3377, 3011, 3405, 3354],
      // Jun 29: Aug 17=$2910, Aug 18=$2910, Aug 19=$3175, Aug 20=$3011, Aug 21=$2993, Aug 22=$3263, Aug 23=$2910
      [2910, 2910, 3175, 3011, 2993, 3263, 2910],
      // Jun 30: Aug 17=$2910, Aug 18=$2910, Aug 19=$3098, Aug 20=$3011, Aug 21=$2661, Aug 22=$3263, Aug 23=$2910
      [2910, 2910, 3098, 3011, 2661, 3263, 2910],
      // Jul 1: Aug 17=$2910, Aug 18=$2910, Aug 19=$3098, Aug 20=$3011, Aug 21=$2661, Aug 22=$3319, Aug 23=$2910
      [2910, 2910, 3098, 3011, 2661, 3319, 2910],
      // Jul 2: Aug 17=$3300, Aug 18=$3306, Aug 19=$3306, Aug 20=$3306, Aug 21=$3011, Aug 22=$3394, Aug 23=$3300
      [3300, 3306, 3306, 3306, 3011, 3394, 3300],
      // Jul 3: Aug 17=$2993, Aug 18=$2993, Aug 19=$3473, Aug 20=$3098, Aug 21=$3077, Aug 22=$3201, Aug 23=$2993
      [2993, 2993, 3473, 3098, 3077, 3201, 2993],
      // Jul 4: Aug 17=null, Aug 18=$2993, Aug 19=$3263, Aug 20=$3098, Aug 21=$3077, Aug 22=$3350, Aug 23=$2993
      [null, 2993, 3263, 3098, 3077, 3350, 2993],
      // Jul 5: Aug 17=null, Aug 18=null, Aug 19=$3377, Aug 20=$3123, Aug 21=$3011, Aug 22=$3123, Aug 23=$3077
      [null, null, 3377, 3123, 3011, 3123, 3077],
      // Jul 6: Aug 17=null, Aug 18=null, Aug 19=null, Aug 20=$3163, Aug 21=$3011, Aug 22=$3163, Aug 23=$2982
      [null, null, null, 3163, 3011, 3163, 2982],
      // Jul 7: Aug 17=null, Aug 18=null, Aug 19=null, Aug 20=null, Aug 21=$2993, Aug 22=$3131, Aug 23=$2910
      [null, null, null, null, 2993, 3131, 2910],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月14日查询，每人价格。最低价（≥45天）：$2,661/人（Jun 30/Jul 1→Aug 21），2人共 $5,322。⚠️ 达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1437,
      totalPrice: 2874,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1631,
      totalPrice: 3262,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1703,
      totalPrice: 3406,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-13",
      returnDateLabel: "8月13日（周四）",
      pricePerPerson: 1994,
      totalPrice: 3988,
      daysInChina: 49,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1994,
      totalPrice: 3988,
      daysInChina: 56,
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
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1437,
      totalPrice2Pax: 2874,
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
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1631,
      totalPrice2Pax: 3262,
      daysInChina: 56,
      cabinNote: "经济舱，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1703,
      totalPrice2Pax: 3406,
      daysInChina: 49,
      cabinNote: "经济舱，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月13日 或 8月20日（周四）",
      pricePerPerson: 1994,
      totalPrice2Pax: 3988,
      daysInChina: 49,
      cabinNote: "经济舱，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "6月30日/7月1日（周二/三）",
      returnDate: "8月21日（周五）",
      pricePerPerson: 2661,
      totalPrice2Pax: 5322,
      daysInChina: 52,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA2LTMwagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjFqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};
// 最新查询：2026年5月13日 08:05 PST
const query_2026_05_13_0805: QueryResult = {
  id: "2026-05-13_08:05",
  queryDate: "2026-05-13",
  queryDateLabel: "2026年5月13日 08:05 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jun 27", "Jun 28", "Jun 29", "Jun 30",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27",
      "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月13日查询，每人价格
    // 最低价（≥45天）：$2,661/人（Jul 7/8→Aug 22），2人共 $5,322
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20
      [3536, 3623, 3727, 3536, 3536, 3536, 3753, 3536, 3623, 3683, 3536, null, 3536],
      // Jun 21
      [3405, 3639, 3405, 3354, 3354, 3310, 3569, 3310, 3639, 3310, 3310, null, 3354],
      // Jun 22
      [3011, 3098, 3361, 3011, 3011, 3011, 3683, 3011, 3098, 3310, 3011, null, 3011],
      // Jun 23
      [3011, 2993, 3011, 2910, 2910, 2910, 3306, 2910, 2993, 3011, 2923, null, 2910],
      // Jun 24
      [3011, 3098, 3011, 3011, 3011, 3011, 3448, 2923, 3098, 3011, 2923, null, 3011],
      // Jun 25
      [3175, 3606, 3011, 3442, 3175, 3175, 3175, 2923, 3536, 3011, 2923, null, 3058],
      // Jun 26
      [null, null, 3319, null, null, null, null, null, null, null, null, null, null],
      // Jun 27
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 28
      [3319, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 29
      [null, 2993, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 30
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 1
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 2
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 3
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 4
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 5
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 6
      [3024, 3288, 3011, 3116, null, null, null, null, null, null, null, null, null],
      // Jul 7
      [null, 2993, 2661, 2910, null, null, null, null, null, null, null, null, null],
      // Jul 8
      [null, null, 2661, 3124, null, null, null, null, null, null, null, null, null],
      // Jul 9
      [null, null, null, 3124, null, null, null, null, null, null, null, null, null],
      // Jul 10
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 11
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 12
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 13
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 14
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 15
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月13日查询，每人价格。最低价（≥45天）$2,661/人（Jul 7/8→Aug 22），2人共 $5,322。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1442,
      totalPrice: 2884,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1625,
      totalPrice: 3250,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1696,
      totalPrice: 3392,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1984,
      totalPrice: 3968,
      daysInChina: 56,
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
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1442,
      totalPrice2Pax: 2884,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1625,
      totalPrice2Pax: 3250,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1696,
      totalPrice2Pax: 3392,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1984,
      totalPrice2Pax: 3968,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月7日/8日（周二/三）",
      returnDate: "8月22日（周六）",
      pricePerPerson: 2661,
      totalPrice2Pax: 5322,
      daysInChina: 46,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA3agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjJqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};


// 最新查询：2026年5月12日 08:06 PST
const query_2026_05_12_0806: QueryResult = {
  id: "2026-05-12_08:06",
  queryDate: "2026-05-12",
  queryDateLabel: "2026年5月12日 08:06 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jun 27", "Jun 28", "Jun 29", "Jun 30",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27",
      "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月12日查询，每人价格
    // 最低价（≥45天）：$1,330/人（Jul 1→Aug 27, Jul 14/15→Aug 30），2人共 $2,661
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug 24=$1811, Aug 26=$1876, Aug 27=$1811, Aug 28=$1855, Aug 29=$1841, Aug 30=$1811
      [null, null, null, null, 1811, null, 1876, 1811, 1855, 1841, 1811, null, null],
      // Jun 21: Aug 24=$1677, Aug 25=$1655, Aug 26=$1784, Aug 27=$1655, Aug 28=$1819, Aug 30=$1655
      [null, null, null, null, 1677, 1655, 1784, 1655, 1819, null, 1655, null, null],
      // Jun 22: Aug 24=$1505, Aug 25=$1505, Aug 26=$1724, Aug 27=$1505, Aug 28=$1549, Aug 29=$1593, Aug 30=$1505
      [null, null, null, null, 1505, 1505, 1724, 1505, 1549, 1593, 1505, null, null],
      // Jun 23: Aug 24=$1455, Aug 25=$1455, Aug 26=$1724, Aug 27=$1455, Aug 28=$1496, Aug 29=$1593, Aug 30=$1505
      [null, null, null, null, 1455, 1455, 1724, 1455, 1496, 1593, 1505, null, null],
      // Jun 24: Aug 27=$1505, Aug 28=$1549, Aug 29=$1655, Aug 30=$1505
      [null, null, null, null, null, null, null, 1505, 1549, 1655, 1505, null, null],
      // Jun 25: Aug 24=$1721, Aug 25=$1671, Aug 26=$1724, Aug 27=$1724, Aug 28=$1768, Aug 29=$1593, Aug 30=$1549
      [null, null, null, null, 1721, 1671, 1724, 1724, 1768, 1593, 1549, null, null],
      // Jun 26: Aug 24=$1496, Aug 25=$1496, Aug 26=$1736, Aug 27=$1496, Aug 28=$1538, Aug 29=$1655, Aug 30=$1549
      [null, null, null, null, 1496, 1496, 1736, 1496, 1538, 1655, 1549, null, null],
      // Jun 27: Aug 24=$1549, Aug 25=$1549, Aug 26=$1784, Aug 27=$1549, Aug 28=$1593, Aug 29=$1749, Aug 30=$1549
      [null, null, null, null, 1549, 1549, 1784, 1549, 1593, 1749, 1549, null, null],
      // Jun 28: Aug 24=$1634, Aug 25=$1612, Aug 26=$1736, Aug 27=$1612, Aug 28=$1771, Aug 30=$1612
      [null, null, null, null, 1634, 1612, 1736, 1612, 1771, null, 1612, null, null],
      // Jun 29: Aug 24=$1455, Aug 25=$1455, Aug 26=$1701, Aug 27=$1455, Aug 28=$1496, Aug 29=$1593, Aug 30=$1505
      [null, null, null, null, 1455, 1455, 1701, 1455, 1496, 1593, 1505, null, null],
      // Jun 30: Aug 24=$1455, Aug 25=$1455, Aug 26=$1549, Aug 27=$1455, Aug 28=$1496, Aug 29=$1418, Aug 30=$1374
      [null, null, null, null, 1455, 1455, 1549, 1455, 1496, 1418, 1374, null, null],
      // Jul 1: Aug 26=$1701, Aug 27=$1330, Aug 28=$1374, Aug 29=$1593
      [null, null, null, null, null, null, 1701, 1330, 1374, 1593, null, null, null],
      // Jul 2: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 3: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 4: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 5: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 6: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 7: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 8: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 9: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 10: Aug 24=$1496, Aug 25=$1496, Aug 26=$1593, Aug 27=$1496, Aug 28=$1538, Aug 29=$1461, Aug 30=$1418
      [null, null, null, null, 1496, 1496, 1593, 1496, 1538, 1461, 1418, null, null],
      // Jul 11: Aug 25=$1496, Aug 26=$1680, Aug 27=$1496, Aug 28=$1538, Aug 29=$1549, Aug 30=$1505
      [null, null, null, null, null, 1496, 1680, 1496, 1538, 1549, 1505, null, null],
      // Jul 12: Aug 26=$1636, Aug 27=$1519, Aug 28=$1680, Aug 29=$1505, Aug 30=$1461
      [null, null, null, null, null, null, 1636, 1519, 1680, 1505, 1461, null, null],
      // Jul 13: Aug 27=$1455, Aug 28=$1496, Aug 29=$1418, Aug 30=$1374
      [null, null, null, null, null, null, null, 1455, 1496, 1418, 1374, null, null],
      // Jul 14: Aug 28=$1374, Aug 29=$1418, Aug 30=$1330
      [null, null, null, null, null, null, null, null, 1374, 1418, 1330, null, null],
      // Jul 15: Aug 29=$1418, Aug 30=$1330
      [null, null, null, null, null, null, null, null, null, 1418, 1330, null, null],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月12日查询，每人价格。最低价（≥45天）$1,330/人（Jul 1→Aug 27、Jul 14/15→Aug 30），2人共 $2,661。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2848,
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
      pricePerPerson: 1498,
      totalPrice: 2996,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3227,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1696,
      totalPrice: 3392,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1899,
      totalPrice: 3798,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1970,
      totalPrice: 3939,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月1日（周三）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1330,
      totalPrice2Pax: 2661,
      daysInChina: 57,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAxagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjdqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月14日/15日（周二/三）",
      returnDate: "8月30日（周日）",
      pricePerPerson: 1330,
      totalPrice2Pax: 2661,
      daysInChina: 47,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTE0agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzBqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月1日（周三）",
      returnDate: "8月28日（周五）",
      pricePerPerson: 1374,
      totalPrice2Pax: 2748,
      daysInChina: 58,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAxagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjhqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2848,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–15日（周一至三）",
      returnDate: "8月30日（周日）",
      pricePerPerson: 1374,
      totalPrice2Pax: 2748,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzBqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};

// 历史查询：2026年5月10日 08:03 PST
const query_2026_05_10_0803: QueryResult = {
  id: "2026-05-10_08:03",
  queryDate: "2026-05-10",
  queryDateLabel: "2026年5月10日 08:03 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月10日查询，每人价格
    // 最低价（≥45天）：$1,156/人（Jul 14/15 → Sep 1），2人共 $2,312
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug 20=$1876, Aug 21=$1911, Aug 22=$1911, Aug 23=$2003
      [1876, 1911, 1911, 2003, null, null, null, null, null, null, null, null, null],
      // Jun 21: Aug 20=$1677, Aug 21=$1819, Aug 22=$1655, Aug 23=$1677
      [1677, 1819, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 22: Aug 20=$1677, Aug 21=$1876, Aug 22=$1655, Aug 23=$1677
      [1677, 1876, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 23: Aug 20=$1671, Aug 21=$1784, Aug 22=$1655, Aug 23=$1677
      [1671, 1784, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 24: Aug 20=$1671, Aug 21=$1784, Aug 23=$1677, Aug 25=$1655, Aug 26=$1701, Aug 27=$1655, Aug 30=$1650
      [1671, 1784, null, 1677, null, 1655, 1701, 1655, null, null, 1650, null, null],
      // Jun 25: Aug 20=$1671, Aug 22=$1876, Aug 24=$1721, Aug 25=$1712, Aug 26=$1724, Aug 27=$1724, Aug 28=$1721, Aug 30=$1549
      [1671, null, 1876, null, 1721, 1712, 1724, 1724, 1721, null, 1549, null, null],
      // Jun 26: Aug 20=$1677, Aug 21=$1771, Aug 27=$1655, Aug 28=$1771, Aug 30=$1655
      [1677, 1771, null, null, null, null, null, 1655, 1771, null, 1655, null, null],
      // Jul 1: Aug 26=$1653, Aug 28=$1562, Aug 29=$1562, Aug 30=$1491
      [null, null, null, null, null, null, 1653, null, 1562, 1562, 1491, null, null],
      // Jul 2: Aug 24=$1721, Aug 25=$1712, Aug 26=$1724, Aug 27=$1724, Aug 30=$1549
      [null, null, null, null, 1721, 1712, 1724, 1724, null, null, 1549, null, null],
      // Jul 3: Aug 24=$1558, Aug 26=$1688, Aug 27=$1558, Aug 28=$1612, Aug 29=$1558, Aug 30=$1541
      [null, null, null, null, 1558, null, 1688, 1558, 1612, 1558, 1541, null, null],
      // Jul 4: Aug 24=$1612, Aug 25=$1644, Aug 28=$1612, Aug 29=$1612, Aug 30=$1541
      [null, null, null, null, 1612, 1644, null, null, 1612, 1612, 1541, null, null],
      // Jul 5: Aug 24=$1519, Aug 25=$1519, Aug 26=$1688, Aug 27=$1519, Aug 28=$1612, Aug 29=$1519, Aug 30=$1519
      [null, null, null, null, 1519, 1519, 1688, 1519, 1612, 1519, 1519, null, null],
      // Jul 6: Aug 24=$1519, Aug 25=$1519, Aug 26=$1673, Aug 27=$1519, Aug 28=$1562, Aug 29=$1519, Aug 30=$1491
      [null, null, null, null, 1519, 1519, 1673, 1519, 1562, 1519, 1491, null, null],
      // Jul 7: Aug 24=$1558, Aug 25=$1558, Aug 26=$1673, Aug 27=$1558
      [null, null, null, null, 1558, 1558, 1673, 1558, null, null, null, null, null],
      // Jul 8: Aug 24=$1558, Aug 25=$1558, Aug 26=$1631, Aug 27=$1558, Aug 29=$1558, Aug 30=$1491
      [null, null, null, null, 1558, 1558, 1631, 1558, null, 1558, 1491, null, null],
      // Jul 9: Aug 24=$1562, Aug 25=$1594, Aug 26=$1653, Aug 27=$1594, Aug 28=$1562, Aug 29=$1562, Aug 30=$1491, Aug 31=$1491, Sep 1=$1400
      [null, null, null, null, 1562, 1594, 1653, 1594, 1562, 1562, 1491, 1491, 1400],
      // Jul 10: Aug 24=$1519, Aug 25=$1519, Aug 26=$1593, Aug 27=$1519, Aug 28=$1612, Aug 29=$1462, Aug 30=$1418, Aug 31=$1519, Sep 1=$1304
      [null, null, null, null, 1519, 1519, 1593, 1519, 1612, 1462, 1418, 1519, 1304],
      // Jul 11: Aug 25=$1644, Aug 26=$1688, Aug 27=$1644, Aug 28=$1612, Aug 29=$1612, Aug 30=$1541, Aug 31=$1497
      [null, null, null, null, null, 1644, 1688, 1644, 1612, 1612, 1541, 1497, null],
      // Jul 12: Aug 26=$1666, Aug 27=$1519, Aug 28=$1612, Aug 29=$1519, Aug 30=$1519, Aug 31=$1519
      [null, null, null, null, null, null, 1666, 1519, 1612, 1519, 1519, 1519, null],
      // Jul 13: Aug 27=$1519, Aug 28=$1562, Aug 29=$1418, Aug 30=$1374, Aug 31=$1491
      [null, null, null, null, null, null, null, 1519, 1562, 1418, 1374, 1491, null],
      // Jul 14: Aug 28=$1562, Aug 29=$1418, Aug 30=$1374, Aug 31=$1331, Sep 1=$1156
      [null, null, null, null, null, null, null, null, 1562, 1418, 1374, 1331, 1156],
      // Jul 15: Aug 29=$1418, Aug 30=$1374, Aug 31=$1331, Sep 1=$1156
      [null, null, null, null, null, null, null, null, null, 1418, 1374, 1331, 1156],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月10日查询，每人价格。最低价（≥45天）$1,156/人（Jul 14/15 → Sep 1），2人共 $2,312。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1426,
      totalPrice: 2852,
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
      pricePerPerson: 1499,
      totalPrice: 2998,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1759,
      totalPrice: 3518,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1828,
      totalPrice: 3655,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月14日/15日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1156,
      totalPrice2Pax: 2312,
      daysInChina: 49,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTE0agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月14日/15日",
      returnDate: "8月31日（周一）",
      pricePerPerson: 1331,
      totalPrice2Pax: 2662,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTE0agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzFqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–15日",
      returnDate: "8月30日（周日）",
      pricePerPerson: 1374,
      totalPrice2Pax: 2749,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzBqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1426,
      totalPrice2Pax: 2852,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–15日",
      returnDate: "8月29日（周六）",
      pricePerPerson: 1418,
      totalPrice2Pax: 2837,
      daysInChina: 47,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjlqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};

// 历史查询：2026年5月9日 08:06 PST
const query_2026_05_09_0806: QueryResult = {
  id: "2026-05-09_08:06",
  queryDate: "2026-05-09",
  queryDateLabel: "2026年5月9日 08:06 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月9日查询，每人价格
    // 最低价（≥45天）：$1,255/人（Jul 12/14/15 → Sep 1），2人共 $2,509
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: 无数据（矩阵未覆盖）
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 21: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 22: Aug 20=$1,637(59d), Aug 21=$1,877(60d), Aug 22=$1,655(61d), Aug 23=$1,677(62d)
      [1637, 1877, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 23: Aug 20=$1,637(58d), Aug 21=$1,785(59d), Aug 22=$1,655(60d), Aug 23=$1,677(61d)
      [1637, 1785, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 24: Aug 20=$1,671(57d), Aug 21=$1,785(58d), Aug 22=$1,655(59d), Aug 23=$1,677(60d)
      [1671, 1785, 1655, 1677, null, null, null, null, null, null, null, null, null],
      // Jun 25: 无数据（矩阵未覆盖）
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 26: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 1: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 2: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 3: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 4: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 5: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 6: Aug 24=$1,491(49d), Aug 27=$1,520(52d)
      [null, null, null, null, 1491, null, null, 1520, null, null, null, null, null],
      // Jul 7: Aug 22=$1,558(46d), Aug 23=$1,577(47d), Aug 25=$1,558(49d), Aug 26=$1,674(50d), Aug 27=$1,456(51d), Aug 28=$1,650(52d)
      [null, null, 1558, 1577, null, 1558, 1674, 1456, 1650, null, null, null, null],
      // Jul 8: Aug 22=$1,558(45d), Aug 24=$1,491(47d), Aug 25=$1,512(48d), Aug 26=$1,632(49d), Aug 27=$1,558(50d), Aug 28=$1,491(51d)
      [null, null, 1558, null, 1491, 1512, 1632, 1558, 1491, null, null, null, null],
      // Jul 9: Aug 23=$1,562(45d), Aug 24=$1,491(46d), Aug 25=$1,512(47d), Aug 26=$1,654(48d), Aug 27=$1,594(49d), Aug 28=$1,491(50d)
      [null, null, null, 1562, 1491, 1512, 1654, 1594, 1491, null, null, null, null],
      // Jul 10: Aug 23=$1,539(44d→null), Aug 24=$1,520(45d), Aug 25=$1,520(46d), Aug 26=$1,594(47d), Aug 27=$1,520(48d), Aug 28=$1,541(49d)
      [null, null, null, null, 1520, 1520, 1594, 1520, 1541, null, null, null, null],
      // Jul 11: Aug 22=$1,772(42d→null), Aug 23=$1,612(43d→null), Aug 24=$1,541(44d→null), Aug 25=$1,562(45d), Aug 26=$1,689(46d), Aug 27=$1,632(47d), Aug 28=$1,541(48d), Aug 29=$1,612(49d), Aug 30=$1,541(50d), Aug 31=$1,541(51d), Sep 1=$1,305(52d)
      [null, null, null, null, null, 1562, 1689, 1632, 1541, 1612, 1541, 1541, 1305],
      // Jul 12: Aug 22=$1,520(41d→null), Aug 24=$1,520(43d→null), Aug 25=$1,520(44d→null), Aug 26=$1,667(45d), Aug 27=$1,520(46d), Aug 28=$1,541(47d), Aug 29=$1,520(48d), Aug 31=$1,520(50d), Sep 1=$1,255(51d)
      [null, null, null, null, null, null, 1667, 1520, 1541, 1520, null, 1520, 1255],
      // Jul 13: Aug 22=$1,520(40d→null), Aug 23=$1,539(41d→null), Aug 24=$1,491(42d→null), Aug 25=$1,512(43d→null), Aug 26=$1,540(44d→null), Aug 27=$1,520(45d), Aug 28=$1,491(46d), Aug 29=$1,419(47d), Aug 30=$1,375(48d), Aug 31=$1,491(49d)
      [null, null, null, null, null, null, null, 1520, 1491, 1419, 1375, 1491, null],
      // Jul 14: Aug 22=$1,518(39d→null), Aug 23=$1,539(40d→null), Aug 25=$1,475(42d→null), Aug 26=$1,475(43d→null), Aug 27=$1,520(44d→null), Aug 28=$1,491(45d), Aug 29=$1,419(46d), Aug 30=$1,375(47d), Sep 1=$1,255(49d)
      [null, null, null, null, null, null, null, null, 1491, 1419, 1375, null, 1255],
      // Jul 15: Aug 29=$1,419(45d), Aug 30=$1,375(46d), Aug 31=$1,456(47d), Sep 1=$1,255(48d)
      [null, null, null, null, null, null, null, null, null, 1419, 1375, 1456, 1255],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月9日查询，每人价格。最低价（≥45天）$1,255/人（Jul 12/14/15 → Sep 1），2人共 $2,509。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1231,
      totalPrice: 2461,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1322,
      totalPrice: 2611,
      daysInChina: 35,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2847,
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
      pricePerPerson: 1499,
      totalPrice: 2997,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3227,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1765,
      totalPrice: 3530,
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
      departDate: "7月16日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1231,
      totalPrice2Pax: 2461,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，低于推荐的45天",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月12日/14日/15日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1255,
      totalPrice2Pax: 2509,
      daysInChina: 51,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2847,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–14日",
      returnDate: "8月30日（周日）",
      pricePerPerson: 1375,
      totalPrice2Pax: 2749,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzBqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–15日",
      returnDate: "8月29日（周六）",
      pricePerPerson: 1419,
      totalPrice2Pax: 2837,
      daysInChina: 47,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjlqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};

// 历史查询：2026年5月8日 09:10 PST
const query_2026_05_08_0910: QueryResult = {
  id: "2026-05-08_09:10",
  queryDate: "2026-05-08",
  queryDateLabel: "2026年5月8日 09:10 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月8日查询，每人价格
    // 最低价（≥45天）：$1,255/人（Jul 12–15 → Sep 1），2人共 $2,509
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: 无数据（出发日期过早，矩阵未覆盖）
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 21: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 22: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 23–26: 无数据（矩阵未覆盖）
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 1: Aug 20=$1,512(50d), Aug 25=$1,512(55d)
      [1512, null, null, null, null, 1512, null, null, null, null, null, null, null],
      // Jul 2: Aug 20=$1,512(49d), Aug 25=$1,512(54d)
      [1512, null, null, null, null, 1512, null, null, null, null, null, null, null],
      // Jul 3: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 4: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jul 5: Aug 24=$1,520(50d), Aug 25=$1,520(51d), Aug 27=$1,520(53d), Aug 30=$1,520(56d)
      [null, null, null, null, 1520, 1520, null, 1520, null, null, 1520, null, null],
      // Jul 6: Aug 20=$1,512(45d), Aug 25=$1,512(50d), Aug 27=$1,520(52d), Aug 30=$1,491(55d)
      [1512, null, null, null, null, 1512, null, 1520, null, null, 1491, null, null],
      // Jul 7: Aug 24=$1,558(48d), Aug 25=$1,558(49d), Aug 26=$1,581(50d), Aug 29=$1,550(53d), Aug 30=$1,550(54d)
      [null, null, null, null, 1558, 1558, 1581, null, null, 1550, 1550, null, null],
      // Jul 8: Aug 24=$1,520(47d), Aug 25=$1,512(48d), Aug 27=$1,558(50d), Aug 28=$1,562(51d), Aug 29=$1,558(52d)
      [null, null, null, null, 1520, 1512, null, 1558, 1562, 1558, null, null, null],
      // Jul 9: Aug 24=$1,562(46d), Aug 25=$1,512(47d), Aug 26=$1,481(48d), Aug 27=$1,654(49d), Aug 28=$1,562(50d), Aug 29=$1,562(51d), Aug 30=$1,491(52d)
      [null, null, null, null, 1562, 1512, 1481, 1654, 1562, 1562, 1491, null, null],
      // Jul 10: Aug 24=$1,520(45d), Aug 25=$1,520(46d), Aug 27=$1,520(48d), Aug 29=$1,462(50d), Aug 30=$1,419(51d)
      [null, null, null, null, 1520, 1520, null, 1520, null, 1462, 1419, null, null],
      // Jul 11: Aug 24=$1,612(44d→null), Aug 25=$1,562(45d), Aug 26=$1,689(46d), Aug 28=$1,612(48d), Aug 29=$1,612(49d)
      [null, null, null, null, null, 1562, 1689, null, 1612, 1612, null, null, null],
      // Jul 12: Aug 24=$1,520(43d→null), Aug 25=$1,520(44d→null), Aug 27=$1,520(46d), Aug 28=$1,612(47d), Aug 29=$1,520(48d), Aug 30=$1,520(49d), Sep 1=$1,255(51d)
      [null, null, null, null, null, null, null, 1520, 1612, 1520, 1520, null, 1255],
      // Jul 13: Aug 24=$1,520(42d→null), Aug 25=$1,512(43d→null), Aug 26=$1,415(44d→null), Aug 27=$1,520(45d), Aug 28=$1,562(46d), Aug 29=$1,419(47d), Aug 30=$1,375(48d), Sep 1=$1,255(50d)
      [null, null, null, null, null, null, null, 1520, 1562, 1419, 1375, null, 1255],
      // Jul 14: Aug 24=$1,475(41d→null), Aug 25=$1,475(42d→null), Aug 26=$1,350(43d→null), Aug 27=$1,520(44d→null), Aug 28=$1,562(45d), Aug 29=$1,419(46d), Aug 30=$1,375(47d), Sep 1=$1,255(49d)
      [null, null, null, null, null, null, null, null, 1562, 1419, 1375, null, 1255],
      // Jul 15: Aug 25=$1,512(41d→null), Aug 26=$1,550(42d→null), Aug 27=$1,520(43d→null), Aug 28=$1,562(44d→null), Aug 29=$1,419(45d), Aug 30=$1,375(46d), Sep 1=$1,255(48d)
      [null, null, null, null, null, null, null, null, null, 1419, 1375, null, 1255],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月8日查询，每人价格。最低价（≥45天）$1,255/人（Jul 12–15 → Sep 1），2人共 $2,509。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1304,
      totalPrice: 2608,
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
      pricePerPerson: 1377,
      totalPrice: 2754,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1246,
      totalPrice: 2492,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1319,
      totalPrice: 2638,
      daysInChina: 35,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
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
      returnDate: "8月27日（周四）",
      pricePerPerson: 1246,
      totalPrice2Pax: 2492,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，低于推荐的45天",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月12日–15日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1255,
      totalPrice2Pax: 2509,
      daysInChina: 51,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1304,
      totalPrice2Pax: 2608,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1377,
      totalPrice2Pax: 2754,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，低于推荐的45天",
      bookingUrl: "https://www.hainanairlines.com/US/CN/Home",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–14日",
      returnDate: "8月30日（周日）",
      pricePerPerson: 1375,
      totalPrice2Pax: 2749,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzBqBwgBEgNQVkdyBwgBEgNTRUFAAUACSAFwAYIBCwj___________8BmAEB&hl=en&curr=USD&gl=us",
    },
  ],
};

// 历史查询：2026年5月7日 08:01 PST
const query_2026_05_07_0801: QueryResult = {
  id: "2026-05-07_08:01",
  queryDate: "2026-05-07",
  queryDateLabel: "2026年5月7日 08:01 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月7日查询，每人价格
    // 最低价（≥45天）：$1,261/人（Jul 12–15 → Sep 1），2人共 $2,522
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: 无数据（出发日期过早，矩阵未覆盖）
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 21: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 22: 无数据
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      // Jun 23: Aug 20=$1,760(58d), Aug 21=$1,810(59d), Aug 22=$1,925(60d), Aug 23=$1,810(61d), Aug 24=$1,728(62d), Aug 25=$1,760(63d), Aug 26=$1,853(64d)
      [1760, 1810, 1925, 1810, 1728, 1760, 1853, null, null, null, null, null, null],
      // Jun 24: Aug 20=$1,760(57d), Aug 21=$1,810(58d), Aug 22=$1,925(59d), Aug 23=$1,810(60d), Aug 24=$1,728(61d), Aug 25=$1,760(62d), Aug 26=$1,853(63d)
      [1760, 1810, 1925, 1810, 1728, 1760, 1853, null, null, null, null, null, null],
      // Jun 25: Aug 20=$1,760(56d), Aug 21=$1,810(57d), Aug 22=$1,925(58d), Aug 23=$1,810(59d), Aug 24=$1,728(60d), Aug 25=$1,760(61d), Aug 26=$1,883(62d)
      [1760, 1810, 1925, 1810, 1728, 1760, 1883, null, null, null, null, null, null],
      // Jun 26: Aug 20=$1,810(55d), Aug 21=$1,860(56d), Aug 22=$1,800(57d), Aug 23=$1,825(58d), Aug 24=$1,778(59d), Aug 25=$1,800(60d), Aug 26=$1,838(61d)
      [1810, 1860, 1800, 1825, 1778, 1800, 1838, null, null, null, null, null, null],
      // Jul 1: Aug 24=$1,569(54d), Aug 25=$1,601(55d), Aug 26=$1,789(56d), Aug 27=$1,698(57d), Aug 28=$1,569(58d), Aug 29=$1,651(59d), Aug 30=$1,498(60d)
      [null, null, null, null, 1569, 1601, 1789, 1698, 1569, 1651, 1498, null, null],
      // Jul 2: Aug 24=$1,728(53d), Aug 25=$1,751(54d), Aug 26=$1,808(55d), Aug 27=$1,806(56d), Aug 28=$1,728(57d), Aug 29=$1,756(58d), Aug 30=$1,657(59d)
      [null, null, null, null, 1728, 1751, 1808, 1806, 1728, 1756, 1657, null, null],
      // Jul 3: Aug 24=$1,619(52d), Aug 25=$1,651(53d), Aug 26=$1,838(54d), Aug 27=$1,646(55d), Aug 28=$1,619(56d), Aug 29=$1,701(57d), Aug 30=$1,548(58d)
      [null, null, null, null, 1619, 1651, 1838, 1646, 1619, 1701, 1548, null, null],
      // Jul 4: Aug 24=$1,619(51d), Aug 25=$1,651(52d), Aug 26=$1,839(53d), Aug 27=$1,748(54d), Aug 28=$1,619(55d), Aug 29=$1,701(56d), Aug 30=$1,548(57d)
      [null, null, null, null, 1619, 1651, 1839, 1748, 1619, 1701, 1548, null, null],
      // Jul 5: Aug 24=$1,619(50d), Aug 25=$1,645(51d), Aug 26=$1,723(52d), Aug 27=$1,645(53d), Aug 28=$1,619(54d), Aug 29=$1,645(55d), Aug 30=null
      [null, null, null, null, 1619, 1645, 1723, 1645, 1619, 1645, null, null, null],
      // Jul 6: Aug 24=$1,569(49d), Aug 25=$1,601(50d), Aug 26=$1,789(51d), Aug 27=$1,645(52d), Aug 28=null, Aug 29=null, Aug 30=null
      [null, null, null, null, 1569, 1601, 1789, 1645, null, null, null, null, null],
      // Jul 7: Aug 24=$1,703(48d), Aug 25=$1,703(49d), Aug 26=$1,673(50d), Aug 27=$1,599(51d), Aug 28=$1,728(52d), Aug 29=$1,609(53d), Aug 30=$1,657(54d)
      [null, null, null, null, 1703, 1703, 1673, 1599, 1728, 1609, 1657, null, null],
      // Jul 8: Aug 24=$1,569(47d), Aug 25=$1,601(48d), Aug 26=$1,673(49d), Aug 27=$1,456(50d), Aug 28=$1,569(51d), Aug 29=$1,609(52d), Aug 30=$1,498(53d)
      [null, null, null, null, 1569, 1601, 1673, 1456, 1569, 1609, 1498, null, null],
      // Jul 9: Aug 24=$1,569(46d), Aug 25=$1,601(47d), Aug 26=$1,618(48d), Aug 27=$1,698(49d), Aug 28=$1,569(50d), Aug 29=$1,609(51d), Aug 30=$1,498(52d)
      [null, null, null, null, 1569, 1601, 1618, 1698, 1569, 1609, 1498, null, null],
      // Jul 10: Aug 25=$1,645(46d), Aug 26=$1,723(47d), Aug 27=$1,645(48d), Aug 28=$1,619(49d), Aug 29=$1,606(50d), Aug 30=$1,548(51d), Aug 31=$1,619(52d), Sep 1=$1,311(53d)
      [null, null, null, null, null, 1645, 1723, 1645, 1619, 1606, 1548, 1619, 1311],
      // Jul 11: Aug 25=$1,645(45d), Aug 26=$1,668(46d), Aug 27=$1,646(47d), Aug 28=$1,619(48d), Aug 29=$1,659(49d), Aug 30=$1,548(50d), Aug 31=$1,619(51d), Sep 1=$1,311(52d)
      [null, null, null, null, null, 1645, 1668, 1646, 1619, 1659, 1548, 1619, 1311],
      // Jul 12: Aug 28=$1,548(47d), Aug 29=$1,645(48d), Aug 30=$1,548(49d), Aug 31=$1,619(50d), Sep 1=$1,261(51d)
      [null, null, null, null, null, null, null, null, 1548, 1645, 1548, 1619, 1261],
      // Jul 13: Aug 29=$1,556(47d), Aug 30=$1,498(48d), Aug 31=$1,543(49d), Sep 1=$1,261(50d)
      [null, null, null, null, null, null, null, null, null, 1556, 1498, 1543, 1261],
      // Jul 14: Aug 29=$1,556(46d), Aug 30=$1,498(47d), Aug 31=$1,456(48d), Sep 1=$1,261(49d)
      [null, null, null, null, null, null, null, null, null, 1556, 1498, 1456, 1261],
      // Jul 15: Aug 29=$1,556(45d), Aug 30=$1,498(46d), Aug 31=$1,456(47d), Sep 1=$1,261(48d)
      [null, null, null, null, null, null, null, null, null, 1556, 1498, 1456, 1261],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月7日查询，每人价格。最低价（≥45天）$1,261/人（Jul 12–15 → Sep 1），2人共 $2,522。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2848,
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
      pricePerPerson: 1424,
      totalPrice: 2848,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1760,
      totalPrice: 3520,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1828,
      totalPrice: 3656,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月12日–15日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1261,
      totalPrice2Pax: 2522,
      daysInChina: 51,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月10日–11日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1311,
      totalPrice2Pax: 2622,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEwagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2848,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月8日（周三）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1456,
      totalPrice2Pax: 2912,
      daysInChina: 50,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA4agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjdqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月14日–15日",
      returnDate: "8月31日（周一）",
      pricePerPerson: 1456,
      totalPrice2Pax: 2912,
      daysInChina: 48,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTE0agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMzFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
  ],
};

// 历史查询：2026年5月6日 08:05 PST
const query_2026_05_06_0805: QueryResult = {
  id: "2026-05-06_08:05",
  queryDate: "2026-05-06",
  queryDateLabel: "2026年5月6日 08:05 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月6日查询，每人价格
    // 最低价（≥45天）：$1,256/人（Jul 13–15 → Sep 1），2人共 $2,512
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug 20=$2,053(61d)
      [2053, 2093, 2038, 2038, null, null, null, null, null, null, null, null, null],
      // Jun 21: Aug 20=$1,854(60d)
      [1854, 1988, 1830, 1830, 1830, 1830, 1893, 1830, null, null, null, null, null],
      // Jun 22: Aug 20=$1,819(59d)
      [1819, 2006, 1933, 1933, null, 1906, 1958, 1906, null, null, null, null, null],
      // Jun 23: Aug 20=$1,908(58d)
      [1908, 1948, 1893, 1893, 1908, null, 1853, 1853, null, null, null, null, null],
      // Jun 24: Aug 21=$1,948(58d)
      [null, 1948, 1830, 1830, 1830, 1830, null, 1830, null, null, null, null, null],
      // Jun 25: Aug 21=$1,948(57d)
      [null, 1948, 1893, 1893, 1908, 1853, 1853, 1853, null, null, null, null, null],
      // Jun 26: Aug 21=$1,933(56d)
      [null, 1933, 1800, 1800, 1800, 1800, null, 1800, null, null, null, null, null],
      // Jul 1: Aug 21=$1,766(51d)
      [null, 1766, 1751, 1751, 1706, 1706, 1716, 1706, null, null, null, null, null],
      // Jul 2: Aug 21=$1,766(50d)
      [null, 1766, 1766, 1766, 1766, 1716, null, 1716, null, null, null, null, null],
      // Jul 3: Aug 21=$1,816(49d)
      [null, 1816, 1816, 1816, 1816, 1766, 1766, 1766, null, null, null, null, null],
      // Jul 4: Aug 21=$1,816(48d)
      [null, 1816, 1816, 1816, 1816, 1766, 1766, 1766, null, null, null, null, null],
      // Jul 5: Aug 23=$1,645(49d)
      [null, null, null, 1645, 1645, 1645, 1723, 1645, 1804, 1645, null, null, null],
      // Jul 6: Aug 23=$1,645(48d)
      [null, null, null, 1645, 1645, 1645, 1716, 1645, 1766, 1645, null, null, null],
      // Jul 7: Aug 23=$1,716(47d)
      [null, null, null, 1716, 1703, 1703, 1673, 1703, 1738, 1604, null, null, null],
      // Jul 8: Aug 23=$1,689(46d)
      [null, null, null, 1689, 1689, 1689, 1673, null, 1738, 1604, null, null, null],
      // Jul 9: Aug 23=$1,766(45d)
      [null, null, null, 1766, 1761, 1716, 1618, 1716, 1754, 1604, 1766, 1618, 1418],
      // Jul 10: Aug 24=$1,645(45d)
      [null, null, null, null, 1645, 1645, 1723, 1645, 1788, 1645, 1645, 1645, 1311],
      // Jul 11: Aug 25=$1,753(45d)
      [null, null, null, null, null, 1753, 1668, 1753, 1788, 1654, 1788, 1646, 1311],
      // Jul 12: Aug 28=$1,738(47d)
      [null, null, null, null, null, null, null, null, 1738, 1645, 1645, 1645, 1261],
      // Jul 13: Aug 28=$1,738(46d)
      [null, null, null, null, null, null, null, null, 1738, 1604, 1619, 1456, 1256],
      // Jul 14: Aug 28=$1,738(45d)
      [null, null, null, null, null, null, null, null, 1738, 1604, 1619, 1456, 1256],
      // Jul 15: Aug 29=$1,604(45d)
      [null, null, null, null, null, null, null, null, null, 1604, 1619, 1456, 1256],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月6日查询，每人价格。最低价（≥45天）$1,256/人（Jul 13–15 → Sep 1），2人共 $2,512。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2848,
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
      pricePerPerson: 1495,
      totalPrice: 2990,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1756,
      totalPrice: 3512,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1847,
      totalPrice: 3694,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月13日–15日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1256,
      totalPrice2Pax: 2512,
      daysInChina: 50,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月12日（周日）",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1261,
      totalPrice2Pax: 2522,
      daysInChina: 51,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZAMAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月10日–11日",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1311,
      totalPrice2Pax: 2622,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEwagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月9日（周四）",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1418,
      totalPrice2Pax: 2836,
      daysInChina: 54,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA5agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2848,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年5月5日 08:05 PST
const query_2026_05_05_0805: QueryResult = {
  id: "2026-05-05_08:05",
  queryDate: "2026-05-05",
  queryDateLabel: "2026年5月5日 08:05 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月5日查询，每人价格
    // Aug 20-24 为今日查询数据；Aug 25-Sep 1 为2026年5月3日查询数据（参考值）
    // 最低价（≥45天）：$1,252/人（Jul 7–15 → Aug 29–Sep 1），2人共 $2,504
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug 20=$2,053(61d), Aug 21=$2,093(62d), Aug 22=$2,038(63d), Aug 23=$2,038(64d), ...
      [2053, 2093, 2038, 2038, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 21: Aug 20=$1,854(60d), Aug 21=$1,988(61d), Aug 22=$1,830(62d), Aug 23=$1,830(63d), ...
      [1854, 1988, 1830, 1830, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 22: Aug 20=$1,957(59d), Aug 21=$2,053(60d), Aug 22=$1,933(61d), Aug 23=$1,933(62d), ...
      [1957, 2053, 1933, 1933, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 23: Aug 20=$1,908(58d), Aug 21=$1,948(59d), Aug 22=$1,893(60d), Aug 23=$1,893(61d), ...
      [1908, 1948, 1893, 1893, 1506, 1506, 1799, 1506, 1506, null, null, null, null],
      // Jun 24: Aug 20=$1,854(57d), Aug 21=$1,948(58d), Aug 22=$1,830(59d), Aug 23=$1,830(60d), ...
      [1854, 1948, 1830, 1830, 1830, 1506, 1799, 1506, 1506, null, null, null, null],
      // Jun 25: Aug 20=$2,013(56d), Aug 21=$2,053(57d), Aug 22=$1,998(58d), Aug 23=$1,998(59d), ...
      [2013, 2053, 1998, 1998, 2013, 1506, 1799, 1506, 1506, null, null, null, null],
      // Jun 26: Aug 20=$1,825(55d), Aug 21=$1,933(56d), Aug 22=$1,800(57d), Aug 23=$1,800(58d), ...
      [1825, 1933, 1800, 1800, 1800, 1506, 1799, 1506, 1506, 1645, null, null, 1506],
      // Jul 1: Aug 20=$1,619(50d), Aug 21=$1,766(51d), Aug 22=$1,751(52d), Aug 23=$1,751(53d), ...
      [1619, 1766, 1751, 1751, 1809, 1809, 1859, 1456, 1839, 1589, 1589, 1589, 1589],
      // Jul 2: Aug 20=$1,716(49d), Aug 21=$1,766(50d), Aug 22=$1,766(51d), Aug 23=$1,766(52d), ...
      [1716, 1766, 1766, 1766, 1809, 1809, 1859, 1809, 1839, 1269, 1706, 1706, 1452],
      // Jul 3: Aug 20=$1,766(48d), Aug 21=$1,816(49d), Aug 22=$1,816(50d), Aug 23=$1,816(51d), ...
      [1766, 1816, 1816, 1816, 1816, 1859, 1859, 1889, 1356, 1889, 1889, 1889, 1452],
      // Jul 4: Aug 20=$1,766(47d), Aug 21=$1,816(48d), Aug 22=$1,816(49d), Aug 23=$1,816(50d), ...
      [1766, 1816, 1816, 1816, 1889, 1667, 1853, 1506, 1356, 1756, 1669, 1889, 1306],
      // Jul 5: Aug 20=$1,667(46d), Aug 21=$1,816(47d), Aug 22=$1,645(48d), Aug 23=$1,645(49d), ...
      [1667, 1816, 1645, 1645, 1667, 1667, 1730, 1667, 1838, 1319, 1319, 1645, 1352],
      // Jul 6: Aug 20=$1,667(45d), Aug 21=$1,766(46d), Aug 22=$1,645(47d), Aug 23=$1,645(48d), ...
      [1667, 1766, 1645, 1645, 1599, 1667, 1798, 1599, 1506, 1269, 1599, 1599, 1352],
      // Jul 7: Aug 21=$1,711(45d), Aug 22=$1,711(46d), Aug 23=$1,711(47d), Aug 24=$1,599(48d), ...
      [null, 1711, 1711, 1711, 1599, 1711, 1680, 1599, 1506, 1252, 1252, 1252, 1252],
      // Jul 8: Aug 22=$1,689(45d), Aug 23=$1,689(46d), Aug 24=$1,599(47d), Aug 25=$1,667(48d), ...
      [null, null, 1689, 1689, 1599, 1667, 1853, 1506, 1306, 1252, 1252, 1252, 1252],
      // Jul 9: Aug 23=$1,766(45d), Aug 24=$1,646(46d), Aug 25=$1,646(47d), Aug 26=$1,723(48d), ...
      [null, null, null, 1766, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 10: Aug 24=$1,646(45d), Aug 25=$1,646(46d), Aug 26=$1,723(47d), Aug 27=$1,646(48d), ...
      [null, null, null, null, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 11: Aug 25=$1,646(45d), Aug 26=$1,723(46d), Aug 27=$1,646(47d), Aug 28=$1,556(48d), ...
      [null, null, null, null, null, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 12: Aug 26=$1,723(45d), Aug 27=$1,646(46d), Aug 28=$1,306(47d), Aug 29=$1,252(48d), ...
      [null, null, null, null, null, null, 1723, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 13: Aug 27=$1,646(45d), Aug 28=$1,306(46d), Aug 29=$1,252(47d), Aug 30=$1,252(48d), ...
      [null, null, null, null, null, null, null, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 14: Aug 28=$1,306(45d), Aug 29=$1,252(46d), Aug 30=$1,252(47d), Aug 31=$1,252(48d), ...
      [null, null, null, null, null, null, null, null, 1306, 1252, 1252, 1252, 1252],
      // Jul 15: Aug 29=$1,252(45d), Aug 30=$1,252(46d), Aug 31=$1,252(47d), Sep 1=$1,252(48d)
      [null, null, null, null, null, null, null, null, null, 1252, 1252, 1252, 1252],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月5日查询，每人价格。Aug 20-24 为今日查询数据；Aug 25-Sep 1 为5月3日参考数据。最低价（≥45天）$1,252/人（Jul 7–15 → Aug 29–Sep 1），2人共 $2,504。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1427,
      totalPrice: 2853,
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
      pricePerPerson: 1498,
      totalPrice: 2995,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1648,
      totalPrice: 3295,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3369,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1757,
      totalPrice: 3513,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1858,
      totalPrice: 3716,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月7日（周二）",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1252,
      totalPrice2Pax: 2504,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA3agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月8日–15日",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1252,
      totalPrice2Pax: 2504,
      daysInChina: 52,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA4agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月6日（周一）",
      returnDate: "8月29日（周六）",
      pricePerPerson: 1269,
      totalPrice2Pax: 2538,
      daysInChina: 54,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA2agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjlqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月2日（周四）",
      returnDate: "8月29日（周六）",
      pricePerPerson: 1269,
      totalPrice2Pax: 2538,
      daysInChina: 58,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjlqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1427,
      totalPrice2Pax: 2853,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年5月3日 08:01 PST
const query_2026_05_03_0801: QueryResult = {
  id: "2026-05-03_08:01",
  queryDate: "2026-05-03",
  queryDateLabel: "2026年5月3日 08:01 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月3日查询，每人价格
    // 最低价（≥45天）：$1,119/人（Jul 7 → Sep 3），2人共 $2,238
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug20=null(61d), Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=null, Aug26=null, Aug27=null, Aug28=null, Aug29=$1,830, Aug30=$1,830, Aug31=$1,830, Sep1=$1,973
      [null, null, null, null, null, null, null, null, null, 1830, 1830, 1830, 1973],
      // Jun 21: same as Jun 20
      [null, null, null, null, null, null, null, null, null, 1830, 1830, 1830, 1830],
      // Jun 22: Sep4=$1,506
      [null, null, null, null, null, null, null, null, null, 1830, 1830, 1830, 1830],
      // Jun 23: Aug29=$1,893
      [null, null, null, null, null, null, null, null, null, 1893, 1830, 1830, 1830],
      // Jun 24: Aug29=$1,830
      [null, null, null, null, null, null, null, null, null, 1830, 1830, 1830, 1830],
      // Jun 25: Aug29=$1,830
      [null, null, null, null, null, null, null, null, null, 1830, 1830, 1830, 1830],
      // Jun 26: Aug29=$1,645, Sep1=$1,506
      [null, null, null, null, null, null, null, null, null, 1645, 1645, 1645, 1506],
      // Jul 1: Aug20=$1,589(50d), Aug27=$1,456, Aug29=$1,589, Sep1=$1,589
      [1589, 1589, 1776, 1756, 1809, 1809, 1859, 1456, 1839, 1589, 1589, 1589, 1589],
      // Jul 2: Aug20=$1,809(49d), Aug27=$1,809, Aug29=$1,269, Sep1=$1,452
      [1809, 1809, 1809, 1809, 1809, 1809, 1859, 1809, 1839, 1269, 1706, 1706, 1452],
      // Jul 3: Aug20=$1,889(48d), Aug28=$1,356, Aug29=$1,889, Sep1=$1,452
      [1889, 1889, 1889, 1889, 1889, 1859, 1859, 1889, 1356, 1889, 1889, 1889, 1452],
      // Jul 4: Aug20=$1,669(47d), Aug28=$1,356, Sep1=$1,306
      [1669, 1669, 1889, 1889, 1889, 1667, 1853, 1506, 1356, 1756, 1669, 1889, 1306],
      // Jul 5: Aug20=$1,669(46d), Aug27=$1,667, Aug29=$1,319, Sep1=$1,352
      [1669, 1669, 1667, 1667, 1667, 1667, 1730, 1667, 1838, 1319, 1319, 1645, 1352],
      // Jul 6: Aug20=$1,669(45d), Aug27=$1,599, Aug29=$1,269, Sep1=$1,352
      [1669, 1669, 1667, 1667, 1599, 1667, 1798, 1599, 1506, 1269, 1599, 1599, 1352],
      // Jul 7: Aug20=null(44d✗), Aug21=null(45d✓), Aug22=$1,711, Aug27=$1,599, Aug28=$1,506, Aug29=$1,252, Sep1=$1,252
      [null, 1711, 1711, 1711, 1599, 1711, 1680, 1599, 1506, 1252, 1252, 1252, 1252],
      // Jul 8: Aug20=null(43d✗), Aug21=null(44d✗), Aug22=null(45d✓), Aug27=$1,506, Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, 1889, 1889, 1599, 1667, 1853, 1506, 1306, 1252, 1252, 1252, 1252],
      // Jul 9: Aug20=null(42d✗), Aug21=null(43d✗), Aug22=null(44d✗), Aug23=null(45d✓), Aug27=$1,646, Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, 1823, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 10: Aug20=null(41d✗), Aug21=null(42d✗), Aug22=null(43d✗), Aug23=null(44d✗), Aug24=null(45d✓), Aug27=$1,646, Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 11: Aug20=null(40d✗), Aug25=null(45d✓), Aug27=$1,646, Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 12: Aug20=null(39d✗), Aug26=null(45d✓), Aug27=$1,646, Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, 1723, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 13: Aug20=null(38d✗), Aug27=null(45d✓), Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, null, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 14: Aug20=null(37d✗), Aug28=null(45d✓), Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, null, null, 1306, 1252, 1252, 1252, 1252],
      // Jul 15: Aug20=null(36d✗), Aug29=null(45d✓), Sep1=$1,252
      [null, null, null, null, null, null, null, null, null, 1252, 1252, 1252, 1252],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月3日查询，每人价格。最低价（≥45天）$1,119/人（Jul 7 → Sep 3），2人共 $2,238。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2848,
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
      pricePerPerson: 1495,
      totalPrice: 2990,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1756,
      totalPrice: 3512,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1847,
      totalPrice: 3694,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月7日（周二）",
      returnDate: "8月29日–9月3日",
      pricePerPerson: 1119,
      totalPrice2Pax: 2238,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA3agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDNqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月7日–15日",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1252,
      totalPrice2Pax: 2504,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA3agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月2日（周四）",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1269,
      totalPrice2Pax: 2538,
      daysInChina: 58,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月4日（周六）",
      returnDate: "9月1日（周二）",
      pricePerPerson: 1306,
      totalPrice2Pax: 2612,
      daysInChina: 59,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA0agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2848,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年5月2日 08:02 PST
const query_2026_05_02_0802: QueryResult = {
  id: "2026-05-02_08:02",
  queryDate: "2026-05-02",
  queryDateLabel: "2026年5月2日 08:02 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26",
      "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
      "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
      "Aug 29", "Aug 30", "Aug 31", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年5月2日查询，每人价格
    // 最低价（≥45天）：$1,252/人（Jul 7-15 → Aug 29-Sep 1），2人共 $2,504
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 20: Aug20=null(61d), Aug21=null, Aug22=$1,506(63d), Aug23=$1,506, Aug24=$1,506, Aug25=$1,506, Aug26=$1,799, Aug27=$1,506, Aug28=null, Aug29=null, Aug30=null, Aug31=null, Sep1=null
      [null, null, 1506, 1506, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 21: same as Jun 20
      [null, null, 1506, 1506, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 22: same as Jun 20
      [null, null, 1506, 1506, 1506, 1506, 1799, 1506, null, null, null, null, null],
      // Jun 23: Aug28=$1,506(66d)
      [null, null, 1506, 1506, 1506, 1506, 1799, 1506, 1506, null, null, null, null],
      // Jun 24: Aug28=$1,506(65d)
      [null, null, 1599, 1599, 1599, 1599, 1799, 1599, 1506, null, null, null, null],
      // Jun 25: Aug28=$1,556(64d)
      [null, null, 1599, 1599, 1599, 1599, 1799, 1599, 1556, null, null, null, null],
      // Jun 26: Aug28=$1,556(63d)
      [null, null, 1556, 1556, 1556, 1556, 1799, 1556, 1556, null, null, null, null],
      // Jul 1: Aug20=$1,669(50d), Aug21=$1,669, Aug22=$1,669, Aug23=$1,669, Aug24=$1,506, Aug25=$1,506, Aug26=$1,799, Aug27=$1,506, Aug28=null, Aug29=$1,506, Aug30=$1,506, Aug31=$1,506, Sep1=$1,452
      [1669, 1669, 1669, 1669, 1506, 1506, 1799, 1506, null, 1506, 1506, 1506, 1452],
      // Jul 2: Aug20=$1,669(49d), Aug28=null, Sep1=$1,452
      [1669, 1669, 1669, 1669, 1506, 1506, 1799, 1506, null, 1506, 1506, 1506, 1452],
      // Jul 3: Aug20=$1,669(48d), Aug28=$1,356(56d), Sep1=$1,452
      [1669, 1669, 1669, 1669, 1506, 1506, 1799, 1506, 1356, 1506, 1506, 1506, 1452],
      // Jul 4: Aug20=$1,669(47d), Aug28=$1,356(55d), Sep1=$1,352
      [1669, 1669, 1669, 1669, 1506, 1506, 1799, 1506, 1356, 1506, 1506, 1506, 1352],
      // Jul 5: Aug20=$1,669(46d), Aug24=$1,777, Aug28=$1,838, Sep1=$1,506
      [1669, 1669, 1669, 1669, 1777, 1777, 1723, 1777, 1838, 1506, 1506, 1506, 1506],
      // Jul 6: Aug20=$1,669(45d), Aug24=$1,599, Aug28=$1,506, Sep1=$1,452
      [1669, 1669, 1669, 1669, 1599, 1599, 1703, 1599, 1506, 1506, 1506, 1506, 1452],
      // Jul 7: Aug20=null(44d✗), Aug21=null(45d✓), Aug22=$1,669, Aug28=$1,506, Aug29=$1,252, Sep1=$1,252
      [null, 1669, 1669, 1669, 1599, 1599, 1673, 1599, 1506, 1252, 1252, 1252, 1252],
      // Jul 8: Aug20=null(43d✗), Aug21=null(44d✗), Aug22=null(45d✓), Aug24=$1,456, Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, 1669, 1669, 1456, 1456, 1673, 1456, 1306, 1252, 1252, 1252, 1252],
      // Jul 9: Aug20=null(42d✗), Aug21=null(43d✗), Aug22=null(44d✗), Aug23=null(45d✓), Aug24=$1,646, Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, 1823, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 10: Aug20=null(41d✗), Aug21=null(42d✗), Aug22=null(43d✗), Aug23=null(44d✗), Aug24=null(45d✓), Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, 1646, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 11: Aug20=null(40d✗), Aug21=null(41d✗), Aug22=null(42d✗), Aug23=null(43d✗), Aug24=null(44d✗), Aug25=null(45d✓), Aug28=$1,556, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, 1646, 1723, 1646, 1556, 1252, 1252, 1252, 1252],
      // Jul 12: Aug20=null(39d✗), Aug25=null(44d✗), Aug26=null(45d✓), Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, 1723, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 13: Aug20=null(38d✗), Aug26=null(44d✗), Aug27=null(45d✓), Aug28=$1,306, Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, null, 1646, 1306, 1252, 1252, 1252, 1252],
      // Jul 14: Aug20=null(37d✗), Aug27=null(44d✗), Aug28=null(45d✓), Aug29=$1,252, Sep1=$1,252
      [null, null, null, null, null, null, null, null, 1306, 1252, 1252, 1252, 1252],
      // Jul 15: Aug20=null(36d✗), Aug28=null(44d✗), Aug29=null(45d✓), Sep1=$1,252
      [null, null, null, null, null, null, null, null, null, 1252, 1252, 1252, 1252],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年5月2日查询，每人价格。最低价（≥45天）$1,252/人（Jul 7-15 → Aug 29-Sep 1），2人共 $2,504。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1435,
      totalPrice: 2870,
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
      pricePerPerson: 1495,
      totalPrice: 2990,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3228,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1785,
      totalPrice: 3570,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1828,
      totalPrice: 3656,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月7日（周二）",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1252,
      totalPrice2Pax: 2504,
      daysInChina: 53,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA3agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjlqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月9日–15日",
      returnDate: "8月29日–9月1日",
      pricePerPerson: 1252,
      totalPrice2Pax: 2504,
      daysInChina: 50,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDktMDFqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月3日或4日",
      returnDate: "8月28日（周五）",
      pricePerPerson: 1306,
      totalPrice2Pax: 2612,
      daysInChina: 56,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjhqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月12日–14日",
      returnDate: "8月28日（周五）",
      pricePerPerson: 1306,
      totalPrice2Pax: 2612,
      daysInChina: 47,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTEyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjhqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1435,
      totalPrice2Pax: 2870,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年4月30日 08:02 PST
const query_2026_04_30_0802: QueryResult = {
  id: "2026-04-30_08:02",
  queryDate: "2026-04-30",
  queryDateLabel: "2026年4月30日 08:02 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 8月28日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 29", "Jul 1", "Jul 3", "Jul 4", "Jul 5",
      "Jul 6", "Jul 7", "Jul 8", "Jul 10", "Jul 11",
      "Jul 13", "Jul 14", "Jul 15",
    ],
    returnTimes: [
      "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年4月30日查询，每人价格
    // 最低价：$1,306/人（Jul 8/13/14/15 → Aug 28，51–50–47–46天），2人共 $2,612
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 29: Aug24=$1,456✓(56d), Aug25=$1,456✓(57d), Aug26=$1,854✓(58d), Aug27=$1,456✓(59d), Aug28=null
      [1456, 1456, 1854, 1456, null],
      // Jul 1: Aug24=$1,456✓(54d), Aug25=$1,456✓(55d), Aug26=$1,799✓(56d), Aug27=$1,456✓(57d), Aug28=null
      [1456, 1456, 1799, 1456, null],
      // Jul 3: Aug24=$1,506✓(52d), Aug25=$1,506✓(53d), Aug26=$1,859✓(54d), Aug27=$1,506✓(55d), Aug28=$1,356✓(56d)
      [1506, 1506, 1859, 1506, 1356],
      // Jul 4: Aug24=$1,506✓(51d), Aug25=$1,506✓(52d), Aug26=$1,853✓(53d), Aug27=$1,506✓(54d), Aug28=$1,356✓(55d)
      [1506, 1506, 1853, 1506, 1356],
      // Jul 5: Aug24=$1,777✓(50d), Aug25=$1,777✓(51d), Aug26=$1,723✓(52d), Aug27=$1,777✓(53d), Aug28=$1,838✓(54d)
      [1777, 1777, 1723, 1777, 1838],
      // Jul 6: Aug24=$1,599✓(49d), Aug25=$1,599✓(50d), Aug26=$1,703✓(51d), Aug27=$1,599✓(52d), Aug28=$1,506✓(53d)
      [1599, 1599, 1703, 1599, 1506],
      // Jul 7: Aug24=$1,599✓(48d), Aug25=$1,599✓(49d), Aug26=$1,673✓(50d), Aug27=$1,599✓(51d), Aug28=$1,506✓(52d)
      [1599, 1599, 1673, 1599, 1506],
      // Jul 8: Aug24=$1,456✓(47d), Aug25=$1,456✓(48d), Aug26=$1,673✓(49d), Aug27=$1,456✓(50d), Aug28=$1,306✓(51d)
      [1456, 1456, 1673, 1456, 1306],
      // Jul 10: Aug24=$1,646✓(45d), Aug25=$1,646✓(46d), Aug26=$1,723✓(47d), Aug27=$1,646✓(48d), Aug28=$1,556✓(49d)
      [1646, 1646, 1723, 1646, 1556],
      // Jul 11: Aug24=$1,506✓(44d✗→skip), Aug25=$1,506✓(45d), Aug26=$1,723✓(46d), Aug27=$1,506✓(47d), Aug28=$1,356✓(48d)
      [null, 1506, 1723, 1506, 1356],
      // Jul 13: Aug24=null(42d✗), Aug25=$1,456✓(43d✗→skip), Aug26=$1,618✓(44d✗→skip), Aug27=$1,456✓(45d), Aug28=$1,306✓(46d)
      [null, null, null, 1456, 1306],
      // Jul 14: Aug24=null(41d✗), Aug25=null(42d✗), Aug26=$1,618✓(43d✗→skip), Aug27=$1,456✓(44d✗→skip), Aug28=$1,306✓(45d)
      [null, null, null, null, 1306],
      // Jul 15: Aug24=null(40d✗), Aug25=null(41d✗), Aug26=$1,673✓(42d✗→skip), Aug27=$1,456✓(43d✗→skip), Aug28=$1,306✓(44d✗→skip)
      [null, null, null, null, null],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年4月30日查询，每人价格。最低价 $1,306/人（Jul 8/13/14 → Aug 28，51–46天），2人共 $2,612。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（请查看 Google Flights 确认具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice: 2847,
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
      pricePerPerson: 1499,
      totalPrice: 2998,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1617,
      totalPrice: 3233,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1766,
      totalPrice: 3531,
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
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月8日（周三）",
      returnDate: "8月28日（周五）",
      pricePerPerson: 1306,
      totalPrice2Pax: 2612,
      daysInChina: 51,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA4agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjhqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1424,
      totalPrice2Pax: 2847,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月3日或4日",
      returnDate: "8月28日（周五）",
      pricePerPerson: 1356,
      totalPrice2Pax: 2712,
      daysInChina: 56,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAzagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjhqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "6月29日（周一）",
      returnDate: "8月24日或25日或27日",
      pricePerPerson: 1456,
      totalPrice2Pax: 2912,
      daysInChina: 56,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看 Google Flights 确认具体航班）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA2LTI5agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjRqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1617,
      totalPrice2Pax: 3233,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年4月29日 08:05 PST
const query_2026_04_29_0805: QueryResult = {
  id: "2026-04-29_08:05",
  queryDate: "2026-04-29",
  queryDateLabel: "2026年4月29日 08:05 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月23日",
    returnWindow: "2026年8月20日 – 8月27日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 26", "Jun 28", "Jun 29",
      "Jul 1", "Jul 2", "Jul 3",
    ],
    returnTimes: [
      "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年4月29日查询，每人价格
    // 最低价：$1,756/人（Jul 2 → Aug 27/29，56–58天），2人共 $3,512
    // ⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票
    prices: [
      // Jun 26: Aug22=null(57d✓→skip), Aug23=$1,777✓(58d), Aug24=$1,777✓(59d), Aug25=$1,777✓(60d), Aug26=$1,839✓(61d), Aug27=$1,777✓(62d), Aug28=null, Aug29=null
      [null, 1777, 1777, 1777, 1839, 1777, null, null],
      // Jun 28: Aug22=$1,777✓(55d), Aug23=$1,777✓(56d), Aug24=$1,777✓(57d), Aug25=$1,777✓(58d), Aug26=$1,839✓(59d), Aug27=$1,777✓(60d), Aug28=null, Aug29=null
      [1777, 1777, 1777, 1777, 1839, 1777, null, null],
      // Jun 29: Aug22=$1,777✓(54d), Aug23=$1,777✓(55d), Aug24=$1,777✓(56d), Aug25=$1,777✓(57d), Aug26=$1,809✓(58d), Aug27=$1,777✓(59d), Aug28=null, Aug29=null
      [1777, 1777, 1777, 1777, 1809, 1777, null, null],
      // Jul 1: Aug22=$1,801✓(52d), Aug23=$1,801✓(53d), Aug24=null, Aug25=null, Aug26=$1,799✓(56d), Aug27=null, Aug28=$1,839✓(58d), Aug29=null
      [1801, 1801, null, null, 1799, null, 1839, null],
      // Jul 2: Aug22=$1,839✓(51d), Aug23=$1,839✓(52d), Aug24=null, Aug25=null, Aug26=$1,809✓(55d), Aug27=$1,756✓(56d), Aug28=$1,839✓(57d), Aug29=$1,756✓(58d)
      [1839, 1839, null, null, 1809, 1756, 1839, 1756],
      // Jul 3: Aug22=$1,855✓(50d), Aug23=$1,855✓(51d), Aug24=$1,831✓(52d), Aug25=null, Aug26=$1,855✓(54d), Aug27=$1,855✓(55d), Aug28=$1,889✓(56d), Aug29=null
      [1855, 1855, 1831, null, 1855, 1855, 1889, null],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年4月29日查询，每人价格。最低价 $1,756/人（Jul 2 → Aug 27 或 Aug 29，56–58天），2人共 $3,512。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为多家航空联营票（可能经停，请查看具体航班详情）。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1427,
      totalPrice: 2853,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1247,
      totalPrice: 2494,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1620,
      totalPrice: 3240,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1693,
      totalPrice: 3385,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1756,
      totalPrice: 3512,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1828,
      totalPrice: 3655,
      daysInChina: 56,
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
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1427,
      totalPrice2Pax: 2853,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月16日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1247,
      totalPrice2Pax: 2494,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1620,
      totalPrice2Pax: 3240,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "多家航空公司",
      airlineCode: "--",
      departDate: "7月2日",
      returnDate: "8月27日或29日",
      pricePerPerson: 1756,
      totalPrice2Pax: 3512,
      daysInChina: 56,
      cabinNote: "经济舱，最低价为多家航空联营票（请查看具体航班详情）",
      warning: "⚠️ 达美航空不运营 SEA→PVG 直飞航线，请查看 Google Flights 确认具体航班",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTAyagcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjdqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1756,
      totalPrice2Pax: 3512,
      daysInChina: 63,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年4月28日 08:04 PST
const query_2026_04_28_0804: QueryResult = {
  id: "2026-04-28_08:04",
  queryDate: "2026-04-28",
  queryDateLabel: "2026年4月28日 08:04 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月1日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "全部航空公司（Google Flights 日期矩阵）",
    flightNumber: "多家航空",
    departureTimes: [
      "Jun 26", "Jun 28", "Jun 29",
      "Jul 6", "Jul 8", "Jul 10", "Jul 11", "Jul 12",
    ],
    returnTimes: [
      "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 日期矩阵（全部航空公司），2026年4月28日查询，每人价格
    // 最低价：$1,599/人（Jul 6 → Aug 25，50天），2人共 $3,198
    // 注意：达美航空不运营 SEA→PVG 航线，最低价为 Alaska/Condor/中国东方航空联营票（经停PDX、FRA）
    prices: [
      // Jun 26: Aug22=null(57d✓), Aug23=$1,777✓(58d), Aug24=$1,777✓(59d), Aug25=$1,777✓(60d), Aug26=$1,839✓(61d), Aug27=$1,777✓(62d)
      [null, 1777, 1777, 1777, 1839, 1777],
      // Jun 28: Aug22=$1,777✓(55d), Aug23=$1,777✓(56d), Aug24=$1,777✓(57d), Aug25=$1,777✓(58d), Aug26=$1,839✓(59d), Aug27=$1,777✓(60d)
      [1777, 1777, 1777, 1777, 1839, 1777],
      // Jun 29: Aug22=$1,777✓(54d), Aug23=$1,777✓(55d), Aug24=$1,777✓(56d), Aug25=$1,777✓(57d), Aug26=$1,809✓(58d), Aug27=$1,777✓(59d)
      [1777, 1777, 1777, 1777, 1809, 1777],
      // Jul 6: Aug22=null(47d✓), Aug23=null(48d✓), Aug24=null(49d✓), Aug25=$1,599✓(50d), Aug26=null, Aug27=null
      [null, null, null, 1599, null, null],
      // Jul 8: Aug22=null(45d✓), Aug23=null(46d✓), Aug24=null(47d✓), Aug25=null, Aug26=$1,680✓(49d), Aug27=null
      [null, null, null, null, 1680, null],
      // Jul 10: Aug22=null(43d✗), Aug23=$1,777✓(44d✗→skip), Aug24=$1,777✓(45d), Aug25=$1,777✓(46d), Aug26=null, Aug27=$1,777✓(48d)
      [null, null, 1777, 1777, null, 1777],
      // Jul 11: Aug22=null(42d✗), Aug23=null(43d✗), Aug24=null(44d✗), Aug25=$1,646✓(45d), Aug26=null, Aug27=null
      [null, null, null, 1646, null, null],
      // Jul 12: Aug22=null(41d✗), Aug23=null(42d✗), Aug24=$1,777✓(43d✗→skip), Aug25=null, Aug26=null, Aug27=$1,777✓(46d)
      [null, null, null, null, null, 1777],
    ],
    note: "价格来源：Google Flights 日期矩阵（全部航空公司），2026年4月28日查询，每人价格。最低价 $1,599/人（Jul 6 → Aug 25，50天），2人共 $3,198。⚠️ 注意：达美航空不运营 SEA→PVG 直飞航线，最低价为 Alaska/Condor/中国东方航空联营票（经停 PDX 和 FRA，约28–30小时）。如需直飞上海，请考虑其他选项。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1828,
      totalPrice: 3656,
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
      pricePerPerson: 1687,
      totalPrice: 3374,
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
      pricePerPerson: 1499,
      totalPrice: 2998,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-25",
      returnDateLabel: "8月25日（周二）",
      pricePerPerson: 1615,
      totalPrice: 3230,
      daysInChina: 47,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "07:25 CKG → 09:00 SEA（经停PEK）",
      flightDuration: "13h 50m / 16h 35m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-25",
      returnDateLabel: "8月25日（周二）",
      pricePerPerson: 1809,
      totalPrice: 3618,
      daysInChina: 54,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "07:25 CKG → 09:00 SEA（经停PEK）",
      flightDuration: "13h 50m / 16h 35m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1499,
      totalPrice2Pax: 2998,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月25日（周二）",
      pricePerPerson: 1615,
      totalPrice2Pax: 3230,
      daysInChina: 47,
      cabinNote: "经济舱直飞去程，回程经停北京（PEK），含2件托运行李",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-25/2adults?sort=price_a&fs=airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1687,
      totalPrice2Pax: 3374,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "Alaska/Condor/中国东方",
      airlineCode: "AS/DE/MU",
      departDate: "7月6日（周一）",
      returnDate: "8月25日（周二）",
      pricePerPerson: 1599,
      totalPrice2Pax: 3198,
      daysInChina: 50,
      cabinNote: "经济舱，经停PDX和FRA，约28–30小时",
      warning: "⚠️ 非直飞，经停2次；达美航空不运营此航线",
      bookingUrl: "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTA2agcIARIDU0VBcgcIARIDUFZHGh4SCjIwMjYtMDgtMjVqBwgBEgNQVkdyBwgBEgNTRUFAAUgBcAGCAQsI____________AZABAg&hl=en&curr=USD&gl=us",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月25日（周二）",
      pricePerPerson: 1809,
      totalPrice2Pax: 3618,
      daysInChina: 54,
      cabinNote: "经济舱直飞去程，回程经停北京（PEK），含2件托运行李",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-25/2adults?sort=price_a&fs=airlines=HU",
    },
  ],
};

// 历史查询：2026年4月26日 08:03 PST
const query_2026_04_26_0803: QueryResult = {
  id: "2026-04-26_08:03",
  queryDate: "2026-04-26",
  queryDateLabel: "2026年4月26日 08:03 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月17日 – 9月3日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [
      "Jun 23", "Jun 24",
      "Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10",
    ],
    returnTimes: [
      "Aug 18", "Aug 19", "Aug 20",
      "Aug 22", "Aug 23",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Delta.com 灵活日期矩阵（Grid1 Jun23中心）+ Google Flights 日期矩阵（Grid2 Jun27中心），2026年4月26日查询，每人价格
    // 最低价：$1,753/人（Jul 6 → Aug 20/22，45–47天），2人共 $3,506
    prices: [
      // Jun 23: Aug18=$1,989✓(56d), Aug19=$1,989✓(57d), Aug20=$1,989✓(58d), Aug22=$2,019✓(60d), Aug23=$2,019✓(61d)
      [1989, 1989, 1989, 2019, 2019],
      // Jun 24: Aug18=$1,989✓(55d), Aug19=$1,989✓(56d), Aug20=$1,989✓(57d), Aug22=$2,019✓(59d), Aug23=$2,019✓(60d)
      [1989, 1989, 1989, 2019, 2019],
      // Jul 6: Aug18=null(43d✗), Aug19=null(44d✗), Aug20=$1,753✓(45d), Aug22=$1,756✓(47d), Aug23=$1,800✓(48d)
      [null, null, 1753, 1756, 1800],
      // Jul 7: Aug18=null(42d✗), Aug19=null(43d✗), Aug20=$1,753✓(44d✗→skip), Aug22=$1,825✓(46d), Aug23=$1,825✓(47d)
      [null, null, null, 1825, 1825],
      // Jul 8: Aug18=null(41d✗), Aug19=null(42d✗), Aug20=null(43d✗), Aug22=$1,825✓(45d), Aug23=$1,825✓(46d)
      [null, null, null, 1825, 1825],
      // Jul 9: Aug18=null(40d✗), Aug19=null(41d✗), Aug20=null(42d✗), Aug22=$1,756✓(44d✗→skip), Aug23=$1,838✓(45d)
      [null, null, null, null, 1838],
      // Jul 10: Aug18=null(39d✗), Aug19=null(40d✗), Aug20=null(41d✗), Aug22=$1,776✓(43d✗→skip), Aug23=$1,776✓(44d✗→skip)
      [null, null, null, null, null],
    ],
    note: "价格来源：Delta.com 灵活日期矩阵（Jun23中心）+ Google Flights 日期矩阵（Jun27中心，2人合计÷2），2026年4月26日查询，每人价格。最低价 $1,753/人（Jul 6 → Aug 20，45天），2人共 $3,506。注意：Delta 价格为 Main Cabin 基础价，请在购票时确认舱位类型。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1495,
      totalPrice: 2989,
      daysInChina: 70,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "14h 25m / 11h 55m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice: 2459,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1100,
      totalPrice: 2199,
      daysInChina: 49,
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
      returnDate: "9月3日（周四）",
      pricePerPerson: 1100,
      totalPrice2Pax: 2199,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice2Pax: 2459,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月6日（周一）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1753,
      totalPrice2Pax: 3506,
      daysInChina: 45,
      cabinNote: "经济舱直飞（DL 129/128），请在购票时确认舱位含行李政策",
      bookingUrl: "https://www.delta.com",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1495,
      totalPrice2Pax: 2989,
      daysInChina: 70,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "6月23–24日（周二/三）",
      returnDate: "8月18–20日",
      pricePerPerson: 1989,
      totalPrice2Pax: 3978,
      daysInChina: 56,
      cabinNote: "经济舱直飞（DL 129/128），请在购票时确认舱位含行李政策",
      bookingUrl: "https://www.delta.com",
    },
  ],
};

// 历史查询：2026年4月25日 08:02 PST
const query_2026_04_25_0802: QueryResult = {
  id: "2026-04-25_08:02",
  queryDate: "2026-04-25",
  queryDateLabel: "2026年4月25日 08:02 PST",
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
      "Jun 23", "Jun 24", "Jun 25",
      "Jul 6", "Jul 7", "Jul 8", "Jul 9",
    ],
    returnTimes: [
      "Aug 18", "Aug 19", "Aug 20",
      "Aug 25", "Aug 26", "Aug 27",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Delta.com 灵活日期矩阵（直飞），2026年4月25日查询，每人价格
    // 最低价：$1,809/人（多个日期组合），2人共 $3,618
    prices: [
      // Jun 23: Aug18=$1,809✓(56d), Aug19=$1,809✓(57d), Aug20=$1,809✓(58d), Aug25=$1,839✓(63d), Aug26=$1,839✓(64d), Aug27=$1,839✓(65d)
      [1809, 1809, 1809, 1839, 1839, 1839],
      // Jun 24: Aug18=$1,809✓(55d), Aug19=$1,809✓(56d), Aug20=$1,809✓(57d), Aug25=$1,839✓(62d), Aug26=$1,839✓(63d), Aug27=$1,839✓(64d)
      [1809, 1809, 1809, 1839, 1839, 1839],
      // Jun 25: Aug18=$1,809✓(54d), Aug19=$1,809✓(55d), Aug20=$1,809✓(56d), Aug25=$1,839✓(61d), Aug26=$1,839✓(62d), Aug27=$1,839✓(63d)
      [1809, 1809, 1809, 1839, 1839, 1839],
      // Jul 6: Aug18=null(43d✗), Aug19=null(44d✗), Aug20=null(45d✓), Aug25=$1,809✓(50d), Aug26=$1,809✓(51d), Aug27=$1,809✓(52d)
      [null, null, 1839, 1809, 1809, 1809],
      // Jul 7: Aug18=null(42d✗), Aug19=null(43d✗), Aug20=null(44d✗), Aug25=$1,809✓(49d), Aug26=$1,809✓(50d), Aug27=$1,809✓(51d)
      [null, null, null, 1809, 1809, 1809],
      // Jul 8: Aug18=null(41d✗), Aug19=null(42d✗), Aug20=null(43d✗), Aug25=$1,809✓(48d), Aug26=$1,809✓(49d), Aug27=$1,809✓(50d)
      [null, null, null, 1809, 1809, 1809],
      // Jul 9: Aug18=null(40d✗), Aug19=null(41d✗), Aug20=null(42d✗), Aug25=$1,809✓(47d), Aug26=$1,809✓(48d), Aug27=$1,809✓(49d)
      [null, null, null, 1809, 1809, 1809],
    ],
    note: "价格来源：Delta.com 灵活日期矩阵（直飞 DL 129/128），2026年4月25日查询，每人价格。最低价 $1,809/人（多个日期组合），2人共 $3,618。注意：Delta 矩阵价格为 Main Cabin 基础价，请在购票时确认舱位类型。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1756,
      totalPrice: 3512,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3227,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1491,
      totalPrice: 2981,
      daysInChina: 70,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "14h 25m / 11h 55m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3370,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1543,
      totalPrice: 3085,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1353,
      totalPrice: 2705,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice: 2459,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1081,
      totalPrice: 2161,
      daysInChina: 49,
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
      returnDate: "9月3日（周四）",
      pricePerPerson: 1081,
      totalPrice2Pax: 2161,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚡ Kayak提示：未来10天内价格将上涨$20，建议尽快购票",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice2Pax: 2459,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "Kayak预测：未来50天内价格将下降$130",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1353,
      totalPrice2Pax: 2705,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1491,
      totalPrice2Pax: 2981,
      daysInChina: 70,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1543,
      totalPrice2Pax: 3085,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年4月24日 08:01 PST
const query_2026_04_24_0801: QueryResult = {
  id: "2026-04-24_08:01",
  queryDate: "2026-04-24",
  queryDateLabel: "2026年4月24日 08:01 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月20日 – 9月10日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [
      "Jun 23", "Jun 30",
      "Jul 7", "Jul 12", "Jul 14",
    ],
    returnTimes: [
      "Aug 23", "Aug 25", "Aug 28", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Kayak 直飞过滤（达美航空），2026年4月24日查询，每人价格
    // 最低价：$1,599/人（Jul 14 → Sep 1），2人共 $3,197（Delta Main Basic）
    prices: [
      // Jun 23: Aug23=$1,859, Aug25=null(63天✓但无数据), Aug28=null, Sep1=null
      [1859, null, null, null],
      // Jun 30: Aug23=null(54天✓但无数据), Aug25=$1,809, Aug28=null, Sep1=null
      [null, 1809, null, null],
      // Jul 7: Aug23=null(47天✓但无数据), Aug25=$1,809, Aug28=null, Sep1=null
      [null, 1809, null, null],
      // Jul 12: Aug23=null(42天✗), Aug25=null(44天✗), Aug28=$1,649, Sep1=$1,649
      [null, null, 1649, 1649],
      // Jul 14: Aug23=null(40天✗), Aug25=null(42天✗), Aug28=$1,859, Sep1=$1,599
      [null, null, 1859, 1599],
    ],
    note: "价格来源：Kayak 直飞过滤（达美航空 DL 129/128），2026年4月24日查询，每人价格。最低价 $1,599/人（Jul 14 → Sep 1），2人共 $3,197，Delta Main Basic 舱（不含托运行李）。Jul 12 → Aug 28（47天）为 $1,649/人（2人 $3,297）。注意：当前最低价均为 Basic Economy，不含托运行李。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1757,
      totalPrice: 3513,
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
      pricePerPerson: 1561,
      totalPrice: 3122,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1511,
      totalPrice: 3022,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice: 2412,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-23",
      departDateLabel: "7月23日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1106,
      totalPrice: 2212,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-30",
      departDateLabel: "7月30日（周四）",
      returnDate: "2026-09-10",
      returnDateLabel: "9月10日（周四）",
      pricePerPerson: 1119,
      totalPrice: 2238,
      daysInChina: 42,
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
      departDate: "7月23日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1106,
      totalPrice2Pax: 2212,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-23/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月30日（周四）",
      returnDate: "9月10日（周四）",
      pricePerPerson: 1119,
      totalPrice2Pax: 2238,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-30/2026-09-10/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月16日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice2Pax: 2412,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月14日",
      returnDate: "9月1日",
      pricePerPerson: 1599,
      totalPrice2Pax: 3197,
      daysInChina: 49,
      cabinNote: "Delta Main Basic（不含托运行李），经济舱直飞（DL 129/128）",
      warning: "⚠️ Basic Economy 不含托运行李，请在购票前确认舱位",
      bookingUrl: "https://www.delta.com",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月12日",
      returnDate: "8月28日 或 9月1日",
      pricePerPerson: 1649,
      totalPrice2Pax: 3297,
      daysInChina: 47,
      cabinNote: "Delta Main Basic（不含托运行李），经济舱直飞（DL 129/128）",
      warning: "⚠️ Basic Economy 不含托运行李，请在购票前确认舱位",
      bookingUrl: "https://www.delta.com",
    },
  ],
};

// 历史查询：2026年4月23日 08:42 PST
const query_2026_04_23_0842: QueryResult = {
  id: "2026-04-23_08:42",
  queryDate: "2026-04-23",
  queryDateLabel: "2026年4月23日 08:42 PST",
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
      "Jun 23", "Jun 30",
      "Jul 7", "Jul 12", "Jul 14",
    ],
    returnTimes: [
      "Aug 23", "Aug 25", "Aug 28", "Sep 1",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Kayak 直飞过滤（达美航空），2026年4月23日查询，每人价格
    // 最低价：$1,139/人（Jul 14 → Sep 1），2人共 $2,277（Delta Main Classic）
    prices: [
      // Jun 23: Aug23=$1,849, Aug25=null, Aug28=null, Sep1=null
      [1849, null, null, null],
      // Jun 30: Aug23=$1,849, Aug25=null, Aug28=null, Sep1=null
      [1849, null, null, null],
      // Jul 7: Aug23=null(47天✓), Aug25=$1,819, Aug28=null, Sep1=null
      [null, 1819, null, null],
      // Jul 12: Aug23=null(42天✗), Aug25=null(44天✗), Aug28=$1,409, Sep1=$1,139
      [null, null, 1409, 1139],
      // Jul 14: Aug23=null(40天✗), Aug25=null(42天✗), Aug28=$1,359, Sep1=$1,139
      [null, null, 1359, 1139],
    ],
    note: "价格来源：Kayak 直飞过滤（达美航空 DL 129/128），2026年4月23日查询，每人价格。最低价 $1,139/人（Jul 12或14 → Sep 1），2人共 $2,277，Delta Main Classic 舱含托运行李。Jul 14 → Aug 28（45天）为 $1,359/人（2人 $2,717）。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1756,
      totalPrice: 3512,
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
      pricePerPerson: 1685,
      totalPrice: 3370,
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
      pricePerPerson: 1495,
      totalPrice: 2989,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice: 2412,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-23",
      departDateLabel: "7月23日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1100,
      totalPrice: 2200,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-30",
      departDateLabel: "7月30日（周四）",
      returnDate: "2026-09-10",
      returnDateLabel: "9月10日（周四）",
      pricePerPerson: 1124,
      totalPrice: 2248,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月12日 或 7月14日",
      returnDate: "9月1日",
      pricePerPerson: 1139,
      totalPrice2Pax: 2277,
      daysInChina: 49,
      cabinNote: "Delta Main Classic 经济舱直飞（DL 129/128），含托运行李",
      bookingUrl: "https://www.delta.com",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月14日",
      returnDate: "8月28日",
      pricePerPerson: 1359,
      totalPrice2Pax: 2717,
      daysInChina: 45,
      cabinNote: "经济舱直飞（DL 129/128），请在达美官网确认舱位类型",
      warning: "⚠️ 在华仅45天，刚好满足最短停留要求",
      bookingUrl: "https://www.delta.com",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月23日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1100,
      totalPrice2Pax: 2200,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-23/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月16日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice2Pax: 2412,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice2Pax: 3370,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年4月22日 08:02 PST
const query_2026_04_22_0802: QueryResult = {
  id: "2026-04-22_08:02",
  queryDate: "2026-04-22",
  queryDateLabel: "2026年4月22日 08:02 PST",
  isLatest: false,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "2026年6月20日 – 7月15日",
    returnWindow: "2026年8月19日 – 9月3日",
    passengers: "1位成人 + 1位儿童（10岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [
      "Jun 22", "Jun 23", "Jun 24",
      "Jun 29", "Jun 30", "Jul 1",
      "Jul 2", "Jul 3", "Jul 4", "Jul 5",
    ],
    returnTimes: [
      "Aug 19", "Aug 20", "Aug 21", "Aug 22",
      "Aug 23", "Aug 24", "Aug 25",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 数据来源：Google Flights 灵活日期矩阵（2026年4月22日查询），每人价格（1人）
    // 最低价：$1,669/人（Jul 3 → Aug 20），2人共 $3,338
    prices: [
      // Jun 22: Aug19=null, Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=null
      [null, null, null, null, null, null, null],
      // Jun 23: Aug19=null, Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=null
      [null, null, null, null, null, null, null],
      // Jun 24: Aug19=null, Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=null
      [null, null, null, null, null, null, null],
      // Jun 29: Aug19=$1,883, Aug20=$1,753, Aug21=$1,931, Aug22=$1,845, Aug23=$1,816, Aug24=$1,777, Aug25=null
      [1883, 1753, 1931, 1845, 1816, 1777, null],
      // Jun 30: Aug19=$1,883, Aug20=$1,753, Aug21=$1,894, Aug22=$1,870, Aug23=$1,841, Aug24=$1,801, Aug25=null
      [1883, 1753, 1894, 1870, 1841, 1801, null],
      // Jul 1: Aug19=$1,959, Aug20=$1,909, Aug21=$1,894, Aug22=$1,845, Aug23=$1,816, Aug24=$1,777, Aug25=null
      [1959, 1909, 1894, 1845, 1816, 1777, null],
      // Jul 2: Aug19=$1,883, Aug20=$2,008, Aug21=$1,921, Aug22=$1,756, Aug23=$1,906, Aug24=$1,905, Aug25=$1,871
      [1883, 2008, 1921, 1756, 1906, 1905, 1871],
      // Jul 3: Aug19=null(41天✗), Aug20=$1,669, Aug21=$1,856, Aug22=$1,806, Aug23=$1,806, Aug24=$1,756, Aug25=null
      [null, 1669, 1856, 1806, 1806, 1756, null],
      // Jul 4: Aug19=null, Aug20=$1,800, Aug21=$1,921, Aug22=$1,806, Aug23=$1,921, Aug24=$1,884, Aug25=null
      [null, 1800, 1921, 1806, 1921, 1884, null],
      // Jul 5: Aug19=null, Aug20=$1,948, Aug21=$1,909, Aug22=$1,756, Aug23=$1,855, Aug24=$1,816, Aug25=null
      [null, 1948, 1909, 1756, 1855, 1816, null],
    ],
    note: "价格来源：Google Flights 灵活日期矩阵（2026年4月22日查询），经济舱直飞（DL 129/128），每人价格（1人）。最低价 $1,669/人（Jul 3 → Aug 20），2人共 $3,338。",
  },
  chongqingResults: [
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice: 2460,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "13h 50m / 11h 55m",
    },
    {
      departDate: "2026-07-16",
      departDateLabel: "7月16日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice: 2412,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1353,
      totalPrice: 2706,
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
      pricePerPerson: 1501,
      totalPrice: 3002,
      daysInChina: 42,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1543,
      totalPrice: 3086,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-09-03",
      returnDateLabel: "9月3日（周四）",
      pricePerPerson: 1495,
      totalPrice: 2989,
      daysInChina: 70,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:05 SEA",
      flightDuration: "14h 25m / 11h 55m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1614,
      totalPrice: 3227,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1685,
      totalPrice: 3369,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1803,
      totalPrice: 3605,
      daysInChina: 56,
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
      departDate: "7月9日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1230,
      totalPrice2Pax: 2460,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月16日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1206,
      totalPrice2Pax: 2412,
      daysInChina: 42,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      warning: "⚠️ 在华仅42天，未达45天建议最短停留",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-16/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1353,
      totalPrice2Pax: 2706,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "9月3日（周四）",
      pricePerPerson: 1495,
      totalPrice2Pax: 2989,
      daysInChina: 70,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-09-03/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "7月3日",
      returnDate: "8月20日",
      pricePerPerson: 1669,
      totalPrice2Pax: 3338,
      daysInChina: 48,
      cabinNote: "经济舱直飞（DL 129/128），请在达美官网确认舱位类型",
      warning: "⚠️ 可能为 Basic Economy（不含托运行李、不可改签），购票前请确认",
      bookingUrl: "https://www.delta.com",
    },
  ],
};

// 历史查询：2026年2月27日 08:02 PST
const query_2026_02_27_0802: QueryResult = {
  id: "2026-02-27_08:02",
  queryDate: "2026-02-27",
  queryDateLabel: "2026年2月27日 08:02 PST",
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
      "Jun 20", "Jun 21", "Jun 22", "Jun 23",
      "Jun 29", "Jun 30", "Jul 1", "Jul 2",
    ],
    returnTimes: [
      "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22",
      "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 达美灵活日期矩阵（My dates are flexible）查询结果
    // 矩阵1（中心 Jun 20 → Aug 20）：Jun 17-23 × Aug 17-23
    // 矩阵2（中心 Jul 1 → Aug 25）：Jun 28 - Jul 4 × Aug 22-28
    // 最低价：$1,739/人（Jun 29-Jul 2 → Aug 22-26）
    // Jun 20-23 → Aug 18-22：$1,774/人
    prices: [
      // Jun 20: Aug18=$1,774, Aug19=$1,774, Aug20=$1,774, Aug21=$1,774, Aug22=$1,774, null×5
      [1774, 1774, 1774, 1774, 1774, null, null, null, null, null],
      // Jun 21: Aug18=$1,774, Aug19=$1,774, Aug20=$1,774, Aug21=$1,774, Aug22=$1,774, null×5
      [1774, 1774, 1774, 1774, 1774, null, null, null, null, null],
      // Jun 22: Aug18=$1,774, Aug19=$1,774, Aug20=$1,774, Aug21=$1,774, Aug22=$1,774, null×5
      [1774, 1774, 1774, 1774, 1774, null, null, null, null, null],
      // Jun 23: Aug18=$1,774, Aug19=$1,774, Aug20=$1,774, Aug21=$1,774, Aug22=$1,774, null×5
      [1774, 1774, 1774, 1774, 1774, null, null, null, null, null],
      // Jun 29: null×5, Aug22=$1,739, Aug23=$1,739, Aug24=$1,739, Aug25=$1,739, Aug26=$1,739
      [null, null, null, null, null, 1739, 1739, 1739, 1739, 1739],
      // Jun 30: null×5, Aug22=$1,739, Aug23=$1,739, Aug24=$1,739, Aug25=$1,739, Aug26=$1,739
      [null, null, null, null, null, 1739, 1739, 1739, 1739, 1739],
      // Jul 1: null×5, Aug22=$1,739, Aug23=$1,739, Aug24=$1,739, Aug25=$1,739, Aug26=$1,739
      [null, null, null, null, null, 1739, 1739, 1739, 1739, 1739],
      // Jul 2: null×5, Aug22=$1,739, Aug23=$1,739, Aug24=$1,739, Aug25=$1,739, Aug26=$1,739
      [null, null, null, null, null, 1739, 1739, 1739, 1739, 1739],
    ],
    note: "价格来源：达美官网灵活日期矩阵（2026年2月27日查询），2人经济舱直飞（DL 129/128），每人价格。最低价 $1,739/人（2人共 $3,478）出现在 Jun 29-Jul 2 → Aug 22-26。Jun 20-23 出发价格为 $1,774/人。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1268,
      totalPrice: 2535,
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
      pricePerPerson: 1244,
      totalPrice: 2488,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice: 2488,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice: 2488,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1302,
      totalPrice: 2603,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    // 注：7月9日→8月20日（42天）不满足45天最短停留要求，已排除
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日 或 8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice2Pax: 2488,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice2Pax: 2488,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1268,
      totalPrice2Pax: 2535,
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
      departDate: "6月25日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1302,
      totalPrice2Pax: 2603,
      daysInChina: 63,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "6月29日 – 7月2日",
      returnDate: "8月22日 – 8月26日",
      pricePerPerson: 1739,
      totalPrice2Pax: 3478,
      daysInChina: 54,
      cabinNote: "经济舱直飞（DL 129/128），请在达美官网确认舱位类型",
      warning: "⚠️ 可能为 Basic Economy（不含托运行李、不可改签），购票前请确认",
      bookingUrl: "https://www.delta.com",
    },
  ],
};

// 历史查询：2026年2月26日 08:03 PST
const query_2026_02_26_0803: QueryResult = {
  id: "2026-02-26_08:03",
  queryDate: "2026-02-26",
  queryDateLabel: "2026年2月26日 08:03 PST",
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
      "Jun 20",
    ],
    returnTimes: [
      "Aug 20",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // Jun 20→Aug 20 = 61天 ✓
    // 本次仅通过 Kayak 查询了 Jun 20→Aug 20 组合（2人直飞最低价）
    prices: [
      // Jun 20: Aug20=$2,039（Kayak 最低价，Delta Main Basic，直飞 DL129/DL128）
      [2039],
    ],
    note: "价格来源：Kayak（2026年2月26日查询），2人经济舱直飞（达美 DL 129/128），每人价格。本次仅查询 Jun 20→Aug 20 组合，最低价 $2,039/人（2人共 $4,077），为 Delta Main Basic 舱（不含托运行李，不可改签）。较上次查询价格明显上涨。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1171,
      totalPrice: 2342,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1298,
      totalPrice: 2596,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1285,
      totalPrice: 2570,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice: 2488,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice: 2488,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    // 注：7月9日→8月20日（42天）不满足45天最短停留要求，已排除
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1171,
      totalPrice2Pax: 2342,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice2Pax: 2488,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1244,
      totalPrice2Pax: 2488,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1285,
      totalPrice2Pax: 2570,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 上海（PVG）",
      airline: "达美航空",
      airlineCode: "DL",
      departDate: "6月20日",
      returnDate: "8月20日",
      pricePerPerson: 2039,
      totalPrice2Pax: 4077,
      daysInChina: 61,
      cabinNote: "Delta Main Basic 直飞（DL 129/128），不含托运行李、不可改签",
      warning: "⚠️ Basic Economy：不含托运行李、不可改签，购票前请确认",
      bookingUrl: "https://www.kayak.com/flights/SEA-PVG/2026-06-20/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=DL",
    },
  ],
};

// 历史查询：2026年2月25日 12:05 PST
const query_2026_02_25_1205: QueryResult = {
  id: "2026-02-25_12:05",
  queryDate: "2026-02-25",
  queryDateLabel: "2026年2月25日 12:05 PST",
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
      "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25",
      "Jun 28", "Jun 29", "Jun 30", "Jul 1", "Jul 2",
      "Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9",
      "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14",
    ],
    returnTimes: [
      "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25",
      "Aug 26", "Aug 27", "Aug 29", "Aug 30",
    ],
    // prices[departIdx][returnIdx], null = 无数据/不满足45天间隔
    // 出发日期 → 返回日期间隔（需≥45天）：
    // Jun 21→Aug 20 = 60天 ✓ ... Jun 25→Aug 20 = 56天 ✓
    // Jun 28→Aug 20 = 53天 ✓ ... Jul 2→Aug 20 = 49天 ✓
    // Jul 5→Aug 20 = 46天 ✓ ... Jul 9→Aug 20 = 42天 ✗
    // Jul 10→Aug 20 = 41天 ✗ ... Jul 14→Aug 20 = 37天 ✗
    // Jul 5→Aug 21 = 47天 ✓ ... Jul 9→Aug 21 = 43天 ✗
    // Jul 10→Aug 21 = 42天 ✗ ... Jul 14→Aug 21 = 38天 ✗
    // Jul 5→Aug 22 = 48天 ✓ ... Jul 9→Aug 22 = 44天 ✗
    // Jul 10→Aug 22 = 43天 ✗ ... Jul 14→Aug 22 = 39天 ✗
    // Jul 5→Aug 23 = 49天 ✓ ... Jul 9→Aug 23 = 45天 ✓
    // Jul 10→Aug 23 = 44天 ✗ ... Jul 14→Aug 23 = 40天 ✗
    // Jul 5→Aug 24 = 50天 ✓ ... Jul 9→Aug 24 = 46天 ✓
    // Jul 10→Aug 24 = 45天 ✓ ... Jul 14→Aug 24 = 41天 ✗
    // Jul 5→Aug 25 = 51天 ✓ ... Jul 9→Aug 25 = 47天 ✓
    // Jul 10→Aug 25 = 46天 ✓ ... Jul 14→Aug 25 = 42天 ✗
    // Jul 5→Aug 26 = 52天 ✓ ... Jul 9→Aug 26 = 48天 ✓
    // Jul 10→Aug 26 = 47天 ✓ ... Jul 14→Aug 26 = 45天 ✓
    // Jul 5→Aug 27 = 53天 ✓ ... Jul 9→Aug 27 = 49天 ✓
    // Jul 10→Aug 27 = 48天 ✓ ... Jul 14→Aug 27 = 44天 ✗
    // Jul 5→Aug 29 = 55天 ✓ ... Jul 14→Aug 29 = 46天 ✓
    // Jul 5→Aug 30 = 56天 ✓ ... Jul 14→Aug 30 = 47天 ✓
    prices: [
      // Jun 21: Aug20=$1,789, Aug21=$1,989, Aug22=$1,839, Aug23=$1,874, Aug24=$1,839, Aug25=$1,789, Aug26=$1,789, Aug27=$1,789, Aug29=null, Aug30=null
      [1789, 1989, 1839, 1874, 1839, 1789, 1789, 1789, null, null],
      // Jun 22: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jun 23: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jun 24: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jun 25: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jun 28: Aug20=$1,839, Aug21=$1,989, Aug22=$1,839, Aug23=$1,874, Aug24=$1,839, Aug25=$1,789, Aug26=$1,789, Aug27=$1,789, Aug29=null, Aug30=null
      [1839, 1989, 1839, 1874, 1839, 1789, 1789, 1789, null, null],
      // Jun 29: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jun 30: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jul 1: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jul 2: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=null, Aug30=null
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, null, null],
      // Jul 5: Aug20=$1,789, Aug21=$1,989, Aug22=$1,839, Aug23=$1,874, Aug24=$1,839, Aug25=$1,789, Aug26=$1,789, Aug27=$1,789, Aug29=$1,789, Aug30=$1,789
      [1789, 1989, 1839, 1874, 1839, 1789, 1789, 1789, 1789, 1789],
      // Jul 6: Aug20=$1,739, Aug21=$1,939, Aug22=$1,789, Aug23=$1,824, Aug24=$1,789, Aug25=$1,739, Aug26=$1,739, Aug27=$1,739, Aug29=$1,739, Aug30=$1,739
      [1739, 1939, 1789, 1824, 1789, 1739, 1739, 1739, 1739, 1739],
      // Jul 7: Aug20=null(42天✗), Aug21=null, Aug22=null, Aug23=$1,724, Aug24=$1,689, Aug25=$1,639, Aug26=$1,639, Aug27=$1,639, Aug29=$1,639, Aug30=$1,639
      [null, null, null, 1724, 1689, 1639, 1639, 1639, 1639, 1639],
      // Jul 8: Aug20=null, Aug21=null, Aug22=null, Aug23=$1,724, Aug24=$1,689, Aug25=$1,639, Aug26=$1,639, Aug27=$1,639, Aug29=$1,639, Aug30=$1,639
      [null, null, null, 1724, 1689, 1639, 1639, 1639, 1639, 1639],
      // Jul 9: Aug20=null(42天✗), Aug21=null, Aug22=null, Aug23=$1,724, Aug24=$1,689, Aug25=$1,639, Aug26=$1,639, Aug27=$1,639, Aug29=$1,639, Aug30=$1,639
      [null, null, null, 1724, 1689, 1639, 1639, 1639, 1639, 1639],
      // Jul 10: Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=$1,689, Aug25=$1,689, Aug26=$1,689, Aug27=$1,689, Aug29=$1,693, Aug30=$1,693
      [null, null, null, null, 1689, 1689, 1689, 1689, 1693, 1693],
      // Jul 11: Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=$1,689, Aug25=$1,689, Aug26=$1,689, Aug27=$1,689, Aug29=$1,693, Aug30=$1,693
      [null, null, null, null, 1689, 1689, 1689, 1689, 1693, 1693],
      // Jul 12: Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=$1,689, Aug25=$1,689, Aug26=$1,689, Aug27=$1,689, Aug29=$1,693, Aug30=$1,693
      [null, null, null, null, 1689, 1689, 1689, 1689, 1693, 1693],
      // Jul 13: Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=$1,689, Aug26=$1,639, Aug27=$1,639, Aug29=$1,689, Aug30=$1,643
      [null, null, null, null, null, 1689, 1639, 1639, 1689, 1643],
      // Jul 14: Aug20=null, Aug21=null, Aug22=null, Aug23=null, Aug24=null, Aug25=$1,689, Aug26=$1,639, Aug27=$1,639, Aug29=$1,689, Aug30=$1,643
      [null, null, null, null, null, 1689, 1639, 1639, 1689, 1643],
    ],
    note: "价格来源：ITA Matrix（2026年2月25日查询），2人经济舱直飞（达美 DL 129/128），每人价格。最低价 $1,639/人（2人共 $3,278）出现在 Jul 7–9 → Aug 25–27 及 Jul 13–14 → Aug 26–27。",
  },
  chongqingResults: [
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1171,
      totalPrice: 2342,
      daysInChina: 56,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-06-25",
      departDateLabel: "6月25日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1266,
      totalPrice: 2532,
      daysInChina: 63,
      departTime: "11:05 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "14h 25m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-20",
      returnDateLabel: "8月20日（周四）",
      pricePerPerson: 1278,
      totalPrice: 2556,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-02",
      departDateLabel: "7月2日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1285,
      totalPrice: 2570,
      daysInChina: 56,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    {
      departDate: "2026-07-09",
      departDateLabel: "7月9日（周四）",
      returnDate: "2026-08-27",
      returnDateLabel: "8月27日（周四）",
      pricePerPerson: 1290,
      totalPrice: 2580,
      daysInChina: 49,
      departTime: "11:40 SEA → 次日 16:30 CKG",
      returnTime: "12:10 CKG → 09:40 SEA",
      flightDuration: "13h 50m / 12h 30m",
    },
    // 注：7月9日→8月20日（42天）不满足45天最短停留要求，已排除
  ],
  topRecommendations: [
    {
      rank: 1,
      medal: "🥇",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1171,
      totalPrice2Pax: 2342,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 2,
      medal: "🥈",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "6月25日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1266,
      totalPrice2Pax: 2532,
      daysInChina: 63,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-06-25/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 3,
      medal: "🥉",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月20日（周四）",
      pricePerPerson: 1278,
      totalPrice2Pax: 2556,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-20/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 4,
      medal: "4️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月2日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1285,
      totalPrice2Pax: 2570,
      daysInChina: 56,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-02/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
    {
      rank: 5,
      medal: "5️⃣",
      route: "SEA → 重庆（CKG）",
      airline: "海南航空",
      airlineCode: "HU",
      departDate: "7月9日（周四）",
      returnDate: "8月27日（周四）",
      pricePerPerson: 1290,
      totalPrice2Pax: 2580,
      daysInChina: 49,
      cabinNote: "经济舱直飞，含2件托运行李（每件23kg）",
      bookingUrl: "https://www.kayak.com/flights/SEA-CKG/2026-07-09/2026-08-27/2adults?sort=price_a&fs=stops=0;airlines=HU",
    },
  ],
};

// 历史查询：2026年2月23日 08:25 PST
const query_2026_02_23_0825: QueryResult = {
  id: "2026-02-23_08:25",
  queryDate: "2026-02-23",
  queryDateLabel: "2026年2月23日 08:25 PST",
  isLatest: false,
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
  query_2026_05_14_0805,
  query_2026_05_13_0805,
  query_2026_05_12_0806,
  query_2026_05_10_0803,
  query_2026_05_09_0806,
  query_2026_05_08_0910,
  query_2026_05_07_0801,
  query_2026_05_06_0805,
  query_2026_05_05_0805,
  query_2026_05_03_0801,
  query_2026_05_02_0802,
  query_2026_04_30_0802,
  query_2026_04_29_0805,
  query_2026_04_28_0804,
  query_2026_04_26_0803,
  query_2026_04_25_0802,
  query_2026_04_24_0801,
  query_2026_04_23_0842,
  query_2026_04_22_0802,
  query_2026_02_27_0802,
  query_2026_02_26_0803,
  query_2026_02_25_1205,
  query_2026_02_23_0825,
  query_2026_02_22_1301,
];

export const latestQueryResult = query_2026_05_14_0805;
