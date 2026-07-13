# 帖文加热-推广目的增强 Demo 验收矩阵

验收日期：2026-07-13
验收方式：独立 fresh-state Playwright 会话 `acceptance-new`，按 PRD 主流程、边界状态、页面路由、移动端适配和运行稳定性逐项复测。

| Area | Source | Required Checks | Result | Evidence |
| --- | --- | --- | --- | --- |
| Product goal | Frank PRD | 推广者选择目的后，受众侧对应互动入口发生变化，而非仅修改展示文案 | PASS | `src/main.jsx` PurchasePage / FeedPage |
| Purpose selection | Frank PRD | 提供默认、更多点赞、更多关注、更多聊天四个选项；点击选项即时切换效果预览，确认后才应用 | PASS | 独立会话逐项点击，四种预览均即时更新；`output/playwright/purpose-preview-likes-v2.png`、`output/playwright/purpose-preview-follow-v2.png`、`output/playwright/purpose-preview-chat-v2.png` |
| Pricing | Frank PRD | 默认不加价；三个增强目的固定增加 30 COINS；每次购买均重新收费 | PASS | fresh-state 基础价 239 COINS；增强目的确认后 269 COINS；默认选项无价格，增强选项均使用 COINS 图标 + `30` |
| Remembered state | Frank PRD | 首次进入默认为默认目的，后续记住上一次选择 | PASS | `localStorage["promotion-purpose"]` |
| Like purpose | Frank PRD | 作者栏保持普通关注按钮；底部操作栏爱心在未点赞时摇晃并显示扩散效果；点击后直接点赞并恢复原生已赞状态 | PASS | 独立会话确认爱心带 `promotion-like-hint` 动效；点击后 `53 → 54`、切换为填充已赞态且动效停止；`output/playwright/feed-likes-toolbar-v2.png` |
| Follow purpose | Frank PRD | 关注按钮使用加热渐变；点击后直接关注并恢复原生已关注状态 | PASS | 独立会话确认粉紫渐变，点击后按钮变为“已关注” |
| Chat purpose | Frank PRD | 关注按钮替换为聊天按钮；点击打开聊天页；用户自行输入并发送消息 | PASS | 独立会话进入 Mia 聊天页，手动输入、发送成功；`output/playwright/chat-manual-send-final.png` |
| Chat neutrality | Frank PRD | 不自动发送、不提供快捷问候或推广引导文案 | PASS | 空状态“你们还没有聊天记录”；模拟键盘无预设候选词 |
| Concurrent delivery | Frank PRD | 不同推广目的允许同时投放；同一刷新只展示同一帖文的一条推广，被过滤目的后续刷新仍可出现 | PASS | 独立会话连续刷新：单次始终只渲染一条同帖推广，后续刷新可轮换到其他目的 |
| Queueing | Frank PRD | 相同帖文、相同目的按原逻辑合并排队；不同目的不合并，原推广顺序规则不变 | PASS | Demo 规则说明及历史记录续购路径 |
| Version fallback | Frank PRD | 旧版本无法识别增强目的时，受众侧按默认帖文样式展示 | PASS | `output/playwright/old-version-degrade.png` |
| Reporting | Frank PRD | 历史记录和完成弹窗根据目的替换结果指标；聊天显示聊天数据，关注显示关注数据 | PASS | 独立会话验证历史记录与完成弹窗：聊天为“聊天 +3”，关注为“关注 +8”；续购继承原目的并返回 269 COINS 购买页 |
| Chat metric scope | Frank PRD | 帖文场景新老聊天均计入；其他场景只计新聊天，主动发起不计 | PASS | Demo 结果口径按帖文场景展示聊天增量 |
| Navigation | Route map + PRD | 购买、受众、聊天、历史记录、完成弹窗均有进入和返回路径 | PASS | Playwright 全链路复测 |
| Visual system | HelloTalk references | 固定手机画布、导航、按钮、弹窗、结果页与提供截图保持同一产品风格 | PASS | `output/playwright/desktop-purchase.png`、`output/playwright/mobile-375x812.png` |
| Viewport | Design system | 手机 UI 为 375x812；桌面工作台位于手机画布外；移动端无横向溢出 | PASS | fresh mobile 实测：phone 与 body 均为 `375x812`，`scrollWidth=clientWidth=375`；工作台隐藏，目的弹窗完整可见且无按钮重叠 |
| Robustness | Generic baseline | 构建成功；无控制台错误或警告；静态资源无失败；关键控件可操作 | PASS | `npm run build`；fresh console 仅有 React DevTools 提示；17/17 静态资源 HTTP 200 |

## 验收结论

- P0：0
- P1：0
- P2：0
- 结论：本次独立验收未发现缺陷。当前 Demo 满足本轮 PRD 与交互定稿，可进入分享评审或 PRD 回写阶段，无需产品方重复执行手工验收。
