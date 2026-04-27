/**
 * 公共登录页：spec 第 5 节 — 同时承载个人端 / 企业端 / 平台管理后台 三入口。
 * - 主屏顶部 Tab 切换「个人端 / 企业端」
 * - 底部小字「平台管理后台入口」点击后切到后台账密表单（同页面）
 * - 三入口登录后跳到各自首页
 *
 * Mock：
 * - 个人/企业：手机号 11 位 + 6 位验证码
 * - 后台：账号 / 密码任意非空
 */
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";

type Mode = "user" | "enterprise" | "admin";

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("user");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [adminAccount, setAdminAccount] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [counting, setCounting] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAsUser, loginAsEnterprise, loginAsAdmin } = useAuth();

  const sendCode = () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    setError(null);
    setCounting(60);
    const timer = setInterval(() => {
      setCounting((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "admin") {
      if (!adminAccount || !adminPwd) {
        setError("请填写后台账号与密码");
        return;
      }
      setError(null);
      loginAsAdmin(adminAccount);
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    if (code.length !== 6) {
      setError("请输入 6 位验证码");
      return;
    }
    setError(null);
    if (mode === "user") {
      loginAsUser(phone);
      navigate("/u/home", { replace: true });
    } else {
      loginAsEnterprise(phone);
      navigate("/b/home", { replace: true });
    }
  };

  const isAdmin = mode === "admin";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-md text-on-surface relative overflow-hidden">
      {/* 装饰：温光氛围（非 glassmorphism） */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 w-[40%] h-[40%] bg-linghuo-amber/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-[30%] h-[30%] bg-misty-slate/10 rounded-full blur-[100px]" />
      </div>

      <div className="mb-xl text-center">
        <h1 className="font-display text-display text-deep-char tracking-tight">
          领活派
        </h1>
        <p className="font-body text-body text-graphite/80 mt-xs">
          让每一次灵活就业都温厚有力
        </p>
      </div>

      <main className="w-full max-w-[420px] bg-bone-cream-dim border border-ash-veil rounded-2xl p-lg shadow-[0_4px_24px_rgba(38,24,19,0.04)] transition-all duration-300">
        {/* Tab：个人 / 企业；后台模式时整体替换为后台标题 */}
        {!isAdmin ? (
          <div className="flex p-xs bg-ash-veil/60 rounded-xl mb-lg">
            <button
              type="button"
              onClick={() => setMode("user")}
              className={cn(
                "flex-1 py-sm rounded-lg font-title text-[14px] transition-all duration-300",
                mode === "user"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-graphite hover:text-deep-char",
              )}
            >
              个人端登录 / 注册
            </button>
            <button
              type="button"
              onClick={() => setMode("enterprise")}
              className={cn(
                "flex-1 py-sm rounded-lg font-title text-[14px] transition-all duration-300",
                mode === "enterprise"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-graphite hover:text-deep-char",
              )}
            >
              企业端登录 / 注册
            </button>
          </div>
        ) : (
          <div className="mb-lg flex items-center gap-sm rounded-xl bg-deep-char/5 border border-ash-veil px-md py-sm">
            <span className="h-9 w-9 rounded-lg bg-deep-char text-bone-cream flex items-center justify-center">
              <Icon name="admin_panel_settings" />
            </span>
            <div className="flex-1">
              <h2 className="font-title text-[14px] text-deep-char">
                平台管理后台
              </h2>
              <p className="text-[11px] text-graphite mt-0.5">
                需要平台内部账号
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode("user")}
              className="text-[12px] text-misty-slate hover:text-linghuo-amber"
            >
              返回
            </button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-lg">
          {!isAdmin ? (
            <div className="space-y-md">
              <Field
                label="手机号码"
                placeholder="请输入手机号"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                leadingIcon={<Icon name="smartphone" size={18} />}
              />
              <Field
                label="验证码"
                placeholder="6 位短信验证码"
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                leadingIcon={<Icon name="verified_user" size={18} />}
                trailing={
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={counting > 0}
                    className="px-md h-11 rounded-lg bg-bone-cream border border-ash-veil text-primary text-[12px] font-medium hover:bg-surface-container-low transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:text-warm-ash"
                  >
                    {counting > 0 ? `${counting}s 后重发` : "获取验证码"}
                  </button>
                }
              />
            </div>
          ) : (
            <div className="space-y-md">
              <Field
                label="账号"
                placeholder="平台内部账号"
                value={adminAccount}
                onChange={(e) => setAdminAccount(e.target.value)}
                leadingIcon={<Icon name="badge" size={18} />}
              />
              <Field
                label="密码"
                placeholder="请输入密码"
                type="password"
                value={adminPwd}
                onChange={(e) => setAdminPwd(e.target.value)}
                leadingIcon={<Icon name="lock" size={18} />}
              />
            </div>
          )}

          {error ? <p className="text-[12px] text-error">{error}</p> : null}

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {isAdmin ? "进入后台" : "登录 / 注册"}
          </Button>

          {!isAdmin ? (
            <p className="text-center text-[11px] text-warm-ash">
              登录即代表你同意{" "}
              <a href="#" className="text-primary hover:underline">
                用户协议
              </a>{" "}
              与{" "}
              <a href="#" className="text-primary hover:underline">
                隐私政策
              </a>
            </p>
          ) : null}
        </form>
      </main>

      {!isAdmin ? (
        <footer className="mt-xl">
          <button
            type="button"
            onClick={() => setMode("admin")}
            className="inline-flex items-center gap-1 text-[12px] text-graphite hover:text-primary transition-colors"
          >
            <Icon name="admin_panel_settings" size={16} />
            平台管理后台入口
          </button>
        </footer>
      ) : null}
    </div>
  );
}
