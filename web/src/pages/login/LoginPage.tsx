/**
 * 公共登录页：个人端 / 企业端 主屏切换 + 底部小字「平台管理后台入口」。
 * Mock：手机号非空 + 6 位验证码即可登录；后台用账号 + 密码（不校验）。
 */
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";

type Tab = "user" | "enterprise";

export function LoginPage() {
  const [tab, setTab] = useState<Tab>("user");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [counting, setCounting] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAsUser, loginAsEnterprise } = useAuth();

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
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    if (code.length !== 6) {
      setError("请输入 6 位验证码");
      return;
    }
    setError(null);
    if (tab === "user") {
      loginAsUser(phone);
      navigate("/u/home", { replace: true });
    } else {
      loginAsEnterprise(phone);
      navigate("/b/home", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-md text-on-surface relative overflow-hidden">
      {/* 装饰：温光，非默认 glassmorphism，仅作环境氛围 */}
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
        <div className="flex p-xs bg-ash-veil/60 rounded-xl mb-lg">
          <button
            type="button"
            onClick={() => setTab("user")}
            className={cn(
              "flex-1 py-sm rounded-lg font-title text-[14px] transition-all duration-300",
              tab === "user"
                ? "bg-surface-container-lowest text-linghuo-amber shadow-sm"
                : "text-graphite hover:text-deep-char",
            )}
          >
            个人端登录 / 注册
          </button>
          <button
            type="button"
            onClick={() => setTab("enterprise")}
            className={cn(
              "flex-1 py-sm rounded-lg font-title text-[14px] transition-all duration-300",
              tab === "enterprise"
                ? "bg-surface-container-lowest text-linghuo-amber shadow-sm"
                : "text-graphite hover:text-deep-char",
            )}
          >
            企业端登录 / 注册
          </button>
        </div>

        <form onSubmit={submit} className="space-y-lg">
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
                  className="px-md h-11 rounded-lg bg-bone-cream border border-ash-veil text-linghuo-amber text-[12px] font-medium hover:bg-surface-container-low transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:text-warm-ash"
                >
                  {counting > 0 ? `${counting}s 后重发` : "获取验证码"}
                </button>
              }
            />
          </div>

          {error ? (
            <p className="text-[12px] text-error">{error}</p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" fullWidth>
            登录 / 注册
          </Button>

          <p className="text-center text-[11px] text-warm-ash">
            登录即代表你同意{" "}
            <a href="#" className="text-linghuo-amber hover:underline">
              用户协议
            </a>{" "}
            与{" "}
            <a href="#" className="text-linghuo-amber hover:underline">
              隐私政策
            </a>
          </p>
        </form>
      </main>

      <footer className="mt-xl">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1 text-[12px] text-graphite hover:text-linghuo-amber transition-colors"
        >
          <Icon name="admin_panel_settings" size={16} />
          平台管理后台入口
        </Link>
      </footer>
    </div>
  );
}
