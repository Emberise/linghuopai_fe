# 领活派 V1 前端

依据：
- 项目根目录 `领活派V1前端规格说明.md`
- 项目根目录 `PRODUCT.md` / `DESIGN.md`
- `stitch_document_insight_engine/` 16 张 stitch 设计稿

技术栈：
- React 18 + TypeScript + Vite
- React Router、Zustand、TanStack Query
- Tailwind CSS（token 严格对齐 DESIGN.md）

## 安装与启动

```bash
# 在 web/ 目录下
npm install
npm run dev
```

默认 dev server: http://localhost:5173

## 路由地图

- `/login` 公共登录页（个人端 / 企业端两入口 + 后台入口）
- `/admin/login` 后台单独登录入口
- `/u/*` 个人端
  - `/u/home` 工作台
  - `/u/tasks` 任务大厅
  - `/u/tasks/:id` 任务详情
  - `/u/profile` 简历与画像
  - `/u/applications` 我的报名
  - `/u/posted-tasks` 我发布的任务
  - `/u/assistant` 个人 AI 助手
  - `/u/screening/:id` 任务级 AI 面试
  - `/u/me` 我的页（含占位）
  - `/u/me/agreements` 我的协议（占位说明页）
- `/b/*` 企业端
  - `/b/home` 企业工作台
  - `/b/qualification` 资质认证
  - `/b/jobs` 岗位列表
  - `/b/jobs/new` 发布岗位
  - `/b/candidates` 候选人管理（仅初筛后）
  - `/b/me` 企业信息
- `/admin/*` 运营后台
  - `/admin/dashboard` 看板
  - `/admin/users` 个人用户
  - `/admin/enterprises` 企业用户
  - `/admin/tasks` 任务管理
  - `/admin/config` 基础配置

## 关键 spec 实现要点

- 严格双账号体系：同手机号在个人端 / 企业端是两个账号
- 三区严格分跳：跨区漂移会被路由守卫送回各自首页
- 企业端没有消息中心 / 顶部提醒，仅个人端右上角集成式消息中心
- 候选人列表只展示完成 AI 初筛、已生成报告的候选人
- 个人发任务：复用 AI JD 流程，不做候选人管理，推进只能通过站内沟通
- AI 面试会话：报名后自动创建，不展示题数上限，可中断按题恢复
- 占位模块：除「我的协议」跳占位说明页外，其他全部「仅展示不可点」

## 后续接入真实 API

- `src/shared/auth/store.ts` 的 `loginAs*` 方法替换为调用真实接口即可
- `src/shared/mock/data.ts` 的所有 mock 改为 TanStack Query queries

## Mock 登录

- 个人端 / 企业端：手机号 11 位 + 任意 6 位验证码
- 后台：账号、密码任意非空
