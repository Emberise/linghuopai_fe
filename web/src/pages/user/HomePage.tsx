/**
 * 个人端首页：
 * - 首屏以接任务为主：欢迎卡 + 任务大厅快捷 + AI 推荐
 * - 占位模块以仅展示不可点形式陈列
 * - 发任务入口作为二级
 */
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { useAuth } from "@/shared/auth/store";
import { taskHall } from "@/shared/mock/data";
import { cn } from "@/shared/utils/cn";

const placeholderModules = [
  { name: "信用评分", icon: "shield_person" },
  { name: "AI 技能培训", icon: "school" },
  { name: "灵活用工参保", icon: "health_and_safety" },
  { name: "积分商城", icon: "redeem" },
  { name: "AI 收入规划", icon: "trending_up" },
  { name: "AI 工具调用", icon: "smart_toy" },
] as const;

export function UserHomePage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const recommended = taskHall
    .filter((t) => t.matchScore && t.matchScore >= 88)
    .slice(0, 3);
  const nickname = session?.realm === "user" ? session.nickname : "你";
  const completeness =
    session?.realm === "user" ? session.resumeCompleteness : 92;

  return (
    <div className="space-y-xl">
      {/* Bento 风格欢迎区 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg">
        <Card className="md:col-span-2 p-lg flex flex-col justify-between gap-md">
          <div>
            <h2 className="font-headline text-headline text-deep-char">
              你好，{nickname}
            </h2>
            <p className="text-graphite mt-xs leading-relaxed max-w-body">
              你的 AI 简历已更新，当前匹配度领先 85% 的同类创作者。继续完善画像，
              下一份合适的任务正在路上。
            </p>
          </div>
          <div className="flex flex-wrap gap-md">
            <div className="bg-surface-container-low rounded-lg px-md py-sm border border-linghuo-amber/15">
              <span className="block text-label text-linghuo-amber tracking-widest">
                能力画像
              </span>
              <div className="flex items-baseline gap-xs mt-1">
                <span className="font-headline text-headline text-linghuo-amber">
                  UI 设计
                </span>
                <span className="text-[12px] text-linghuo-amber/70 font-medium">
                  Lvl. High
                </span>
              </div>
            </div>
            <div className="bg-bone-cream-dim rounded-lg px-md py-sm border border-ash-veil flex-1 min-w-[180px]">
              <div className="flex items-center justify-between">
                <span className="text-label text-graphite">资料完整度</span>
                <span className="text-[12px] font-medium text-deep-char">
                  {completeness}%
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-ash-veil rounded-full overflow-hidden">
                <div
                  className="h-full bg-linghuo-amber transition-all duration-500 ease-out-quart"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-lg text-white bg-linghuo-amber flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="font-title text-title">任务大厅</h3>
            <p className="text-white/80 text-[13px] mt-xs">
              探索 1,240+ 新增灵活用工岗位，按你的画像智能排序。
            </p>
          </div>
          <Button
            variant="secondary"
            className="!bg-white !text-linghuo-amber border-transparent self-start mt-md"
            onClick={() => navigate("/u/tasks")}
          >
            立即前往
            <Icon name="arrow_forward" size={18} />
          </Button>
          <Icon
            name="work_outline"
            className="absolute -right-4 -bottom-4 text-white/15"
            size={120}
          />
        </Card>
      </section>

      {/* AI 推荐 */}
      <section>
        <header className="flex items-end justify-between mb-md">
          <div>
            <h2 className="font-headline text-headline text-deep-char">
              AI 智能匹配
            </h2>
            <p className="text-[12px] text-graphite mt-xs">
              基于你的「交互设计」与「插画」能力推荐
            </p>
          </div>
          <Link
            to="/u/tasks"
            className="text-[13px] text-linghuo-amber font-medium hover:underline"
          >
            查看更多
          </Link>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {recommended.map((t) => (
            <Card
              key={t.id}
              tone="warm"
              hoverable
              onClick={() => navigate(`/u/tasks/${t.id}`)}
              className="p-lg cursor-pointer"
            >
              <div className="flex justify-between items-start mb-sm">
                <div className="h-12 w-12 rounded-lg border border-ash-veil bg-surface-container-lowest flex items-center justify-center text-misty-slate overflow-hidden">
                  {/* 同色系几何 logo 占位，避免远程图，保持品牌克制 */}
                  <svg
                    viewBox="0 0 32 32"
                    width={28}
                    height={28}
                    aria-hidden
                  >
                    <rect
                      x="3"
                      y="3"
                      width="26"
                      height="26"
                      rx="6"
                      fill="oklch(96% 0.008 60)"
                    />
                    <path
                      d="M9 22 L16 9 L23 22 Z"
                      fill="#EA5614"
                      fillOpacity="0.18"
                      stroke="#EA5614"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="16" cy="14" r="2.5" fill="#4A616F" />
                  </svg>
                </div>
                <div className="text-right">
                  <span className="block text-linghuo-amber font-bold">
                    {t.budget}
                  </span>
                  <span className="text-label text-graphite">
                    {t.budgetType}
                  </span>
                </div>
              </div>
              <h3 className="font-title text-title text-deep-char mb-xs">
                {t.title}
              </h3>
              <div className="flex flex-wrap gap-xs mb-md">
                {t.tags.map((tag) => (
                  <Badge key={tag} tone="graphite">
                    {tag}
                  </Badge>
                ))}
              </div>
              {t.matchHint ? (
                <div className="bg-linghuo-amber/5 border border-linghuo-amber/15 rounded-lg p-sm flex gap-sm items-start">
                  <Icon
                    name="smart_toy"
                    filled
                    size={16}
                    className="text-linghuo-amber mt-0.5"
                  />
                  <p className="text-[12px] text-linghuo-amber/85 italic leading-relaxed">
                    “{t.matchHint}”
                  </p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      {/* 占位能力：仅展示不可点 */}
      <section>
        <header className="flex items-end justify-between mb-md">
          <div>
            <h2 className="font-headline text-[20px] text-deep-char">
              敬请期待
            </h2>
            <p className="text-[12px] text-graphite mt-xs">
              这些能力即将开放。
            </p>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm">
          {placeholderModules.map((m) => (
            <div
              key={m.name}
              role="presentation"
              aria-disabled
              className={cn(
                "bg-bone-cream-dim border border-ash-veil rounded-xl p-md text-center select-none",
                "opacity-80 cursor-not-allowed",
              )}
            >
              <Icon
                name={m.icon}
                className="text-warm-ash"
                size={22}
              />
              <p className="text-[12px] text-graphite mt-xs leading-tight">
                {m.name}
              </p>
              <p className="text-[10px] text-warm-ash mt-1 uppercase tracking-widest">
                即将开放
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 二级入口：发任务 + 我的协议 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card
          tone="warm"
          hoverable
          className="p-lg flex items-center gap-md cursor-pointer"
          onClick={() => navigate("/u/posted-tasks")}
        >
          <span className="h-12 w-12 rounded-xl bg-linghuo-amber/10 text-linghuo-amber flex items-center justify-center">
            <Icon name="add_task" />
          </span>
          <div className="flex-1">
            <h3 className="font-title text-title text-deep-char">我也想发任务</h3>
            <p className="text-[12px] text-graphite mt-xs">
              复用 AI 帮你润色描述，发布后自动进入任务大厅。
            </p>
          </div>
          <Icon name="arrow_forward" className="text-graphite" />
        </Card>
        <Card
          tone="warm"
          className="p-lg flex items-center gap-md cursor-pointer hover:shadow-ambient-hover transition-shadow"
          onClick={() => navigate("/u/me/agreements")}
        >
          <span className="h-12 w-12 rounded-xl bg-misty-slate/10 text-misty-slate flex items-center justify-center">
            <Icon name="description" />
          </span>
          <div className="flex-1">
            <h3 className="font-title text-title text-deep-char">我的协议</h3>
            <p className="text-[12px] text-graphite mt-xs">
              查看与企业之间签署过的服务协议。本版为占位说明页。
            </p>
          </div>
          <Icon name="arrow_forward" className="text-graphite" />
        </Card>
      </section>
    </div>
  );
}
