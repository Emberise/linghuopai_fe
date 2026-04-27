/**
 * 运营后台布局：
 * - PC/Pad：左侧导航 + 顶部 AppBar
 * - Mobile：抽屉导航
 *
 * spec：后台不存在消息中心，不存在顶部提醒入口。
 */
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";

const items = [
  { to: "/admin/dashboard", label: "运营看板", icon: "monitoring" },
  { to: "/admin/users", label: "个人用户", icon: "person" },
  { to: "/admin/enterprises", label: "企业用户", icon: "domain" },
  { to: "/admin/tasks", label: "任务管理", icon: "checklist" },
  { to: "/admin/config", label: "基础配置", icon: "settings" },
] as const;

export function AdminLayout() {
  const { session, logout } = useAuth();
  const admin = session?.realm === "admin" ? session : null;
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-bone-cream text-deep-char">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-deep-char text-bone-cream flex flex-col transition-transform duration-300 ease-out-quart",
          "md:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-lg py-lg border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-linghuo-amber/20 text-linghuo-amber flex items-center justify-center">
              <Icon name="admin_panel_settings" />
            </span>
            <div>
              <h2 className="text-[13px] font-bold tracking-widest">运营后台</h2>
              <p className="text-[11px] text-warm-ash mt-0.5">
                {admin?.displayName ?? "管理员"}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-md py-sm rounded-lg text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-linghuo-amber/15 text-linghuo-amber"
                    : "text-bone-cream/70 hover:text-bone-cream hover:bg-white/5",
                )
              }
            >
              <Icon name={it.icon} size={18} />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-3 px-md py-sm rounded-lg text-[12px] text-bone-cream/70 hover:text-bone-cream hover:bg-white/5 flex items-center gap-2 transition-colors"
        >
          <Icon name="logout" size={16} />
          退出后台
        </button>
      </aside>

      {navOpen ? (
        <div
          className="fixed inset-0 z-40 bg-deep-char/40 md:hidden"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className="flex-1 md:ml-60 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-bone-cream/95 backdrop-blur border-b border-ash-veil flex items-center justify-between px-md md:px-lg">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="md:hidden p-2 rounded-lg text-graphite hover:bg-bone-cream-dim"
              aria-label="打开导航"
            >
              <Icon name="menu" />
            </button>
            <h1 className="font-headline text-[16px] text-deep-char tracking-tight">
              领活派 · 运营后台
            </h1>
          </div>
          <p className="text-[11px] text-graphite hidden sm:block">
            纯治理：只看不发，不代企业 / 不代个人执行业务动作
          </p>
        </header>
        <main className="flex-1 px-md md:px-lg py-md md:py-lg max-w-[1400px] w-full mx-auto">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}
