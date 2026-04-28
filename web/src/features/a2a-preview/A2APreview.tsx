/**
 * A2A 配对预演组件
 *
 * spec 第 10.5 节「Agent × Agent 双向实时撮合」的 V1 mock 实现：
 * 双 Agent 头像 / 对话气泡 / 流式打字 / 撮合进度条 / 数据可视化 / 总结卡。
 *
 * 演示语义：聚合候选人池（platform Agent 雾灰青）vs 单岗位（enterprise Agent 领活橙）
 * 全 CSS keyframe + setTimeout / requestAnimationFrame 实现，不引 lottie-react。
 *
 * 大屏独立 URL / 音效 / 降级 / 1000 并发节流推迟到下版本。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import {
  type A2ADialogue,
  a2aPreviewScripts,
  enterpriseJobs,
} from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

interface A2APreviewProps {
  jobId: string;
  onExit: () => void;
}

interface RenderedTurn extends A2ADialogue {
  visible: string;
  complete: boolean;
}

const TYPE_SPEED_MS = 35;
const TURN_PAUSE_MS = 600;

export function A2APreview({ jobId, onExit }: A2APreviewProps) {
  const script = useMemo(
    () =>
      a2aPreviewScripts.find((s) => s.jobId === jobId) ?? a2aPreviewScripts[0],
    [jobId],
  );
  const job = enterpriseJobs.find((j) => j.id === script.jobId);

  const [turns, setTurns] = useState<RenderedTurn[]>([]);
  const [done, setDone] = useState(false);
  const cancelRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cancelRef.current = false;
    setTurns([]);
    setDone(false);

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        // 不收集 timer：cancelRef 早于 timer 触发即可终止
        void id;
      });

    const typewriter = (full: string) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const tick = () => {
          if (cancelRef.current) {
            resolve();
            return;
          }
          i += 1;
          setTurns((prev) => {
            if (prev.length === 0) return prev;
            const copy = [...prev];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, visible: full.slice(0, i) };
            return copy;
          });
          if (i < full.length) {
            window.setTimeout(tick, TYPE_SPEED_MS);
          } else {
            resolve();
          }
        };
        tick();
      });

    (async () => {
      for (const turn of script.dialogue) {
        if (cancelRef.current) return;
        setTurns((prev) => [
          ...prev,
          { ...turn, visible: "", complete: false },
        ]);
        await typewriter(turn.text);
        if (cancelRef.current) return;
        setTurns((prev) => {
          if (prev.length === 0) return prev;
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, complete: true };
          return copy;
        });
        await sleep(TURN_PAUSE_MS);
      }
      if (!cancelRef.current) setDone(true);
    })();

    return () => {
      cancelRef.current = true;
    };
  }, [script.jobId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, done]);

  // 进度推断：根据已完成对话条数 + done 状态映射到 0/30/70/100
  const progressPct = useMemo(() => {
    if (done) return 100;
    const completed = turns.filter((t) => t.complete).length;
    const total = script.dialogue.length;
    if (completed === 0) return 0;
    if (completed < Math.ceil(total / 3)) return 30;
    if (completed < Math.ceil((total * 2) / 3)) return 70;
    return 90;
  }, [turns, done, script.dialogue.length]);

  // 数据可视化：每个数字独立递增，按里程碑触发
  const scanned = useCountUp(script.scan.total, 1200, progressPct >= 30);
  const matched = useCountUp(script.scan.matched, 1200, progressPct >= 70);
  const topN = useCountUp(script.scan.topN, 1200, progressPct >= 100);

  const skip = () => {
    cancelRef.current = true;
    setTurns(
      script.dialogue.map((d) => ({ ...d, visible: d.text, complete: true })),
    );
    setDone(true);
  };

  return (
    <div className="relative">
      {/* 顶部 header：双 Agent 对照 + 操作 */}
      <header className="mb-lg flex flex-col gap-md">
        <div className="flex items-center justify-between gap-sm">
          <span className="font-label text-label text-warm-ash uppercase tracking-widest">
            Agent × Agent · 配对预演
          </span>
          <div className="flex gap-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={skip}
              disabled={done}
              aria-label="跳过预演"
            >
              <Icon name="skip_next" size={16} />
              跳过
            </Button>
            <Button variant="secondary" size="sm" onClick={onExit}>
              <Icon name="arrow_back" size={16} />
              返回助手
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-md">
          <AgentHeaderCard
            role="platform"
            title="平台 Agent"
            subtitle={`候选人池 · ${script.poolSize} 人在场`}
          />
          <div className="hidden md:flex items-center justify-center text-graphite">
            <Icon name="sync_alt" size={28} />
          </div>
          <AgentHeaderCard
            role="enterprise"
            title="企业 Agent"
            subtitle={job ? `${job.title} · ${job.salary}` : "招聘代表"}
          />
        </div>
      </header>

      {/* 对话流 + 数据可视化 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="lg:col-span-2 p-lg space-y-md min-h-[360px]">
          {turns.length === 0 ? (
            <p className="text-[12px] text-warm-ash">两位 Agent 正在握手…</p>
          ) : null}
          {turns.map((t, i) => (
            <DialogueTurn
              key={i}
              turn={t}
              streaming={!t.complete && i === turns.length - 1}
            />
          ))}
          <div ref={endRef} />
        </Card>

        <aside className="space-y-md">
          <StatCard
            label="已扫描候选人"
            value={scanned}
            active={progressPct >= 30}
            tone="slate"
            icon="search"
          />
          <StatCard
            label="命中核心条件"
            value={matched}
            active={progressPct >= 70}
            tone="slate"
            icon="filter_alt"
          />
          <StatCard
            label="推荐 Top N"
            value={topN}
            active={progressPct >= 100}
            tone="amber"
            icon="emoji_events"
          />
          <ProgressBar pct={progressPct} done={done} />
        </aside>
      </div>

      {/* 总结卡：done 后渐显 */}
      {done ? (
        <Card className="mt-lg p-lg space-y-md transition-opacity duration-500 ease-out-quart">
          <header className="flex items-center gap-sm">
            <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
              <Icon name="auto_awesome" filled size={18} />
            </span>
            <div>
              <h3 className="font-title text-title text-deep-char">
                撮合完成 · 一份联合摘要
              </h3>
              <p className="text-[11px] text-graphite">
                由两位 Agent 协商总结，不会替你做决定
              </p>
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <SummaryCol
              tone="amber"
              title="匹配点"
              icon="check_circle"
              items={script.summary.matches}
            />
            <SummaryCol
              tone="slate"
              title="分歧点"
              icon="error"
              items={script.summary.gaps}
            />
            <SummaryCol
              tone="graphite"
              title="建议"
              icon="lightbulb"
              items={script.summary.suggestions}
            />
          </div>
        </Card>
      ) : null}

      {/* 100% 时的彩带 */}
      {done ? <Confetti /> : null}
    </div>
  );
}

/* -------------------------------- helpers -------------------------------- */

function useCountUp(target: number, durationMs: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      setValue(Math.round(easeOut(t) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return value;
}

function AgentHeaderCard({
  role,
  title,
  subtitle,
}: {
  role: "platform" | "enterprise";
  title: string;
  subtitle: string;
}) {
  const isPlatform = role === "platform";
  return (
    <div
      className={cn(
        "p-md rounded-xl border flex items-center gap-md",
        isPlatform
          ? "bg-bone-cream-dim border-misty-slate/20"
          : "bg-linghuo-amber/5 border-linghuo-amber/20",
      )}
    >
      <span
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
          isPlatform
            ? "bg-misty-slate/15 text-misty-slate"
            : "bg-linghuo-amber/15 text-linghuo-amber",
        )}
      >
        <Icon name="smart_toy" filled size={26} />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "font-title text-[14px] font-medium",
            isPlatform ? "text-deep-char" : "text-deep-char",
          )}
        >
          {title}
        </p>
        <p className="text-[11px] text-graphite truncate">{subtitle}</p>
      </div>
    </div>
  );
}

function DialogueTurn({
  turn,
  streaming,
}: {
  turn: RenderedTurn;
  streaming: boolean;
}) {
  const isPlatform = turn.from === "platform";
  return (
    <div
      className={cn(
        "flex items-start gap-sm",
        isPlatform ? "justify-start" : "flex-row-reverse",
      )}
    >
      <span
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
          isPlatform
            ? "bg-misty-slate/15 text-misty-slate"
            : "bg-linghuo-amber/15 text-linghuo-amber",
        )}
      >
        <Icon name="smart_toy" filled size={18} />
      </span>
      <div
        className={cn(
          "max-w-[80%] px-md py-sm rounded-2xl",
          isPlatform
            ? "bg-bone-cream-dim border border-ash-veil rounded-tl-none text-deep-char"
            : "bg-linghuo-amber/10 border border-linghuo-amber/20 rounded-tr-none text-deep-char",
        )}
      >
        <p
          className={cn(
            "text-[14px] leading-relaxed whitespace-pre-line",
            streaming && "a2a-cursor",
          )}
        >
          {turn.visible}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  active,
  tone,
  icon,
}: {
  label: string;
  value: number;
  active: boolean;
  tone: "amber" | "slate";
  icon: string;
}) {
  return (
    <Card
      className={cn(
        "p-md transition-opacity duration-500 ease-out-quart",
        active ? "opacity-100" : "opacity-50",
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            tone === "amber"
              ? "bg-linghuo-amber/10 text-linghuo-amber"
              : "bg-bone-cream-dim text-misty-slate",
          )}
        >
          <Icon name={icon} size={16} />
        </span>
        <span className="text-[10px] text-warm-ash uppercase tracking-widest">
          {active ? "Live" : "待开始"}
        </span>
      </header>
      <p
        className={cn(
          "mt-md font-headline text-[24px] tabular-nums",
          tone === "amber" ? "text-linghuo-amber" : "text-deep-char",
        )}
      >
        {value.toLocaleString()}
      </p>
      <p className="text-[12px] text-graphite mt-1">{label}</p>
    </Card>
  );
}

function ProgressBar({ pct, done }: { pct: number; done: boolean }) {
  const milestone = done ? 100 : pct;
  return (
    <Card className="p-md space-y-sm">
      <div className="flex items-center justify-between text-[11px] text-graphite">
        <span className="uppercase tracking-widest text-warm-ash">
          撮合进度
        </span>
        <span className="font-bold text-deep-char tabular-nums">
          {milestone}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-bone-cream-dim overflow-hidden">
        <div
          className="h-full rounded-full bg-linghuo-amber transition-all duration-700 ease-out-quart"
          style={{ width: `${milestone}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-warm-ash uppercase tracking-widest">
        <span className={milestone >= 30 ? "text-misty-slate" : ""}>
          硬指标
        </span>
        <span className={milestone >= 70 ? "text-misty-slate" : ""}>
          软指标
        </span>
        <span className={milestone >= 100 ? "text-linghuo-amber" : ""}>
          Top N
        </span>
      </div>
    </Card>
  );
}

function SummaryCol({
  tone,
  title,
  icon,
  items,
}: {
  tone: "amber" | "slate" | "graphite";
  title: string;
  icon: string;
  items: string[];
}) {
  const colorMap = {
    amber: "text-linghuo-amber bg-linghuo-amber/10",
    slate: "text-misty-slate bg-bone-cream-dim",
    graphite: "text-graphite bg-bone-cream-dim",
  } as const;
  return (
    <div className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
      <header className="flex items-center gap-sm mb-sm">
        <span
          className={cn(
            "h-7 w-7 rounded-md flex items-center justify-center",
            colorMap[tone],
          )}
        >
          <Icon name={icon} size={14} filled />
        </span>
        <h4 className="font-title text-[13px] font-medium text-deep-char">
          {title}
        </h4>
      </header>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="text-[12px] text-graphite leading-relaxed">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Confetti() {
  // 12 个粒子，水平随机分布，颜色在领活橙 / 雾灰青 / 暖白之间
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: 8 + ((i * 8) % 92),
        delay: (i % 6) * 90,
        color: ["#EA5614", "#4A616F", "#FFD9C9"][i % 3],
        size: 6 + (i % 3) * 2,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-4 h-32 overflow-visible z-10">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="animate-confetti-fall absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
