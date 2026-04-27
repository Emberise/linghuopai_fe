/**
 * 基础配置：spec 没有展开具体范围，按「公告 / 标签字典 / 推荐策略只读」做最小占位。
 */
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { Button } from "@/shared/ui/Button";

const policyItems = [
  { key: "ai-pace", label: "AI 面试问答上限（5 轮以内，前端不展示）", value: 5 },
  { key: "report-ttl", label: "报告有效期（天）", value: 30 },
  { key: "candidate-keep", label: "候选人列表保留时长（天）", value: 90 },
];

const skillTags = [
  "UI 设计",
  "交互设计",
  "插画 / 视觉",
  "前端开发",
  "活动主持",
  "短视频脚本",
  "运营 / 内容",
  "测试 / QA",
];

export function AdminConfigPage() {
  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">基础配置</h2>
        <p className="text-graphite text-[13px] mt-xs">
          运营最小配置项。复杂策略由后端定义，前端仅做展示与轻量编辑。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <Card className="p-lg space-y-md">
          <h3 className="font-title text-title text-deep-char">平台公告</h3>
          <Field
            label="标题"
            placeholder="例如：服务条款更新"
            leadingIcon={<Icon name="campaign" size={18} />}
          />
          <div>
            <label className="block font-label text-label text-graphite ml-xs mb-xs">
              正文
            </label>
            <textarea
              rows={5}
              placeholder="发布到个人端消息中心。文案应当克制、清晰、不卖弄。"
              className="w-full px-md py-sm rounded-lg bg-bone-cream-dim border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-sm">
            <Button variant="ghost">保存草稿</Button>
            <Button>
              <Icon name="send" size={16} />
              发布公告
            </Button>
          </div>
        </Card>

        <Card className="p-lg space-y-md">
          <h3 className="font-title text-title text-deep-char">运营策略（只读）</h3>
          <ul className="divide-y divide-ash-veil">
            {policyItems.map((p) => (
              <li
                key={p.key}
                className="flex items-center justify-between py-sm"
              >
                <span className="text-[13px] text-deep-char">{p.label}</span>
                <span className="font-headline text-misty-slate">{p.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-warm-ash leading-relaxed">
            上述参数由后端配置中心提供，前端只读展示。如需调整，请联系工程团队走配置变更流程。
          </p>
        </Card>

        <Card className="p-lg lg:col-span-2 space-y-md">
          <header className="flex items-center justify-between">
            <h3 className="font-title text-title text-deep-char">技能标签字典</h3>
            <Button variant="secondary" size="sm">
              <Icon name="add" size={16} />
              新增标签
            </Button>
          </header>
          <ul className="flex flex-wrap gap-sm">
            {skillTags.map((tag) => (
              <li
                key={tag}
                className="px-md h-9 inline-flex items-center gap-2 rounded-full bg-bone-cream-dim border border-ash-veil text-[13px] text-deep-char"
              >
                {tag}
                <button
                  type="button"
                  className="text-warm-ash hover:text-error"
                  aria-label="移除"
                >
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-warm-ash">
            技能标签会同时作为个人画像与企业 JD 的可选标签项。
          </p>
        </Card>
      </div>
    </div>
  );
}
