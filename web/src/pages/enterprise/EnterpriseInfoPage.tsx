/**
 * 企业信息页（对照 stitch 企业端_5）
 * - 顶部企业概览卡：Logo + 名称 + verified + 行业 chip + 操作
 * - 主区：基础资料 + 证件文件管理
 * - 侧边：资质状态 + 企业智能洞察 + 合规提示
 * - 不加团队成员
 */
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { useAuth } from "@/shared/auth/store";

const companyTags = ["人力资源服务", "高新企业", "A 轮融资", "200-500 人"];

const documents = [
  {
    name: "营业执照",
    uploadedAt: "2024-03-15",
    icon: "description",
  },
  {
    name: "人力资源许可",
    uploadedAt: "2023-11-20",
    icon: "verified_user",
  },
];

export function EnterpriseInfoPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const enterprise = session?.realm === "enterprise" ? session : null;

  return (
    <div className="space-y-lg">
      {/* 企业概览卡 */}
      <Card className="p-lg flex flex-col md:flex-row gap-md md:gap-lg md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <button
            type="button"
            className="h-24 w-24 rounded-2xl bg-primary-fixed text-linghuo-amber border border-ash-veil flex items-center justify-center shrink-0 hover:brightness-105 transition-all relative group"
            aria-label="上传企业 Logo"
          >
            <Icon name="domain" filled size={32} />
            <span className="absolute inset-0 rounded-2xl flex items-center justify-center bg-deep-char/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[12px] font-medium">
              <Icon name="upload" size={20} />
            </span>
          </button>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-sm flex-wrap">
              <h2 className="font-headline text-headline text-deep-char">
                {enterprise?.enterpriseName ?? "深圳暖光科技有限公司"}
              </h2>
              <Icon
                name="verified"
                filled
                className="text-linghuo-amber"
                size={20}
                ariaLabel="已认证企业"
              />
            </div>
            <p className="text-misty-slate text-[13px] mt-xs">
              人力资源服务 / 数字化人才解决方案
            </p>
            <div className="flex flex-wrap gap-xs justify-center md:justify-start mt-sm">
              {companyTags.map((tag) => (
                <Badge key={tag} tone="graphite">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-sm">
          <Button variant="secondary">预览门户</Button>
          <Button>
            <Icon name="edit" size={16} />
            编辑资料
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-lg">
          {/* 基础资料 */}
          <Card className="overflow-hidden">
            <header className="px-lg py-md border-b border-ash-veil bg-bone-cream/40 flex items-center gap-sm">
              <Icon name="info" size={18} className="text-misty-slate" />
              <h3 className="font-title text-title text-deep-char">基础资料</h3>
            </header>
            <div className="p-lg space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <Field
                  label="企业全称"
                  defaultValue={enterprise?.enterpriseName ?? ""}
                  leadingIcon={<Icon name="domain" size={18} />}
                />
                <Field
                  label="统一社会信用代码"
                  placeholder="91440300MA5EXXXX1X"
                  leadingIcon={<Icon name="qr_code_2" size={18} />}
                />
                <Field
                  label="官方网站"
                  placeholder="https://"
                  leadingIcon={<Icon name="link" size={18} />}
                />
                <Field
                  label="联系电话"
                  placeholder="0755-XXXX-XXXX"
                  leadingIcon={<Icon name="phone" size={18} />}
                />
              </div>
              <div className="pt-md border-t border-ash-veil/60">
                <label className="block font-label text-label text-graphite mb-xs">
                  企业简介
                </label>
                <div className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm text-[14px] text-graphite leading-relaxed max-w-body">
                  暖光科技是领先的数字化人才服务商，致力于为高增长企业提供灵活的弹性用工方案。
                  我们通过自主研发的 AI 匹配算法与灵活用工平台，连接优质青年专业人才与创新型企业。
                </div>
              </div>
            </div>
          </Card>

          {/* 证件文件管理 */}
          <Card className="overflow-hidden">
            <header className="px-lg py-md border-b border-ash-veil bg-bone-cream/40 flex items-center gap-sm">
              <Icon
                name="verified_user"
                size={18}
                className="text-misty-slate"
              />
              <h3 className="font-title text-title text-deep-char">
                资质文件管理
              </h3>
            </header>
            <div className="p-lg grid grid-cols-1 sm:grid-cols-2 gap-md">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="bg-bone-cream-dim border border-ash-veil rounded-xl px-md py-sm flex items-center gap-md hover:shadow-ambient-hover transition-all group"
                >
                  <span className="h-16 w-12 rounded bg-surface-container-lowest border border-ash-veil flex items-center justify-center text-misty-slate shrink-0">
                    <Icon name={doc.icon} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-deep-char">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-warm-ash mt-1">
                      已上传（{doc.uploadedAt}）
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    更新
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-lg">
          {/* 资质状态 */}
          <Card className="p-lg">
            <header className="flex items-center gap-sm mb-md">
              <span
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  enterprise?.qualified
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <Icon
                  name={enterprise?.qualified ? "verified" : "warning"}
                  filled={enterprise?.qualified}
                />
              </span>
              <div>
                <h3 className="font-title text-title text-deep-char">
                  资质状态
                </h3>
                <p className="text-[12px] text-graphite mt-xs">
                  {enterprise?.qualified
                    ? "已通过 · 全部能力开启"
                    : "待认证 · 业务能力锁定"}
                </p>
              </div>
            </header>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate("/b/qualification")}
            >
              {enterprise?.qualified ? "查看认证详情" : "立即去认证"}
            </Button>
          </Card>

          {/* 企业智能洞察（暖橙弱底 + 完整描边，无侧条） */}
          <Card className="p-lg bg-gradient-to-br from-linghuo-amber/5 to-transparent border border-linghuo-amber/20">
            <header className="flex items-center gap-sm mb-sm">
              <Icon
                name="auto_awesome"
                filled
                className="text-linghuo-amber"
                size={20}
              />
              <h4 className="font-title text-[12px] font-bold text-linghuo-amber uppercase tracking-tight">
                企业智能洞察
              </h4>
            </header>
            <p className="text-[13px] text-graphite leading-relaxed">
              你的企业简介中关于「数字化」的关键词匹配度极高，建议在招聘岗位中增加
              「技术敏感度」标签，以吸引更精准的复合型人才。
            </p>
            <button
              type="button"
              className="mt-md text-[12px] font-bold text-linghuo-amber inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              查看详细建议
              <Icon name="arrow_forward" size={14} />
            </button>
          </Card>

          <Card tone="warm" className="p-lg">
            <h3 className="font-title text-title text-deep-char">合规提示</h3>
            <p className="mt-md text-[13px] text-graphite leading-relaxed">
              企业信息将出现在岗位详情、候选人沟通页与资质审核记录中。请确保填写真实，
              不真实将影响认证结果。
            </p>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="mt-md text-[12px] text-graphite hover:text-error inline-flex items-center gap-1"
            >
              <Icon name="logout" size={14} />
              退出企业端
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
