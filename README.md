# 领活派 · LingHuoPai

> 一个 AI 驱动的灵活用工双边撮合平台 · 网页端 V1
>
> 让每一次灵活就业都温厚有力。

---

## 这是什么

领活派是面向**零工 / 灵活用工劳动者**与**企业用人方**的双边撮合平台。第一版包含：

- **个人端**：劳动者完整接任务 + 二级发任务 + 集成式消息中心
- **企业端**：资质认证 + AI 主导发岗位 + 仅初筛后候选人管理 + 站内沟通
- **运营后台**：纯治理，只管不发

三区共享底层框架与组件，但路由、布局、视觉与权限**严格隔离**。

核心产品原则（按优先级）：

1. **AI 是助手，不是裁判**
2. **状态透明，不让人猜**
3. **劳动者优先**（个人端是产品的「主人公」）

---

## 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 路由 | React Router v6 |
| 客户端状态 | Zustand |
| 服务端状态 | TanStack Query v5 |
| 样式 | Tailwind CSS v3 |
| 图标 | Material Symbols Outlined |
| 字体 | Manrope（西文）+ PingFang / 思源黑体（中文） |

---

## 快速开始

```bash
# 1. 进入前端工程目录
cd web

# 2. 安装依赖
npm install

# 3. 启动开发服务
npm run dev
# → http://localhost:5173
```

### Mock 登录凭据

第一版没有接真实后端，使用 mock 登录：

| 区 | 凭据 |
| --- | --- |
| 个人端 / 企业端 | 11 位手机号 + 任意 6 位验证码 |
| 运营后台 | 账号 / 密码任意非空 |

> 进 `/login` 在顶部切换「个人端 / 企业端」；底部小字「平台管理后台入口」进入后台登录。

### 构建

```bash
npm run build      # tsc -b && vite build
npm run preview    # 预览生产构建
```

---

## 仓库布局

```text
.
├── 领活派V1前端规格说明.md          # 正式实施规格（最高权威）
├── PRODUCT.md                        # 战略层：用户、人格、原则、anti-references
├── DESIGN.md                         # 视觉层：Token、配色策略、命名规则
├── AGENTS.md                         # 给后续协作者 / AI agent 的工作手册
├── 领活派-网页端V1-PRD正式版.md      # PRD 原本
├── stitch_document_insight_engine/   # 16 张 stitch 设计稿（HTML + screen.png）
├── web/                              # 前端工程（唯一代码所在）
│   ├── package.json
│   ├── tailwind.config.ts            # Token 严格对齐 DESIGN.md
│   └── src/
│       ├── main.tsx                  # 入口
│       ├── App.tsx                   # 路由编排
│       ├── app/layouts/              # UserLayout / EnterpriseLayout / AdminLayout
│       ├── shared/
│       │   ├── auth/                 # store + RealmGuard（三区严格分跳）
│       │   ├── ui/                   # Button / Badge / Card / Field / Icon
│       │   ├── mock/data.ts          # 唯一数据源（接真实 API 时只改这）
│       │   └── utils/cn.ts
│       ├── features/user-message-center/
│       └── pages/
│           ├── login/                # 2 张
│           ├── user/                 # 8 张
│           ├── enterprise/           # 5 张
│           └── admin/                # 5 张
└── .claude/                          # Claude Code 配置（不要动）
```

---

## 路由地图

### 公共

- `/login` — 登录页（个人端 + 企业端 + 后台入口）
- `/admin/login` — 后台单独登录入口
- `/403` `/404`

### 个人端 `/u/*`

| 路径 | 页面 |
| --- | --- |
| `/u/home` | 工作台（接任务为主） |
| `/u/tasks` | 任务大厅（个人 + 企业混展） |
| `/u/tasks/:taskId` | 任务详情 |
| `/u/profile` | 简历与能力画像（合并页） |
| `/u/applications` | 我的报名 / 我的任务 |
| `/u/posted-tasks` | 我发布的任务 |
| `/u/assistant` | 个人 AI 助手 |
| `/u/screening/:sessionId` | 任务级 AI 面试 |
| `/u/me` | 我的页 |
| `/u/me/agreements` | 我的协议（占位说明页） |

### 企业端 `/b/*`

| 路径 | 页面 |
| --- | --- |
| `/b/home` | 企业工作台 |
| `/b/qualification` | 资质认证 |
| `/b/jobs` | 岗位列表 |
| `/b/jobs/new` | 发布岗位（AI 主导） |
| `/b/candidates` | 候选人管理（仅初筛后） |
| `/b/me` | 企业信息 |

### 运营后台 `/admin/*`

| 路径 | 页面 |
| --- | --- |
| `/admin/dashboard` | 三类指标看板 |
| `/admin/users` | 个人用户管理 |
| `/admin/enterprises` | 企业用户管理 |
| `/admin/tasks` | 任务管理（不发布） |
| `/admin/config` | 基础配置 |

---

## 设计系统

完整 token 见 [`DESIGN.md`](./DESIGN.md)。要点：

- **Creative North Star**：暖光下的工作站
- **配色策略**：Restrained — 温厚中性 + 一支暖橙重点色（≤5% 占面积）
- **品牌色**：领活橙 `#EA5614` + 雾灰青 `#4A616F`
- **中性色**：暖白到深炭 6 级 OKLCH 阶梯，全部向品牌橙色相微偏
- **字体**：单无衬线 Manrope + 中文回退；层级比 ≥ 1.25
- **阴影**：默认平面，阴影只作为状态回声
- **动效**：主链路 Restrained（指数缓动）；A2A 撮合场景 Choreographed

---

## 核心规格速查

需要规格细节时直接读 [`领活派V1前端规格说明.md`](./领活派V1前端规格说明.md)。下面是几条最容易踩坑的硬约束：

- **严格双账号体系**：同一手机号在个人端 / 企业端是**两个独立账号**
- **三区严格分跳**：跨区漂移会被路由守卫送回各自首页，切换身份必须先退出登录
- **企业资质锁**：未认证企业账号可登录、可看导航，但岗位发布 / 候选人 / 报告 / 沟通**表面可见但锁定**
- **消息中心**：**仅个人端右上角**集成式面板；企业端、后台**没有**消息中心、**没有**顶部提醒入口
- **任务级 AI 面试**：报名后**自动创建会话**；前端**不展示**题数上限和剩余题数；可中断按题恢复
- **AI 报告**：**仅企业端可见**；候选人本人在个人端只看进度与画像更新提示
- **个人发任务**：复用 AI JD 流程，**不做候选人管理**，推进只能通过站内沟通
- **占位模块**：除「我的协议」跳占位说明页外，全部**仅展示不可点**
- **第一版不做**：批量发布岗位、批量验收、实时 IM、协议签约、浏览器直连模型

---

## 文档导航

| 文件 | 用途 | 看的人 |
| --- | --- | --- |
| [`领活派V1前端规格说明.md`](./领活派V1前端规格说明.md) | 正式实施规格 | 产品、设计、前端、后端、测试 |
| [`PRODUCT.md`](./PRODUCT.md) | 战略层（用户、人格、原则） | 全员 |
| [`DESIGN.md`](./DESIGN.md) | 视觉层（Token、命名规则） | 设计、前端 |
| [`AGENTS.md`](./AGENTS.md) | 协作者 / AI agent 工作手册 | 任何想改代码的人 |
| [`领活派-网页端V1-PRD正式版.md`](./领活派-网页端V1-PRD正式版.md) | PRD 原本 | 背景参考 |
| [`web/README.md`](./web/README.md) | 工程级 README | 前端 |

---

## 路线图

### V1（当前）

- ✅ 三区单应用 + 严格分跳
- ✅ 16 张 stitch 设计稿翻译为 React 页面
- ✅ Mock 登录、Mock 数据贯通
- ✅ Mobile / Pad / PC 重排适配

### V2（接入真实后端）

- 替换 `shared/auth/store.ts` 为真实手机号 + 验证码 API
- 新建 `shared/api/client.ts`（鉴权、错误处理、上传、流式）
- Mock 数据替换为 TanStack Query 查询
- AI 接口走后端 SSE / 流式

### V3（远期）

- 协议签约 / 主系统对接
- 占位能力逐步实装（信用评分、AI 技能培训、积分商城等）
- 批量能力（如业务确需）

---

## License

仅供项目内部使用。
