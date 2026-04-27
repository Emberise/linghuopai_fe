/**
 * 三区路由守卫：未登录 → /login；登录身份与请求区不符 → 各自首页。
 * 严格分跳：不允许从一个区漂移到另一个区。
 */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { type Realm, useAuth } from "@/shared/auth/store";

interface RealmGuardProps {
  realm: Realm;
}

export function RealmGuard({ realm }: RealmGuardProps) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (session.realm !== realm) {
    // 串区禁止：把用户送回他所在区的首页
    const home =
      session.realm === "user"
        ? "/u/home"
        : session.realm === "enterprise"
          ? "/b/home"
          : "/admin/dashboard";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
