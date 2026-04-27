/**
 * 企业用户管理（占位列表，结构与个人用户一致）
 */
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";

const enterprises = [
  { id: "e-001", name: "极光科技工作室", contact: "138****1010", verified: true, jobs: 3, registeredAt: "2026-03-04" },
  { id: "e-002", name: "雾灰设计事务所", contact: "138****2020", verified: true, jobs: 2, registeredAt: "2026-03-08" },
  { id: "e-003", name: "光合插画工作室", contact: "138****3030", verified: false, jobs: 0, registeredAt: "2026-04-12" },
  { id: "e-004", name: "WarmLight 营销", contact: "138****4040", verified: true, jobs: 5, registeredAt: "2026-02-21" },
];

export function AdminEnterprisesPage() {
  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">
          企业用户管理
        </h2>
        <p className="text-graphite text-[13px] mt-xs">
          查看企业基础信息、资质状态与发布岗位数量。可标记 / 暂停企业。
        </p>
      </header>

      <Card className="p-lg">
        <div className="hidden md:block">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-warm-ash uppercase tracking-widest text-[11px]">
                <th className="py-sm font-medium">企业</th>
                <th className="py-sm font-medium">联系人</th>
                <th className="py-sm font-medium">资质</th>
                <th className="py-sm font-medium">岗位数</th>
                <th className="py-sm font-medium">注册时间</th>
                <th className="py-sm font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash-veil">
              {enterprises.map((e) => (
                <tr key={e.id} className="text-deep-char">
                  <td className="py-md">
                    <div className="flex items-center gap-sm">
                      <span className="h-8 w-8 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                        <Icon name="domain" size={16} />
                      </span>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="py-md text-graphite">{e.contact}</td>
                  <td className="py-md">
                    <Badge tone={e.verified ? "success" : "amber"}>
                      {e.verified ? "已认证" : "待认证"}
                    </Badge>
                  </td>
                  <td className="py-md text-graphite">{e.jobs}</td>
                  <td className="py-md text-graphite">{e.registeredAt}</td>
                  <td className="py-md text-right">
                    <button className="text-[12px] text-misty-slate hover:text-linghuo-amber">
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden space-y-sm">
          {enterprises.map((e) => (
            <li
              key={e.id}
              className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm flex items-center gap-md"
            >
              <span className="h-9 w-9 rounded-lg bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
                <Icon name="domain" size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-deep-char truncate">{e.name}</p>
                <p className="text-[11px] text-graphite mt-0.5">
                  {e.contact} · {e.registeredAt}
                </p>
              </div>
              <Badge tone={e.verified ? "success" : "amber"}>
                {e.verified ? "已认证" : "待认证"}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
