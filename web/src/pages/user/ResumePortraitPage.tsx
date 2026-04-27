/**
 * 简历与能力画像（合并页）
 * - 基础资料、简历、画像、AI 助手补全草案待确认区
 * - 简历仅 PDF / Word
 */
import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { useAuth } from "@/shared/auth/store";

const skills = [
  { name: "UI 设计", level: "High", color: "linghuo-amber" },
  { name: "交互设计", level: "Mid-High", color: "linghuo-amber" },
  { name: "插画 / 视觉", level: "Mid", color: "misty-slate" },
  { name: "前端协作", level: "Mid", color: "misty-slate" },
  { name: "需求沟通", level: "High", color: "misty-slate" },
];

const projects = [
  {
    name: "WarmLight 设计系统重构",
    period: "2025.10 — 至今",
    desc: "主导组件库 token 化迁移，整理跨端规范，配合工程团队建立 Storybook。",
  },
  {
    name: "Bento 风格作品集",
    period: "2025.06 — 2025.09",
    desc: "为活动品牌设计 12 张主插画 + 配套图标，参与营销侧整体节奏设计。",
  },
];

const draftFromAI = {
  field: "项目经验",
  preview:
    "你最近完成了一个企业内刊插画项目，建议把它加入项目经验，并补充：风格参考（克制暖橙）+ 交付周期（2 周）+ 客户类型（中小型科技公司）。",
};

export function ResumePortraitPage() {
  const { session } = useAuth();
  const nickname = session?.realm === "user" ? session.nickname : "陈领活";
  const completeness =
    session?.realm === "user" ? session.resumeCompleteness : 92;
  const [hasResume, setHasResume] = useState(true);
  const [draftAccepted, setDraftAccepted] = useState(false);

  return (
    <div className="space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <h2 className="font-headline text-headline text-deep-char">
            简历与能力画像
          </h2>
          <p className="text-graphite text-[13px] mt-xs">
            一切资料都在这里。AI 帮你不停补全画像，最终是否写入仍由你决定。
          </p>
        </div>
        <div className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm flex items-center gap-md">
          <div>
            <p className="text-[11px] text-warm-ash">资料完整度</p>
            <p className="font-headline text-[20px] text-deep-char">
              {completeness}%
            </p>
          </div>
          <div className="w-32 h-1.5 bg-ash-veil rounded-full overflow-hidden">
            <div
              className="h-full bg-linghuo-amber transition-all duration-500 ease-out-quart"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="p-lg lg:col-span-2 space-y-lg">
          {/* 基础资料 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char">基础资料</h3>
              <button
                type="button"
                className="text-[12px] text-linghuo-amber hover:underline"
              >
                编辑
              </button>
            </header>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-md text-[13px]">
              {[
                { k: "昵称", v: nickname },
                { k: "城市", v: "杭州 · 滨江" },
                { k: "行业", v: "设计 / 视觉" },
                { k: "经验", v: "5 年" },
                { k: "可服务时段", v: "工作日 19:00 后 + 周末" },
                { k: "状态", v: "可接单" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="text-[11px] text-warm-ash">{item.k}</dt>
                  <dd className="text-deep-char font-medium mt-1">{item.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 简历 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char">简历</h3>
              <Badge tone="amber">仅支持 PDF / Word</Badge>
            </header>
            {hasResume ? (
              <div className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-md flex items-center gap-md">
                <span className="h-10 w-10 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                  <Icon name="picture_as_pdf" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-deep-char font-medium truncate">
                    chen-linghuo-resume-2026.pdf
                  </p>
                  <p className="text-[11px] text-warm-ash mt-0.5">
                    上传于 2026-04-20 · 1.8 MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasResume(false)}
                  className="text-[12px] text-graphite hover:text-error flex items-center gap-1"
                >
                  <Icon name="delete_outline" size={16} />
                  移除
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setHasResume(true)}
                className="w-full border-2 border-dashed border-ash-veil rounded-lg px-md py-lg text-graphite hover:bg-bone-cream-dim transition-colors flex flex-col items-center gap-xs"
              >
                <Icon name="upload_file" size={28} />
                <p className="text-[13px] font-medium">点击上传简历（PDF / Word）</p>
                <p className="text-[11px] text-warm-ash">
                  上传后 AI 自动解析，画像在右侧可见
                </p>
              </button>
            )}
          </section>

          {/* 项目经验 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char">
                项目经验
              </h3>
              <button
                type="button"
                className="text-[12px] text-linghuo-amber hover:underline"
              >
                添加项目
              </button>
            </header>
            <ul className="space-y-md">
              {projects.map((p) => (
                <li
                  key={p.name}
                  className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-md"
                >
                  <p className="font-medium text-deep-char">{p.name}</p>
                  <p className="text-[11px] text-warm-ash mt-0.5">{p.period}</p>
                  <p className="text-[13px] text-graphite mt-xs leading-relaxed">
                    {p.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </Card>

        <div className="space-y-lg">
          {/* AI 能力画像 */}
          <Card tone="warm" className="p-lg">
            <header className="flex items-center gap-sm mb-md">
              <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="auto_awesome" filled size={18} />
              </span>
              <h3 className="font-title text-title text-deep-char">
                AI 能力画像
              </h3>
            </header>
            <ul className="space-y-sm">
              {skills.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="text-[13px] text-deep-char">{s.name}</span>
                  <Badge
                    tone={s.color === "linghuo-amber" ? "amber" : "slate"}
                  >
                    {s.level}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-md text-[11px] text-warm-ash leading-relaxed">
              画像每次面试或资料更新时由 AI 自动刷新；目前仅展示，不提供「立即刷新」按钮。
            </p>
          </Card>

          {/* AI 助手草案 */}
          <Card className="p-lg">
            <header className="flex items-center gap-sm mb-md">
              <span className="h-9 w-9 rounded-lg bg-misty-slate/10 text-misty-slate flex items-center justify-center">
                <Icon name="smart_toy" size={18} />
              </span>
              <h3 className="font-title text-title text-deep-char">
                AI 助手为你写了一段草案
              </h3>
            </header>
            <p className="text-[12px] text-graphite mb-xs">
              针对 <span className="font-medium text-deep-char">{draftFromAI.field}</span>
            </p>
            <p className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm text-[13px] text-deep-char leading-relaxed">
              {draftFromAI.preview}
            </p>
            <div className="mt-md flex gap-sm">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setDraftAccepted(true)}
                disabled={draftAccepted}
              >
                <Icon name="check" size={16} />
                {draftAccepted ? "已写入资料" : "确认写入"}
              </Button>
              <Button size="sm" variant="ghost">
                先放着
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
