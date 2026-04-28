/**
 * 企业端工作台：
 * - 首屏以「岗位」+「待处理候选人」为主
 * - 资质状态作为辅助
 * - spec：企业端没有消息中心
 */
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { RingGauge } from "@/shared/ui/RingGauge";
import { useAuth } from "@/shared/auth/store";
import { enterpriseJobs, enterpriseCandidates } from "@/shared/mock/data";

export function EnterpriseHomePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const enterprise = session?.realm === "enterprise" ? session : null;
  const pendingCandidates = enterpriseCandidates.filter(
    (c) => c.stage === "REPORT_GENERATED" || c.stage === "IN_PROCESS",
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div className="lg:col-span-2 space-y-lg">
        <section className="grid grid-cols-3 gap-md">
          <Card
            hoverable
            className="p-md md:p-lg cursor-pointer"
            onClick={() => navigate("/b/candidates")}
          >
            <div className="flex items-start justify-between">
              <span className="h-9 w-9 rounded-lg bg-bone-cream-dim text-misty-slate flex items-center justify-center">
                <Icon name="group" />
              </span>
              <span className="text-[10px] text-warm-ash uppercase tracking-widest font-bold">
                Candidates
              </span>
            </div>
            <p className="mt-md font-headline text-[28px] text-deep-char">
              {pendingCandidates}
            </p>
            <p className="text-[12px] text-graphite">待处理候选人</p>
          </Card>
          <Card
            hoverable
            className="p-md md:p-lg cursor-pointer"
            onClick={() => navigate("/b/jobs")}
          >
            <div className="flex items-start justify-between">
              <span className="h-9 w-9 rounded-lg bg-bone-cream-dim text-linghuo-amber flex items-center justify-center">
                <Icon name="work" filled />
              </span>
              <span className="text-[10px] text-warm-ash uppercase tracking-widest font-bold">
                Openings
              </span>
            </div>
            <p className="mt-md font-headline text-[28px] text-deep-char">
              {enterpriseJobs.filter((j) => j.status === "进行中").length}
            </p>
            <p className="text-[12px] text-graphite">招聘中岗位</p>
          </Card>
          <Card
            hoverable
            className="p-md md:p-lg cursor-pointer bg-gradient-to-br from-white to-orange-50/30"
            onClick={() => navigate("/b/candidates")}
          >
            <div className="flex items-start justify-between">
              <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="auto_awesome" filled />
              </span>
              <span className="text-[10px] text-linghuo-amber uppercase tracking-widest font-bold">
                AI Insight
              </span>
            </div>
            <p className="mt-md font-headline text-[28px] text-deep-char">12</p>
            <p className="text-[12px] text-graphite">AI 报告生成（本周）</p>
          </Card>
        </section>

        <section>
          <header className="flex items-center justify-between mb-md">
            <h2 className="font-title text-title text-deep-char">
              我发布的岗位
            </h2>
            <button
              type="button"
              onClick={() => navigate("/b/jobs")}
              className="text-[13px] text-misty-slate hover:text-linghuo-amber flex items-center gap-1"
            >
              查看全部 <Icon name="arrow_forward" size={14} />
            </button>
          </header>
          <ul className="space-y-md">
            {enterpriseJobs.map((j) => (
              <Card
                key={j.id}
                hoverable
                className="p-lg flex flex-col md:flex-row md:items-center gap-md cursor-pointer"
                onClick={() => navigate("/b/candidates")}
              >
                <div className="flex-1 min-w-0">
                  <header className="flex items-center gap-sm mb-xs">
                    <h3 className="font-title text-title text-deep-char truncate">
                      {j.title}
                    </h3>
                    <Badge tone="info">{j.status}</Badge>
                  </header>
                  <p className="text-[12px] text-graphite flex flex-wrap gap-x-md gap-y-1">
                    <span className="flex items-center gap-1">
                      <Icon name="location_on" size={14} />
                      {j.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="payments" size={14} />
                      {j.salary}
                    </span>
                  </p>
                </div>
                <div className="flex gap-lg">
                  <div className="text-center">
                    <p className="font-headline text-[18px] text-deep-char">
                      {j.applied}
                    </p>
                    <p className="text-[11px] text-warm-ash">报名人数</p>
                  </div>
                  <div className="text-center">
                    <p className="font-headline text-[18px] text-linghuo-amber">
                      {j.passed}
                    </p>
                    <p className="text-[11px] text-warm-ash">AI 初筛通过</p>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-lg">
        <Card className="p-lg">
          <header className="flex items-center gap-sm mb-md">
            <span
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                enterprise?.qualified
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Icon name="verified" filled size={18} />
            </span>
            <h3 className="font-title text-title text-deep-char">
              企业资质状态
            </h3>
          </header>
          <div className="bg-bone-cream-dim border border-ash-veil rounded-lg p-md">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-graphite font-medium">
                认证结果
              </span>
              <span
                className={`text-[12px] font-bold ${
                  enterprise?.qualified ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {enterprise?.qualified ? "已通过" : "待认证"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-graphite leading-relaxed">
              {enterprise?.qualified
                ? "你的企业资质已通过审核，可使用全部业务能力。"
                : "未完成资质认证前，发布岗位、查看候选人、AI 报告与站内沟通将被锁定。"}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="mt-md"
            onClick={() => navigate("/b/qualification")}
          >
            查看认证详情
          </Button>
        </Card>

        <Card className="p-lg bg-deep-char text-bone-cream relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-linghuo-amber/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 text-[10px] text-linghuo-amber uppercase tracking-widest font-bold">
              <Icon name="auto_awesome" filled size={14} />
              Smart Recruitment
            </span>
            <h3 className="mt-sm font-title text-title">需要发布新职位？</h3>
            <p className="text-[12px] text-warm-ash mt-1 leading-relaxed">
              让 AI 在 30 秒内帮你润色 JD，吸引最合适的候选人。
            </p>
            <Button
              fullWidth
              className="mt-md"
              onClick={() =>
                enterprise?.qualified
                  ? navigate("/b/jobs/new")
                  : navigate("/b/qualification")
              }
            >
              <Icon name="add_circle" size={16} />
              {enterprise?.qualified ? "发布新岗位" : "先去完成资质认证"}
            </Button>
          </div>
        </Card>

        <Card className="p-lg">
          <header className="flex items-center justify-between mb-md">
            <h3 className="font-title text-title text-deep-char">AI 数据看板</h3>
            <span className="text-[10px] text-warm-ash">实时更新</span>
          </header>
          <div className="grid grid-cols-2 gap-sm">
            <RingGauge value={0.94} label="匹配准确度" tone="amber" />
            <RingGauge
              value={0.82}
              label="候选人质量评分"
              display="8.2"
              tone="slate"
            />
          </div>
          <p className="mt-md text-[11px] text-warm-ash leading-relaxed">
            数据由 AI 在每次报告生成后异步刷新；前端不提供「刷新」按钮。
          </p>
        </Card>
      </aside>
    </div>
  );
}
