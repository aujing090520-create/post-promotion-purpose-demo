# 帖文加热-推广目的增强 Demo 验收矩阵

验收日期：2026-07-14

验收基线：最新版 Frank PRD revision 51、HelloTalk Demo route map、设计规范与通用可操作性基线。

验收方式：独立 Playwright 会话 `acceptance-20260714`，覆盖 fresh-state、新购买刷新、弹窗草稿态、三种受众效果、聊天发送、历史记录、结束弹窗、续购继承、旧版本降级、并发刷新演示、375x812 移动端和生产构建。

| Area | Source | Required Checks | Result | Evidence |
| --- | --- | --- | --- | --- |
| Product goal | Frank PRD | 推广目的改变受众侧原生互动控件，而非仅修改说明文案 | PASS | 点赞操作栏、关注按钮、聊天按钮三条链路实测 |
| Entry and layout | Frank PRD | 入口位于“加热人群”区域内、“帖文外观”上方；无问号入口；点击整行打开弹窗 | PASS | Playwright DOM 位置与控件检查 |
| Purpose selection | Frank PRD | 四项单选；打开时选中已应用值；选择仅切换预览；确认后应用；关闭或取消不保存 | PASS | 四项逐项检查；取消后仍为默认和 239；确认后更新为增强目的和 269 |
| Pricing | Frank PRD | 默认不显示加价；三个增强目的均显示 HT COIN 图标 + 30；效果预览不显示价格 | PASS | 弹窗价格节点检查与移动端截图 |
| New purchase default | Frank PRD | 新购买始终默认选择“默认”，不记忆用户上一次选择 | PASS | 已移除目的 `localStorage` 读写；确认增强目的后 reload 恢复默认和 239 |
| Continue and duplicate | Frank PRD | 从历史记录继续加热或复制条件时继承该条记录目的；付费目的再次加 30；仍可在购买前修改 | PASS | “更多聊天”记录继续加热后进入 269 购买页；目的入口仍可编辑 |
| More likes | Frank PRD | 不新增按钮；操作栏爱心显示加热高亮、摇晃和扩散；同一卡片生命周期只播放一次；点赞后恢复原生已赞状态 | PASS | 动画迭代次数为 `1`；结束后扩散透明；点击后 `53 -> 54` 且停止增强；后续再次命中可重播 |
| More follows | Frank PRD | 原关注按钮显示粉紫渐变并脉冲一次；点击后恢复原生已关注状态 | PASS | `.heated-follow.pulse-once`；点击后变为“已关注”且移除动效 |
| More chats | Frank PRD | 关注按钮替换为聊天按钮；打开聊天页；不预填、不自动发送；用户自行输入并发送 | PASS | 空聊天页输入值为空；手动输入并发送消息成功 |
| Old-version fallback | Frank PRD | 旧版本忽略增强目的，展示原生点赞和关注控件 | PASS | 开启旧版本降级后仅存在原生关注按钮，无增强聊天、关注或点赞引导 |
| Reporting | Frank PRD | 历史记录和结束弹窗按目的替换中间指标，且同一记录数值一致 | PASS | “更多聊天”历史记录和结束弹窗均显示“聊天 +3” |
| Concurrent feed demo | Frank PRD | 同一次刷新同一帖文只展示一条推广；后续刷新可展示其他目的 | PASS | 每次仅一个 `.moment-card`；连续刷新可切换展示目的 |
| Backend merge rules | Frank PRD | 同目的合并排队；不同目的不合并但可并发；沿用原推广顺序 | NOT TESTABLE | 属于订单、投放和服务端候选逻辑，前端交互 Demo 仅展示规则说明，不作为实现通过证据 |
| Metric computation | Frank PRD | 去重、时间窗、关注增量、聊天新老会话及发起方口径正确 | NOT TESTABLE | Demo 使用静态结果数据；需服务端接口、埋点或测试数据验收 |
| Navigation | Route map + PRD | 购买、受众、聊天、历史记录、完成弹窗均有进入和返回路径 | PASS | Playwright 全链路自动操作通过 |
| Viewport and visual | Design system | 375x812 手机画布；移动端无横向溢出；弹窗和底部操作完整可见；桌面工作台位于手机外 | PASS | `acceptance-final-mobile-375x812.png`、`acceptance-final-desktop.png` |
| Robustness | Demo baseline | 生产构建成功；核心控件可操作；无控制台错误；无 4xx/5xx 资源失败 | PASS | `npm run build`；浏览器错误 0；失败响应 0 |

## 本轮自动修复

| Priority | Finding | Fix | Retest |
| --- | --- | --- | --- |
| P1 | 新购买错误记忆上一次推广目的，刷新后不恢复默认 | 删除 `promotion-purpose` 和 `promotion-purpose-seen` 的持久化读写，App 初始化固定为 `default` | PASS |
| P1 | 更多点赞在同一卡片中无限循环摇晃和扩散 | 受众侧爱心和扩散动画改为单次播放，扩散结束后保持透明；再次命中时可重播 | PASS |

## 验收结论

- 未关闭 P0：0
- 未关闭 P1：0
- 未关闭 P2：0
- 已修复 P1：2
- 前端 Demo 不可验证项：2（服务端推广合并规则、服务端指标统计口径）
- 结论：当前 Demo 的可执行前端范围验收通过。服务端规则不能用静态 Demo 代替研发联调或数据验收。
