/**
 * 严格双账号体系 + 三区分跳的最小 auth store。
 * Phase 1 仅做 mock：手机号 + 验证码 -> 直接成功。
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Realm = "user" | "enterprise" | "admin";

interface BaseSession {
  phone: string;
  loggedInAt: number;
}

export interface UserSession extends BaseSession {
  realm: "user";
  nickname: string;
  resumeCompleteness: number; // 0-100
}

export interface EnterpriseSession extends BaseSession {
  realm: "enterprise";
  enterpriseName: string;
  qualified: boolean; // 是否已完成资质认证
}

export interface AdminSession extends BaseSession {
  realm: "admin";
  displayName: string;
}

export type Session = UserSession | EnterpriseSession | AdminSession;

interface AuthState {
  session: Session | null;
  loginAsUser: (phone: string) => void;
  loginAsEnterprise: (phone: string) => void;
  loginAsAdmin: (account: string) => void;
  setQualified: (qualified: boolean) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      loginAsUser: (phone) =>
        set({
          session: {
            realm: "user",
            phone,
            nickname: phone ? `用户${phone.slice(-4)}` : "陈领活",
            resumeCompleteness: 92,
            loggedInAt: Date.now(),
          },
        }),
      loginAsEnterprise: (phone) =>
        set({
          session: {
            realm: "enterprise",
            phone,
            enterpriseName: "极光科技工作室",
            qualified: true,
            loggedInAt: Date.now(),
          },
        }),
      loginAsAdmin: (account) =>
        set({
          session: {
            realm: "admin",
            phone: account,
            displayName: "运营管理员",
            loggedInAt: Date.now(),
          },
        }),
      setQualified: (qualified) =>
        set((state) => {
          if (state.session?.realm !== "enterprise") return state;
          return {
            session: { ...state.session, qualified },
          };
        }),
      logout: () => set({ session: null }),
    }),
    {
      name: "linghuopai-auth",
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
