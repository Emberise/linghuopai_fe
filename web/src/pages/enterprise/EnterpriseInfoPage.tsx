/**
 * 企业信息页：维护企业资料、查看认证状态、退出登录。
 */
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { Button } from "@/shared/ui/Button";
import { useAuth } from "@/shared/auth/store";

export function EnterpriseInfoPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const enterprise = session?.realm === "enterprise" ? session : null;

  return (
    <div className="space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <h2 className="font-headline text-headline text-deep-char">企业信息</h2>
          <p className="text-graphite text-[13px] mt-xs">
            维护企业基础信息与联系方式。资质审核入口在「资质认证」页。
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/b/qualification")}
          >
            <Icon name="verified" size={16} />
            资质认证
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <Icon name="logout" size={16} />
            退出企业端
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="lg:col-span-2 p-lg space-y-md">
          <h3 className="font-title text-title text-deep-char">基础资料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <Field
              label="企业名称"
              defaultValue={enterprise?.enterpriseName ?? ""}
              leadingIcon={<Icon name="domain" size={18} />}
            />
            <Field
              label="主营方向"
              placeholder="例如：设计 / 内容 / 活动"
              leadingIcon={<Icon name="category" size={18} />}
            />
            <Field
              label="员工规模"
              placeholder="20 人以下 / 20-100 人 / 100+ 人"
              leadingIcon={<Icon name="groups" size={18} />}
            />
            <Field
              label="官网"
              placeholder="https://"
              leadingIcon={<Icon name="link" size={18} />}
            />
            <div className="md:col-span-2">
              <label className="block font-label text-label text-graphite ml-xs mb-xs">
                企业介绍
              </label>
              <textarea
                rows={4}
                placeholder="一段简短介绍，会出现在你发布的岗位详情中。"
                className="w-full px-md py-sm rounded-lg bg-bone-cream-dim border border-ash-veil text-body placeholder:text-warm-ash focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>保存修改</Button>
          </div>
        </Card>

        <aside className="space-y-lg">
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
                  {enterprise?.qualified ? "已通过 · 全部能力开启" : "待认证 · 业务能力锁定"}
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
          <Card tone="warm" className="p-lg">
            <h3 className="font-title text-title text-deep-char">合规提示</h3>
            <p className="mt-md text-[13px] text-graphite leading-relaxed">
              企业信息将出现在岗位详情、候选人沟通页与资质审核记录中。请确保填写真实，
              不真实将影响认证结果。
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
