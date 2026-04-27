/**
 * RadarPolygon: 五维能力雷达图。
 * - 纯 SVG 绘制，无第三方
 * - 同心五边形网格 + 数据多边形 + 5 维标签
 * - 用 token 颜色：linghuo-amber 数据；ash-veil 网格
 *
 * 5 维：创新力 / 执行效率 / 沟通协调 / 专业广度 / 抗压性
 */
import { useId } from "react";
import { cn } from "@/shared/utils/cn";

export interface RadarAxis {
  label: string;
  value: number; // 0..1
}

interface RadarPolygonProps {
  axes: RadarAxis[]; // 必须 5 项
  size?: number;
  className?: string;
}

function pentagonPoint(cx: number, cy: number, r: number, i: number) {
  // 顶点朝上，等分 5 边
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

export function RadarPolygon({
  axes,
  size = 220,
  className,
}: RadarPolygonProps) {
  const id = useId();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.4;

  // 三层网格
  const layers = [1, 0.66, 0.33];

  const dataPoints = axes
    .slice(0, 5)
    .map((a, i) => pentagonPoint(cx, cy, radius * Math.max(0.05, Math.min(1, a.value)), i))
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const labelPoints = axes
    .slice(0, 5)
    .map((_, i) => pentagonPoint(cx, cy, radius + 18, i));

  return (
    <div className={cn("relative inline-block", className)} aria-label="能力画像雷达图">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
      >
        <defs>
          <radialGradient id={`grad-${id}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="oklch(98% 0.008 60)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(98% 0.008 60)" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* 背景渐变软光 */}
        <circle cx={cx} cy={cy} r={radius * 1.05} fill={`url(#grad-${id})`} />

        {/* 三层同心五边形网格 */}
        {layers.map((scale, layerIndex) => {
          const points = Array.from({ length: 5 }, (_, i) =>
            pentagonPoint(cx, cy, radius * scale, i),
          )
            .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
            .join(" ");
          return (
            <polygon
              key={layerIndex}
              points={points}
              fill="none"
              stroke="oklch(92% 0.006 60)"
              strokeWidth={1}
              opacity={0.85 - layerIndex * 0.18}
            />
          );
        })}

        {/* 5 条主轴线 */}
        {Array.from({ length: 5 }).map((_, i) => {
          const [x, y] = pentagonPoint(cx, cy, radius, i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="oklch(92% 0.006 60)"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        {/* 数据多边形 */}
        <polygon
          points={dataPoints}
          fill="#EA5614"
          fillOpacity={0.18}
          stroke="#EA5614"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* 数据节点 */}
        {axes.slice(0, 5).map((a, i) => {
          const [x, y] = pentagonPoint(
            cx,
            cy,
            radius * Math.max(0.05, Math.min(1, a.value)),
            i,
          );
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3.5}
              fill="#fff"
              stroke="#EA5614"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* 5 维标签：用绝对定位贴在 SVG 外圈 */}
      {axes.slice(0, 5).map((axis, i) => {
        const [x, y] = labelPoints[i];
        return (
          <span
            key={axis.label}
            className="absolute text-[11px] font-medium text-deep-char select-none whitespace-nowrap"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {axis.label}
          </span>
        );
      })}
    </div>
  );
}
