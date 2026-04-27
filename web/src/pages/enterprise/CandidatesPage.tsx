/**
 * 候选人管理列表：
 * - spec：仅展示通过 AI 初筛的候选人
 * - 三段状态：报告生成 / 处理中 / 已结束
 * - 处理中下子状态：邀约沟通 / 负面反馈 / 暂不推进
 */
import { useMemo, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import {
  type CandidateItem,
  type CandidateStage,
  enterpriseCandidates,
  enterpriseJobs,
} from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const stageMeta: Record<
  CandidateStage,
  { label: string; tone: "amber" | "slate" | "graphite" }
> = {
  REPORT_GENERATED: { label: "报告生成", tone: "amber" },
  IN_PROCESS: { label: "处理中", tone: "slate" },
  FINISHED: { label: "已结束", tone: "graphite" },
};

const stageOptions: Array<{ key: CandidateStage | "ALL"; label: string }> = [
  { key: "ALL", label: "全部" },
  { key: "REPORT_GENERATED", label: "报告生成" },
  { key: "IN_PROCESS", label: "处理中" },
  { key: "FINISHED", label: "已结束" },
];

export function CandidatesPage() {
  const [stage, setStage] = useState<CandidateStage | "ALL">("ALL");
  const [active, setActive] = useState<CandidateItem | null>(
    enterpriseCandidates[0] ?? null,
  );

  const list = useMemo(
    () =>
      enterpriseCandidates.filter((c) =>
        stage === "ALL" ? true : c.stage === stage,
      ),
    [stage],
  );

  const job = active
    ? enterpriseJobs.find((j) => j.id === active.jobId)?.title
    : null;

  return (
    <div className="space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <h2 className="font-headline text-headline text-deep-char">
            候选人管理
          </h2>
          <p className="text-graphite text-[13px] mt-xs max-w-body">
            列表只展示完成 AI 初筛、已生成报告的候选人；面试进行中的候选人不在此呈现。
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {stageOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStage(s.key)}
              className={cn(
                "shrink-0 px-md h-9 rounded-full text-[12px] font-medium transition-colors",
                stage === s.key
                  ? "bg-linghuo-amber text-white"
                  : "bg-bone-cream-dim text-graphite hover:bg-surface-container-low border border-ash-veil",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
        <ul className="lg:col-span-2 space-y-md">
          {list.map((c) => {
            const isActive = active?.id === c.id;
            const meta = stageMeta[c.stage];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActive(c)}
                  className={cn(
                    "w-full text-left rounded-xl border bg-surface-container-lowest p-lg transition-all duration-300 ease-out-quart",
                    isActive
                      ? "border-linghuo-amber shadow-ambient-hover"
                      : "border-ash-veil hover:shadow-ambient-hover",
                  )}
                >
                  <header className="flex items-center justify-between gap-sm mb-sm">
                    <div className="flex items-center gap-sm min-w-0">
                      <span className="h-10 w-10 rounded-full bg-bone-cream-dim text-deep-char flex items-center justify-center font-headline">
                        {c.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-title text-title text-deep-char truncate">
                          {c.name}
                        </p>
                        <p className="text-[12px] text-graphite truncate">
                          {c.title}
                        </p>
                      </div>
                    </div>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </header>
                  <p className="text-[12px] text-graphite line-clamp-2 leading-relaxed">
                    {c.highlight}
                  </p>
                  <footer className="mt-md flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1 text-warm-ash">
                      <Icon name="schedule" size={14} />
                      {c.appliedAt}
                    </span>
                    <span className="font-headline text-misty-slate">
                      匹配度 {c.matchScore}%
                    </span>
                  </footer>
                </button>
              </li>
            );
          })}
          {list.length === 0 ? (
            <li className="text-center py-xl text-graphite">
              <Icon name="hourglass_empty" size={28} className="text-warm-ash" />
              <p className="mt-sm">这个状态下还没有候选人。</p>
            </li>
          ) : null}
        </ul>

        <aside className="lg:col-span-3">
          {active ? (
            <Card className="p-lg space-y-lg">
              <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-md">
                <div className="flex items-center gap-md">
                  <span className="h-12 w-12 rounded-full bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center font-headline">
                    {active.name.slice(0, 1)}
                  </span>
                  <div>
                    <h3 className="font-headline text-headline text-deep-char">
                      {active.name}
                    </h3>
                    <p className="text-[13px] text-graphite">{active.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <Badge tone={stageMeta[active.stage].tone}>
                    {stageMeta[active.stage].label}
                  </Badge>
                  {active.subStage ? (
                    <Badge tone="graphite">{active.subStage}</Badge>
                  ) : null}
                </div>
              </header>

              <section>
                <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                  关于
                </p>
                <p className="font-medium text-deep-char">{job}</p>
                <p className="text-[12px] text-graphite mt-1">
                  报名时间 {active.appliedAt}
                </p>
              </section>

              <section className="bg-bone-cream-dim border border-ash-veil rounded-lg p-lg">
                <header className="flex items-center justify-between mb-md">
                  <h4 className="font-title text-title text-deep-char flex items-center gap-sm">
                    <Icon
                      name="auto_awesome"
                      filled
                      className="text-linghuo-amber"
                      size={18}
                    />
                    AI 初筛报告（摘要）
                  </h4>
                  <span className="font-headline text-misty-slate">
                    匹配度 {active.matchScore}%
                  </span>
                </header>
                <p className="text-[14px] text-deep-char leading-relaxed">
                  {active.highlight}
                </p>
                <ul className="mt-md grid grid-cols-1 md:grid-cols-3 gap-sm text-[13px]">
                  <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                    <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                      能力契合
                    </p>
                    <p className="font-medium text-deep-char mt-1">
                      经验充分，重点能力覆盖率高
                    </p>
                  </li>
                  <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                    <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                      时间契合
                    </p>
                    <p className="font-medium text-deep-char mt-1">
                      可工作日晚 + 周末
                    </p>
                  </li>
                  <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                    <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                      风险提示
                    </p>
                    <p className="font-medium text-deep-char mt-1">
                      项目周期偏紧，建议提前对齐节奏
                    </p>
                  </li>
                </ul>
                <p className="mt-md text-[11px] text-warm-ash leading-relaxed">
                  报告由后端在面试结束后自动生成；JD 一人一份；JD 修改后旧报告作废，需重走面试。
                </p>
              </section>

              <section className="flex flex-col md:flex-row gap-sm md:justify-end">
                <Button variant="ghost">
                  <Icon name="thumb_down_off_alt" size={18} />
                  负面反馈
                </Button>
                <Button variant="secondary">
                  <Icon name="hourglass_empty" size={18} />
                  暂不推进
                </Button>
                <Button>
                  <Icon name="forum" size={18} />
                  邀约沟通
                </Button>
              </section>
            </Card>
          ) : (
            <Card className="p-lg text-center text-graphite">
              <Icon name="person_search" size={32} className="text-warm-ash" />
              <p className="mt-sm">从左侧选择一位候选人查看详情。</p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
