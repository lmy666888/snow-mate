# Snowmate 项目状态

- 稳定基线：M1.0 / v1.0.0，main = fda899348c0740242c67ad46307c1232b9fdd598，GitHub 已独立确认。
- M1.1 已于 2026-11-23 获 owner 功能演示阶段验收（Demo Release Candidate），不是生产验收。
- 候选 VERSION 1.1.0，分支 feature/m1.1-social-identity；仍需有效独立 Reviewer 审批及必需 CI，尚未合并 main，也未创建 v1.1.0 标签。
- 审批与条件见 docs/releases/M1.1_APPROVAL.md；流程状态见 M1.1_RELEASE_STATUS.md。
- 当前能力：粉/梅紫 UI、35 路由覆盖、English/简体中文持久切换、手动地区/单位、七步本地身份、六图本机照片、Profile、40 个虚构成人、可筛选/持久化的演示配对与聊天。
- UI Complete / Demo Functional 按模块记录；Backend Integrated = 否，Device Tested = 否，Production Ready = 否。
- 真实 Auth、成人验证、云端图片/资料、Supabase 匹配/Realtime、AI、实时报价、BLE 与运动算法均未集成。
- main 保护真实生效：verify/database + review、管理员执行、禁止强推/删除。
- GitHub：https://github.com/lmy666888/snow-mate 。最新分支、SHA、PR 和 CI 记录见 docs/releases/REMOTE_STATUS.md；功能/风险见 M1.1_ENGINEERING_REPORT.md。
- 所有开发/测试仅使用本地演示资料与授权库存素材，无生产部署、付款或真实消息发送。M1.2 指令已收到，但其 M1.1 已批准并合并的前置条件尚未满足；M1.2 未开始，M1.3/M2.0 未开始。
