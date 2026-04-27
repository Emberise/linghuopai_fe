/**
 * 个人 AI 助手：
 * - 简历解析、画像生成、岗位推荐、通用画像问答
 * - 不承接任务级 AI 面试
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";

interface Bubble {
  id: string;
  from: "ai" | "user";
  text: string;
  hint?: string;
}

const initial: Bubble[] = [
  {
    id: "b-1",
    from: "ai",
    text: "你好，我是你的领活派 AI 助手。我可以帮你解析简历、补全画像、找匹配任务。要不要先告诉我，你最近在思考哪类机会？",
    hint: "通用画像问答 · 跨任务复用",
  },
];

const quickPrompts = [
  "帮我补全简历里的项目经验",
  "推荐 3 个我可以接的远程任务",
  "我最近想多接点插画类任务",
  "帮我看看画像里还差什么",
];

export function AssistantPage() {
  const [messages, setMessages] = useState<Bubble[]>(initial);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (raw?: string) => {
    const content = (raw ?? text).trim();
    if (!content) return;
    const userMessage: Bubble = {
      id: `u-${Date.now()}`,
      from: "user",
      text: content,
    };
    setMessages((m) => [...m, userMessage]);
    setText("");
    setPending(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          from: "ai",
          text: "已记录。我会用你刚才说的内容更新草案，你可以在「简历与能力画像」里确认是否写入。",
          hint: "本次回答仅生成草案，不会直接改写正式资料。",
        },
      ]);
      setPending(false);
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <Card className="lg:col-span-2 flex flex-col h-[70vh]">
        <header className="px-lg py-md border-b border-ash-veil flex items-center gap-sm">
          <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
            <Icon name="smart_toy" filled size={18} />
          </span>
          <div>
            <h2 className="font-title text-title text-deep-char">个人 AI 助手</h2>
            <p className="text-[11px] text-graphite">
              不替你做决定，但可以一路陪你补完资料
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-lg py-md space-y-md no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-sm",
                m.from === "user" ? "justify-end" : "justify-start",
              )}
            >
              {m.from === "ai" ? (
                <span className="h-8 w-8 shrink-0 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                  <Icon name="smart_toy" size={16} filled />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[75%] px-md py-sm rounded-2xl",
                  m.from === "ai"
                    ? "bg-bone-cream-dim border border-ash-veil text-deep-char"
                    : "bg-linghuo-amber text-white",
                )}
              >
                <p className="text-[14px] leading-relaxed">{m.text}</p>
                {m.hint ? (
                  <p className="mt-1 text-[11px] opacity-70">{m.hint}</p>
                ) : null}
              </div>
            </div>
          ))}
          {pending ? (
            <div className="flex gap-sm">
              <span className="h-8 w-8 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="smart_toy" size={16} filled />
              </span>
              <div className="px-md py-sm rounded-2xl bg-bone-cream-dim border border-ash-veil text-graphite text-[12px]">
                正在思考…
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="px-lg pb-md pt-sm border-t border-ash-veil space-y-sm">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="px-md h-8 rounded-full bg-bone-cream-dim border border-ash-veil text-[12px] text-graphite hover:bg-surface-container-low"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-sm"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="说点什么，比如「我最近作品集多了一组插画」"
              className="flex-1 h-11 px-md rounded-lg bg-bone-cream-dim border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none"
            />
            <Button type="submit" disabled={!text.trim() || pending}>
              <Icon name="send" size={16} />
              发送
            </Button>
          </form>
          <p className="text-[11px] text-warm-ash">
            助手不直接改写正式资料；它只生成草案，确认权一直在你这里。
          </p>
        </div>
      </Card>

      <aside className="space-y-lg">
        <Card tone="warm" className="p-lg">
          <h3 className="font-title text-title text-deep-char">能做的事</h3>
          <ul className="mt-md space-y-sm text-[13px] text-graphite">
            {[
              { i: "description", t: "解析简历内容并生成画像" },
              { i: "auto_awesome", t: "通用画像问答补齐缺口" },
              { i: "task", t: "推荐符合你方向的任务" },
            ].map((r) => (
              <li key={r.i} className="flex items-start gap-sm">
                <Icon name={r.i} size={16} className="text-linghuo-amber mt-0.5" />
                <span>{r.t}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-lg">
          <h3 className="font-title text-title text-deep-char">不做的事</h3>
          <ul className="mt-md space-y-sm text-[13px] text-graphite">
            <li className="flex items-start gap-sm">
              <Icon name="block" size={16} className="text-warm-ash mt-0.5" />
              不直接改写正式资料
            </li>
            <li className="flex items-start gap-sm">
              <Icon name="block" size={16} className="text-warm-ash mt-0.5" />
              不替你启动任务级 AI 面试
            </li>
            <li className="flex items-start gap-sm">
              <Icon name="block" size={16} className="text-warm-ash mt-0.5" />
              不查看其他人的画像或报告
            </li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}
