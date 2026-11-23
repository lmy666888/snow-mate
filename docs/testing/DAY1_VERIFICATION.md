# Day 1 验证记录

日期：2026-11-23，按 America/New_York 客户端日期记录。最终审阅方向为淡粉底色、梅紫操作色、Allura 花体 Snowmate；结果不沿用旧深色截图。

## 环境与完成等级

Node v24.20.0，npm 12.0.2，pnpm 11.24.0，PostgreSQL 17.11。Expo SDK 58 / React Native 0.88.1 / React 19.3.0，具体解析版本由 pnpm-lock.yaml 固定。移动依赖参照同版本 Expo 官方模板及 `expo install --check`。

状态：UI Complete（审阅候选，待批准）；Demo Functional **尚未整体达到**；Backend Integrated **否**；Tested on iPhone **否**；Production Ready **否**。

## 实际执行命令与结果

以下命令均在当前 Snowmate 仓库执行，未部署到外部服务。

| 命令 | 结果与范围 |
|---|---|
| `pnpm install` | 依赖安装成功，pnpm-lock.yaml 已生成。esbuild 的必要安装脚本通过工作区 allowBuilds 显式允许，无其他项目改动。 |
| `pnpm typecheck` | 最终严格 TypeScript 检查通过，覆盖移动端源代码、共享契约与测试；测试使用显式 Node 类型。 |
| `pnpm lint` | 最终 ESLint 通过，无错误和警告。 |
| `pnpm test` | 3/3 通过：虚构票价不可冒充已验证来源、USD 格式化、合成运动来源和协议版本。 |
| `pnpm build` | 最终浅粉主题 Web 静态导出成功，含本地摄影与字体资源；不是公网部署。 |
| `pnpm --filter @snowmate/mobile exec expo export --platform ios --output-dir dist-ios` | 最终 iOS JS/Hermes bundle 导出成功（约 5.9 MB bundle），字体和图片包含在导出资产内；不是签名原生构建。 |
| `pnpm --filter @snowmate/mobile exec expo install --check` | 通过：Dependencies are up to date。 |
| 在 `apps/mobile` 执行 `pnpm dlx expo-doctor` | 20/20 检查通过；不代表已在实体设备运行。 |
| `PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm exec playwright install chromium` | 安装到仓库私有 `.local/browsers`。本机 headless-shell 崩溃，最终配置选择完整 Chromium。 |
| `PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm test:ui` | 最终 7/7 通过，42.2 秒；无跳过、重试或不稳定通过。32 个路由逐页渲染，无 pageerror；以下导航、状态及触摸检查通过。 |
| `PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" node scripts/capture-review.cjs` | 实际生成 3 张加高视口和 1 张五标签总览，结合 UI 测试的 15 张截图，共 19 张 PNG。 |
| `pnpm test:db` | 本地 PostgreSQL 迁移应用成功，29 项权限断言全部通过。测试实例结束自动停止，未连接 Supabase。 |
| `git diff --check` | 无输出；本仓库首次生成文件尚未提交，源文件另经 Prettier 格式化。 |

UI 开发服务器实际启动命令：`pnpm --filter @snowmate/mobile exec expo start --web --port 8081`。原生启动说明见 README 和审阅包。

## 浏览器验证范围

- 31 个产品路由 + 组件状态页的代表内容、无未匹配路由/运行异常、无页面横向溢出。
- 图片不超出视口：发现并修复 React Native Web ImageBackground 使用原始尺寸的问题，为背景图指定 100% 宽高。
- Welcome 跳过、五标签切换、Trip Planner 输入 → 固定结果、票价 → Offer、不可购买的禁用态。
- Pass/Like 按钮 → 样例匹配 → 临时聊天输入。
- 资料姓名与站姿的内存更新、导航后保留、重新加载重置；行程收藏状态的视觉更新。
- 教练固定合成图表，暂停/断连控件的视觉状态。
- Chromium CDP 触摸事件拖动卡片：移动中出现 PASS，松手后切换到下一虚构人物。
- 393×852 和 375×812 两种移动视口；不是 Safari 或 iOS 系统渲染测试。

## 数据库验证范围

匿名无 profile/RPC 权限；不能直接创建单向 match 或会话成员；不能伪造 profile 身份、消息发送者或 verified motion origin；第一方向 like 不产生 match，反向 like 产生唯一 canonical match、conversation 与两个成员；重复 like 幂等；非成员无法读取或发送消息；私人 preferences、motion_sessions 和 incoming likes 不可由他人读取；双方拉黑后隐藏 profile/match/message，不能发送；report 对举报人私有；全部 11 表启用 RLS；profile 没有 email/precise location/admin 字段。

本地 Auth schema 是测试夹具，不验证真实 Supabase JWT、Auth、Realtime 或 Storage。并发压力、RPC 限速、实际 Supabase 配置与存储策略仍需后续验证。

## 开发期间发现并修复的问题

- SDK 原生 SVG 依赖版本不匹配：改为 Expo 期望的 15.16.0。
- RN 0.88 已移除 `StyleSheet.absoluteFillObject`：改为显式绝对定位属性。
- React refs 静态规则：Animated.ValueXY 改为稳定 lazy state，拖拽 PanResponder 使用稳定 memo/callback，避免拖动反馈触发重建。
- 新增测试的 Node 类型声明：明确加入 @types/node 和 tsconfig types。
- 精简 Chromium GPU/ICU 进程崩溃：改用完整 Chromium 通道，不将基础设施崩溃算作 App 通过。
- 背景照片展示为原始尺寸左上角：背景图加 100% 宽高，并补充图片尺寸断言。
- 自动拖拽从鼠标事件改为移动环境真实触摸事件；最终触摸测试通过。尚不能推断原生 iOS 性能。

## 未验证项目与已知限制

完整 Xcode 和 simctl 不存在，原生签名构建、Simulator、Expo Go/真机启动 **未完成**。VoiceOver、最大 Dynamic Type、输入键盘遮挡、原生分享、modal 焦点、减少动态效果在硬件上的效果、Android 和 Safari **未测试**。

没有进行生产数据/网络写入、AI 正确率评估、实时价格校验、真实 IMU/BLE 采集、认证会话持久化或生产安全审计。价格和运动图表始终标明虚构/合成。UI 截图与运行结果保存在 `docs/design/review/day1/`；临时测试报告、浏览器、PostgreSQL 数据与构建导出在 .gitignore 排除的本地目录中。
