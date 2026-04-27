/**
 * 任务管理列表（运营后台）
 * spec：可下架 / 标记，不发布、不代发、不代启动初筛
 */
import { useMemo, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { adminTasks, taskStatusMeta } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const filters = ["全部", "已发布", "进行中", "已关闭"] as const;
const statusFilterMap: Record<(typeof filters)[number], string | null> = {
  全部: null,
  已发布: "PUBLISHED",
  进行中: "IN_PROGRESS",
  已关闭: "CLOSED",
};

export function AdminTasksPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("全部");
  const [keyword, setKeyword] = useState("");

  const list = useMemo(() => {
    const target = statusFilterMap[filter];
    return adminTasks.filter((t) => {
      const matchesFilter = !target || t.status === target;
      const matchesKeyword =
        keyword.trim() === "" ||
        t.title.includes(keyword) ||
        t.publisher.includes(keyword);
      return matchesFilter && matchesKeyword;
    });
  }, [filter, keyword]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">任务管理</h2>
        <p className="text-graphite text-[13px] mt-xs">
          只看不发：可以下架违规任务，但不代企业 / 个人发布。
        </p>
      </header>

      <Card className="p-lg space-y-md">
        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-1 relative">
            <Icon
              name="search"
              className="absolute left-md top-1/2 -translate-y-1/2 text-warm-ash"
              size={18}
            />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="按标题或发布者搜索"
              className="w-full pl-xl pr-md h-10 rounded-lg bg-bone-cream-dim border border-ash-veil placeholder:text-warm-ash text-[14px] focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 px-md h-9 rounded-full text-[12px] font-medium transition-colors",
                  filter === f
                    ? "bg-linghuo-amber text-white"
                    : "bg-bone-cream-dim text-graphite hover:bg-surface-container-low border border-ash-veil",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-warm-ash uppercase tracking-widest text-[11px]">
                <th className="py-sm font-medium">任务</th>
                <th className="py-sm font-medium">发布方</th>
                <th className="py-sm font-medium">来源</th>
                <th className="py-sm font-medium">发布时间</th>
                <th className="py-sm font-medium">状态</th>
                <th className="py-sm font-medium">AI 报告</th>
                <th className="py-sm font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash-veil">
              {list.map((t) => {
                const meta = taskStatusMeta[t.status];
                return (
                  <tr key={t.id} className="text-deep-char">
                    <td className="py-md font-medium">{t.title}</td>
                    <td className="py-md text-graphite">{t.publisher}</td>
                    <td className="py-md">
                      <Badge tone={t.source === "enterprise" ? "slate" : "graphite"}>
                        {t.source === "enterprise" ? "企业" : "个人"}
                      </Badge>
                    </td>
                    <td className="py-md text-graphite">{t.publishedAt}</td>
                    <td className="py-md">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium",
                          meta.tone,
                        )}
                      >
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-md text-graphite">{t.reportCount}</td>
                    <td className="py-md text-right space-x-3">
                      <button
                        type="button"
                        className="text-[12px] text-misty-slate hover:text-linghuo-amber"
                      >
                        详情
                      </button>
                      <button
                        type="button"
                        className="text-[12px] text-error hover:underline"
                        disabled={t.status === "CLOSED"}
                      >
                        下架
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden space-y-sm">
          {list.map((t) => {
            const meta = taskStatusMeta[t.status];
            return (
              <li
                key={t.id}
                className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm"
              >
                <header className="flex items-center justify-between gap-sm">
                  <p className="font-medium text-deep-char truncate">{t.title}</p>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium",
                      meta.tone,
                    )}
                  >
                    {meta.label}
                  </span>
                </header>
                <p className="text-[11px] text-graphite mt-1">
                  {t.publisher} · {t.publishedAt}
                </p>
                <div className="mt-sm flex items-center justify-between">
                  <Badge tone={t.source === "enterprise" ? "slate" : "graphite"}>
                    {t.source === "enterprise" ? "企业发布" : "个人发布"}
                  </Badge>
                  <span className="text-[11px] text-graphite">
                    报告 {t.reportCount}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
