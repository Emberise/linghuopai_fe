/**
 * 企业端 AI 助手：
 * - 双气泡聊天 UI（仿个人端 AssistantPage）
 * - 承担 JD 优化、候选人对比、A2A 配对预演入口
 * - mode: 'chat' | 'preview' 切换；'preview' 时整页切到 A2APreview
 *
 * spec 第 10.5 节 A2A 落地：「实现时只在「撮合页」出现」→
 * preview mode 即「撮合页」语义，关闭后回主流程，不挤占常规交互。
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import {
  enterpriseCandidates,
  enterpriseJobs,
  type CandidateItem,
} from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";
import { A2APreview } from "@/features/a2a-preview/A2APreview";

interface Bubble {
  id: string;
  from: "ai" | "user";
  text: string;
  hint?: string;
  timestamp: string;
  candidateIds?: string[];
  followUps?: string[];
  ctaA2A?: boolean; // 是否在气泡末尾加「启动 Agent 配对预演」CTA 按钮
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
    text: "你好，我是你的招聘助手。可以帮你优化 JD、对比候选人，或者启动一次 Agent 配对预演看看撮合过程。",
    timestamp: "09:41",
    followUps: [
      "对比当前 3 位候选人",
      "优化我的 JD 表述",
      "启动 Agent 配对预演",
      "最近候选人质量怎么样",
    ],
  },
];

export function EnterpriseAssistantPage() {
  const [mode, setMode] = useState<"chat" | "preview">("chat");
  const [previewJobId, setPreviewJobId] = useState<string>("j-001");
  const [messages, setMessages] = useState<Bubble[]>(initialMessages);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  if (mode === "preview") {
    return (
      <A2APreview jobId={previewJobId} onExit={() => setMode("chat")} />
    );
  }

  const startPreview = (jobId: string) => {
    setPreviewJobId(jobId);
    setMode("preview");
  };

  const respond = (content: string) => {
    setPending(true);
    window.setTimeout(() => {
      const wantsJD = /JD|润色|优化|招聘描述|岗位描述/i.test(content);
      const wantsCompare = /对比|候选人|候选|筛选|看看候选/.test(content);
      const wantsA2A = /Agent|配对|预演|撮合|演示/.test(content);
      const wantsQuality = /质量|数据|看板|本周|趋势/.test(content);
      let reply: Bubble;
      if (wantsA2A) {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "我会让平台 Agent 与企业 Agent 现场协商，一起从候选人池里挑出 Top 5。耗时约 15 秒，可随时跳过。",
          timestamp: nowLabel(),
          ctaA2A: true,
        };
      } else if (wantsCompare) {
        const picks = enterpriseCandidates
          .filter((c) => c.stage === "REPORT_GENERATED" || c.stage === "IN_PROCESS")
          .slice(0, 3);
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "我帮你把当前进入处理阶段的 3 位候选人列出来，点击可以直接进入候选人列表查看完整 AI 报告。",
          timestamp: nowLabel(),
          candidateIds: picks.map((c) => c.id),
          followUps: ["启动 Agent 配对预演", "把 Top 候选人加入邀约队列"],
        };
      } else if (wantsJD) {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "JD 优化建议我已经汇总到岗位发布页右侧的「AI 优化建议」aside 里。你直接去那里，可以一边看建议一边改。",
          hint: "草案由你确认后才会写入正式岗位",
          timestamp: nowLabel(),
          followUps: ["去岗位发布页", "启动 Agent 配对预演"],
        };
      } else if (wantsQuality) {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "本周已生成 12 份 AI 报告，匹配准确度 94%、候选人质量评分 8.2 / 10。要看明细可以去工作台的 AI 数据看板。",
          timestamp: nowLabel(),
          followUps: ["对比当前 3 位候选人", "启动 Agent 配对预演"],
        };
      } else {
        reply = {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "已记录。我会在下次刷新候选人列表 / 岗位看板时把你这次的偏好考虑进去。",
          hint: "助手只生成草案，是否落到正式动作由你确认",
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
    if (content === "去岗位发布页") {
      navigate("/b/jobs/new");
      return;
    }
    if (content === "把 Top 候选人加入邀约队列") {
      navigate("/b/candidates");
      return;
    }
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

  return (
    <>
      <div className="max-w-body mx-auto pb-44 md:pb-32">
        <div className="flex items-center gap-sm mb-md">
          <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
            <Icon name="smart_toy" filled size={18} />
          </span>
          <div>
            <h2 className="font-title text-title text-deep-char leading-tight">
              企业 AI 助手
            </h2>
            <p className="text-[11px] text-graphite leading-none mt-0.5">
              JD 优化 / 候选人对比 / Agent 配对预演
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          {messages.map((m) => (
            <Message
              key={m.id}
              bubble={m}
              onSend={send}
              onCandidateClick={() => navigate("/b/candidates")}
              onStartPreview={() => startPreview("j-001")}
            />
          ))}

          {pending ? <TypingDots /> : null}

          <div ref={endRef} />
        </div>
      </div>

      <div className="fixed left-0 right-0 z-30 px-md md:px-lg bottom-4 md:bottom-4 pointer-events-none">
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
            placeholder="问问助手，比如「对比候选人」「启动 Agent 配对预演」..."
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
          助手只生成草案，最终是否落到岗位 / 候选人动作由你确认
        </p>
      </div>
    </>
  );
}

interface MessageProps {
  bubble: Bubble;
  onSend: (text: string) => void;
  onCandidateClick: (id: string) => void;
  onStartPreview: () => void;
}

function Message({
  bubble,
  onSend,
  onCandidateClick,
  onStartPreview,
}: MessageProps) {
  const isUser = bubble.from === "user";
  const hasGrid = !isUser && Boolean(bubble.candidateIds?.length);
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
          {bubble.candidateIds?.length ? (
            <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-sm">
              {bubble.candidateIds
                .map((id) => enterpriseCandidates.find((c) => c.id === id))
                .filter((c): c is CandidateItem => Boolean(c))
                .map((c) => (
                  <CandidateMiniCard
                    key={c.id}
                    candidate={c}
                    onClick={() => onCandidateClick(c.id)}
                  />
                ))}
            </div>
          ) : null}
          {bubble.ctaA2A ? (
            <button
              type="button"
              onClick={onStartPreview}
              className="mt-md w-full py-2 rounded-lg bg-linghuo-amber text-white font-medium text-[14px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ease-out-quart flex items-center justify-center gap-2"
            >
              <Icon name="play_arrow" filled size={18} />
              启动 Agent 配对预演
            </button>
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

function CandidateMiniCard({
  candidate,
  onClick,
}: {
  candidate: CandidateItem;
  onClick: () => void;
}) {
  const job = enterpriseJobs.find((j) => j.id === candidate.jobId);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-md bg-surface-container-lowest border border-ash-veil rounded-lg flex flex-col justify-between h-40 hover:border-linghuo-amber transition-colors duration-200 ease-out-quart"
    >
      <div>
        <div className="flex justify-between items-start mb-xs gap-2">
          <span className="font-label text-[10px] uppercase tracking-wider text-misty-slate bg-secondary-container px-2 py-0.5 rounded">
            {job?.title.slice(0, 10) ?? "候选人"}
          </span>
          <span className="text-linghuo-amber font-title text-[13px] whitespace-nowrap">
            {candidate.matchScore}%
          </span>
        </div>
        <h4 className="font-title text-body font-medium text-deep-char line-clamp-1 leading-snug">
          {candidate.name}
        </h4>
        <p className="text-[12px] text-graphite mt-xs line-clamp-2">
          {candidate.highlight}
        </p>
      </div>
      <span className="font-label text-label text-graphite flex items-center gap-1">
        查看报告
        <Icon name="arrow_forward" size={14} />
      </span>
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
