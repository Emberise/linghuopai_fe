/**
 * 我发布的任务（个人发任务列表）
 * - 个人发任务：复用 AI JD 流程，字段简化
 * - spec：不做候选管理；推进只能通过站内沟通
 */
import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { type TaskStatus, taskStatusMeta } from "@/shared/mock/data";

interface PostedTask {
  id: string;
  title: string;
  budget: string;
  status: TaskStatus;
  publishedAt: string;
  applicants: number;
  unreadThreads: number;
}

const seed: PostedTask[] = [
  {
    id: "p-1",
    title: "周末校园活动主持",
    budget: "¥600 / 场",
    status: "PUBLISHED",
    publishedAt: "2 小时前",
    applicants: 4,
    unreadThreads: 1,
  },
  {
    id: "p-2",
    title: "短视频脚本润色（教育类）",
    budget: "¥300-500",
    status: "IN_PROGRESS",
    publishedAt: "昨天",
    applicants: 9,
    unreadThreads: 2,
  },
  {
    id: "p-3",
    title: "毕业作品集排版校对",
    budget: "¥150 / 份",
    status: "CLOSED",
    publishedAt: "上周",
    applicants: 12,
    unreadThreads: 0,
  },
];

export function PostedTasksPage() {
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [polished, setPolished] = useState<string | null>(null);
  const [tasks, setTasks] = useState<PostedTask[]>(seed);

  const polish = () => {
    if (!draft.trim()) return;
    setPolished(
      `${draft}\n\n（AI 整理）任务交付物：与你描述对齐；交付周期：建议 3 天内；预算建议范围：参考你的描述确认；沟通：建议站内留言。`,
    );
  };

  const publish = () => {
    if (!polished) return;
    setTasks((prev) => [
      {
        id: `p-${Date.now()}`,
        title: draft.split(/[，。\n]/)[0].slice(0, 18) || "新任务",
        budget: "¥可议",
        status: "PUBLISHED",
        publishedAt: "刚刚",
        applicants: 0,
        unreadThreads: 0,
      },
      ...prev,
    ]);
    setCreating(false);
    setDraft("");
    setPolished(null);
  };

  return (
    <div className="space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <h2 className="font-headline text-headline text-deep-char">
            我发布的任务
          </h2>
          <p className="text-graphite text-[13px] mt-xs max-w-body">
            个人发布任务的所有推进通过站内沟通进行。
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Icon name="add" size={18} />
          发布新任务
        </Button>
      </header>

      {creating ? (
        <Card className="p-lg space-y-md">
          <header className="flex items-center justify-between">
            <h3 className="font-title text-title text-deep-char">
              发布任务（AI 帮你润色）
            </h3>
            <button
              type="button"
              className="text-[12px] text-graphite hover:text-error"
              onClick={() => {
                setCreating(false);
                setDraft("");
                setPolished(null);
              }}
            >
              取消
            </button>
          </header>
          <div>
            <p className="text-[12px] text-graphite mb-xs">
              用一两句话描述就够了，AI 会帮你整理成结构化任务说明。
            </p>
            <textarea
              rows={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="例如：周末活动主持人，有舞台经验，杭州滨江，时薪 200 上下。"
              className="w-full px-md py-sm rounded-lg bg-bone-cream-dim border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
            />
            <div className="mt-sm flex gap-sm">
              <Button variant="secondary" size="sm" onClick={polish}>
                <Icon name="auto_awesome" size={16} />
                AI 润色
              </Button>
              <Button
                size="sm"
                onClick={publish}
                disabled={!polished}
              >
                直接发布
              </Button>
            </div>
          </div>
          {polished ? (
            <div className="bg-bone-cream-dim border border-ash-veil rounded-lg p-md">
              <p className="text-[11px] text-warm-ash uppercase tracking-widest mb-xs">
                AI 润色稿（你可以直接发布，也可以再修改）
              </p>
              <p className="text-[14px] text-deep-char whitespace-pre-line leading-relaxed">
                {polished}
              </p>
            </div>
          ) : null}
        </Card>
      ) : null}

      <ul className="space-y-md">
        {tasks.map((t) => (
          <Card key={t.id} className="p-lg flex flex-col md:flex-row md:items-center gap-md">
            <div className="flex-1 min-w-0">
              <header className="flex items-center gap-sm mb-1">
                <Badge tone="graphite">个人发布</Badge>
                <Badge
                  tone={
                    t.status === "PUBLISHED"
                      ? "amber"
                      : t.status === "IN_PROGRESS"
                        ? "slate"
                        : "graphite"
                  }
                >
                  {taskStatusMeta[t.status].label}
                </Badge>
              </header>
              <h3 className="font-title text-title text-deep-char">{t.title}</h3>
              <p className="text-[12px] text-graphite mt-xs flex flex-wrap gap-x-md gap-y-1">
                <span className="flex items-center gap-1">
                  <Icon name="payments" size={14} />
                  {t.budget}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="schedule" size={14} />
                  {t.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="forum" size={14} />
                  {t.unreadThreads} 条未读沟通
                </span>
              </p>
            </div>
            <div className="flex gap-sm md:items-end">
              <Button variant="ghost" size="sm">
                <Icon name="forum" size={16} />
                打开沟通
              </Button>
              <Button variant="secondary" size="sm">
                {t.status === "CLOSED" ? "重新打开" : "关闭任务"}
              </Button>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
