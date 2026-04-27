/**
 * 个人端右上角集成式消息中心面板。
 * spec：
 * - 仅个人端
 * - 不分 Tab，集成式汇总面板
 * - 面板内预览即终点，第一版不提供跳转业务页
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import {
  type MessageItem,
  type MessageKind,
  messageKindMeta,
  userMessages as initialMessages,
} from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const toneClass: Record<MessageKind, string> = {
  invite: "text-linghuo-amber bg-linghuo-amber/10",
  interview: "text-linghuo-amber bg-linghuo-amber/10",
  report: "text-linghuo-amber bg-linghuo-amber/10",
  thread: "text-misty-slate bg-secondary/10",
  system: "text-misty-slate bg-secondary/10",
  announcement: "text-graphite bg-warm-ash/20",
};

export function MessageCenter() {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  useEffect(() => {
    if (!panelOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
        setOpenId(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  const togglePanel = () => {
    setPanelOpen((open) => {
      const next = !open;
      if (!next) setOpenId(null);
      return next;
    });
  };

  const open = (id: string) => {
    setOpenId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  };

  const detail = openId ? messages.find((m) => m.id === openId) ?? null : null;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="消息中心"
        onClick={togglePanel}
        className="relative p-2 rounded-full hover:bg-bone-cream-dim transition-colors"
      >
        <Icon name="mail" className="text-graphite" />
        {unreadCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-linghuo-amber text-white text-[10px] font-bold leading-[18px] text-center border-2 border-bone-cream">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {panelOpen ? (
        <div
          role="dialog"
          aria-label="消息中心面板"
          className={cn(
            "absolute right-0 mt-3 w-[min(90vw,380px)] rounded-2xl border border-ash-veil bg-surface-container-lowest shadow-floating-overlay overflow-hidden z-50",
            "origin-top-right",
          )}
        >
          <header className="flex items-center justify-between px-md py-sm border-b border-ash-veil bg-bone-cream-dim">
            <div>
              <h3 className="font-title text-title text-deep-char">消息中心</h3>
              <p className="text-[11px] text-graphite mt-0.5">
                {detail
                  ? "面板内预览，无需跳转"
                  : `${unreadCount} 条未读 · 共 ${messages.length} 条`}
              </p>
            </div>
            {detail ? (
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="text-[12px] text-misty-slate hover:text-linghuo-amber flex items-center gap-1"
              >
                <Icon name="arrow_back_ios_new" size={14} />
                返回列表
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
                }
                className="text-[12px] text-misty-slate hover:text-linghuo-amber"
              >
                全部已读
              </button>
            )}
          </header>

          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {detail ? (
              <article className="p-md space-y-md">
                <div
                  className={cn(
                    "inline-flex items-center gap-xs rounded-full px-2 py-1",
                    toneClass[detail.kind],
                  )}
                >
                  <Icon
                    name={messageKindMeta[detail.kind].icon}
                    size={14}
                    filled
                  />
                  <span className="text-[11px] font-medium">
                    {messageKindMeta[detail.kind].label}
                  </span>
                </div>
                <div>
                  <h4 className="font-title text-title text-deep-char">
                    {detail.title}
                  </h4>
                  <p className="text-[11px] text-warm-ash mt-1">{detail.time}</p>
                </div>
                <p className="text-body text-on-surface-variant leading-relaxed">
                  {detail.preview}
                </p>
                <p className="text-[11px] text-warm-ash">
                  说明：第一版消息中心仅在面板内预览，不跳转业务页。请前往对应主入口处理。
                </p>
              </article>
            ) : messages.length === 0 ? (
              <div className="px-md py-xl text-center text-graphite">
                <Icon name="forum" className="text-warm-ash" size={28} />
                <p className="mt-sm text-body">这里安静得像清晨。</p>
                <p className="text-[12px] text-warm-ash">
                  企业邀约、面试推进、AI 报告生成会先出现在这里。
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-ash-veil">
                {messages.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => open(m.id)}
                      className="w-full text-left px-md py-sm flex gap-sm hover:bg-bone-cream-dim transition-colors"
                    >
                      <span
                        className={cn(
                          "shrink-0 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full",
                          toneClass[m.kind],
                        )}
                      >
                        <Icon
                          name={messageKindMeta[m.kind].icon}
                          size={16}
                          filled
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-xs">
                          <span className="text-[13px] font-medium text-deep-char truncate">
                            {m.title}
                          </span>
                          {!m.read ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-linghuo-amber shrink-0" />
                          ) : null}
                        </span>
                        <span className="block text-[12px] text-graphite line-clamp-2 mt-0.5">
                          {m.preview}
                        </span>
                        <span className="block text-[11px] text-warm-ash mt-1">
                          {m.time}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
