/**
 * 个人端布局：
 * - Mobile：顶部 AppBar（带消息中心）+ 底部 Tab
 * - Pad/PC：顶部 AppBar（带消息中心）+ 顶部主导航
 */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { useAuth } from "@/shared/auth/store";
import { cn } from "@/shared/utils/cn";
import { MessageCenter } from "@/features/user-message-center/MessageCenter";

const tabs = [
  { to: "/u/home", label: "首页", icon: "home" },
  { to: "/u/tasks", label: "任务大厅", icon: "work_outline" },
  { to: "/u/assistant", label: "AI助手", icon: "smart_toy" },
  { to: "/u/me", label: "我的", icon: "person" },
] as const;

export function UserLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-bone-cream text-deep-char">
      <header className="sticky top-0 z-40 bg-bone-cream/90 backdrop-blur border-b border-ash-veil">
        <div className="max-w-screen-xl mx-auto h-16 px-md md:px-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linghuo-amber text-white">
              <Icon name="local_fire_department" filled size={20} />
            </span>
            <div>
              <h1 className="font-headline text-[18px] tracking-tight text-deep-char leading-tight">
                领活派
              </h1>
              <p className="text-[10px] text-warm-ash leading-none mt-0.5">
                让每一次灵活就业都温厚有力
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    "px-md py-sm rounded-lg text-[13px] font-medium transition-all flex items-center gap-2",
                    isActive
                      ? "bg-bone-cream-dim text-linghuo-amber"
                      : "text-graphite hover:text-deep-char hover:bg-bone-cream-dim/60",
                  )
                }
              >
                <Icon name={tab.icon} size={18} />
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MessageCenter />
            <button
              type="button"
              onClick={logout}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full text-[12px] text-graphite hover:text-deep-char hover:bg-bone-cream-dim transition-colors"
            >
              <Icon name="logout" size={16} />
              退出
            </button>
            <span className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full bg-bone-cream-dim text-[12px] font-medium text-deep-char border border-ash-veil">
              {session?.realm === "user" ? session.nickname.slice(0, 1) : "U"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-screen-xl mx-auto px-md md:px-lg pt-md md:pt-lg">
          <Outlet key={location.pathname} />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bone-cream/95 backdrop-blur border-t border-ash-veil pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => (
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
  );
}
