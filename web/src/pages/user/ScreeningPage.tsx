/**
 * AI 面试会话页：
 * - 报名后自动创建（spec），不做「开始面试」二级动作
 * - 不展示题数上限/剩余题数（spec 10.3）
 * - 中断恢复，按题恢复
 * - 视觉对照 stitch_document_insight_engine/个人端_8_ai面试会话：
 *   · 气泡无头像，气泡上方一行 timestamp meta（"AI 面试官 · 14:20" / "14:22 · 你"）
 *   · thinking 状态用 dashed border + 3 pulse dot
 *   · 输入区是 white 卡内嵌 mic/image + Enter 提示 + 单独 amber 发送按钮
 *   · 移动端 aside 隐藏，面试主区撑满 viewport 可见区
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
  timestamp: string;
}

function nowLabel() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

const initialFlow: Turn[] = [
  {
    id: "ai-1",
    role: "ai",
    text: "你好，欢迎来到这次的智能初筛。咱们先从你最熟的事情说起：能不能简单聊聊你最近一次做插画的过程？",
    timestamp: "09:41",
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 仅滚动内层聊天容器，不触发 window scroll，避免移动端把 aside 带入视野
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, thinking]);

  const submit = () => {
    const value = draft.trim();
    if (!value || thinking || done) return;
    setTurns((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: "user",
        text: value,
        timestamp: nowLabel(),
      },
    ]);
    setDraft("");
    if (taRef.current) taRef.current.style.height = "auto";
    setThinking(true);
    window.setTimeout(() => {
      const round = turns.filter((t) => t.role === "user").length + 1;
      // spec：不向用户展示题数上限；这里仅模拟在 4-5 轮后自然收尾
      if (round >= 4) {
        setTurns((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "ai",
            text: "我了解了。你的回答和这个任务非常契合，谢谢你的耐心。我已经把要点整理好，企业方稍后会看到结构化结果。",
            timestamp: nowLabel(),
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
        const next =
          followUps[round - 1] ??
          "再多讲一点你最得意的细节，可以是色彩、节奏或文案。";
        setTurns((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "ai",
            text: next,
            timestamp: nowLabel(),
          },
        ]);
        setThinking(false);
      }
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      {/* 主区：移动端撑满 main 可视区，桌面端 70vh */}
      <Card className="lg:col-span-2 flex flex-col h-[calc(100dvh-160px)] lg:h-[70vh]">
        <header className="px-lg py-md border-b border-ash-veil flex items-center justify-between gap-sm">
          <div className="flex items-center gap-sm min-w-0">
            <span className="h-9 w-9 rounded-full bg-linghuo-amber text-white flex items-center justify-center shrink-0">
              <Icon name="psychology" filled size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="font-title text-title text-deep-char">
                智能初筛
              </h2>
              <p className="text-[11px] text-graphite truncate">
                {task.title}
              </p>
            </div>
          </div>
          <Badge tone={done ? "graphite" : "amber"}>
            <Icon name={done ? "task_alt" : "play_circle"} size={12} filled />
            {done ? "面试已完成" : "面试进行中"}
          </Badge>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-lg py-md space-y-lg no-scrollbar"
        >
          {turns.map((t) => (
            <BubbleRow key={t.id} turn={t} />
          ))}
          {thinking ? <ThinkingBubble /> : null}
        </div>

        <div className="px-md md:px-lg py-md border-t border-ash-veil">
          {done ? (
            <div className="flex flex-col md:flex-row md:items-center gap-md">
              <p className="text-[13px] text-graphite max-w-body">
                你已完成本次面试。是否确认把结果交给企业方？决定权仍在你这里。
              </p>
              <div className="flex gap-sm md:ml-auto">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/u/applications")}
                >
                  以后再说
                </Button>
                <Button onClick={() => navigate("/u/applications")}>
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
              className="flex items-end gap-sm"
            >
              <div className="flex-1 bg-surface-container-lowest border border-ash-veil rounded-2xl p-2 focus-within:border-linghuo-amber transition-all duration-200 ease-out-quart">
                <textarea
                  ref={taRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="点击这里分享你的回答..."
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none px-2 py-1 text-[14px] text-deep-char placeholder:text-warm-ash"
                  style={{ maxHeight: 120 }}
                />
                <div className="flex justify-between items-center px-1 mt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bone-cream-dim text-misty-slate transition-colors"
                      aria-label="语音输入"
                    >
                      <Icon name="mic" size={18} />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bone-cream-dim text-misty-slate transition-colors"
                      aria-label="附图"
                    >
                      <Icon name="image" size={18} />
                    </button>
                  </div>
                  <p className="font-label text-[10px] text-warm-ash">
                    Enter 发送 · Shift + Enter 换行
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || thinking}
                className="w-12 h-12 bg-linghuo-amber rounded-2xl flex items-center justify-center text-white hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all duration-200 ease-out-quart shrink-0"
                aria-label="发送"
              >
                <Icon name="send" size={20} />
              </button>
            </form>
          )}
          <p className="mt-sm text-[10px] text-warm-ash text-center">
            报告仅企业可见，正式资料不会被改写。
          </p>
        </div>
      </Card>

      {/* aside 桌面端独占；移动端隐藏，让面试聚焦 */}
      <aside className="hidden lg:block space-y-lg">
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

function BubbleRow({ turn }: { turn: Turn }) {
  const isUser = turn.role === "user";
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[85%]",
        isUser ? "items-end ml-auto" : "items-start",
      )}
    >
      <span className="font-label text-label text-warm-ash px-1">
        {isUser ? `${turn.timestamp} · 你` : `AI 面试官 · ${turn.timestamp}`}
      </span>
      <div
        className={cn(
          "px-md py-sm rounded-2xl text-[14px] leading-relaxed shadow-ambient-rest",
          isUser
            ? "bg-linghuo-amber text-white rounded-tr-none"
            : "bg-bone-cream-dim border border-ash-veil text-deep-char rounded-tl-none",
        )}
      >
        {turn.text}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex flex-col gap-1 max-w-[85%] items-start">
      <span className="font-label text-label text-warm-ash px-1">
        AI 面试官 · 正在回复
      </span>
      <div className="px-md py-sm rounded-2xl rounded-tl-none bg-bone-cream-dim border border-ash-veil border-dashed flex items-center gap-1.5 h-9">
        <span className="w-1.5 h-1.5 rounded-full bg-linghuo-amber/40 animate-pulse" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-linghuo-amber/40 animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-linghuo-amber/40 animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
