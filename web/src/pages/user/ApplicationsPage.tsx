/**
 * 我的报名 / 我的任务：
 * - 个人侧仅看进度、画像更新结果、能力缺口提示
 * - 不展示企业 AI 报告原文
 */
import { useMemo } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { taskHall } from "@/shared/mock/data";

type ApplicationStage =
  | "INTERVIEW"
  | "AWAIT_CONFIRM"
  | "SUBMITTED"
  | "INVITED"
  | "FINISHED";

interface MyApplication {
  id: string;
  taskId: string;
  stage: ApplicationStage;
  lastUpdate: string;
  hint: string;
}

const myApplications: MyApplication[] = [
  {
    id: "a-1",
    taskId: "t-001",
    stage: "INVITED",
    lastUpdate: "今天 14:21",
    hint: "企业方已邀请你进一步沟通，可前往任务详情查看。",
  },
  {
    id: "a-2",
    taskId: "t-002",
    stage: "SUBMITTED",
    lastUpdate: "今天 09:48",
    hint: "AI 报告已交给企业方，等待企业反馈。",
  },
  {
    id: "a-3",
    taskId: "t-003",
    stage: "INTERVIEW",
    lastUpdate: "昨天 21:30",
    hint: "AI 面试还差最后一段问答即可完成，可随时回到面试页继续。",
  },
  {
    id: "a-4",
    taskId: "t-006",
    stage: "AWAIT_CONFIRM",
    lastUpdate: "2 天前",
    hint: "AI 面试已完成，等你确认是否投递。",
  },
  {
    id: "a-5",
    taskId: "t-005",
    stage: "FINISHED",
    lastUpdate: "上周",
    hint: "本次合作已结束，欢迎在我的协议查看记录。",
  },
];

const stageMeta: Record<
  ApplicationStage,
  { label: string; tone: "amber" | "slate" | "graphite"; icon: string }
> = {
  INTERVIEW: { label: "AI 面试中", tone: "amber", icon: "smart_toy" },
  AWAIT_CONFIRM: { label: "待你确认投递", tone: "amber", icon: "task_alt" },
  SUBMITTED: { label: "等待企业处理", tone: "slate", icon: "hourglass_empty" },
  INVITED: { label: "企业已邀约", tone: "amber", icon: "campaign" },
  FINISHED: { label: "已结束", tone: "graphite", icon: "history_toggle_off" },
};

export function ApplicationsPage() {
  const groups = useMemo(() => {
    return {
      active: myApplications.filter((a) => a.stage !== "FINISHED"),
      finished: myApplications.filter((a) => a.stage === "FINISHED"),
    };
  }, []);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">
          我的报名
        </h2>
        <p className="text-graphite text-[13px] mt-xs">
          推进路径在这里同步：你看到的不是报告原文，而是「现在你在哪一步」。
        </p>
      </header>

      <section>
        <h3 className="font-title text-title text-deep-char mb-md">进行中</h3>
        <ul className="space-y-md">
          {groups.active.map((app) => {
            const task = taskHall.find((t) => t.id === app.taskId);
            const meta = stageMeta[app.stage];
            return (
              <li key={app.id}>
                <Card hoverable className="p-lg flex flex-col md:flex-row gap-md">
                  <div className="flex-1 min-w-0">
                    <header className="flex items-center gap-sm">
                      <Badge tone={meta.tone}>
                        <Icon name={meta.icon} size={12} filled />
                        {meta.label}
                      </Badge>
                      <span className="text-[11px] text-warm-ash">
                        {app.lastUpdate}
                      </span>
                    </header>
                    <h4 className="font-title text-title text-deep-char mt-sm">
                      {task?.title ?? "任务"}
                    </h4>
                    <p className="text-[12px] text-graphite mt-1">
                      {task?.publisher ?? ""}
                    </p>
                    <p className="text-[13px] text-graphite mt-md leading-relaxed max-w-body">
                      {app.hint}
                    </p>
                  </div>
                  <div className="md:w-44 flex md:flex-col gap-sm md:items-end justify-end">
                    {app.stage === "INTERVIEW" ? (
                      <button
                        type="button"
                        className="px-md h-10 rounded-lg bg-linghuo-amber text-white text-[13px] font-medium hover:brightness-110"
                      >
                        继续面试
                      </button>
                    ) : null}
                    {app.stage === "AWAIT_CONFIRM" ? (
                      <button
                        type="button"
                        className="px-md h-10 rounded-lg bg-linghuo-amber text-white text-[13px] font-medium hover:brightness-110"
                      >
                        确认投递
                      </button>
                    ) : null}
                    {app.stage === "INVITED" ? (
                      <button
                        type="button"
                        className="px-md h-10 rounded-lg bg-linghuo-amber text-white text-[13px] font-medium hover:brightness-110"
                      >
                        查看邀约
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="px-md h-10 rounded-lg border border-ash-veil text-graphite text-[13px] hover:bg-bone-cream-dim"
                    >
                      查看任务
                    </button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {groups.finished.length > 0 ? (
        <section>
          <h3 className="font-title text-title text-deep-char mb-md">
            历史记录
          </h3>
          <ul className="space-y-sm">
            {groups.finished.map((app) => {
              const task = taskHall.find((t) => t.id === app.taskId);
              return (
                <li
                  key={app.id}
                  className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm flex items-center justify-between gap-md"
                >
                  <div>
                    <p className="text-deep-char font-medium">
                      {task?.title ?? "任务"}
                    </p>
                    <p className="text-[11px] text-warm-ash mt-0.5">
                      {task?.publisher} · {app.lastUpdate}
                    </p>
                  </div>
                  <Badge tone="graphite">已结束</Badge>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
