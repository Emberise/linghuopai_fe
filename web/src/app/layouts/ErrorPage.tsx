/**
 * 错误页：403 / 404，统一造型。
 */
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";

interface Props {
  code: 403 | 404;
}

export function ErrorPage({ code }: Props) {
  const config = {
    403: { title: "你不在这间屋子的钥匙环上", hint: "这条路径需要其他身份。请回到登录页选择正确的入口。" },
    404: { title: "这扇门暂时还没开", hint: "你访问的页面不存在，或已下线。" },
  }[code];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bone-cream text-deep-char px-md">
      <div className="text-center max-w-md">
        <p className="text-[12px] tracking-[0.4em] text-graphite uppercase">
          {code}
        </p>
        <h1 className="mt-sm font-display text-display text-deep-char">
          {config.title}
        </h1>
        <p className="mt-md text-graphite leading-relaxed">{config.hint}</p>
        <div className="mt-lg flex justify-center gap-sm">
          <Link to="/login">
            <Button variant="primary">
              <Icon name="login" size={18} />
              回到登录页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
