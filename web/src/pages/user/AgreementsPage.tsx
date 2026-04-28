/**
 * 我的协议：占位说明页（spec：仅占位，跳转至说明页）
 */
import { Link } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Card } from "@/shared/ui/Card";

export function AgreementsPage() {
  return (
    <div className="max-w-body mx-auto py-lg space-y-lg">
      <header>
        <Link
          to="/u/me"
          className="inline-flex items-center gap-1 text-[12px] text-graphite hover:text-deep-char"
        >
          <Icon name="arrow_back" size={14} />
          返回我的页
        </Link>
        <h1 className="mt-md font-headline text-headline text-deep-char">
          我的协议
        </h1>
        <p className="text-graphite text-[13px] mt-xs">
          这里会集中展示与企业方签署过的服务协议。签约能力即将上线，先做个预告。
        </p>
      </header>

      <Card tone="warm" className="p-lg space-y-md">
        <span className="inline-flex items-center gap-1 text-[11px] text-warm-ash uppercase tracking-widest">
          <Icon name="info" size={14} />
          预告
        </span>
        <h2 className="font-title text-title text-deep-char">
          上线后会出现哪些内容？
        </h2>
        <ul className="space-y-sm text-[13px] text-graphite">
          <li className="flex items-start gap-sm">
            <Icon name="article" size={16} className="text-linghuo-amber mt-0.5" />
            协议列表：与每个任务一一对应
          </li>
          <li className="flex items-start gap-sm">
            <Icon name="schedule" size={16} className="text-misty-slate mt-0.5" />
            状态：待签署 / 已生效 / 已结束
          </li>
          <li className="flex items-start gap-sm">
            <Icon name="lock" size={16} className="text-graphite mt-0.5" />
            隐私边界：仅你与对方企业可见
          </li>
        </ul>
      </Card>
    </div>
  );
}
