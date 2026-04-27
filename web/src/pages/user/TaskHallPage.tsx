/**
 * 任务大厅：同时展示个人发任务与企业发岗位，仅在卡片上做轻量来源标识。
 * 默认按 AI 推荐优先级排序。
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { taskHall } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const filters = [
  { key: "all", label: "全部" },
  { key: "remote", label: "远程" },
  { key: "design", label: "设计" },
  { key: "frontend", label: "前端" },
  { key: "operation", label: "运营 / 内容" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function TaskHallPage() {
  const [active, setActive] = useState<FilterKey>("all");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const list = useMemo(() => {
    return taskHall.filter((t) => {
      const matchesKeyword =
        keyword.trim() === "" ||
        t.title.toLowerCase().includes(keyword.toLowerCase()) ||
        t.publisher.includes(keyword);
      const matchesFilter =
        active === "all"
          ? true
          : active === "remote"
            ? t.tags.some((tag) => tag.includes("远程"))
            : active === "design"
              ? /UI|插画|设计/i.test(t.title)
              : active === "frontend"
                ? t.title.includes("前端")
                : active === "operation"
                  ? /脚本|活动|运营|内容/.test(t.title)
                  : true;
      return matchesKeyword && matchesFilter;
    });
  }, [active, keyword]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="font-headline text-headline text-deep-char">
          任务大厅
        </h2>
        <p className="text-graphite text-[13px] mt-xs">
          全量已发布任务，按你的画像智能排序，个人与企业一起呈现。
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center gap-md md:gap-lg">
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
            placeholder="搜索任务标题、发布者、标签"
            className="w-full pl-xl pr-md h-11 rounded-lg bg-bone-cream-dim border border-ash-veil placeholder:text-warm-ash text-body focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={cn(
                "shrink-0 px-md h-9 rounded-full text-[12px] font-medium transition-colors",
                active === f.key
                  ? "bg-linghuo-amber text-white"
                  : "bg-bone-cream-dim text-graphite hover:bg-surface-container-low border border-ash-veil",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {/* 热门活动 banner（克制：占一格而不是横通栏） */}
        <Card
          className="relative overflow-hidden p-lg text-white bg-gradient-to-br from-linghuo-amber to-primary cursor-pointer md:col-span-2 lg:col-span-1"
        >
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-widest text-white/80">
              本周热门
            </p>
            <h3 className="font-headline text-[20px] mt-1">
              城市青年作品季
            </h3>
            <p className="text-white/85 text-[13px] mt-xs leading-relaxed max-w-[28ch]">
              50 个设计向任务集中开放，AI 优先按你的画像推荐入选项。
            </p>
            <button
              type="button"
              className="mt-md inline-flex items-center gap-1 text-[13px] font-medium bg-white/15 hover:bg-white/25 backdrop-blur-sm px-md h-9 rounded-full transition-colors"
            >
              查看入选任务
              <Icon name="arrow_forward" size={14} />
            </button>
          </div>
          <Icon
            name="local_fire_department"
            className="absolute -right-3 -bottom-3 text-white/15"
            size={120}
            filled
          />
        </Card>
        {list.map((t) => (
          <Card
            key={t.id}
            tone="warm"
            hoverable
            className="p-lg cursor-pointer flex flex-col gap-md"
            onClick={() => navigate(`/u/tasks/${t.id}`)}
          >
            <div className="flex items-start justify-between gap-sm">
              <div>
                <h3 className="font-title text-title text-deep-char">
                  {t.title}
                </h3>
                <p className="text-[12px] text-graphite mt-xs flex items-center gap-xs">
                  <Icon
                    name={t.source === "enterprise" ? "domain" : "person"}
                    size={14}
                  />
                  {t.publisher}
                </p>
              </div>
              <Badge tone={t.source === "enterprise" ? "slate" : "graphite"}>
                {t.source === "enterprise" ? "企业发布" : "个人发布"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-xs">
              {t.tags.map((tag) => (
                <Badge key={tag} tone="graphite">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-auto flex items-end justify-between">
              <div>
                <p className="text-[11px] text-warm-ash">{t.budgetType}</p>
                <p className="text-linghuo-amber font-headline text-[20px]">
                  {t.budget}
                </p>
              </div>
              {t.matchScore ? (
                <div className="text-right">
                  <p className="text-[11px] text-graphite">AI 匹配度</p>
                  <p className="font-headline text-[18px] text-misty-slate">
                    {t.matchScore}%
                  </p>
                </div>
              ) : (
                <span className="text-[12px] text-warm-ash flex items-center gap-1">
                  <Icon name="schedule" size={14} />
                  新发布
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="py-xl text-center text-graphite">
          <Icon name="inbox" size={32} className="text-warm-ash" />
          <p className="mt-sm">暂无符合条件的任务，换个关键词试试。</p>
        </div>
      ) : null}
    </div>
  );
}
