/**
 * 企业资质认证页：
 * - 上传营业执照、法人信息、企业地址等
 * - spec：未认证前业务能力锁定，但可看到主导航
 */
import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { useAuth } from "@/shared/auth/store";

const documents = [
  { key: "license", label: "营业执照", required: true },
  { key: "legal", label: "法人身份证（正反面）", required: true },
  { key: "extra", label: "授权委托书（如经办人非法人）", required: false },
];

export function QualificationPage() {
  const { session, setQualified } = useAuth();
  const enterprise = session?.realm === "enterprise" ? session : null;
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(enterprise?.qualified ?? false);

  const allUploaded = documents
    .filter((d) => d.required)
    .every((d) => uploaded[d.key]);

  const submit = () => {
    if (!allUploaded) return;
    setSubmitted(true);
    setQualified(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div className="lg:col-span-2 space-y-lg">
        <Card className="p-lg space-y-md">
          <header className="flex items-center gap-sm">
            <span
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                submitted
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Icon name="verified" filled />
            </span>
            <div>
              <h2 className="font-title text-title text-deep-char">
                {submitted ? "你的企业资质已通过审核" : "完成企业资质认证"}
              </h2>
              <p className="text-[12px] text-graphite mt-xs">
                {submitted
                  ? "你已具备发布岗位、查看候选人与站内沟通等全部能力。"
                  : "未认证前，发布岗位、查看候选人、AI 报告与站内沟通将被锁定。"}
              </p>
            </div>
          </header>
        </Card>

        <Card className="p-lg space-y-md">
          <h3 className="font-title text-title text-deep-char">企业基础信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <Field
              label="企业名称"
              defaultValue={enterprise?.enterpriseName ?? ""}
              placeholder="例如：极光科技工作室"
              leadingIcon={<Icon name="domain" size={18} />}
            />
            <Field
              label="统一社会信用代码"
              placeholder="18 位社会信用代码"
              leadingIcon={<Icon name="qr_code_2" size={18} />}
            />
            <Field
              label="法定代表人"
              placeholder="法人姓名"
              leadingIcon={<Icon name="person" size={18} />}
            />
            <Field
              label="联系电话"
              placeholder="经办人手机号"
              leadingIcon={<Icon name="phone" size={18} />}
            />
            <div className="md:col-span-2">
              <Field
                label="注册地址"
                placeholder="省 / 市 / 区 / 街道详细地址"
                leadingIcon={<Icon name="location_on" size={18} />}
              />
            </div>
          </div>
        </Card>

        <Card className="p-lg space-y-md">
          <h3 className="font-title text-title text-deep-char">证照上传</h3>
          <ul className="space-y-md">
            {documents.map((doc) => (
              <li
                key={doc.key}
                className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-md flex items-center gap-md"
              >
                <span
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    uploaded[doc.key]
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-bone-cream text-graphite"
                  }`}
                >
                  <Icon
                    name={uploaded[doc.key] ? "check" : "upload_file"}
                    filled={uploaded[doc.key]}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-deep-char">
                    {doc.label}
                    {doc.required ? (
                      <span className="ml-1 text-error">*</span>
                    ) : (
                      <span className="ml-1 text-warm-ash text-[11px]">
                        选填
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-warm-ash mt-0.5">
                    JPG / PNG / PDF · 不超过 10 MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setUploaded((prev) => ({
                      ...prev,
                      [doc.key]: !prev[doc.key],
                    }))
                  }
                  className="text-[12px] text-linghuo-amber hover:underline"
                >
                  {uploaded[doc.key] ? "重新上传" : "选择文件"}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-end gap-sm">
          <Button variant="ghost" size="md">
            保存草稿
          </Button>
          <Button
            disabled={!allUploaded || submitted}
            onClick={submit}
          >
            <Icon name="send" size={18} />
            {submitted ? "已提交审核" : "提交审核"}
          </Button>
        </div>
      </div>

      <aside className="space-y-lg">
        <Card tone="warm" className="p-lg">
          <h3 className="font-title text-title text-deep-char">认证须知</h3>
          <ul className="mt-md space-y-sm text-[13px] text-graphite leading-relaxed">
            <li className="flex items-start gap-sm">
              <Icon name="schedule" size={16} className="text-misty-slate mt-0.5" />
              人工审核 1-2 个工作日内完成
            </li>
            <li className="flex items-start gap-sm">
              <Icon name="lock" size={16} className="text-misty-slate mt-0.5" />
              资料仅用于资质核验，不用于其他用途
            </li>
            <li className="flex items-start gap-sm">
              <Icon name="error" size={16} className="text-error mt-0.5" />
              资料不真实将被永久封禁，谨慎填写
            </li>
          </ul>
        </Card>

        <Card className="p-lg">
          <h3 className="font-title text-title text-deep-char">认证后开启</h3>
          <ul className="mt-md space-y-sm text-[13px] text-deep-char">
            <li className="flex items-center gap-sm">
              <Icon name="check_circle" size={16} className="text-emerald-600" />
              发布岗位 / AI 一键润色 JD
            </li>
            <li className="flex items-center gap-sm">
              <Icon name="check_circle" size={16} className="text-emerald-600" />
              查看 AI 初筛后候选人
            </li>
            <li className="flex items-center gap-sm">
              <Icon name="check_circle" size={16} className="text-emerald-600" />
              进入站内沟通
            </li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}
