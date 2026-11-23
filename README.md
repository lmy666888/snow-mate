# Snowmate

iPhone-first 单板滑雪应用的 Day 1 架构与高保真 UI 原型。M1.0 (`v1.0.0`) 为保留基线：尚未接入真实登录、AI、价格、消息或传感器。

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
pnpm --filter @snowmate/mobile exec expo export --platform ios --output-dir dist-ios
pnpm --filter @snowmate/mobile exec expo install --check
pnpm --filter @snowmate/mobile dlx expo-doctor
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm exec playwright install chromium
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/browsers" pnpm test:ui
pnpm test:db
```

`test:db` 需要 PostgreSQL 17 的 initdb/pg_ctl/psql/createdb/dropdb 和 rg。仅启动 `.local/pg-day1` 私有测试实例，使用 127.0.0.1:55439，创建并重建专用 `snowmate_policy_test` 数据库，结束自动停机；不会连接 Supabase。端口被占用时通过 `SNOWMATE_TEST_PG_PORT` 更换。

`build` 是 Web 静态导出，`expo export --platform ios` 是 iOS JS/Hermes bundle 导出，均不等于原生签名构建或真机运行。当前机器缺完整 Xcode，因此 iPhone、VoiceOver、原生手势和键盘仍需人工验证。

## 当前交互边界

滑卡/按钮、示例匹配、聊天/评论输入、行程编辑与收藏、资料编辑、隐私开关均为 UI 预览。Zustand 的名字、站姿、级别及收藏状态仅在当前 JS 会话内保留，其余多为屏幕局部状态。重新加载会重置；示例匹配不代表真实互赞。

价格均为虚构 USD 数字，未验证且不可购买。图表是手工固定合成示意，不是真实测量或 AI 推断。素材可替换，见 [授权来源](apps/mobile/assets/ATTRIBUTION.md)。

远端为 [lmy666888/snow-mate](https://github.com/lmy666888/snow-mate)，本地分支 `codex/day1-ui-foundation`；M1.0 基线已获授权保存至 GitHub；具体状态见 [PROJECT_STATUS](PROJECT_STATUS.md) 和 [M1.0 版本说明](docs/releases/M1.0_RELEASE_NOTES.md)。不部署、不购买服务。后续里程碑必须通过 PR 和 owner 审批，不能自动合并或发布。
