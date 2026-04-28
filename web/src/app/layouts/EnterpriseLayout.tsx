/**
 * 企业端布局：
 * - PC / Pad：左侧固定 SideNav + 顶部 AppBar
 * - Mobile：仅底部 Tab（无汉堡 / 无抽屉，避免与底 Tab 重叠）
 *
 * spec：企业端没有消息中心、没有顶部提醒入口；
 * 移动端「资质认证」入口走顶部状态条（可点击）+ 「企业」Tab → EnterpriseInfoPage 资质状态卡；
 * 移动端「退出登录」走 EnterpriseInfoPage 合规卡的「退出企业端」按钮。
 */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";

const items = [
  { to: "/b/home", label: "工作台", icon: "dashboard" },
  { to: "/b/qualification", label: "资质认证", icon: "verified_user" },
  { to: "/b/jobs", label: "岗位管理", icon: "work_outline" },
  { to: "/b/assistant", label: "AI 助手", icon: "smart_toy" },
  { to: "/b/candidates", label: "候选人管理", icon: "group" },
  { to: "/b/me", label: "企业信息", icon: "domain" },
] as const;

const mobileTabs = [
  { to: "/b/home", label: "工作台", icon: "dashboard" },
  { to: "/b/jobs", label: "岗位", icon: "work_outline" },
  { to: "/b/candidates", label: "候选人", icon: "group" },
  { to: "/b/me", label: "企业", icon: "domain" },
] as const;

export function EnterpriseLayout() {
  const { session, logout } = useAuth();
  const enterprise = session?.realm === "enterprise" ? session : null;
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bone-cream text-deep-char flex">
      {/* SideNav 仅 PC / Pad 显示 */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-[#F2F0EB] border-r border-ash-veil flex-col">
        <div className="px-lg py-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linghuo-amber text-white flex items-center justify-center">
              <Icon name="domain" filled />
            </div>
            <div>
              <h2 className="text-linghuo-amber font-bold tracking-widest text-[12px]">
                企业管理中心
              </h2>
              <p className="text-[11px] text-graphite mt-0.5">
                资质状态：
                <span
                  className={
                    enterprise?.qualified
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {enterprise?.qualified ? "已认证" : "待认证"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-md py-sm rounded-lg text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-bone-cream-dim text-linghuo-amber border-r-2 border-linghuo-amber"
                    : "text-graphite hover:bg-bone-cream-dim/60 hover:text-deep-char",
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
          className="m-3 px-md py-sm rounded-lg text-[12px] text-graphite hover:text-deep-char hover:bg-bone-cream-dim flex items-center gap-2 transition-colors"
        >
          <Icon name="logout" size={16} />
          退出登录
        </button>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-bone-cream/95 backdrop-blur border-b border-ash-veil flex items-center justify-between px-md md:px-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="font-headline text-[16px] md:text-[18px] text-deep-char tracking-tight truncate">
                {enterprise?.enterpriseName ?? "企业端"}
              </h1>
              <NavLink
                to="/b/qualification"
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] truncate transition-colors",
                  enterprise?.qualified
                    ? "text-graphite hover:text-linghuo-amber"
                    : "text-amber-600 hover:text-linghuo-amber",
                )}
              >
                {enterprise?.qualified ? "资质已认证" : "请尽快完成资质认证"}
                <Icon name="arrow_forward" size={12} />
              </NavLink>
            </div>
          </div>

          {/* 移动端 AI 助手快捷入口（桌面端走 SideNav） */}
          <NavLink
            to="/b/assistant"
            className={({ isActive }) =>
              cn(
                "md:hidden h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                isActive
                  ? "bg-linghuo-amber text-white"
                  : "bg-linghuo-amber/10 text-linghuo-amber hover:bg-linghuo-amber/20",
              )
            }
            aria-label="AI 助手"
          >
            <Icon name="smart_toy" filled size={20} />
          </NavLink>
        </header>

        <main className="flex-1 pb-24 md:pb-12">
          <div className="max-w-[1400px] mx-auto px-md md:px-lg py-md md:py-lg">
            <Outlet key={location.pathname} />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bone-cream/95 backdrop-blur border-t border-ash-veil pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-4">
            {mobileTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center py-2 gap-0.5 text-[11px]",
                    isActive ? "text-linghuo-amber" : "text-graphite",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={tab.icon} filled={isActive} size={22} />
                    <span className="leading-none">{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
