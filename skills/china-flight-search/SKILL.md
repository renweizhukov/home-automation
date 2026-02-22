---
name: query-china-flights
description: "查询从西雅图（SEA）直飞中国主要城市（上海PVG、重庆CKG）的暑假往返机票，并将搜索结果发布到 GitHub Pages 网站。当用户询问相关机票信息时，使用此 skill 来指导查询、比较和发布过程。"
---

# 查询西雅图直飞中国机票

## 概述

本 skill 用于系统地查询和比较从西雅图（SEA）直飞中国主要城市（上海PVG、重庆CKG）的暑假往返机票，重点关注达美航空和海南航空的直飞航班，并在查询完成后将结果发布到 GitHub Pages 展示网站。

## 查询工作流

### 1. 固定搜索参数（无需与用户确认）

本 skill 使用以下固定参数，**无需在每次执行前与用户确认**，直接进入搜索步骤：

| 参数 | 值 |
|------|----|
| **目的地城市** | 上海（PVG）和重庆（CKG）均需查询 |
| **出发时间范围** | 6月20日 – 7月15日 |
| **返回时间范围** | 8月20日 – 9月1日 |
| **乘客人数** | 1位成人 + 1位10岁儿童（共2人）|

> 若用户在调用时明确指定了不同参数，则以用户指定值为准；否则直接使用上述默认值开始搜索。

### 2. 查询达美航空（西雅图 → 上海）

达美航空每日均有直飞上海的航班（DL129），是首选查询目标。由于达美官网的灵活日期功能最准确，优先使用该功能。

**查询步骤：**
1.  访问达美航空官网的灵活日期搜索页面，设置好出发地（SEA）、目的地（PVG）、乘客人数，并勾选"My dates are flexible"。
2.  系统地搜索不同的中心日期组合，以覆盖完整的出行窗口。每次搜索后，使用 `browser_console_exec` 提取7x7价格矩阵的数据并保存。
    - **推荐中心日期组合**：
        - 出发 Jun 20 + 返回 Aug 20
        - 出发 Jun 27 + 返回 Aug 20
        - 出发 Jul 4 + 返回 Aug 25
        - 出发 Jul 11 + 返回 Aug 25
        - 出发 Jul 15 + 返回 Aug 28
3.  整合所有价格数据，找出最便宜的日期组合，并注意区分 Basic Economy 和 Main Cabin 的价格。

### 3. 查询海南航空（西雅图 → 重庆）

海南航空直飞重庆的航班每周只有周四运营，因此查询重点是找出指定日期范围内的周四航班价格。

**查询步骤：**
1.  使用 Kayak.com 进行查询，因为它能更方便地筛选特定航司和直飞航班。
2.  分别查询出发窗口内的每个周四（如6月25日、7月2日、7月9日）与返回窗口内的每个周四（如8月20日、8月27日）的组合价格。
3.  记录每个组合的价格，找出最便宜的选项。

### 4. 整理并呈现结果

综合达美航空和海南航空的查询结果，为用户提供最终推荐。

**报告内容应包括：**
- **最优推荐**：明确指出最便宜的日期组合、航空公司、航班号、价格。
- **价格总览表**：清晰展示不同日期组合的价格对比。
- **与另一航线的对比**：帮助用户权衡选择。
- **购票建议**：包括购票渠道、行李政策、儿童票等实用信息。

### 5. 发布结果到网站

查询完成后，将结果更新到 GitHub Pages 展示网站，使结果持久保存并可随时访问。

**网站信息：**
- 项目路径：`/home/ubuntu/sea-china-flights/`（本地开发）
- GitHub 仓库：`renweizhukov/home-automation`，子目录 `china-flight-search/`
- 已部署网址：`https://renweizhukov.github.io/home-automation/`
- 数据文件：`client/src/data/flightData.ts`（所有查询结果均存储于此）

**发布步骤：**

#### 5a. 更新数据文件

编辑 `/home/ubuntu/sea-china-flights/client/src/data/flightData.ts`：

1. **将旧的 `latestQuery` 的 `isLatest` 改为 `false`**，并将其加入 `allQueryResults` 数组（保留历史记录）。

2. **新增一个 `QueryResult` 对象**，填入本次查询结果，字段说明如下：

```typescript
const newQuery: QueryResult = {
  id: "YYYY-MM-DD HH:MM",        // 查询时间戳，格式 YYYY-MM-DD HH:MM（PST），同一天多次查询不会冲突
  queryDate: "YYYY-MM-DD",
  queryDateLabel: "YYYY年M月D日 HH:MM",  // 显示时间，如「2026年3月1日 08:00」
  isLatest: true,
  searchParams: {
    origin: "西雅图（SEA）",
    departWindow: "YYYY年M月D日 – M月D日",
    returnWindow: "YYYY年M月D日 – M月D日",
    passengers: "X位成人 + X位儿童（X岁）",
  },
  shanghaiResults: {
    airline: "达美航空",
    flightNumber: "DL 129 / DL 128",
    departureTimes: [...],       // 出发日期标签数组，如 "Jun 20"
    returnTimes: [...],          // 返回日期标签数组，如 "Aug 20"
    prices: [[...]],             // 二维数组，prices[出发索引][返回索引]，无数据填 null
    note: "...",                 // 可选注释，如 Basic Economy 警告
  },
  chongqingResults: [...],       // ChongqingResult[] 数组，每个周四组合一条记录
  topRecommendations: [...],     // Recommendation[] 数组，按2人总价升序排列，最多5条
};
```

3. **更新导出**：
```typescript
export const allQueryResults: QueryResult[] = [newQuery, ...previousQueries];
export const latestQueryResult = newQuery;
```

#### 5b. 同步到 GitHub 仓库并触发部署

```bash
# 1. 将更新后的数据文件复制到 home-automation 仓库
cp /home/ubuntu/sea-china-flights/client/src/data/flightData.ts \
   /home/ubuntu/home-automation/china-flight-search/client/src/data/flightData.ts

# 2. 提交并推送（会自动触发 GitHub Actions 重新部署）
cd /home/ubuntu/home-automation
git add china-flight-search/client/src/data/flightData.ts
git commit -m "data: update flight search results YYYY-MM-DD HH:MM PST"
git pull origin main --rebase   # 先拉取避免冲突
git push origin main
```

#### 5c. 等待部署完成并验证

```bash
# 监控 GitHub Actions 工作流状态
cd /home/ubuntu/home-automation
gh run list --workflow=deploy-china-flight-search.yml --limit=3

# 等待最新运行完成（约 30–60 秒）
RUN_ID=$(gh run list --workflow=deploy-china-flight-search.yml --limit=1 --json databaseId \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['databaseId'])")
gh run watch $RUN_ID
```

部署成功后，访问 `https://renweizhukov.github.io/home-automation/` 验证新数据是否正确显示。

#### 5d. 常见问题排查

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 推送被拒绝（rejected） | 远程有新提交 | `git pull origin main --rebase` 后再推送 |
| 网站显示旧数据 | GitHub Pages CDN 缓存 | 等待 1–2 分钟后强制刷新（Ctrl+Shift+R） |
| 网站空白页 | JS/CSS 资源路径错误 | 确认 `vite.config.ts` 中有 `base: process.env.VITE_BASE_PATH \|\| "/"` |
| 路由 404 | Wouter basename 未设置 | 确认 `App.tsx` 中 `<WouterRouter base={base}>` 已配置 |
