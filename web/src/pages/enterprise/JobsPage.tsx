/**
 * 企业岗位列表 + 单条管理。
 */
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { enterpriseJobs } from "@/shared/mock/data";
import { useAuth } from "@/shared/auth/store";

export function JobsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const qualified =
    session?.realm === "enterprise" ? session.qualified : false;

  return (
    <div className="space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <h2 className="font-headline text-headline text-deep-char">岗位管理</h2>
          <p className="text-graphite text-[13px] mt-xs">
            第一版仅支持单条发布与管理；批量能力暂未上线。
          </p>
        </div>
        <Button
          onClick={() => navigate(qualified ? "/b/jobs/new" : "/b/qualification")}
        >
          <Icon name="add" size={18} />
          {qualified ? "发布新岗位" : "先去完成资质"}
        </Button>
      </header>

      {!qualified ? (
        <Card tone="warm" className="p-lg flex items-center gap-md">
          <span className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Icon name="lock" />
          </span>
          <div>
            <p className="font-medium text-deep-char">岗位管理已锁定</p>
            <p className="text-[12px] text-graphite">
              请先完成企业资质认证，再发布或查看岗位详情。
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={() => navigate("/b/qualification")}
          >
            前往认证
          </Button>
        </Card>
      ) : null}

      <ul className="space-y-md">
        {enterpriseJobs.map((j) => (
          <Card key={j.id} className="p-lg flex flex-col md:flex-row md:items-center gap-md">
            <div className="flex-1 min-w-0">
              <header className="flex flex-wrap items-center gap-sm mb-xs">
                <h3 className="font-title text-title text-deep-char">{j.title}</h3>
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
                <span className="flex items-center gap-1">
                  <Icon name="how_to_reg" size={14} />
                  {j.applied} 报名 · {j.passed} 通过初筛
                </span>
              </p>
            </div>
            <div className="flex gap-sm md:items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/b/candidates")}
                disabled={!qualified}
              >
                <Icon name="group" size={16} />
                查看候选人
              </Button>
              <Button variant="secondary" size="sm" disabled={!qualified}>
                管理岗位
              </Button>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
