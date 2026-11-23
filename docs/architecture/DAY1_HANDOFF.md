# Day 1 审批前工程交接

这是 UI 审批前交付，不是主提示第 14 节中“已获批并完成功能的 Day 1”声明。按第 10 节停止，等待 owner 对视觉风格、布局、导航、字体、卡片、动画及体验明确批准。

## 新建内容

- 根目录：pnpm workspace、lockfile、脚本、格式化忽略和 README。移动端通过小型 Expo Router 路由文件进入七个 domain 的 screens/fixtures，集中 UI 和 tokens。
- `apps/mobile`：32 个可审阅页面（含 gallery），31 个产品路由；五主标签；Allura 花体、本地摄影、临时 Zustand store、QueryClient provider、安全区域与减少动态效果 hook。
- `packages/shared-types`：stance/level/rider/offer/origin/stage contracts；`packages/sensor-protocol`：v1.0.0 sample/provider 契约。没有 MockMotionProvider 或 BLE 实现。
- `supabase/migrations/202611230001_essential_foundation.sql`：11 表、UUID/FK/约束/索引、RLS、限定 grants、互赞事务 RPC 与 membership/block helpers。
- `supabase/tests` 与 `scripts/test-db.sh`：仅仓库内 PostgreSQL 集群的 29 项角色/权限验证，不触达 Supabase。
- `docs/product`、`architecture`、`design`、`api`、`testing`：实际实现、14 个后续实体设计、决策、集成前置条件和验证记录。
- `docs/design/review/day1`：19 张真实浏览器 PNG、路由清单、中文审阅包。`scripts/capture-review.cjs` 可重复捕获总览与加高视口。

主要依赖：Expo/Router/React Native、expo-font、expo-status-bar、safe-area-context、screens、gesture-handler、Reanimated/worklets、Zustand、TanStack Query、lucide-react-native、react-native-svg、React Native Web。开发检查：TypeScript、ESLint Expo config、tsx/Node test、Playwright、Prettier。精确版本见 package.json / lockfile。没有使用 NativeWind，没有额外 Python/NestJS 服务。

## 验证

最终 typecheck/lint/3 个 unit tests/7 个浏览器 tests/29 个 SQL assertions 全部通过；Expo Doctor 20/20；Web 与 iOS JS bundle 导出成功。Xcode/Simulator/物理 iPhone 未验证。完整命令与修复记录见 `docs/testing/DAY1_VERIFICATION.md`。

## 模块状态与风险

所有模块均是 UI Complete 候选；后端均未连接、真机均未测试、均不为 Production Ready。局部 UI 状态可交互，不能据此宣称完整 Demo Functional。完整逐模块表和视觉限制在 `docs/design/review/day1/REVIEW.md`。

主要风险：最新 SDK 与 owner 手机客户端匹配、原生键盘/动态字号/手势验证；真实 Supabase Auth/RLS/Realtime/Storage 接入；票价源合法性和新鲜度；AI 输出结构/费用/隐私；IMU 校准/时钟/丢包/验证集；持久化和真实错误恢复尚未做。当前没有 API secrets、生产部署、实时价格或真实运动测量。

## 获批后推荐顺序

严格遵循原提示：先完整 Demo Social state machine 与持久化，再 Auth foundation 和 demo fallback，再表单校验/日历/草稿，再确定性 MockMotionProvider（含五种故障场景）。每项单独 typecheck/test/runtime/state 检查。不要从 UI 样例直接扩展成未验证生产逻辑。

Day 2 必须另有指示：准备 owner 的 Supabase development project 和 publishable key、服务端 AI vendor/model/key 与预算、可合法展示的报价 feed、明确的结果 provenance 和质量边界。然后 staging 迁移及 Auth/资料 → AI 行程草稿 → 价格适配器 → 私有运动服务，P2 realtime/community 最后。详见 `docs/api/INTEGRATION_CONTRACTS.md`。

Git：工作分支 `codex/day1-ui-foundation`，origin 为 owner 提供的空 GitHub 仓库；本轮文件保留在本地，未推送、未部署。不会自动开始 Day 2。
