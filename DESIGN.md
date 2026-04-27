---
name: 领活派 Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#efd4cc'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e3'
  surface-container-high: '#fee2da'
  surface-container-highest: '#f8ddd4'
  on-surface: '#261813'
  on-surface-variant: '#5a4138'
  inverse-surface: '#3d2d27'
  inverse-on-surface: '#ffede8'
  outline: '#8e7066'
  outline-variant: '#e2bfb3'
  surface-tint: '#a93700'
  primary: '#a53600'
  on-primary: '#ffffff'
  primary-container: '#cf4600'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59b'
  secondary: '#4a616f'
  on-secondary: '#ffffff'
  secondary-container: '#cde6f7'
  on-secondary-container: '#506776'
  tertiary: '#005ea3'
  on-tertiary: '#ffffff'
  tertiary-container: '#0077cd'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59b'
  on-primary-fixed: '#380d00'
  on-primary-fixed-variant: '#812800'
  secondary-fixed: '#cde6f7'
  secondary-fixed-dim: '#b2cada'
  on-secondary-fixed: '#041e2a'
  on-secondary-fixed-variant: '#334a57'
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#a1c9ff'
  on-tertiary-fixed: '#001c37'
  on-tertiary-fixed-variant: '#004880'
  background: '#fff8f6'
  on-background: '#261813'
  surface-variant: '#f8ddd4'
  linghuo-amber: '#EA5614'
  misty-slate: '#4A616F'
  bone-cream: oklch(98% 0.008 60)
  bone-cream-dim: oklch(96% 0.008 60)
  ash-veil: oklch(92% 0.006 60)
  warm-ash: oklch(75% 0.005 60)
  graphite: oklch(45% 0.005 60)
  deep-char: oklch(22% 0.008 60)
typography:
  display:
    fontFamily: Manrope
    fontSize: clamp(2rem, 5vw, 3rem)
    fontWeight: '600'
    lineHeight: '1.1'
  headline:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.25'
  title:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.35'
  body:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max-body: 75ch
---

<!-- SEED — re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: 领活派

## 1. Overview

**Creative North Star: "暖光下的工作站"**

领活派的视觉系统是一间在傍晚开着暖光的工作站。墙是温厚中性的米白与雾蓝灰，做事的人坐下、动手、把任务说清楚；屋子里有一盏暖橙的灯，只在重要的时刻亮起：你被看见了、企业邀约了、AI 把工作做完了、可以下一步了。其他时间，灯是灯，人才是主角。

这个系统服务两类被传统招聘网站打疲了的人：被信息密集和广告条幅压怕的劳动者，被中后台默认皮肤伺候到麻木的企业用人人。所以舞台必须先安静下来，AI 的存在感必须先克制下来，重点色必须先稀少下来；然后才轮到品牌橙在该亮的时候亮，A2A 撮合动画在该出场的时候出场。

这个系统**明确拒绝**：
- 51job / 智联 / BOSS 直聘那种密集表格、广告条幅、"立即领取" 弹层的招聘网站气质
- 黑底紫光、神经网络背景、未来感霓虹的纯 AI 玄学风（不是设计选择，是训练数据反射）
- Ant Design / Element Plus 默认皮肤直接出场的蓝灰色 B 端中后台无感

**Key Characteristics:**
- 温厚中性主导，品牌橙是稀少的强光
- 单无衬线的人文字体承担全部排版
- 动效双轨：主链路安静，A2A 撮合场景才动起来
- 移动端是真的移动优先，不是桌面缩一缩
- 状态、节点、下一步永远讲清楚，不让人猜

## 2. Colors: 暖光与雾灰的 Restrained 调色板

整个调色板是温厚中性 + 一支暖橙重点色，再加一支冷雾蓝灰做次中性陪衬；策略是 **Restrained**：标准色出现频率 ≤5%。

### Primary

- **领活橙 (LingHuo Amber)** `#EA5614` / `oklch(63.8% 0.2 36)`：品牌标准色。**稀少**：用于关键 CTA、关键状态指示（"已邀约"、"AI 报告生成"）、品牌锚点（logo、loading 主色）、A2A 撮合动效中的"企业 Agent"头像。**禁止**：作为大面积背景、作为页面主色块、作为多个并列元素的统一强调色。
- **雾灰青 (Misty Slate)** `#4A616F` / `oklch(45.5% 0.035 232)`：品牌辅助色。承担次级强调、关键导航文字、信息标签、A2A 撮合动效中的"学生 Agent"头像。**不喧宾夺主**：永远比领活橙低一级。

### Neutral

由暖白逐级走到深炭，所有中性色微微向品牌橙的色相倾斜（chroma 0.005 ~ 0.012），这样品牌橙落在画面里时，是"同一光线下的强调"，不是"贴上去的"。

- **米白 (Bone Cream)** `oklch(98% 0.008 60)`：主背景。
- **米白 -1 (Bone Cream Dim)** `oklch(96% 0.008 60)`：分区背景、表单底色、抽屉背景。
- **雾白 (Ash Veil)** `oklch(92% 0.006 60)`：分隔线、卡片描边、低强度边界。
- **暖灰 (Warm Ash)** `oklch(75% 0.005 60)`：占位文字、被禁用文字、辅助说明。
- **石墨 (Graphite)** `oklch(45% 0.005 60)`：次级正文、Label 文字。
- **深炭 (Deep Char)** `oklch(22% 0.008 60)`：主要正文、标题、关键数字。

### Named Rules

**The 5% 暖光 Rule.** 领活橙在任何一屏上的占面积不超过 5%。它是稀少光源，不是装饰漆。如果一屏里出现两个并列的橙色按钮、橙色 tag、橙色图标，就已经过亮了——挑出最重要的一个保留橙，其他降到雾灰青或深炭。

**The Tinted Neutral Rule.** **禁止** `#000` 与 `#fff`。所有中性色必须微微暖偏（色相 60 附近，chroma 0.005 ~ 0.012）。这是"同一盏暖灯下"的物理一致性。

**The Anti-AI-Slop Rule.** **禁止** 黑底紫光、神经网络背景、未来感霓虹、"AI 风暴" 视觉。AI 原生不是 AI 视觉装饰；它的表达是助手姿态、克制、稳定，不是粒子和发光。

## 3. Typography

**Display Font:** 单无衬线，人文偏暖。具体字体在实现阶段选定（候选方向：Inter / Manrope / Sohne / 思源黑体；中文配 PingFang / Source Han Sans VF / HarmonyOS Sans）。

**Body Font:** 与 Display 同族同源；不引入第二种英文字体家族。

**Label / Mono Font:** 实现阶段决定是否引入等宽字体；如引入，仅用于数字、ID、时间戳、AI 流式输出代码块。

**Character:** 这套排版应该读起来像一个声音冷静、不抢话、有过经验的助手在跟你解释下一步。它不卖弄、不煽情、不写营销腔。它有人文温度，但温度是在字距与节奏里，不是在装饰里。

### Hierarchy

- **Display** (FontWeight 600, `clamp(2rem, 5vw, 3rem)`, line-height 1.1)：仅用于关键节点的大标题，如登录页主标题、空状态主插图旁、A2A 撮合页大屏模式。**禁止**用于普通页面标题。
- **Headline** (FontWeight 600, 24px, line-height 1.25)：页面级主标题（如"任务大厅"、"我的报名"、"候选人详情"）。
- **Title** (FontWeight 500, 18px, line-height 1.35)：分区标题、卡片标题、对话话题。
- **Body** (FontWeight 400, 15px, line-height 1.6, max-width 65–75ch)：正文、任务描述、AI 助手对话。**永远**遵守 65–75ch 行长上限。
- **Label** (FontWeight 500, 12px, letter-spacing 0.04em, 大小写灵活)：状态徽章、任务卡上的"已发布 / 进行中 / 已结束"、表单字段标签。

### Named Rules

**The Two-Step Rule.** 每两级层级之间的字号比 ≥ 1.25。**禁止**出现 16px 与 17px、18px 与 19px 这种近似层级。要么明显大一级，要么不分级。

**The Reading Comfort Rule.** Body 文本的容器最大宽度卡在 65–75ch。**禁止**让正文铺满 PC 大屏整行宽度——劳动者读完两行就会失焦。

**The No-Gradient-Text Rule.** **禁止** `background-clip: text` + 渐变背景的"梦幻文字"。强调用字重和字号，不用色彩特效。

## 4. Elevation

领活派**默认平面**。深度通过：
1. 中性色逐级递进的"色调分层"（米白 → 米白-1 → 雾白）
2. 仅在状态需要时（hover / focus / 抬起 / 弹层）出现的极轻阴影

阴影不是装饰，而是状态的回声。一个永远悬浮的卡片是 2014 年的设计；一个 hover 时才轻轻"被注意到"的卡片才是 2026 年的设计。

### Shadow Vocabulary

- **ambient-rest** (`box-shadow: 0 1px 0 0 oklch(92% 0.006 60)`)：默认状态下卡片与表单的极轻分隔（实质是底部 1px 而非传统投影）。
- **ambient-hover** (`box-shadow: 0 4px 16px -4px oklch(45% 0.005 60 / 0.08)`)：hover 时卡片的"被注意"信号。
- **floating-overlay** (`box-shadow: 0 16px 40px -12px oklch(22% 0.008 60 / 0.18)`)：抽屉、弹层、消息中心面板。**仅**用于真正脱离文档流的元素。

### Named Rules

**The Flat-By-Default Rule.** 所有表面默认平面。阴影只作为状态的反应（hover、focus、elevation 提升、面板浮起）。**禁止**给静态卡片加默认投影。

**The No-Glassmorphism Rule.** **禁止** glassmorphism 当默认。模糊与玻璃质感只在极少场景出现（消息中心面板对内容上方的轻磨砂、A2A 撮合大屏背景），而且必须是"功能必要"才出现，不是装饰。

## 5. Components

> 项目尚无组件实现。下一次 `/impeccable document` 在有代码后会扫真实 token 与组件结构。当前 seed 版仅记录已经锁定的视觉规格，不预先发明组件。

实现期需要建立的组件，按出现优先级（仅占位列表，不在此处定义具体 token）：

- 按钮（Primary 暖橙 / Secondary 深炭描边 / Ghost 透明 / Danger 暗红）
- 状态徽章（已发布 / 进行中 / 已结束 / 报告生成 / 处理中 / 已邀约 / 已拒绝）
- 任务卡（任务大厅与个人/企业首页共用同一基本卡片，详情页用轻量来源标识区分个人发与企业发）
- 候选人卡片（仅用在企业端候选人列表，含 AI 报告摘要）
- 输入框 / 表单字段（含简历上传、PDF/Word 文件指示、空状态文案）
- 顶部导航（C 端含右上角集成式消息中心；B 端无消息中心）
- 消息中心面板（仅 C 端、右上角、面板内预览、不分 Tab、不提供跳转业务页）
- A2A 撮合动效组件（双 Agent 头像 / 对话气泡 / 流式打字 / 进度条 / 数据可视化 / 大屏模式 / 降级播放）

实现期请遵循上方 Color、Typography、Elevation 的命名规则，避免在组件级擅自破坏整体克制度。

## 6. Do's and Don'ts

### Do:

- **Do** 让 `#EA5614` 领活橙在每一屏上的占面积 ≤ 5%；它是稀少光源。
- **Do** 把所有中性色微微偏向品牌橙的色相（chroma 0.005 ~ 0.012），保持"同一盏暖灯下"的物理一致性。
- **Do** 把 Body 容器宽度卡在 65–75ch；让劳动者读得下去。
- **Do** 用字重和字号传达层级；强调通过节奏，而不是色彩特效。
- **Do** 把"AI 在做什么、你在哪一步、企业是否看到"这三件事永远讲清楚。
- **Do** 把 A2A 撮合动效（双 Agent 头像、对话气泡、流式打字、进度条、数据可视化、大屏模式、降级方案）按既定要点实现，但**只**在该出现的入口（撮合页、大屏模式）出现。
- **Do** 给 A2A 撮合动效准备完整的降级方案：AI 异常时切到预录示例对话循环，前端无感切换。
- **Do** 让所有动画走 ease-out-quart / quint / expo 这类指数缓动；**禁止** bounce / elastic。
- **Do** 让消息中心严格只在 C 端右上角；面板内预览即终点，不提供跳转业务页。
- **Do** 在 Mobile / Pad / PC 三设备上做真正的重排，不是缩放。

### Don't:

- **Don't** 把 51job / 智联 / BOSS 直聘那种密集表格、广告条幅、"立即领取" 运营弹层带进来。
- **Don't** 走纯 AI 玄学风：黑底紫光、神经网络背景、高对比霓虹、"AI 风暴" 粒子。这是训练数据反射，不是设计选择。
- **Don't** 用 Ant Design / Element Plus 的默认蓝灰色出场；那种感觉默认就是"我不在乎你怎么用"。
- **Don't** 用 `#000` 或 `#fff`；所有中性色必须微微暖偏（chroma 0.005 ~ 0.012）。
- **Don't** 用 `border-left` / `border-right` > 1px 的彩色侧条做强调。换成完整描边、背景轻染色，或干脆什么都不加。
- **Don't** 用 `background-clip: text` + 渐变文字；强调用字重和字号。
- **Don't** 让卡片默认带阴影。阴影是状态的回声，不是装饰。
- **Don't** 用 glassmorphism 做默认背景；除非"功能必要"。
- **Don't** 把每个 CTA 都做成大色块橙色按钮。一屏只能有一个真正的主行动。
- **Don't** 把 Modal 当作第一直觉。穷尽 inline / 渐进式 / 抽屉的可能性，再考虑 Modal。
- **Don't** 用 em dash 或 `--` 做分隔；用逗号、冒号、分号、句号或括号。
- **Don't** 在用户面前显示 AI 面试题数上限 / 剩余题数；让劳动者自然回答，不被压迫。
- **Don't** 让候选人在 AI 面前感到"被打分"。AI 是助手，不是裁判。