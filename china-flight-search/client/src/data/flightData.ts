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

// 最新查询：2026年4月26日 08:03 PST
const query_2026_04_26_0803: QueryResult = {
  id: "2026-04-26_08:03",
  queryDate: "2026-04-26",
  queryDateLabel: "2026年4月26日 08:03 PST",
  isLatest: true,
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

export const latestQueryResult = query_2026_04_26_0803;
