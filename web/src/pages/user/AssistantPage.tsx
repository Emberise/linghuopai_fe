/**
 * 个人 AI 助手：
 * - 简历解析、画像生成、岗位推荐、通用画像问答
 * - 不承接任务级 AI 面试
 * - 视觉对照 stitch_document_insight_engine/个人端_7_个人ai助手
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { taskHall, type TaskCard } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

interface Bubble {
  id: string;
  from: "ai" | "user";
  text: string;
  hint?: string;
  timestamp: string;
  taskCardIds?: string[];
  followUps?: string[];
}

function nowLabel() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

const initialMessages: Bubble[] = [
  {
    id: "b-1",
    from: "ai",
    text: "你好，我是你的领活派 AI 助手。我可以帮你解析简历、生成专业画像，或者为你推荐最合适的岗位。",
    timestamp: "09:41",
    followUps: [
      "推荐 3 个匹配的远程任务",
      "我最近想多接点插画类任务",
      "帮我看看画像里还差什么",
    ],
  },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<Bubble[]>(initialMessages);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const respond = (content: string) => {
    setPending(true);
    window.setTimeout(() => {
      const wantsTaskRec = /推荐|任务|岗位|工作|远程|插画/.test(content);
      const wantsProfile = /画像|简历|项目|经验|能力/.test(content);
      let reply: Bubble;
      if (wantsTaskRec) {
        const picks = taskHall
          .filter((t) => t.matchScore && t.matchScore >= 88)
          .slice(0, 2);
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "基于你的画像与过往作品，我为你筛选了 2 个高匹配度的任务，发布方都倾向于有相关经验的候选人：",
          timestamp: nowLabel(),
          taskCardIds: picks.map((t) => t.id),
          followUps: ["生成岗位匹配报告", "修改期望薪资"],
        };
      } else if (wantsProfile) {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "我看了一下你的画像，「项目细节」与「最近一次交付」可以再补一点。要现在补，还是先把大致内容告诉我，由我整理草案？",
          hint: "本次回答仅生成草案，不会直接改写正式资料",
          timestamp: nowLabel(),
          followUps: ["让我口述，由你整理", "我自己去补"],
        };
      } else {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "已记录。我会用你刚才说的内容更新草案，你可以在「简历与能力画像」里确认是否写入。",
          hint: "助手只生成草案，是否写入由你确认",
          timestamp: nowLabel(),
        };
      }
      setMessages((m) => [...m, reply]);
      setPending(false);
    }, 700);
  };

  const send = (raw?: string) => {
    const content = (raw ?? text).trim();
    if (!content) return;
    if (content === "查看简历画像") {
      navigate("/u/profile");
      return;
    }
    if (showUpload) setShowUpload(false);
    setMessages((m) => [
      ...m,
      {
        id: `u-${Date.now()}`,
        from: "user",
        text: content,
        timestamp: nowLabel(),
      },
    ]);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
    respond(content);
  };

  const handleUpload = () => {
    setShowUpload(false);
    setMessages((m) => [
      ...m,
      {
        id: `u-${Date.now()}`,
        from: "user",
        text: "已上传简历附件 · 张同学_履历.pdf",
        timestamp: nowLabel(),
      },
      {
        id: `a-${Date.now() + 1}`,
        from: "ai",
        text: "已收到你的简历。我会在后台解析并整理出画像草案，整理完会在「简历与能力画像」里提示你确认。",
        hint: "草案由你确认后才会写入正式资料",
        timestamp: nowLabel(),
        followUps: ["查看简历画像", "推荐几个远程任务"],
      },
    ]);
  };

  return (
    <>
      <div className="max-w-body mx-auto pb-44 md:pb-32">
        <div className="flex items-center gap-sm mb-md">
          <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
            <Icon name="smart_toy" filled size={18} />
          </span>
          <div>
            <h2 className="font-title text-title text-deep-char leading-tight">
              个人 AI 助手
            </h2>
            <p className="text-[11px] text-graphite leading-none mt-0.5">
              不替你做决定，只生成草案
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          {messages.map((m) => (
            <Message
              key={m.id}
              bubble={m}
              onSend={send}
              onTaskClick={(id) => navigate(`/u/tasks/${id}`)}
            />
          ))}

          {showUpload ? (
            <>
              <div className="flex justify-center py-sm">
                <p className="font-label text-label text-warm-ash tracking-widest">
                  尝试上传你的简历以开始分析
                </p>
              </div>
              <UploadCard onUpload={handleUpload} />
            </>
          ) : null}

          {pending ? <TypingDots /> : null}

          <div ref={endRef} />
        </div>
      </div>

      <div className="fixed left-0 right-0 z-30 px-md md:px-lg bottom-[calc(64px+env(safe-area-inset-bottom))] md:bottom-4 pointer-events-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="max-w-body mx-auto bg-bone-cream/85 backdrop-blur-md border border-ash-veil rounded-2xl p-2 flex items-end gap-1 shadow-floating-overlay pointer-events-auto"
        >
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-graphite hover:text-misty-slate rounded-full transition-colors"
            aria-label="附件"
          >
            <Icon name="add_circle" size={22} />
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-graphite hover:text-misty-slate rounded-full transition-colors"
            aria-label="语音输入"
          >
            <Icon name="mic" size={22} />
          </button>
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="输入消息，或询问职业建议..."
            className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 resize-none py-2.5 px-1 font-body text-body text-deep-char placeholder:text-warm-ash"
            style={{ maxHeight: 120 }}
          />
          <button
            type="submit"
            disabled={!text.trim() || pending}
            className="w-10 h-10 bg-misty-slate text-bone-cream rounded-xl flex items-center justify-center transition-transform duration-200 ease-out-quart hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            aria-label="发送"
          >
            <Icon name="arrow_upward" size={20} />
          </button>
        </form>
        <p className="max-w-body mx-auto mt-1 text-center text-[10px] text-warm-ash">
          助手只生成草案，最终是否写入由你决定
        </p>
      </div>
    </>
  );
}

interface MessageProps {
  bubble: Bubble;
  onSend: (text: string) => void;
  onTaskClick: (id: string) => void;
}

function Message({ bubble, onSend, onTaskClick }: MessageProps) {
  const isUser = bubble.from === "user";
  const hasGrid = !isUser && Boolean(bubble.taskCardIds?.length);
  return (
    <div className={cn("flex gap-md items-start", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-10 w-10 rounded-full shrink-0 flex items-center justify-center",
          isUser
            ? "bg-surface-container-high text-deep-char"
            : "bg-misty-slate/15 text-misty-slate",
        )}
        aria-hidden
      >
        <Icon name={isUser ? "person" : "smart_toy"} filled={!isUser} size={20} />
      </div>

      <div
        className={cn(
          "flex flex-col gap-1 min-w-0",
          isUser ? "items-end max-w-[85%]" : "items-start",
          hasGrid ? "flex-1" : "",
        )}
      >
        <div
          className={cn(
            "px-md py-sm rounded-2xl",
            isUser
              ? "bg-linghuo-amber text-white rounded-tr-none"
              : "bg-bone-cream-dim border border-ash-veil text-deep-char rounded-tl-none",
            hasGrid ? "w-full" : "max-w-full",
          )}
        >
          <p className="text-body leading-relaxed whitespace-pre-line">
            {bubble.text}
          </p>
          {bubble.hint ? (
            <p
              className={cn(
                "mt-1 text-[11px]",
                isUser ? "text-white/70" : "text-graphite",
              )}
            >
              {bubble.hint}
            </p>
          ) : null}
          {bubble.taskCardIds?.length ? (
            <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-sm">
              {bubble.taskCardIds
                .map((id) => taskHall.find((t) => t.id === id))
                .filter((t): t is TaskCard => Boolean(t))
                .map((t) => (
                  <TaskMiniCard
                    key={t.id}
                    task={t}
                    onClick={() => onTaskClick(t.id)}
                  />
                ))}
            </div>
          ) : null}
        </div>

        {bubble.followUps?.length ? (
          <div
            className={cn(
              "flex flex-wrap gap-sm mt-1",
              isUser && "justify-end",
            )}
          >
            {bubble.followUps.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onSend(f)}
                className="px-3 py-1.5 bg-bone-cream border border-ash-veil rounded-full font-label text-label text-deep-char hover:bg-bone-cream-dim transition-colors"
              >
                {f}
              </button>
            ))}
          </div>
        ) : null}

        <span className="font-label text-label text-warm-ash px-1">
          {bubble.timestamp}
        </span>
      </div>
    </div>
  );
}

function TaskMiniCard({
  task,
  onClick,
}: {
  task: TaskCard;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-md bg-surface-container-lowest border border-ash-veil rounded-lg flex flex-col justify-between h-40 hover:border-linghuo-amber transition-colors duration-200 ease-out-quart"
    >
      <div>
        <div className="flex justify-between items-start mb-xs gap-2">
          <span className="font-label text-[10px] uppercase tracking-wider text-misty-slate bg-secondary-container px-2 py-0.5 rounded">
            {task.tags[0] ?? "任务"}
          </span>
          <span className="text-linghuo-amber font-title text-[13px] whitespace-nowrap">
            {task.budget}
          </span>
        </div>
        <h4 className="font-title text-body font-medium text-deep-char line-clamp-2 leading-snug">
          {task.title}
        </h4>
        <p className="text-[12px] text-graphite mt-xs line-clamp-1">
          {task.publisher} · {task.budgetType}
        </p>
      </div>
      <span className="font-label text-label text-graphite flex items-center gap-1">
        查看详情
        <Icon name="arrow_forward" size={14} />
      </span>
    </button>
  );
}

function UploadCard({ onUpload }: { onUpload: () => void }) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className="w-full bg-bone-cream border border-dashed border-misty-slate/30 rounded-xl p-xl flex flex-col items-center justify-center gap-md hover:border-misty-slate/60 hover:shadow-ambient-hover transition-all duration-300 ease-out-quart group"
    >
      <div className="w-12 h-12 rounded-full bg-secondary-container text-misty-slate flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ease-out-quart">
        <Icon name="upload_file" size={22} />
      </div>
      <div className="text-center">
        <h3 className="font-title text-title text-deep-char">
          点击或拖拽上传简历
        </h3>
        <p className="font-body text-body text-graphite mt-xs">
          支持 PDF、Word 格式（最大 10MB）
        </p>
      </div>
      <div className="flex gap-sm">
        <span className="px-3 py-1 bg-ash-veil rounded-full font-label text-label text-graphite">
          快速解析
        </span>
        <span className="px-3 py-1 bg-ash-veil rounded-full font-label text-label text-graphite">
          画像匹配
        </span>
      </div>
    </button>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-md items-start">
      <span className="h-10 w-10 shrink-0 rounded-full bg-misty-slate/15 text-misty-slate flex items-center justify-center">
        <Icon name="smart_toy" filled size={20} />
      </span>
      <div className="px-md py-sm rounded-2xl rounded-tl-none bg-bone-cream-dim border border-ash-veil flex items-center gap-1.5 h-9">
        <span className="w-1.5 h-1.5 rounded-full bg-graphite/70 animate-pulse" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-graphite/70 animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-graphite/70 animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
