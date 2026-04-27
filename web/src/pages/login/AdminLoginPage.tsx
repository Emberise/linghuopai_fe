/**
 * 后台登录页：账号 + 密码 mock，登录后进 /admin/dashboard。
 */
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { useAuth } from "@/shared/auth/store";

export function AdminLoginPage() {
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account || !pwd) {
      setErr("请填写账号与密码");
      return;
    }
    setErr(null);
    loginAsAdmin(account);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-md bg-deep-char text-bone-cream">
      <main className="w-full max-w-[400px] bg-deep-char border border-white/10 rounded-2xl p-lg">
        <div className="flex items-center gap-3 mb-lg">
          <span className="h-10 w-10 rounded-lg bg-linghuo-amber/20 text-linghuo-amber flex items-center justify-center">
            <Icon name="admin_panel_settings" />
          </span>
          <div>
            <h1 className="font-headline text-[18px] tracking-tight">
              领活派 · 运营后台
            </h1>
            <p className="text-[11px] text-warm-ash mt-0.5">
              纯治理：只看不发，需要平台内部账号
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-md">
          <Field
            label="账号"
            placeholder="平台内部账号"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            leadingIcon={<Icon name="badge" size={18} />}
            className="bg-deep-char/40 text-bone-cream placeholder:text-warm-ash border-white/10"
          />
          <Field
            label="密码"
            placeholder="请输入密码"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            leadingIcon={<Icon name="lock" size={18} />}
            className="bg-deep-char/40 text-bone-cream placeholder:text-warm-ash border-white/10"
          />
          {err ? <p className="text-[12px] text-error">{err}</p> : null}
          <Button type="submit" variant="primary" size="lg" fullWidth>
            进入后台
          </Button>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-[12px] text-warm-ash hover:text-linghuo-amber"
          >
            <Icon name="arrow_back" size={14} />
            返回普通登录
          </Link>
        </form>
      </main>
    </div>
  );
}
