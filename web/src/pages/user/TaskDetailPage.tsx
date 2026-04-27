/**
 * 任务详情：
 * - 报名 → 自动跳到任务级 AI 面试会话页（spec：报名后自动创建会话）
 * - 详情页用轻量标识区分来源
 */
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { taskHall } from "@/shared/mock/data";

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const task = useMemo(
    () => taskHall.find((t) => t.id === taskId) ?? taskHall[0],
    [taskId],
  );

  const apply = () => {
    // 报名即创建任务级 AI 面试会话；spec：不点二级动作
    navigate(`/u/screening/${task.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <article className="lg:col-span-2 space-y-lg">
        <Card className="p-lg space-y-md">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge tone={task.source === "enterprise" ? "slate" : "graphite"}>
              {task.source === "enterprise" ? "企业发布" : "个人发布"}
            </Badge>
            {task.matchScore ? (
              <Badge tone="amber">
                <Icon name="smart_toy" size={12} filled />
                AI 匹配度 {task.matchScore}%
              </Badge>
            ) : null}
            <Badge tone="info">
              <Icon name="schedule" size={12} />
              发布中
            </Badge>
          </div>
          <header>
            <h1 className="font-headline text-headline text-deep-char">
              {task.title}
            </h1>
            <p className="text-graphite text-[13px] mt-xs">
              {task.publisher}
            </p>
          </header>
          <div className="flex flex-wrap gap-md text-[13px] text-graphite">
            <span className="flex items-center gap-1">
              <Icon name="payments" size={16} />
              {task.budget} · {task.budgetType}
            </span>
            {task.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1">
                <Icon name="check" size={14} />
                {tag}
              </span>
            ))}
          </div>
        </Card>

        {task.matchHint ? (
          <Card tone="warm" className="p-lg">
            <header className="flex items-center gap-sm mb-md">
              <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="smart_toy" filled size={18} />
              </span>
              <h2 className="font-title text-title text-deep-char">
                AI 匹配分析
              </h2>
            </header>
            <p className="text-graphite leading-relaxed max-w-body">
              “{task.matchHint}”
            </p>
            <ul className="mt-md grid grid-cols-1 md:grid-cols-3 gap-sm text-[13px] text-deep-char">
              <li className="bg-bone-cream-dim border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                  能力契合
                </p>
                <p className="font-medium mt-1">UI/UX · 插画</p>
              </li>
              <li className="bg-bone-cream-dim border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                  时间契合
                </p>
                <p className="font-medium mt-1">3 天内可交付</p>
              </li>
              <li className="bg-bone-cream-dim border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-warm-ash uppercase tracking-widest">
                  历史合作
                </p>
                <p className="font-medium mt-1">2 项相似风格已完成</p>
              </li>
            </ul>
          </Card>
        ) : null}

        <Card className="p-lg">
          <h2 className="font-title text-title text-deep-char">任务详情</h2>
          <div className="mt-md prose prose-sm max-w-body text-graphite leading-relaxed">
            <p>
              我们正在寻找一位能在 3 天内交付高质量插画的设计师。任务包含 6 张主插画，2 张
              头图，以及配套的 SVG 图标 12 枚。需要熟悉品牌的暖光气质，配色克制。
            </p>
            <h3 className="font-title text-deep-char mt-md">交付要求</h3>
            <ul className="list-disc pl-md space-y-1">
              <li>所有插画输出 SVG 与 PNG 两种格式</li>
              <li>风格保持一致，避免单张作品过度独立</li>
              <li>提交前请通过站内沟通做一次中期评审</li>
            </ul>
          </div>
        </Card>

        <Card tone="warm" className="p-lg">
          <header className="flex items-center gap-sm mb-md">
            <span className="h-9 w-9 rounded-lg bg-misty-slate/10 text-misty-slate flex items-center justify-center">
              <Icon name="route" size={18} />
            </span>
            <h2 className="font-title text-title text-deep-char">流程节奏</h2>
          </header>
          <ol className="space-y-md text-[13px] text-deep-char">
            <li className="flex items-start gap-md">
              <span className="h-7 w-7 shrink-0 rounded-full bg-linghuo-amber text-white flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="font-medium">报名后自动开启 AI 面试</p>
                <p className="text-[12px] text-graphite mt-xs">
                  你不需要点击「开始面试」，系统会基于这个任务给你一段对话式问答，最多
                  几轮即可完成。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-md">
              <span className="h-7 w-7 shrink-0 rounded-full bg-bone-cream-dim border border-ash-veil text-graphite flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="font-medium">完成面试后再确认是否投递</p>
                <p className="text-[12px] text-graphite mt-xs">
                  你随时可以中断回来续接。报告由后端生成，仅企业可见。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-md">
              <span className="h-7 w-7 shrink-0 rounded-full bg-bone-cream-dim border border-ash-veil text-graphite flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="font-medium">企业看到你之后再开启沟通</p>
                <p className="text-[12px] text-graphite mt-xs">
                  消息中心会同步进度，期间不会有人催你。
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </article>

      <aside className="space-y-lg">
        <Card className="p-lg">
          <p className="text-[11px] text-warm-ash uppercase tracking-widest">
            预算
          </p>
          <p className="font-headline text-headline text-linghuo-amber mt-1">
            {task.budget}
          </p>
          <p className="text-[12px] text-graphite mt-1">{task.budgetType}</p>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-lg"
            onClick={apply}
          >
            <Icon name="how_to_reg" size={18} />
            报名 / 进入 AI 面试
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-md w-full h-11 rounded-lg border border-ash-veil text-graphite hover:bg-bone-cream-dim flex items-center justify-center gap-1 transition-colors"
          >
            <Icon name="bookmark_border" size={16} />
            收藏，稍后再看
          </button>
          <p className="mt-md text-[11px] text-warm-ash leading-relaxed">
            报名即同意你的能力画像被该任务的 AI 面试调用。报告仅企业可见，你只能看到
            进度与画像更新结果。
          </p>
        </Card>

        <Card tone="warm" className="p-lg">
          <h3 className="font-title text-title text-deep-char">关于发布方</h3>
          <p className="text-graphite text-[12px] mt-xs leading-relaxed">
            {task.source === "enterprise"
              ? "已认证企业，平台已为其完成资质核验。"
              : "个人发布。请通过站内沟通推进合作；个人发布方不查看 AI 报告。"}
          </p>
        </Card>
      </aside>
    </div>
  );
}
