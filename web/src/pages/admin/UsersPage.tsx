/**
 * 个人用户管理列表
 * spec：纯治理；可下架封禁，但不代发任务、不代启动初筛。
 */
import { useMemo, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { adminUsers } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const filters = ["全部", "正常", "待审核", "已封禁"] as const;

export function AdminUsersPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("全部");
  const [keyword, setKeyword] = useState("");

  const list = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchesFilter = filter === "全部" || u.status === filter;
      const matchesKeyword =
        keyword.trim() === "" ||
        u.nickname.includes(keyword) ||
        u.phone.includes(keyword);
      return matchesFilter && matchesKeyword;
    });
  }, [filter, keyword]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">
          个人用户管理
        </h2>
        <p className="text-graphite text-[13px] mt-xs">
          纯治理：仅查看 / 下架 / 标记，不代用户执行任何业务动作。
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
              placeholder="按昵称、手机号搜索"
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

        {/* 桌面：表格 / 移动：卡片 */}
        <div className="hidden md:block">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-warm-ash uppercase tracking-widest text-[11px]">
                <th className="py-sm font-medium">用户</th>
                <th className="py-sm font-medium">手机号</th>
                <th className="py-sm font-medium">注册时间</th>
                <th className="py-sm font-medium">任务参与</th>
                <th className="py-sm font-medium">状态</th>
                <th className="py-sm font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash-veil">
              {list.map((u) => (
                <tr key={u.id} className="text-deep-char">
                  <td className="py-md">
                    <div className="flex items-center gap-sm">
                      <span className="h-8 w-8 rounded-full bg-bone-cream-dim flex items-center justify-center text-deep-char text-[12px] font-medium">
                        {u.nickname.slice(0, 1)}
                      </span>
                      <span className="font-medium">{u.nickname}</span>
                    </div>
                  </td>
                  <td className="py-md text-graphite">{u.phone}</td>
                  <td className="py-md text-graphite">{u.registeredAt}</td>
                  <td className="py-md text-graphite">{u.taskCount}</td>
                  <td className="py-md">
                    <Badge
                      tone={
                        u.status === "正常"
                          ? "success"
                          : u.status === "待审核"
                            ? "amber"
                            : "danger"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-md text-right">
                    <button
                      type="button"
                      className="text-[12px] text-misty-slate hover:text-linghuo-amber"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden space-y-sm">
          {list.map((u) => (
            <li
              key={u.id}
              className="bg-bone-cream-dim border border-ash-veil rounded-lg px-md py-sm flex items-center gap-md"
            >
              <span className="h-9 w-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-deep-char font-medium">
                {u.nickname.slice(0, 1)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-deep-char truncate">
                  {u.nickname}
                </p>
                <p className="text-[11px] text-graphite mt-0.5">
                  {u.phone} · {u.registeredAt}
                </p>
              </div>
              <Badge
                tone={
                  u.status === "正常"
                    ? "success"
                    : u.status === "待审核"
                      ? "amber"
                      : "danger"
                }
              >
                {u.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
