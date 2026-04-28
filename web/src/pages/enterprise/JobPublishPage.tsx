/**
 * 岗位发布流程：
 * - AI 主导 + 手填补充
 * - 直接发布，不做人工审核（spec）
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";

export function JobPublishPage() {
  const navigate = useNavigate();
  const [intent, setIntent] = useState("");
  const [ai, setAi] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [requirement, setRequirement] = useState("");

  const generate = () => {
    if (!intent.trim()) return;
    setGenerating(true);
    setAi(null);
    setTimeout(() => {
      setAi(
        `岗位：${intent.split(/[，。\n]/)[0].slice(0, 18) || "新岗位"}\n核心职责：根据需求拆解任务，与团队协同推进。\n硬技能：与岗位描述匹配的工程或设计能力。\n软技能：清晰沟通、自我推进。\n薪资建议：参考你描述的范围。\n期待你在简历中体现：3 段以上相关项目经验。`,
      );
      setTitle(intent.split(/[，。\n]/)[0].slice(0, 18) || "新岗位");
      setSalary("15k-25k");
      setLocation("远程 / 杭州");
      setRequirement(
        "3 年以上相关经验，熟悉行业流程，能独立拆解任务，并与跨职能团队顺畅沟通。",
      );
      setGenerating(false);
    }, 800);
  };

  const publish = () => {
    if (!title || !salary || !location || !requirement) return;
    navigate("/b/jobs");
  };

  return (
    <div className="space-y-lg">
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-[12px] text-graphite hover:text-deep-char"
        >
          <Icon name="arrow_back" size={14} />
          返回岗位列表
        </button>
        <h2 className="mt-sm font-headline text-headline text-deep-char">
          发布新岗位
        </h2>
        <p className="text-graphite text-[13px] mt-xs">
          先用一两句描述意图，AI 会帮你润色出结构化稿，你再补几个关键字段就能直接发布。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-lg">
          <Card tone="warm" className="p-lg space-y-md">
            <h3 className="font-title text-title text-deep-char flex items-center gap-sm">
              <Icon name="auto_awesome" filled className="text-linghuo-amber" />
              一句话描述你的需求
            </h3>
            {/* 快捷模板 chip */}
            <div className="flex flex-wrap gap-2">
              {[
                "UI 设计 · 远程",
                "内容运营 · 兼职",
                "前端协作 · 项目制",
                "活动主持 · 周末",
                "插画绘制 · 按件",
              ].map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() =>
                    setIntent(
                      `招一位${tpl}的合作者，预算可议，希望能在两周内交付。`,
                    )
                  }
                  className="px-md h-8 rounded-full bg-surface-container-lowest border border-ash-veil text-[12px] text-graphite hover:border-linghuo-amber hover:text-linghuo-amber transition-colors"
                >
                  {tpl}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="例如：我想招一位有 3 年以上 SaaS 经验的高级 UI/UX，远程合作，薪资 15-25k。"
              className="w-full px-md py-sm rounded-lg bg-surface-container-lowest border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
            />
            <div className="flex gap-sm">
              <Button onClick={generate} disabled={!intent.trim() || generating}>
                <Icon name="auto_awesome" size={16} />
                {generating ? "AI 整理中…" : "AI 润色"}
              </Button>
              <Button variant="ghost" onClick={() => setAi(null)} disabled={!ai}>
                清空
              </Button>
            </div>
            {ai ? (
              <div className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-warm-ash uppercase tracking-widest mb-xs">
                  AI 润色稿
                </p>
                <p className="whitespace-pre-line text-[14px] text-deep-char leading-relaxed">
                  {ai}
                </p>
              </div>
            ) : null}
          </Card>

          <Card className="p-lg space-y-md">
            <h3 className="font-title text-title text-deep-char">补几个关键字段</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field
                label="岗位名称"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：高级 UI/UX 设计师"
              />
              <Field
                label="薪资范围"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="例如：15k-25k"
              />
              <Field
                label="工作地点"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="远程 / 杭州 滨江 / 北京 海淀"
              />
            </div>
            <div>
              <label className="block font-label text-label text-graphite ml-xs mb-xs">
                岗位要求
              </label>
              <textarea
                rows={5}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="清晰描述硬技能 + 软技能。AI 已经为你写好了一稿，你可以再加一两条。"
                className="w-full px-md py-sm rounded-lg bg-bone-cream-dim border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
              />
            </div>
          </Card>

          <div className="flex flex-col md:flex-row gap-sm md:items-center md:justify-between">
            <p className="text-[11px] text-warm-ash">
              直接发布：第一版没有人工审核环节，发布后立即出现在任务大厅。
            </p>
            <div className="flex gap-sm">
              <Button variant="ghost" onClick={() => navigate("/b/jobs")}>
                存草稿
              </Button>
              <Button
                onClick={publish}
                disabled={!title || !salary || !location || !requirement}
              >
                <Icon name="send" size={18} />
                直接发布
              </Button>
            </div>
          </div>
        </div>

        <aside className="space-y-lg">
          <Card className="p-lg bg-gradient-to-br from-linghuo-amber/5 to-transparent border border-linghuo-amber/20">
            <header className="flex items-center gap-sm mb-md">
              <Icon
                name="lightbulb"
                filled
                className="text-linghuo-amber"
                size={18}
              />
              <h3 className="font-title text-title text-deep-char">AI 优化建议</h3>
            </header>
            <ul className="space-y-sm">
              <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-linghuo-amber uppercase tracking-widest font-bold mb-xs">
                  信息完善
                </p>
                <p className="text-[13px] text-graphite leading-relaxed">
                  补齐「薪资范围」与「工作地点」可以让候选人匹配度提升约 30%。
                </p>
              </li>
              <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-misty-slate uppercase tracking-widest font-bold mb-xs">
                  关键词识别
                </p>
                <p className="text-[13px] text-graphite leading-relaxed">
                  已识别到「远程协作」「项目制」，建议再补一条「项目周期」帮候选人评估接单意愿。
                </p>
              </li>
              <li className="bg-surface-container-lowest border border-ash-veil rounded-lg p-md">
                <p className="text-[11px] text-misty-slate uppercase tracking-widest font-bold mb-xs">
                  市场参考
                </p>
                <p className="text-[13px] text-graphite leading-relaxed">
                  相似岗位本周平均收到 12-18 份简历，AI 初筛通过率约 35%。
                </p>
              </li>
            </ul>
          </Card>

          <Card tone="warm" className="p-lg">
            <h3 className="font-title text-title text-deep-char">岗位发布须知</h3>
            <ul className="mt-md space-y-sm text-[13px] text-graphite leading-relaxed">
              <li className="flex items-start gap-sm">
                <Icon
                  name="bolt"
                  size={16}
                  className="text-linghuo-amber mt-0.5"
                />
                第一版直接发布，无人工审核环节。
              </li>
              <li className="flex items-start gap-sm">
                <Icon
                  name="psychology"
                  size={16}
                  className="text-misty-slate mt-0.5"
                />
                发布后报名候选人将自动进入 AI 初筛。
              </li>
              <li className="flex items-start gap-sm">
                <Icon
                  name="edit_note"
                  size={16}
                  className="text-misty-slate mt-0.5"
                />
                JD 修改后旧 AI 报告作废，候选人需重走面试。
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
