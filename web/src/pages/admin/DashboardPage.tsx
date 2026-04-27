/**
 * 运营数据看板：
 * - 三类指标：注册与活跃、任务发布与进行中、AI 初筛与报告转化
 * - 纯只读
 */
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { adminDashboardMetrics } from "@/shared/mock/data";

const sections = [
  {
    key: "registration",
    icon: "person_add",
    headline: adminDashboardMetrics.registration.weekTotal,
    deltaLabel: `${adminDashboardMetrics.registration.weekDelta > 0 ? "+" : ""}${adminDashboardMetrics.registration.weekDelta}% / 周`,
    sub: `活跃率 ${(adminDashboardMetrics.registration.activeRate * 100).toFixed(0)}%`,
    title: adminDashboardMetrics.registration.title,
  },
  {
    key: "tasks",
    icon: "work",
    headline: adminDashboardMetrics.taskFlow.publishedThisWeek,
    deltaLabel: `${adminDashboardMetrics.taskFlow.delta}% / 周`,
    sub: `进行中 ${adminDashboardMetrics.taskFlow.inProgress}`,
    title: adminDashboardMetrics.taskFlow.title,
  },
  {
    key: "ai",
    icon: "auto_awesome",
    headline: adminDashboardMetrics.aiScreening.reports,
    deltaLabel: `面试 ${adminDashboardMetrics.aiScreening.sessions} 次`,
    sub: `报告转化率 ${(adminDashboardMetrics.aiScreening.convertRate * 100).toFixed(0)}%`,
    title: adminDashboardMetrics.aiScreening.title,
  },
];

const eventLog = [
  {
    time: "10:42",
    type: "任务发布",
    msg: "雾灰设计事务所发布「企业内刊插画绘制」",
    tone: "amber",
  },
  {
    time: "10:31",
    type: "AI 初筛",
    msg: "陈领活完成「移动端 UI 界面优化」初筛，报告已生成",
    tone: "amber",
  },
  {
    time: "10:18",
    type: "邀约沟通",
    msg: "极光科技工作室向林沐风发起邀约",
    tone: "slate",
  },
  {
    time: "09:55",
    type: "用户注册",
    msg: "139****0017 完成手机号注册",
    tone: "graphite",
  },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">运营看板</h2>
        <p className="text-graphite text-[13px] mt-xs">
          只展示三类核心指标：注册与活跃、任务发布与进行中、AI 初筛与报告转化。
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {sections.map((s) => (
          <Card key={s.key} className="p-lg">
            <header className="flex items-start justify-between">
              <span className="h-9 w-9 rounded-lg bg-bone-cream-dim text-misty-slate flex items-center justify-center">
                <Icon name={s.icon} />
              </span>
              <span className="text-[10px] text-warm-ash uppercase tracking-widest font-bold">
                {s.deltaLabel}
              </span>
            </header>
            <p className="mt-md font-headline text-[28px] text-deep-char">
              {s.headline.toLocaleString()}
            </p>
            <p className="text-[13px] text-graphite mt-1">{s.title}</p>
            <p className="text-[11px] text-warm-ash mt-xs">{s.sub}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="lg:col-span-2 p-lg">
          <header className="flex items-center justify-between mb-md">
            <h3 className="font-title text-title text-deep-char">本周转化漏斗</h3>
            <span className="text-[11px] text-warm-ash">
              报名 → AI 面试 → 报告 → 邀约
            </span>
          </header>
          <ul className="space-y-md">
            {[
              { label: "新报名", value: 1280, percent: 100 },
              { label: "进入 AI 面试", value: 1024, percent: 80 },
              { label: "报告生成", value: 762, percent: 60 },
              { label: "进入沟通", value: 312, percent: 24 },
            ].map((row) => (
              <li key={row.label}>
                <div className="flex items-center justify-between text-[12px] mb-xs">
                  <span className="text-graphite">{row.label}</span>
                  <span className="font-bold text-deep-char">
                    {row.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-bone-cream-dim rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linghuo-amber"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-lg">
          <header className="flex items-center justify-between mb-md">
            <h3 className="font-title text-title text-deep-char">实时事件</h3>
            <span className="text-[11px] text-warm-ash">最近 1 小时</span>
          </header>
          <ul className="space-y-md">
            {eventLog.map((ev, idx) => (
              <li key={idx} className="flex items-start gap-md">
                <span className="text-[11px] text-warm-ash w-12 mt-1 shrink-0">
                  {ev.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-deep-char">{ev.msg}</p>
                  <p className="text-[11px] text-graphite mt-0.5">{ev.type}</p>
                </div>
                <span
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    ev.tone === "amber"
                      ? "bg-linghuo-amber"
                      : ev.tone === "slate"
                        ? "bg-misty-slate"
                        : "bg-graphite"
                  }`}
                />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
