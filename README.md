# Snowmate

iPhone-first 单板滑雪应用。稳定 M1.0 已保存为 `v1.0.0`；当前为 **M1.1 / 1.1.0-dev 审阅候选**，尚未合并或发布。

M1.1 提供双语、地区偏好、七步本地身份、照片管理、40 人虚构资料库和持久化演示探索/配对。没有真实 Auth、云上传、真实互赞、AI、实时票价或 BLE。

先看 [M1.1 审阅包](docs/design/review/m1.1/REVIEW.md)、[工程报告](docs/releases/M1.1_ENGINEERING_REPORT.md)、[验证记录](docs/testing/M1.1_VERIFICATION.md) 和 [仓库状态](docs/releases/REMOTE_STATUS.md)。M1.0 的 Day 1 文档与截图保留为历史材料。

## 启动

需要 Node 24、pnpm 11。首次安装：

```sh
pnpm install --frozen-lockfile
pnpm start
```

iPhone：电脑和手机接入同一 Wi-Fi，在手机安装支持 Expo SDK 58 的 Expo Go，用相机扫描终端二维码。点击 **Explore the demo**，不需要账号或密钥。若商店版本与 SDK 不匹配，先确认可用的 SDK 58 Expo Go / development client，不能把版本错误当作代码已通过真机验证。

网页预览：

```sh
pnpm web
```

已运行开发服务器时可访问 [本地原型](http://localhost:8081)。本地端口不等于公开部署。

## 审阅材料

- [中文 UI 审阅包](docs/design/review/day1/REVIEW.md)
- [产品需求](docs/product/PRD.md)
- [系统架构](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [数据库与 RLS](docs/architecture/DATABASE_SCHEMA.md)
- [传感器架构](docs/architecture/SENSOR_ARCHITECTURE.md)
- [设计系统](docs/design/DESIGN_SYSTEM.md)
- [架构决策](docs/architecture/DECISIONS.md)
- [验证记录](docs/testing/DAY1_VERIFICATION.md)

## 工程结构

`apps/mobile/app` 是 Expo Router 路由；`src/features` 按业务域组织屏幕与固定演示数据；`src/components` 与 `theme` 提供共享 UI；`packages` 仅含共享类型与传感器契约；`supabase` 含未部署的基础迁移与本地权限测试。没有另建 NestJS 或 Python 服务。

## 检查

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build:ios
pnpm --filter @snowmate/mobile exec expo install --check
pnpm --dir apps/mobile dlx expo-doctor
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm exec playwright install chromium
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm test:ui
pnpm test:db
```

`test:db` 需要 PostgreSQL 17 的 initdb/pg_ctl/psql/createdb/dropdb 和 rg。仅启动 `.local/pg-day1` 私有测试实例，使用 127.0.0.1:55439，创建并重建专用 `snowmate_policy_test` 数据库，结束自动停机；不会连接 Supabase。端口被占用时通过 `SNOWMATE_TEST_PG_PORT` 更换。

`build` 是 Web 静态导出，`expo export --platform ios` 是 iOS JS/Hermes bundle 导出，均不等于原生签名构建或真机运行。当前机器缺完整 Xcode，因此 iPhone、VoiceOver、原生手势和键盘仍需人工验证。

## 当前交互边界

社交演示的身份、地区、语言、筛选、已看、喜欢、匹配、屏蔽与聊天使用独立版本化本地存储，刷新保留。40 人资料明确虚构，预置双向喜欢才配对，单向喜欢不会配对。账号预览的成人/照片限制仅是本地演示，不等于认证或服务端权限。

照片通过系统选图，仅保存在本机（Web IndexedDB、原生文档子目录），最多六张，支持校验/主图/排序/删除。可能保留源元数据；未做生产级图片安全和云存储。不要用本地演示存储保存密码或认证 token。

Trips、Prices、Coach、Community 仍是原有样例和局部临时交互，不能视作本轮已完成功能。票价虚构且未验证，运动图表手工合成，未推断真实技术或 AI 准确率。

## 工程约定

VERSION 是应用版本来源，`pnpm version:sync` 同步 manifests，`pnpm version:check` 防止漂移。设置展示构建时的里程碑与 Git SHA。main 只接受 owner 已批准且通过 CI 的 PR；不自动合并、打最终标签、发布或开始下一里程碑。

远端：[lmy666888/snow-mate](https://github.com/lmy666888/snow-mate)。M1.0 已推送；M1.1 在 feature/m1.1-social-identity 上审阅。无生产部署、无服务购买。
