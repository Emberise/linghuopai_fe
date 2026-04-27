/**
 * 简历与能力画像（合并页）：对照 stitch 个人端_5
 * - 头像 + 1 行人物标签
 * - AI 能力画像 = SVG 雷达 + 技能 chip 云
 * - 简历管理：主投递简历 + 添加多版本
 * - AI 资料优化建议：暖色完整描边卡（避免 border-l 侧条）
 */
import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { RadarPolygon } from "@/shared/ui/RadarPolygon";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";

const radarAxes = [
  { label: "创新力", value: 0.78 },
  { label: "执行效率", value: 0.92 },
  { label: "沟通协调", value: 0.66 },
  { label: "专业广度", value: 0.74 },
  { label: "抗压性", value: 0.84 },
];

const skillChips = [
  { name: "UI/UX Design", primary: false },
  { name: "Tailwind CSS", primary: true },
  { name: "Project Mgmt", primary: false },
  { name: "AI Prompting", primary: false },
  { name: "Brand Identity", primary: false },
  { name: "Python", primary: false, slate: true },
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

export function ResumePortraitPage() {
  const { session } = useAuth();
  const nickname = session?.realm === "user" ? session.nickname : "陈领活";
  const completeness =
    session?.realm === "user" ? session.resumeCompleteness : 92;
  const [hasResume, setHasResume] = useState(true);
  const [draftAccepted, setDraftAccepted] = useState(false);

  return (
    <div className="space-y-lg">
      {/* 个人头部 */}
      <Card tone="warm" className="p-lg flex flex-col md:flex-row md:items-center gap-md">
        <div className="relative h-20 w-20 shrink-0 rounded-full bg-bone-cream-dim border border-linghuo-amber/40 p-0.5">
          <div className="h-full w-full rounded-full bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center font-headline text-[24px]">
            {nickname.slice(0, 1)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-sm">
            <h2 className="font-headline text-headline text-deep-char">
              {nickname}
            </h2>
            <Badge tone="amber">Lv.4 资深协作客</Badge>
          </div>
          <p className="text-graphite text-[13px] mt-xs">
            全栈设计师 / 数字化游民 / 摄影爱好者
          </p>
          <div className="flex flex-wrap gap-md mt-sm text-[12px] text-misty-slate">
            <span className="flex items-center gap-1">
              <Icon name="location_on" size={14} />
              上海
            </span>
            <span className="flex items-center gap-1">
              <Icon name="verified_user" size={14} />
              身份已认证
            </span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" size={14} />
              工作日 19:00 后 + 周末
            </span>
          </div>
        </div>
        <div className="md:w-44 shrink-0 bg-surface-container-lowest border border-ash-veil rounded-lg px-md py-sm">
          <p className="text-[11px] text-warm-ash">资料完整度</p>
          <div className="flex items-baseline gap-xs">
            <p className="font-headline text-[20px] text-deep-char">
              {completeness}%
            </p>
            <span className="text-[11px] text-misty-slate">领先 85%</span>
          </div>
          <div className="mt-2 h-1.5 bg-ash-veil rounded-full overflow-hidden">
            <div
              className="h-full bg-linghuo-amber transition-all duration-500 ease-out-quart"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </Card>

      {/* AI 能力画像（雷达 + 技能 chip） */}
      <section className="space-y-md">
        <header className="flex items-center justify-between">
          <h3 className="font-title text-title text-deep-char flex items-center gap-2">
            <Icon name="auto_awesome" filled className="text-linghuo-amber" />
            AI 能力画像
          </h3>
          <span className="text-[11px] text-graphite">
            最后更新: 今日 10:24
          </span>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <Card className="md:col-span-2 p-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #EA5614 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <RadarPolygon axes={radarAxes} size={240} />
            <div className="mt-lg text-center">
              <p className="text-[14px] font-medium text-deep-char">
                “高适应性的跨学科专家”
              </p>
              <p className="text-[12px] text-graphite mt-1">
                在复杂多变的任务环境中表现优异
              </p>
            </div>
          </Card>

          <Card tone="warm" className="p-lg space-y-md">
            <h4 className="text-[12px] font-bold text-deep-char uppercase tracking-widest">
              核心技能标签
            </h4>
            <div className="flex flex-wrap gap-sm">
              {skillChips.map((chip) => (
                <span
                  key={chip.name}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors",
                    chip.primary
                      ? "bg-linghuo-amber text-white border-transparent"
                      : chip.slate
                        ? "bg-secondary-container text-on-secondary-container border-transparent"
                        : "bg-surface-container-lowest text-deep-char border-ash-veil hover:border-linghuo-amber",
                  )}
                >
                  {chip.name}
                </span>
              ))}
            </div>
            <div className="pt-md border-t border-ash-veil">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-graphite">匹配度评分</span>
                <span className="text-linghuo-amber font-bold">92%</span>
              </div>
              <div className="h-1.5 bg-ash-veil rounded-full overflow-hidden">
                <div
                  className="h-full bg-linghuo-amber"
                  style={{ width: "92%" }}
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 资料 + 简历 + 项目 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="p-lg lg:col-span-2 space-y-lg">
          {/* 基础资料 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char">基础资料</h3>
              <button type="button" className="text-[12px] text-primary hover:underline">
                编辑
              </button>
            </header>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-md text-[13px]">
              {[
                { k: "昵称", v: nickname },
                { k: "城市", v: "上海" },
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

          {/* 简历管理 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char flex items-center gap-2">
                <Icon name="description" className="text-linghuo-amber" size={18} />
                简历管理
              </h3>
              <button
                type="button"
                onClick={() => setHasResume(true)}
                className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Icon name="upload" size={14} />
                上传新版本
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="bg-surface-container-lowest border border-ash-veil rounded-xl p-md hover:shadow-ambient-hover transition-shadow group">
                <div className="flex items-start gap-sm">
                  <span className="h-12 w-10 rounded bg-error-container/60 text-on-error-container flex items-center justify-center shrink-0">
                    <Icon name="picture_as_pdf" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[13px] text-deep-char truncate">
                      陈领活_全栈设计师_2026.pdf
                    </p>
                    <p className="text-[11px] text-warm-ash mt-1">
                      PDF · 2.4 MB · 3 天前更新
                    </p>
                  </div>
                </div>
                <div className="mt-md flex gap-2">
                  <Badge tone="slate">主投递简历</Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasResume((prev) => prev)}
                className="bg-surface-container-lowest border border-dashed border-ash-veil rounded-xl p-md flex flex-col items-center justify-center text-graphite hover:border-linghuo-amber hover:text-linghuo-amber transition-all"
              >
                <Icon name="add_circle" size={28} />
                <span className="text-[12px] font-medium mt-1">
                  添加多版本简历
                </span>
                <span className="text-[10px] text-warm-ash mt-0.5">
                  仅 PDF / Word
                </span>
              </button>
            </div>
            {!hasResume ? (
              <p className="text-[11px] text-warm-ash mt-sm">
                你尚未上传任何简历。
              </p>
            ) : null}
          </section>

          {/* 项目经验 */}
          <section>
            <header className="flex items-center justify-between mb-md">
              <h3 className="font-title text-title text-deep-char">项目经验</h3>
              <button type="button" className="text-[12px] text-primary hover:underline">
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

        {/* AI 助手草案 */}
        <Card tone="warm" className="p-lg space-y-md">
          <header className="flex items-center gap-sm">
            <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
              <Icon name="smart_toy" filled size={18} />
            </span>
            <h3 className="text-[12px] font-bold text-deep-char uppercase tracking-widest">
              AI 资料优化建议
            </h3>
          </header>
          <div className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
            <p className="text-[14px] text-deep-char leading-relaxed italic">
              “基于你近期的{" "}
              <span className="text-linghuo-amber font-medium">
                ‘跨境电商 UI 优化’
              </span>{" "}
              项目成果，建议在简历的「专业成就」板块增加：
              <span className="font-medium">
                「通过 A/B 测试将结账转化率提升了 18%」
              </span>
              。”
            </p>
            <div className="mt-md flex justify-end gap-sm">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDraftAccepted(false)}
              >
                忽略
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setDraftAccepted(true)}
                disabled={draftAccepted}
              >
                <Icon name="check" size={14} />
                {draftAccepted ? "已写入" : "立即采纳并更新"}
              </Button>
            </div>
          </div>
          <div className="bg-bone-cream border border-ash-veil rounded-lg px-md py-sm flex items-center gap-sm">
            <Icon name="lightbulb" size={16} className="text-linghuo-amber" />
            <p className="text-[12px] text-on-surface-variant flex-1">
              发现 3 个与你画像高度匹配的新任务，可在任务大厅查看。
            </p>
            <Icon name="chevron_right" size={16} className="text-graphite" />
          </div>
          <p className="text-[11px] text-warm-ash leading-relaxed">
            说明：助手只生成草案，确认权一直在你这里。AI 不会直接改写正式资料。
          </p>
        </Card>
      </div>
    </div>
  );
}
