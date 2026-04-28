# AGENTS.md

> 给后续在本仓库工作的 AI agent（Claude Code、Cursor、Codex 等）和人类协作者看的工作手册。
> 写给一个**今天才进入这个仓库**的合作者：你不需要重新询问产品方向，只需要遵循这份文件。

---

## 1. 这个项目是什么

**领活派（LingHuoPai）** — 一个 AI 驱动的灵活用工双边撮合平台。

第一版的真实形态：

> **一个 React 单应用，登录页同时承载「个人端 / 企业端 / 后台入口」三入口；个人端做完整接任务 + 二级发任务 + 集成式消息中心，企业端做资质认证 + AI 主导发岗位 + 仅初筛后候选人管理 + 站内沟通，运营后台做纯治理。三区使用严格双账号体系、严格分跳，不互通。**

只关心三件事就能开始：

1. AI 是助手，不是裁判
2. 状态透明，不让人猜
3. 劳动者优先（个人端是产品的「主人公」）

---

## 2. 必读文件（按优先级）

进入仓库后**按这个顺序读**，跳过任何一份都会出问题：

| 顺序 | 文件 | 角色 |
| --- | --- | --- |
| 1 | `领活派V1前端规格说明.md` | **正式实施规格，最高权威**。功能范围、状态机、UI/UX 总原则、设备适配。 |
| 2 | `PRODUCT.md` | 战略层：register、用户、品牌人格、anti-references、5 条设计原则。 |
| 3 | `DESIGN.md` | 视觉层：Token、配色策略、字体、命名规则（5% 暖光 / Tinted Neutral / Flat-By-Default …）。 |
| 4 | `领活派-网页端V1-PRD正式版.md` | PRD 原本，作为背景。 |
| 5 | `stitch_document_insight_engine/` | 16 张 stitch 设计稿（HTML + screen.png）。**实施时的视觉对照基准。** |
| 6 | `web/README.md` | 工程级 README：路由、安装、Mock 登录方式。 |

不要再读：`StellaWork_PRD_正式版.md`、`zazzy-crunching-wolf_1/2.md`、`current-page.png` / `demands-page.png` / `candidate-detail.png` / `personal-page.png` / `backstage-page.png` / `job-detail.png` / `login-page-text.json`。它们是过程产物，已被上面的正式规格替代。

---

## 3. 仓库布局速览

```text
.
├── 领活派V1前端规格说明.md       # 正式 spec（最高权威）
├── PRODUCT.md                    # 战略层
├── DESIGN.md                     # 视觉层（Stitch 兼容）
├── 领活派-网页端V1-PRD正式版.md  # PRD 原本
├── stitch_document_insight_engine/
│   ├── 个人端_1_统一登录页/
│   │   ├── code.html
│   │   └── screen.png
│   ├── 个人端_2_个人端首页/
│   ├── ... 其他 14 张稿
│   └── design_system/DESIGN.md   # stitch 自带的 token 来源
├── web/                          # 唯一的前端工程
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts        # token 严格对齐 DESIGN.md frontmatter
│   ├── index.html
│   └── src/
│       ├── main.tsx              # 入口（QueryClient + Router）
│       ├── App.tsx               # 路由编排
│       ├── styles/globals.css
│       ├── app/
│       │   └── layouts/          # UserLayout / EnterpriseLayout / AdminLayout / ErrorPage
│       ├── shared/
│       │   ├── auth/             # store + RealmGuard（三区严格分跳的核心）
│       │   ├── ui/               # Button / Badge / Card / Field / Icon / RadarPolygon / RingGauge
│       │   ├── mock/data.ts      # 唯一的数据源（接真实 API 时只改这一处）
│       │   └── utils/cn.ts
│       ├── features/
│       │   └── user-message-center/MessageCenter.tsx  # 仅个人端
│       └── pages/
│           ├── login/            # LoginPage（三入口同页：个人 / 企业 / 后台）
│           ├── user/             # 8 张
│           ├── enterprise/       # 5 张
│           └── admin/            # 5 张（含 Enterprises、Config）
└── .claude/                      # 本仓库的 Claude Code 配置（不要动）
```

**所有真实代码都在 `web/`。** 仓库根的 png / md 是产品文档与设计稿，不参与构建。

---

## 4. 技术栈与命令

| 项 | 选择 | 备注 |
| --- | --- | --- |
| 框架 | React 18 + TypeScript | 严格模式 |
| 构建 | Vite | 端口 5173 |
| 路由 | React Router v6 | `BrowserRouter` |
| 客户端状态 | Zustand | 仅 auth；其他用 useState |
| 服务端状态 | TanStack Query v5 | 已挂 Provider，可直接 `useQuery` |
| 样式 | Tailwind CSS v3 | `tailwind.config.ts` 是唯一 token 出处 |
| 图标 | Material Symbols Outlined（Google Fonts） | 通过 `<Icon name="..." />` 使用 |
| 字体 | Manrope + 中文回退（PingFang/思源） | 不要替换 |

```bash
cd web
npm install
npm run dev      # 启 dev server，默认 http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # 预览构建产物
```

**Mock 登录凭据**：
- 个人端 / 企业端：手机号 11 位 + 任意 6 位验证码
- 后台：账号 / 密码任意非空

---

## 5. 三区分跳：你必须理解的核心

整个应用最不能搞错的一件事：

```text
个人端  /u/*    ←→  RealmGuard realm="user"
企业端  /b/*    ←→  RealmGuard realm="enterprise"
运营后台 /admin/*  ←→  RealmGuard realm="admin"
```

`src/shared/auth/RealmGuard.tsx` 是把守入口的唯一组件。规则：

- 未登录 → `/login`
- 登录身份与请求区不符 → 各自首页（不允许串区）
- 切换身份的唯一方式：退出登录 → 回登录页选另一入口

**严格双账号体系**：同一手机号在个人端 / 企业端是两个独立账号。不要写「同账号双身份」的代码路径。

**登录页规则**（spec 第 5 节）：登录页**唯一入口** = `/login`。它在同一页面承载三入口：
- 顶部 Tab 切换「个人端 / 企业端」
- 底部小字「平台管理后台入口」点击后切到后台账密表单（**同页**，不再有独立 `/admin/login`）

**不要重新引入** 独立后台登录页或路由。后台登录就是 LoginPage 的一种 mode。

**企业资质锁**：企业端未认证账号仍可登录、看到导航，但岗位发布、候选人列表、AI 报告、站内沟通**表面可见但锁定**（`disabled` 或拦截 + 引导到 `/b/qualification`）。锁的来源是 `session.qualified` 字段。

---

## 6. 实施前必查的硬约束

**做任何 PR / 改动前，先用这一节自检。**

### 一定要遵守

- ✅ Token **只**从 `tailwind.config.ts`（即 DESIGN.md frontmatter）取；不要硬编码 `#ffffff`、`#000`、自调色。
- ✅ 中性色全部走 `bone-cream` / `bone-cream-dim` / `ash-veil` / `warm-ash` / `graphite` / `deep-char`，禁止 `#000` / `#fff`。
- ✅ 主行动用 `Button variant="primary"`（领活橙），**一屏只有一个**主按钮，重点色 ≤5%。
- ✅ 所有动效缓动用 `ease-out-quart` 或同类指数缓动（已加入 Tailwind 配置）；禁止 bounce / elastic。
- ✅ 图标统一用 `<Icon name="..." />`，不要直接写 `material-symbols-outlined`。
- ✅ 个人端右上角消息中心 = `MessageCenter` 组件，**只在 UserLayout 里**。
- ✅ Body 文本容器宽度 ≤ 75ch（用 `max-w-body`）。
- ✅ 三设备重排：Mobile（底 Tab）/ Pad（折叠侧栏 / 列表-详情）/ PC（侧栏 + 多列）。
- ✅ 中文标点优先：用逗号、分号、冒号、句号或括号。
- ✅ 数据可视化优先复用 `RadarPolygon`（雷达，5 维能力画像）和 `RingGauge`（圆环 conic-gradient，gauge 类指标）；不要引第三方图表库。
- ✅ 个人 AI 助手页 (`/u/assistant`)：单列居中（`max-w-body`）聊天 + 底部浮动输入条；AI 回复嵌入任务时用 `md:grid-cols-2` Bento mini 卡（数据源 `taskHall.matchScore`），followUps 胶囊放气泡外；移动端浮动条用 `bottom-[calc(64px+env(safe-area-inset-bottom))]` 让出底部 Tab。**不要**改回左右分栏 + aside 提示卡。
- ✅ 看板 / 工作台的 KPI / stat 卡片若有对应列表页，**必须可点击跳转**（`hoverable cursor-pointer onClick={() => navigate(...)}`），不要做成哑卡。已应用：`/b/home`（候选人 / 岗位 / AI 三卡）与 `/admin/dashboard`（4 格全可点击）。
- ✅ 企业资质锁的实现模式：未认证账号进入受限页（`/b/jobs`、`/b/candidates`）时整页渲染拦截卡（warm Card + 锁图标 + 「前往认证」secondary 按钮），不要让用户看到空列表后再去猜要做什么。`session.qualified` 为唯一来源。

### 一定不要做

- ❌ 不要在企业端、运营后台加消息中心 / 顶部提醒角标。
- ❌ 不要在用户面前展示 AI 面试题数上限 / 剩余题数（spec 第 10.3 条）。
- ❌ 不要让候选人看到 AI 报告原文（个人端只能看进度 + 画像更新提示）。
- ❌ 不要在个人发任务的发任务人侧暴露候选人列表 / AI 报告（spec 第 14.3 条）。
- ❌ 不要把任意「占位模块」做成可点击或弹「即将开放」弹层；它们应当原地静态展示（除「我的协议」跳占位说明页）。
- ❌ 不要使用 em dash（——）或 `--` 分隔；不要用 `background-clip: text` 渐变文字；不要给静态卡片加默认投影；不要把 glassmorphism 当默认。
- ❌ 不要写 `border-left/right > 1px` 的彩色侧条做强调。
- ❌ 不要在浏览器侧调用大模型 API（spec：浏览器不直连模型）。所有 AI 流式输出走后端代理。
- ❌ 不要做批量发布岗位、批量验收任务。第一版明确不做。
- ❌ 不要做实时 IM。第一版站内沟通是异步线程，按 `候选人 × 任务` 绑定。
- ❌ 不要做候选状态机的「邀约 / 暂不推进 / 负面反馈」之外的子状态。
- ❌ **不要重新引入独立的后台登录路由**（如 `/admin/login`）。后台从 `/login` 底部入口同页切换进入。

---

## 7. 状态机（写代码时直接复制）

### 任务状态（个人任务与企业岗位共用）

```ts
type TaskStatus = "PUBLISHED" | "IN_PROGRESS" | "CLOSED";
```

**第一版没有 DRAFT，没有人工审核中间态。**

### 候选人状态（仅企业端候选人列表，且必经 AI 初筛）

```ts
type CandidateStage = "REPORT_GENERATED" | "IN_PROCESS" | "FINISHED";
type CandidateSubStage = "邀约沟通" | "负面反馈" | "暂不推进";  // IN_PROCESS 才有
```

候选人列表**只**展示这三段，不展示「面试中」的候选人。

### 个人侧报名进度（仅给劳动者看）

```text
已报名 → AI 面试进行中 → AI 面试已完成 → 等待企业处理 → 已被企业邀约 / 已结束
```

不展示「报告内容」「企业内部判断」。

### 任务级 AI 面试

- 报名后**自动创建会话**（不要做「开始面试」二级动作）
- 5 轮以内完成；前端**不展示**题数上限和剩余题数
- 中断恢复粒度到「按题恢复」
- 多任务并发；同一任务同一时刻只保留一个有效会话

---

## 8. UI/UX 落地清单（节选）

### 颜色策略 = Restrained
- 领活橙 `#EA5614` 在任意一屏占面积 **≤ 5%**
- 雾灰青 `#4A616F` 永远比领活橙低一级
- 中性色微微向品牌橙色相偏（chroma 0.005~0.012）

### 字体层级（≥ 1.25 倍率）
- Display：`clamp(2rem, 5vw, 3rem)`，仅登录主标题、空状态、A2A 大屏
- Headline：24px，页面级主标题
- Title：18px，分区标题、卡片标题
- Body：15px，正文
- Label：12px，徽章 / 字段标签

### 阴影
- 默认平面，**不**给静态卡片加投影
- `ambient-rest` / `ambient-hover` / `floating-overlay`，仅作状态回声

### A2A 双向撮合动画
- 第一版**会做**，但本仓库**不在此阶段定义其视觉细节**
- 实现时只在「撮合页」「大屏模式」出现；不挤占主链路注意力
- 全部用 CSS / Lottie，不阻塞主线程；提供预录降级方案

---

## 9. 路由与页面清单

| 路径 | 文件 | 说明 |
| --- | --- | --- |
| `/login` | `pages/login/LoginPage.tsx` | 三入口（个人 / 企业 + 底部小字「平台管理后台入口」同页切换） |
| `/u/home` | `pages/user/HomePage.tsx` | 个人首页 |
| `/u/tasks` | `pages/user/TaskHallPage.tsx` | 任务大厅（个人 + 企业混展，含本周热门 banner 卡） |
| `/u/tasks/:taskId` | `pages/user/TaskDetailPage.tsx` | 任务详情（含 AI 核心摘要 + verified 徽章） |
| `/u/profile` | `pages/user/ResumePortraitPage.tsx` | 简历 + 画像合并页（含 SVG 雷达 + 技能 chip + AI 优化建议） |
| `/u/applications` | `pages/user/ApplicationsPage.tsx` | 我的报名（sticky Tab + 3 格 stat + 邀约卡） |
| `/u/posted-tasks` | `pages/user/PostedTasksPage.tsx` | 我发布的任务（个人发） |
| `/u/assistant` | `pages/user/AssistantPage.tsx` | 个人 AI 助手（`max-w-body` 单列聊天 + 浮动输入条；AI 回复可嵌入 Bento 任务 mini 卡 + 胶囊 followUps；首屏带渐进式上传引导卡，进入对话即让位） |
| `/u/screening/:sessionId` | `pages/user/ScreeningPage.tsx` | 任务级 AI 面试（Enter 送出 / Shift+Enter 换行） |
| `/u/me` | `pages/user/MePage.tsx` | 我的页 |
| `/u/me/agreements` | `pages/user/AgreementsPage.tsx` | 我的协议（占位说明页） |
| `/b/home` | `pages/enterprise/HomePage.tsx` | 企业工作台（AI 数据看板用 RingGauge；KPI 卡可点击跳到候选人 / 岗位列表） |
| `/b/qualification` | `pages/enterprise/QualificationPage.tsx` | 资质认证（顶部 3 步 step tracker：圆点在上 / label 在下 / 中间贯穿连线） |
| `/b/jobs` | `pages/enterprise/JobsPage.tsx` | 岗位列表（未认证整页拦截卡 + 引导到 `/b/qualification`） |
| `/b/jobs/new` | `pages/enterprise/JobPublishPage.tsx` | AI 主导发布岗位（左：快捷模板 chip + AI 润色 + 字段；右：AI 优化建议 aside —— 信息完善 / 关键词识别 / 市场参考） |
| `/b/candidates` | `pages/enterprise/CandidatesPage.tsx` | 候选人管理（仅初筛后，右上角 score badge；未认证企业整页拦截卡，引导到 `/b/qualification`） |
| `/b/me` | `pages/enterprise/EnterpriseInfoPage.tsx` | 企业信息（Logo + 资质文件 + 企业智能洞察） |
| `/admin/dashboard` | `pages/admin/DashboardPage.tsx` | 运营看板（4 KPI 卡可点击跳到对应列表页） |
| `/admin/users` | `pages/admin/UsersPage.tsx` | 个人用户管理 |
| `/admin/enterprises` | `pages/admin/EnterprisesPage.tsx` | 企业用户管理 |
| `/admin/tasks` | `pages/admin/TasksPage.tsx` | 任务管理（4 格 stat 顶栏；不发布） |
| `/admin/config` | `pages/admin/ConfigPage.tsx` | 基础配置 |

---

## 10. 数据层

第一版所有页面消费 `src/shared/mock/data.ts` 的静态数据。

接入真实 API 时按这个顺序改：

1. `shared/auth/store.ts` 的 `loginAs*` 方法 → 调真实手机号 + 验证码 / 后台账密接口
2. 新建 `shared/api/client.ts`（统一封装鉴权头、错误处理、上传、流式）
3. 把 mock 数组替换为 `useQuery`；mock 的 type 直接复用即可
4. AI 相关接口（JD 润色、面试问答流、画像生成、报告）走 SSE / 流式接口

---

## 11. 工作流约定

### 写新功能

1. **先读 spec**：找到 `领活派V1前端规格说明.md` 里对应章节，再写代码
2. 视觉对照 `stitch_document_insight_engine/<page>/screen.png`
3. 不存在的能力，宁可做占位也不要乱补；占位走「仅展示不可点」
4. 改 token 只能改 `tailwind.config.ts` 和 `DESIGN.md`，两处保持一致

### 修 bug

1. 先确认是不是 spec 限制（很多「bug」其实是规格刻意要的）
2. 改完跑 `npm run build`，确保 TS 通过
3. 至少在 Mobile 与 PC 两个宽度下肉眼自查一次

### 不要做的事

- 不要随手装组件库（Ant Design、MUI、shadcn 全部禁用）。这是 anti-reference。
- 不要把 stitch HTML 直接复制粘贴到 React 文件里。已经有翻译版本，参考即可。
- 不要在没看 spec 的情况下加路由 / 改路由前缀。
- 不要把消息中心扩展到企业端 / 后台。
- 不要碰 `.claude/` 目录。

### PR 描述模板

```md
## 这次改了什么
- 一句话说清

## 涉及 spec 的哪个章节
- 列出章节号

## 自查清单
- [ ] 没有引入新组件库
- [ ] Token 都来自 DESIGN.md
- [ ] 验证了三区分跳没破坏
- [ ] 没有重新引入独立后台登录路由
- [ ] Mobile / PC 两个宽度下都看过
- [ ] AI 面试不展示题数上限
- [ ] 占位模块仍是「仅展示不可点」
```

---

## 12. 一句话总结

**修任何东西前，先回答自己一句：「这条改动有没有违反 spec、有没有违反 DESIGN.md 的命名规则、有没有把领活橙堆到 5% 以上、有没有让劳动者觉得被压迫」。**

如果四个都没违反，再写代码。
