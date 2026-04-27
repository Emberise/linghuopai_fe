/**
 * Mock 数据：任务大厅、岗位、候选人、消息、看板。
 * 之后可以无痛替换为真实 API。
 */

export type TaskStatus = "PUBLISHED" | "IN_PROGRESS" | "CLOSED";

export interface TaskCard {
  id: string;
  title: string;
  source: "enterprise" | "individual";
  publisher: string;
  budget: string;
  budgetType: string;
  tags: string[];
  matchHint?: string;
  matchScore?: number;
  status: TaskStatus;
  cover?: string;
}

export const taskHall: TaskCard[] = [
  {
    id: "t-001",
    title: "移动端 UI 界面优化",
    source: "enterprise",
    publisher: "光合插画工作室",
    budget: "¥800-1200",
    budgetType: "按件计费",
    tags: ["远程", "3天内交付"],
    matchHint: "你的风格与该企业过往的插画偏好匹配度达 98%",
    matchScore: 98,
    status: "PUBLISHED",
  },
  {
    id: "t-002",
    title: "企业内刊插画绘制",
    source: "enterprise",
    publisher: "雾灰设计事务所",
    budget: "¥5,000",
    budgetType: "项目制",
    tags: ["灵活工时", "周期 2 周"],
    matchHint: "系统识别到你近期完成了 2 项类似风格的任务，效率极高",
    matchScore: 92,
    status: "PUBLISHED",
  },
  {
    id: "t-003",
    title: "交互逻辑评审专家",
    source: "enterprise",
    publisher: "极光科技工作室",
    budget: "¥200/时",
    budgetType: "时薪制",
    tags: ["线上会议", "长期合作"],
    matchHint: "此岗位需要资深背景，你的 5 年 UI/UX 经验完全符合",
    matchScore: 88,
    status: "PUBLISHED",
  },
  {
    id: "t-004",
    title: "周末校园活动主持",
    source: "individual",
    publisher: "活动方 · 林同学",
    budget: "¥600/场",
    budgetType: "按场计费",
    tags: ["杭州 · 滨江", "周末"],
    status: "PUBLISHED",
  },
  {
    id: "t-005",
    title: "短视频脚本润色（教育类）",
    source: "individual",
    publisher: "活动方 · 王老师",
    budget: "¥300-500",
    budgetType: "按件计费",
    tags: ["远程", "2 天内"],
    status: "PUBLISHED",
  },
  {
    id: "t-006",
    title: "线下品牌快闪布展支持",
    source: "enterprise",
    publisher: "WarmLight 营销",
    budget: "¥1,500/天",
    budgetType: "日结",
    tags: ["上海", "11 月 22-24 日"],
    status: "PUBLISHED",
  },
];

export interface JobItem {
  id: string;
  title: string;
  status: "进行中" | "已结束";
  location: string;
  salary: string;
  applied: number;
  passed: number;
}

export const enterpriseJobs: JobItem[] = [
  {
    id: "j-001",
    title: "高级 UI/UX 设计师",
    status: "进行中",
    location: "杭州 · 滨江",
    salary: "15k-25k",
    applied: 42,
    passed: 12,
  },
  {
    id: "j-002",
    title: "前端开发工程师 (React)",
    status: "进行中",
    location: "远程",
    salary: "18k-30k",
    applied: 28,
    passed: 8,
  },
];

export type CandidateStage = "REPORT_GENERATED" | "IN_PROCESS" | "FINISHED";

export interface CandidateItem {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  stage: CandidateStage;
  subStage?: "邀约沟通" | "负面反馈" | "暂不推进";
  jobId: string;
  highlight: string;
  appliedAt: string;
}

export const enterpriseCandidates: CandidateItem[] = [
  {
    id: "c-001",
    name: "陈领活",
    title: "5年经验 · 高级 UI/UX",
    matchScore: 96,
    stage: "REPORT_GENERATED",
    jobId: "j-001",
    highlight: "在 SaaS 项目重构与设计系统方面有完整案例。",
    appliedAt: "2026-04-25 14:21",
  },
  {
    id: "c-002",
    name: "林沐风",
    title: "3年经验 · 交互设计师",
    matchScore: 91,
    stage: "IN_PROCESS",
    subStage: "邀约沟通",
    jobId: "j-001",
    highlight: "AI 面试中展示了较强的复杂流程梳理能力。",
    appliedAt: "2026-04-24 09:50",
  },
  {
    id: "c-003",
    name: "王清和",
    title: "6年经验 · 前端架构",
    matchScore: 89,
    stage: "REPORT_GENERATED",
    jobId: "j-002",
    highlight: "对 React 性能优化与设计协作有清晰方法论。",
    appliedAt: "2026-04-25 17:08",
  },
  {
    id: "c-004",
    name: "苏栈",
    title: "2年经验 · 前端工程师",
    matchScore: 84,
    stage: "IN_PROCESS",
    subStage: "暂不推进",
    jobId: "j-002",
    highlight: "经验偏初级但学习态度突出，可以做项目协作配角。",
    appliedAt: "2026-04-23 11:15",
  },
  {
    id: "c-005",
    name: "顾岸",
    title: "4年经验 · 全栈",
    matchScore: 78,
    stage: "FINISHED",
    jobId: "j-002",
    highlight: "已正式录用，进入合作期。",
    appliedAt: "2026-04-19 10:32",
  },
];

export type MessageKind =
  | "system"
  | "invite"
  | "interview"
  | "report"
  | "thread"
  | "announcement";

export interface MessageItem {
  id: string;
  kind: MessageKind;
  title: string;
  preview: string;
  time: string;
  read: boolean;
}

export const userMessages: MessageItem[] = [
  {
    id: "m-001",
    kind: "invite",
    title: "极光科技工作室邀请你沟通",
    preview: "你的画像匹配度达 96%，企业方希望与你进一步沟通「交互逻辑评审专家」岗位。",
    time: "刚刚",
    read: false,
  },
  {
    id: "m-002",
    kind: "interview",
    title: "AI 面试推进",
    preview: "「移动端 UI 界面优化」的 AI 面试已完成第一轮，可在任意时刻继续作答。",
    time: "10 分钟前",
    read: false,
  },
  {
    id: "m-003",
    kind: "report",
    title: "AI 报告已生成",
    preview: "你完成的「企业内刊插画绘制」初筛报告已交给企业方，等待企业反馈。",
    time: "1 小时前",
    read: false,
  },
  {
    id: "m-004",
    kind: "thread",
    title: "新留言：王老师",
    preview: "你好，关于短视频脚本，能否在周三前给我看一版样稿？",
    time: "今天上午",
    read: true,
  },
  {
    id: "m-005",
    kind: "system",
    title: "你已完成简历更新",
    preview: "AI 已根据你的最近作品集，刷新了能力画像，匹配度提升 4%。",
    time: "昨天",
    read: true,
  },
  {
    id: "m-006",
    kind: "announcement",
    title: "平台公告：服务条款更新",
    preview: "我们更新了关于个人发任务的协议条款，建议你在合适的时间阅读。",
    time: "本周",
    read: true,
  },
];

export const messageKindMeta: Record<
  MessageKind,
  { label: string; icon: string; tone: "amber" | "slate" | "graphite" }
> = {
  system: { label: "系统通知", icon: "info", tone: "slate" },
  invite: { label: "企业邀约", icon: "campaign", tone: "amber" },
  interview: { label: "面试推进", icon: "smart_toy", tone: "amber" },
  report: { label: "AI 报告", icon: "description", tone: "amber" },
  thread: { label: "站内沟通", icon: "chat_bubble", tone: "slate" },
  announcement: { label: "平台公告", icon: "campaign", tone: "graphite" },
};

export const adminDashboardMetrics = {
  registration: {
    title: "注册与活跃",
    weekTotal: 1284,
    weekDelta: 12.4,
    activeRate: 0.62,
  },
  taskFlow: {
    title: "任务发布与进行中",
    publishedThisWeek: 318,
    inProgress: 542,
    delta: 8.1,
  },
  aiScreening: {
    title: "AI 初筛与报告转化",
    sessions: 1024,
    reports: 762,
    convertRate: 0.43,
  },
};

export interface AdminUserRow {
  id: string;
  phone: string;
  nickname: string;
  registeredAt: string;
  status: "正常" | "已封禁" | "待审核";
  taskCount: number;
}

export const adminUsers: AdminUserRow[] = [
  { id: "u-001", phone: "138****0001", nickname: "陈领活", registeredAt: "2026-03-12", status: "正常", taskCount: 14 },
  { id: "u-002", phone: "138****0002", nickname: "林沐风", registeredAt: "2026-03-18", status: "正常", taskCount: 9 },
  { id: "u-003", phone: "138****0003", nickname: "王清和", registeredAt: "2026-03-21", status: "正常", taskCount: 11 },
  { id: "u-004", phone: "139****0007", nickname: "苏栈", registeredAt: "2026-03-29", status: "待审核", taskCount: 3 },
  { id: "u-005", phone: "139****0009", nickname: "顾岸", registeredAt: "2026-04-02", status: "已封禁", taskCount: 0 },
];

export interface AdminTaskRow {
  id: string;
  title: string;
  publisher: string;
  source: "individual" | "enterprise";
  publishedAt: string;
  status: TaskStatus;
  reportCount: number;
}

export const adminTasks: AdminTaskRow[] = [
  { id: "ta-001", title: "高级 UI/UX 设计师", publisher: "极光科技工作室", source: "enterprise", publishedAt: "2026-04-12", status: "IN_PROGRESS", reportCount: 12 },
  { id: "ta-002", title: "前端开发工程师 (React)", publisher: "雾灰设计事务所", source: "enterprise", publishedAt: "2026-04-15", status: "IN_PROGRESS", reportCount: 8 },
  { id: "ta-003", title: "周末校园活动主持", publisher: "活动方 · 林同学", source: "individual", publishedAt: "2026-04-19", status: "PUBLISHED", reportCount: 0 },
  { id: "ta-004", title: "短视频脚本润色（教育类）", publisher: "活动方 · 王老师", source: "individual", publishedAt: "2026-04-21", status: "PUBLISHED", reportCount: 0 },
  { id: "ta-005", title: "Logo 设计赛事评委", publisher: "WarmLight 营销", source: "enterprise", publishedAt: "2026-04-08", status: "CLOSED", reportCount: 5 },
];

export const taskStatusMeta: Record<TaskStatus, { label: string; tone: string }> = {
  PUBLISHED: { label: "已发布", tone: "bg-secondary/10 text-misty-slate" },
  IN_PROGRESS: { label: "进行中", tone: "bg-linghuo-amber/10 text-linghuo-amber" },
  CLOSED: { label: "已关闭", tone: "bg-warm-ash/20 text-graphite" },
};
