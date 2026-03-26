# Fruit Warehouse MVP

基于 Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL 的水果仓管后台 MVP，已包含真实 Prisma 数据模型、登录 API、库存 API 和基础后台页面。

## 已实现

- App Router 后台页面与登录页
- Prisma 数据模型：`User`、`FruitItem`、`StockMovement`、`LossRecord`
- 登录接口与基础会话 Cookie
- 库存查询、入库、出库、报损、仪表盘、报表汇总 API
- 入库增加库存、出库减少库存、报损减少库存
- 临期查询和低库存状态标记

## API 列表

- `POST /api/login`
- `GET /api/inventory`
- `POST /api/inbound`
- `POST /api/outbound`
- `POST /api/loss`
- `GET /api/dashboard`
- `GET /api/reports/summary`

## 本地启动

1. 安装并启动 PostgreSQL，创建数据库 `fruit_system`。
2. 复制环境变量模板：

```bash
copy .env.example .env
```

3. 按实际环境修改 `.env` 中的 `DATABASE_URL` 和 `AUTH_SECRET`。
4. 安装依赖：

```bash
npm.cmd install
```

5. 生成 Prisma Client：

```bash
npm.cmd run prisma:generate
```

6. 执行数据库迁移：

```bash
npm.cmd run prisma:migrate -- --name init
```

7. 写入默认管理员和演示库存：

```bash
npm.cmd run prisma:seed
```

8. 启动开发环境：

```bash
npm.cmd run dev
```

默认种子账号：`admin / admin123456`

## 查询说明

- `GET /api/inventory?search=苹果`
- `GET /api/inventory?lowStock=true`
- `GET /api/inventory?expiringWithinDays=7`
- `GET /api/reports/summary?periodDays=30`

## 说明

- 当前后台页面仍以 mock 展示为主，真实后端能力已经通过 API 提供。
- 如果本机 PostgreSQL 未启动，`prisma migrate` 和登录/API 数据读写会失败，需要先完成数据库配置。