/**
 * 应用根组件：路由 + 三区严格分跳。
 */
import { Navigate, Route, Routes } from "react-router-dom";

import { UserLayout } from "@/app/layouts/UserLayout";
import { EnterpriseLayout } from "@/app/layouts/EnterpriseLayout";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { ErrorPage } from "@/app/layouts/ErrorPage";
import { RealmGuard } from "@/shared/auth/RealmGuard";

import { LoginPage } from "@/pages/login/LoginPage";

import { UserHomePage } from "@/pages/user/HomePage";
import { TaskHallPage } from "@/pages/user/TaskHallPage";
import { TaskDetailPage } from "@/pages/user/TaskDetailPage";
import { ResumePortraitPage } from "@/pages/user/ResumePortraitPage";
import { ApplicationsPage } from "@/pages/user/ApplicationsPage";
import { AssistantPage } from "@/pages/user/AssistantPage";
import { ScreeningPage } from "@/pages/user/ScreeningPage";
import { MePage } from "@/pages/user/MePage";
import { AgreementsPage } from "@/pages/user/AgreementsPage";
import { PostedTasksPage } from "@/pages/user/PostedTasksPage";

import { EnterpriseHomePage } from "@/pages/enterprise/HomePage";
import { QualificationPage } from "@/pages/enterprise/QualificationPage";
import { JobsPage } from "@/pages/enterprise/JobsPage";
import { JobPublishPage } from "@/pages/enterprise/JobPublishPage";
import { CandidatesPage } from "@/pages/enterprise/CandidatesPage";
import { EnterpriseInfoPage } from "@/pages/enterprise/EnterpriseInfoPage";

import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminUsersPage } from "@/pages/admin/UsersPage";
import { AdminEnterprisesPage } from "@/pages/admin/EnterprisesPage";
import { AdminTasksPage } from "@/pages/admin/TasksPage";
import { AdminConfigPage } from "@/pages/admin/ConfigPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 个人端 */}
      <Route element={<RealmGuard realm="user" />}>
        <Route element={<UserLayout />}>
          <Route path="/u" element={<Navigate to="/u/home" replace />} />
          <Route path="/u/home" element={<UserHomePage />} />
          <Route path="/u/tasks" element={<TaskHallPage />} />
          <Route path="/u/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/u/profile" element={<ResumePortraitPage />} />
          <Route path="/u/applications" element={<ApplicationsPage />} />
          <Route path="/u/applications/:id" element={<ApplicationsPage />} />
          <Route path="/u/assistant" element={<AssistantPage />} />
          <Route path="/u/screening/:sessionId" element={<ScreeningPage />} />
          <Route path="/u/posted-tasks" element={<PostedTasksPage />} />
          <Route path="/u/me" element={<MePage />} />
          <Route path="/u/me/agreements" element={<AgreementsPage />} />
        </Route>
      </Route>

      {/* 企业端 */}
      <Route element={<RealmGuard realm="enterprise" />}>
        <Route element={<EnterpriseLayout />}>
          <Route path="/b" element={<Navigate to="/b/home" replace />} />
          <Route path="/b/home" element={<EnterpriseHomePage />} />
          <Route path="/b/qualification" element={<QualificationPage />} />
          <Route path="/b/jobs" element={<JobsPage />} />
          <Route path="/b/jobs/new" element={<JobPublishPage />} />
          <Route path="/b/candidates" element={<CandidatesPage />} />
          <Route path="/b/me" element={<EnterpriseInfoPage />} />
        </Route>
      </Route>

      {/* 运营后台 */}
      <Route element={<RealmGuard realm="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/enterprises" element={<AdminEnterprisesPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/config" element={<AdminConfigPage />} />
        </Route>
      </Route>

      <Route path="/403" element={<ErrorPage code={403} />} />
      <Route path="*" element={<ErrorPage code={404} />} />
    </Routes>
  );
}
