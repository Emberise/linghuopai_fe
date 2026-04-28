/**
 * AI 面试会话页：
 * - 报名后自动创建（spec），不做「开始面试」二级动作
 * - 不展示题数上限/剩余题数
 * - 中断恢复，按题恢复
 */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { taskHall } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

interface Turn {
  id: string;
  role: "ai" | "user";
  text: string;
}

const initialFlow: Turn[] = [
  {
    id: "ai-1",
    role: "ai",
    text: "你好，欢迎来到这次的智能初筛。咱们先从你最熟的事情说起：能不能简单聊聊你最近一次做插画的过程？",
  },
];

export function ScreeningPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const task = taskHall.find((t) => t.id === sessionId) ?? taskHall[0];
  const [turns, setTurns] = useState<Turn[]>(initialFlow);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, thinking]);

  const submit = () => {
    const value = draft.trim();
    if (!value || thinking || done) return;
    setTurns((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: value },
    ]);
    setDraft("");
    setThinking(true);
    setTimeout(() => {
      const round = turns.filter((t) => t.role === "user").length + 1;
      // spec：不向用户展示题数上限；这里仅模拟在 4-5 轮后自然收尾
      if (round >= 4) {
        setTurns((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "ai",
            text: "我了解了。你的回答和这个任务非常契合，谢谢你的耐心。我已经把要点整理好，企业方稍后会看到结构化结果。",
          },
        ]);
        setThinking(false);
        setDone(true);
      } else {
        const followUps = [
          "听起来你对节奏有偏好。如果给你 3 天交付 8 张插画，你会怎么排时间？",
          "你提到风格保持一致，能聊聊你判断「风格一致」的标准吗？",
          "如果中期评审被指出风格偏了，你打算怎么处理？",
        ];
        const next = followUps[round - 1] ?? "再多讲一点你最得意的细节，可以是色彩、节奏或文案。";
        setTurns((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, role: "ai", text: next },
        ]);
        setThinking(false);
      }
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <Card className="lg:col-span-2 flex flex-col h-[70vh]">
        <header className="px-lg py-md border-b border-ash-veil flex items-center justify-between gap-sm">
          <div className="flex items-center gap-sm">
            <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
              <Icon name="smart_toy" filled size={18} />
            </span>
            <div>
              <h2 className="font-title text-title text-deep-char">
                智能初筛 · {task.title}
              </h2>
              <p className="text-[11px] text-graphite">
                可随时离开页面，回来时会接着上一题继续
              </p>
            </div>
          </div>
          <Badge tone={done ? "graphite" : "amber"}>
            <Icon name={done ? "task_alt" : "play_circle"} size={12} filled />
            {done ? "面试已完成" : "面试进行中"}
          </Badge>
        </header>

        <div className="flex-1 overflow-y-auto px-lg py-md space-y-md no-scrollbar">
          {turns.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex gap-sm",
                t.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {t.role === "ai" ? (
                <span className="h-8 w-8 shrink-0 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                  <Icon name="smart_toy" size={16} filled />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[75%] px-md py-sm rounded-2xl text-[14px] leading-relaxed",
                  t.role === "ai"
                    ? "bg-bone-cream-dim border border-ash-veil text-deep-char"
                    : "bg-linghuo-amber text-white",
                )}
              >
                {t.text}
              </div>
            </div>
          ))}
          {thinking ? (
            <div className="flex gap-sm">
              <span className="h-8 w-8 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="smart_toy" size={16} filled />
              </span>
              <div className="px-md py-sm rounded-2xl bg-bone-cream-dim border border-ash-veil text-graphite text-[12px]">
                正在记录…
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="px-lg py-md border-t border-ash-veil space-y-sm">
          {done ? (
            <div className="flex flex-col md:flex-row md:items-center gap-md">
              <p className="text-[13px] text-graphite max-w-body">
                你已完成本次面试。是否确认把结果交给企业方？决定权仍在你这里。
              </p>
              <div className="flex gap-sm md:ml-auto">
                <Button variant="ghost" onClick={() => navigate("/u/applications")}>
                  以后再说
                </Button>
                <Button
                  onClick={() => navigate("/u/applications")}
                >
                  <Icon name="task_alt" size={18} />
                  确认投递
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex flex-col md:flex-row gap-sm"
            >
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="你的回答…回车发送，Shift + 回车换行"
                className="flex-1 px-md py-sm rounded-lg bg-bone-cream-dim border border-ash-veil text-[14px] placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
              />
              <Button type="submit" disabled={!draft.trim() || thinking}>
                <Icon name="arrow_upward" size={18} />
                发送
              </Button>
            </form>
          )}
          <p className="text-[10px] text-warm-ash">
            报告仅企业可见，正式资料不会被改写。
          </p>
        </div>
      </Card>

      <aside className="space-y-lg">
        <Card tone="warm" className="p-lg">
          <h3 className="font-title text-title text-deep-char">这次面试关于</h3>
          <p className="text-[13px] text-deep-char mt-sm font-medium">
            {task.title}
          </p>
          <p className="text-[12px] text-graphite mt-1">{task.publisher}</p>
          <div className="mt-md flex flex-wrap gap-xs">
            {task.tags.map((tag) => (
              <Badge key={tag} tone="graphite">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
