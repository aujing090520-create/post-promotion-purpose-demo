import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  Flame,
  Heart,
  Home,
  Image,
  Languages,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import "./styles.css";

const PURPOSES = {
  default: {
    key: "default",
    label: "默认",
    short: "默认",
    title: "默认推广",
    desc: "沿用原有帖文样式与互动入口",
    metric: "赞",
    icon: Sparkles,
    paid: false,
  },
  likes: {
    key: "likes",
    label: "更多点赞",
    short: "点赞",
    title: "获得更多点赞",
    desc: "强化点赞入口，引导用户表达喜欢",
    metric: "赞",
    icon: Heart,
    paid: true,
  },
  follows: {
    key: "follows",
    label: "更多关注",
    short: "关注",
    title: "获得更多关注",
    desc: "强化关注按钮，帮助沉淀长期关系",
    metric: "关注",
    icon: UserPlus,
    paid: true,
  },
  chats: {
    key: "chats",
    label: "更多聊天",
    short: "聊天",
    title: "获得更多聊天",
    desc: "将关注替换为聊天入口，由用户自行发送",
    metric: "聊天",
    icon: MessageCircle,
    paid: true,
  },
};

const PURPOSE_ORDER = ["default", "likes", "follows", "chats"];
const BOOST_COUNTS = [500, 1000, 2000, 3000];
const BASE_PRICES = { 500: 239, 1000: 399, 2000: 699, 3000: 929 };

function StatusBar({ dark = false }) {
  return (
    <div className={`status-bar ${dark ? "status-bar-dark" : ""}`}>
      <span>12:08</span>
      <div className="status-icons" aria-label="设备状态">
        <span className="signal">▮▮▮▮</span>
        <span className="wifi">⌁</span>
        <span className="battery">87</span>
      </div>
    </div>
  );
}

function IconButton({ label, children, className = "", onClick, disabled = false }) {
  return (
    <button
      className={`icon-button ${className}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function PhoneNav({ title, onBack, onClose, right }) {
  return (
    <header className="phone-nav">
      <div className="nav-side">
        {onBack && (
          <IconButton label="返回" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        )}
        {onClose && (
          <IconButton label="关闭" className="nav-close" onClick={onClose}>
            <X size={26} />
          </IconButton>
        )}
      </div>
      <h1>{title}</h1>
      <div className="nav-side nav-side-right">{right}</div>
    </header>
  );
}

function PurposeEffectPreview({ purpose }) {
  const likesPurpose = purpose === "likes";
  const followsPurpose = purpose === "follows";
  const chatsPurpose = purpose === "chats";

  return (
    <div className={`purpose-preview preview-${purpose}`} key={purpose}>
      <div className="preview-heading">
        <span>效果预览</span>
      </div>
      <div className="preview-post">
        <div className="preview-author">
          <img src="/assets/avatar-mia.png" alt="" />
          <div>
            <strong>Mia</strong>
            <span>正在学习 中文 · 推广</span>
          </div>
          {chatsPurpose ? (
            <span className="preview-cta preview-cta-heated pulse-once">
              <MessageCircle size={14} />聊天
            </span>
          ) : (
            <span className={`preview-cta ${followsPurpose ? "preview-cta-heated pulse-once" : ""}`}>
              {followsPurpose && <UserPlus size={14} />}
              关注
            </span>
          )}
        </div>
        <div className="preview-copy">
          <i />
          <i />
        </div>
        <div className="preview-toolbar">
          <span className={likesPurpose ? "preview-like is-heated" : "preview-like"}>
            <span className={likesPurpose ? "toolbar-heart shake-once" : "toolbar-heart"}>
              <Heart size={17} />
            </span>
            53
          </span>
          <span><MessageCircle size={17} />8</span>
          <span><Share2 size={17} /></span>
          <span><MoreHorizontal size={17} /></span>
        </div>
      </div>
    </div>
  );
}

function PurposeModal({ applied, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(applied);

  return (
    <div className="modal-layer" role="presentation" onMouseDown={onCancel}>
      <section
        className="purpose-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purpose-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-heading">
          <div>
            <h2 id="purpose-title">想要获得什么</h2>
            <p>选择一个推广目的，强化对应互动入口</p>
          </div>
          <IconButton label="关闭目的选择" onClick={onCancel}>
            <X size={22} />
          </IconButton>
        </div>

        <div className="purpose-options">
          {PURPOSE_ORDER.map((key) => {
            const item = PURPOSES[key];
            const Icon = item.icon;
            return (
              <button
                type="button"
                className={`purpose-option ${draft === key ? "is-selected" : ""}`}
                key={key}
                onClick={() => setDraft(key)}
              >
                <span className={`purpose-icon purpose-icon-${key}`}>
                  <Icon size={21} />
                </span>
                <span className="purpose-copy">
                  <strong>{item.label}</strong>
                  <small>{item.desc}</small>
                </span>
                {item.paid && (
                  <span className="purpose-price">
                    <img src="/assets/ht-coin.png" alt="HT" />
                    <b>30</b>
                  </span>
                )}
                <span className="radio-mark">{draft === key && <Check size={15} />}</span>
              </button>
            );
          })}
        </div>

        <PurposeEffectPreview purpose={draft} />

        <div className="sheet-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            取消
          </button>
          <button
            type="button"
            className="gradient-button"
            onClick={() => onConfirm(draft)}
          >
            确认
          </button>
        </div>
      </section>
    </div>
  );
}

function PurchasePage({
  purpose,
  boostCount,
  onBoostCount,
  onPurpose,
  onHistory,
  onPurchase,
}) {
  const [purposeOpen, setPurposeOpen] = useState(false);
  const [toast, setToast] = useState("");
  const basePrice = BASE_PRICES[boostCount];
  const total = basePrice + (PURPOSES[purpose].paid ? 30 : 0);

  const confirmPurpose = (nextPurpose) => {
    onPurpose(nextPurpose);
    setPurposeOpen(false);
    setToast(nextPurpose === "default" ? "已恢复默认推广" : `已选择${PURPOSES[nextPurpose].label}`);
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div className="phone-page purchase-page">
      <StatusBar />
      <PhoneNav title="加热中心" onClose={() => setToast("演示中暂不退出")} />

      <div className="purchase-scroll">
        <div className="heat-tabs" role="tablist" aria-label="加热类型">
          <button className="active" type="button" role="tab" aria-selected="true">
            帖文加热
          </button>
          <button type="button" role="tab" aria-selected="false">
            超级曝光
          </button>
        </div>

        <div className="activity-ticker">
          <img src="/assets/avatar-lin.png" alt="" />
          <span>
            J*e 使用帖文加热新增了 <strong>6</strong> 个评论
          </span>
          <time>星期六</time>
        </div>

        <section className="purchase-section">
          <div className="section-heading">
            <h2>选择帖文</h2>
            <button type="button">
              全部 <ChevronRight size={20} />
            </button>
          </div>
          <article className="selected-post">
            <p>[心愿单]我设置了心愿单，可以帮我点亮心愿吗 ❤️1</p>
            <div className="post-stats">
              <span><Eye size={15} />16.8K</span>
              <span><Heart size={15} />53</span>
              <span><MessageCircle size={15} />25</span>
              <time>34 个月前</time>
            </div>
          </article>
        </section>

        <section className="purchase-section audience-section">
          <div className="section-heading">
            <h2>加热人群</h2>
            <button type="button" onClick={onHistory}>
              历史记录 <ChevronRight size={20} />
            </button>
          </div>
          <div className="audience-options">
            <button type="button" className="active">
              默认条件 <CircleHelp size={15} />
            </button>
            <button type="button">
              自定义 <CircleHelp size={15} />
            </button>
          </div>
          <button
            className="setting-row purpose-setting"
            type="button"
            onClick={() => setPurposeOpen(true)}
          >
            <span className="setting-label">想要获得什么</span>
            <span className={purpose === "default" ? "setting-value" : "setting-value paid"}>
              {PURPOSES[purpose].label}
              {PURPOSES[purpose].paid && (
                <span className="purpose-price setting-purpose-price">
                  <img src="/assets/ht-coin.png" alt="HT" />
                  <b>30</b>
                </span>
              )}
            </span>
            <ChevronRight size={20} />
          </button>
          <button className="setting-row" type="button">
            <span>帖文外观</span>
            <span className="appearance-swatch" />
            <ChevronRight size={20} />
          </button>
        </section>
      </div>

      <footer className="purchase-footer">
        <h2>
          选择加热次数 <CircleHelp size={16} />
        </h2>
        <div className="boost-options">
          {BOOST_COUNTS.map((count) => (
            <button
              type="button"
              key={count}
              className={boostCount === count ? "active" : ""}
              onClick={() => onBoostCount(count)}
            >
              <strong>{count}</strong>
              {count > 500 && <small>节省 {count === 3000 ? 23 : 16}%</small>}
            </button>
          ))}
        </div>
        <button className="purchase-button" type="button" onClick={() => onPurchase(total)}>
          <span className="coin">HT</span>
          <strong>{total} 币</strong>
          {PURPOSES[purpose].paid && <small>含目的增强 +30</small>}
        </button>
        <p className="agreement"><Check size={14} /> 我已阅读并同意加热协议</p>
      </footer>

      {purposeOpen && (
        <PurposeModal
          applied={purpose}
          onCancel={() => setPurposeOpen(false)}
          onConfirm={confirmPurpose}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function PromotedActions({ purpose, oldVersion, followed, onFollow, onChat }) {
  if (purpose === "follows") {
    return (
      <button
        type="button"
        className={`heated-action heated-follow ${followed ? "is-complete" : "pulse-once"}`}
        onClick={onFollow}
      >
        <UserPlus size={19} /> {followed ? "已关注" : "关注"}
      </button>
    );
  }

  if (!oldVersion && purpose === "chats") {
    return (
      <button type="button" className="heated-action heated-chat pulse-once" onClick={onChat}>
        <MessageCircle size={19} /> 聊天
      </button>
    );
  }

  return (
    <button type="button" className={`native-follow ${followed ? "is-followed" : ""}`} onClick={onFollow}>
      {followed ? "已关注" : "关注"}
    </button>
  );
}

function FeedPage({
  purpose,
  oldVersion,
  refreshIndex,
  onRefresh,
  onBack,
  onChat,
}) {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const shownPurpose = refreshIndex % 2 === 0 ? purpose : purpose === "likes" ? "chats" : "likes";
  const currentPurpose = oldVersion ? "default" : shownPurpose;

  return (
    <div className="phone-page feed-page">
      <StatusBar />
      <PhoneNav
        title="动态"
        onBack={onBack}
        right={
          <IconButton label="刷新内容" onClick={onRefresh}>
            <RefreshCw size={22} />
          </IconButton>
        }
      />
      <div className="feed-tabs">
        <button type="button">关注</button>
        <button type="button" className="active">推荐</button>
        <button type="button">附近</button>
      </div>
      <div className="feed-filter-note">
        <span>本次刷新仅展示同一帖文的一条推广</span>
        <strong>{PURPOSES[currentPurpose].label}</strong>
      </div>

      <main className="moment-card">
        <div className="moment-author">
          <img src="/assets/avatar-mia.png" alt="Mia" />
          <div>
            <strong>Mia</strong>
            <span>正在学习 中文 · 2分钟前</span>
          </div>
          <PromotedActions
            purpose={currentPurpose}
            oldVersion={oldVersion}
            followed={followed}
            onFollow={() => setFollowed((value) => !value)}
            onChat={onChat}
          />
        </div>

        <div className="promoted-label"><Flame size={13} />推广</div>
        <p className="moment-text">
          最近开始认真练习中文，希望认识愿意一起交流的朋友。你今天学了什么？
        </p>
        <div className="moment-photo">
          <div className="sky" />
          <div className="sun" />
          <div className="building building-a" />
          <div className="building building-b" />
          <div className="building building-c" />
          <span>深圳 · 傍晚散步</span>
        </div>
        <div className="translation">
          <Languages size={14} /> 翻译
        </div>
        <div className="moment-meta">
          <span>128 次浏览</span>
          <time>2分钟前</time>
        </div>
        <div className="moment-toolbar">
          <button
            type="button"
            className={`${liked ? "is-liked" : ""} ${currentPurpose === "likes" && !liked ? "promotion-like-hint" : ""}`}
            onClick={() => setLiked((value) => !value)}
          >
            <span className="toolbar-heart">
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </span>
            {liked ? 54 : 53}
          </button>
          <button type="button"><MessageCircle size={20} /> 8</button>
          <button type="button"><Share2 size={20} /></button>
          <button type="button"><MoreHorizontal size={20} /></button>
        </div>
      </main>

      {oldVersion && (
        <div className="degrade-banner">
          旧版本用户看到原生样式，不展示目的增强
        </div>
      )}

      <BottomTabs />
    </div>
  );
}

function BottomTabs() {
  const tabs = [
    [Home, "HelloTalk"],
    [Users, "找语伴"],
    [Sparkles, "动态"],
    [MessageCircle, "语聊"],
    [UserPlus, "我"],
  ];
  return (
    <nav className="bottom-tabs" aria-label="主导航">
      {tabs.map(([Icon, label]) => (
        <button type="button" key={label} className={label === "动态" ? "active" : ""}>
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function ChatPage({ onBack }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const sendMessage = () => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [...current, clean]);
    setText("");
    setFocused(false);
    inputRef.current?.blur();
  };

  return (
    <div className="phone-page chat-page">
      <StatusBar />
      <PhoneNav
        title="Mia"
        onBack={onBack}
        right={
          <IconButton label="聊天设置">
            <MoreHorizontal size={23} />
          </IconButton>
        }
      />
      <main className={`message-list ${focused ? "with-keyboard" : ""}`}>
        <div className="chat-day">今天</div>
        <div className="chat-safety">请友善交流，谨防索取个人信息或财物。</div>
        {messages.length === 0 ? (
          <div className="empty-chat">
            <img src="/assets/avatar-mia.png" alt="" />
            <strong>开始和 Mia 聊天</strong>
            <span>你们还没有聊天记录</span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div className="message-row mine" key={`${message}-${index}`}>
              <div className="message-bubble">{message}</div>
              <img src="/assets/avatar-lin.png" alt="我" />
            </div>
          ))
        )}
      </main>
      <div className={`composer ${focused ? "composer-focused" : ""}`}>
        <div className="composer-row">
          <input
            ref={inputRef}
            value={text}
            aria-label="聊天消息"
            placeholder="输入消息"
            onChange={(event) => setText(event.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
          />
          {text.trim() ? (
            <button type="button" className="send-button" onClick={sendMessage} aria-label="发送消息">
              <Send size={18} />
            </button>
          ) : (
            <IconButton label="语音输入"><MessageCircle size={23} /></IconButton>
          )}
        </div>
        <div className="composer-tools">
          <button type="button" aria-label="更多工具"><img src="/assets/composer-plus.png" alt="" /></button>
          <button type="button" aria-label="照片"><img src="/assets/composer-photo.png" alt="" /></button>
          <button type="button" aria-label="表情"><img src="/assets/composer-emoji.png" alt="" /></button>
          <button type="button" aria-label="翻译"><img src="/assets/composer-translate.png" alt="" /></button>
        </div>
      </div>
      {focused && (
        <div className="demo-keyboard" aria-hidden="true">
          <div className="keyboard-keys">
            {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((letter) => <i key={letter}>{letter}</i>)}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, accent = false, avatars = false }) {
  return (
    <div className="result-metric">
      <span>{label}</span>
      <div className={accent ? "accent-number" : ""}>
        {accent && value > 0 ? "+" : ""}{value}
        {avatars && (
          <span className="metric-avatars">
            <img src="/assets/avatar-mia.png" alt="" />
            <img src="/assets/avatar-anna.png" alt="" />
          </span>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ purpose, age, onContinue, onDuplicate }) {
  const metric = PURPOSES[purpose].metric;
  const value = purpose === "chats" ? 3 : purpose === "follows" ? 8 : 4;
  return (
    <article className="history-card">
      <time>{age}</time>
      <div className="result-metrics">
        <Metric label="看过我" value={500} />
        <Metric label={metric} value={value} accent avatars />
        <Metric label="评论" value={0} />
      </div>
      <p>[心愿单]我设置了心愿单，可以帮我点亮心愿吗 ❤️1</p>
      <div className="history-actions">
        <button type="button" className="secondary-button" onClick={() => onDuplicate(purpose)}>
          复制加热条件
        </button>
        <button type="button" className="gradient-button" onClick={() => onContinue(purpose)}>
          继续加热
        </button>
      </div>
      <small>上次加热：{PURPOSES[purpose].label}{PURPOSES[purpose].paid ? " · 目的增强 +30" : ""}</small>
    </article>
  );
}

function HistoryPage({ purpose, onBack, onContinue, onDuplicate, onCompletion }) {
  const records = useMemo(
    () => [
      { purpose, age: "1 个月前" },
      { purpose: "follows", age: "4 个月前" },
      { purpose: "chats", age: "5 个月前" },
    ],
    [purpose],
  );
  return (
    <div className="phone-page history-page">
      <StatusBar />
      <PhoneNav
        title="历史记录"
        onClose={onBack}
        right={
          <button className="text-nav-action" type="button" onClick={() => onCompletion(purpose)}>
            看结果
          </button>
        }
      />
      <main className="history-list">
        {records.map((record, index) => (
          <HistoryCard
            key={`${record.purpose}-${record.age}-${index}`}
            purpose={record.purpose}
            age={record.age}
            onContinue={onContinue}
            onDuplicate={onDuplicate}
          />
        ))}
      </main>
    </div>
  );
}

function CompletionModal({ purpose, onClose }) {
  const metric = PURPOSES[purpose].metric;
  const value = purpose === "chats" ? 3 : purpose === "follows" ? 8 : 4;
  return (
    <div className="completion-backdrop">
      <div className="dimmed-history">
        <StatusBar dark />
        <div className="ghost-nav">加热中心</div>
        <div className="ghost-card" />
      </div>
      <section className="completion-sheet" role="dialog" aria-modal="true" aria-labelledby="completion-title">
        <IconButton label="关闭完成报告" className="completion-close" onClick={onClose}>
          <X size={28} />
        </IconButton>
        <h2 id="completion-title">帖文加热完成</h2>
        <div className="completion-post">
          <div className="post-thumb">T</div>
          <div>
            <strong>[心愿单]我设置了心愿单，可以帮我点亮心愿...</strong>
            <span>34 个月前</span>
          </div>
        </div>
        <div className="completion-report">
          <div className="completion-copy">
            <h3>人气爆棚</h3>
            <p>比其他用户加热速度提升了 <strong>45.2</strong> 倍，太火了！</p>
            <span>共加热</span>
            <b>500 次</b>
          </div>
          <div className="flame-art"><Flame size={76} fill="currentColor" /></div>
          <div className="completion-metrics">
            <div>
              <span>加热时长</span>
              <strong>00:13:03</strong>
            </div>
            <Metric label={metric} value={value} accent avatars />
            <Metric label="评论" value={0} />
          </div>
          <div className="report-detail">
            <span>加热报告详情</span>
            <strong>显著提升 9999%</strong>
            <div className="bars"><i /><i /><i /></div>
          </div>
        </div>
        <button type="button" className="gradient-button completion-button" onClick={onClose}>关闭</button>
      </section>
    </div>
  );
}

function Workbench({
  route,
  purpose,
  oldVersion,
  onRoute,
  onPurpose,
  onOldVersion,
  onCompletion,
}) {
  return (
    <aside className="workbench">
      <div className="workbench-title">
        <span className="workbench-logo"><Flame size={19} /></span>
        <div>
          <strong>帖文加热</strong>
          <small>推广目的增强 Demo</small>
        </div>
      </div>
      <section>
        <h2>演示页面</h2>
        <div className="segmented">
          {[
            ["purchase", "购买"],
            ["feed", "受众"],
            ["history", "记录"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={route === key ? "active" : ""}
              onClick={() => onRoute(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2>当前目的</h2>
        <div className="purpose-control">
          {PURPOSE_ORDER.map((key) => {
            const Icon = PURPOSES[key].icon;
            return (
              <button
                type="button"
                key={key}
                className={purpose === key ? "active" : ""}
                onClick={() => onPurpose(key)}
              >
                <Icon size={17} />
                <span>{PURPOSES[key].label}</span>
                {PURPOSES[key].paid && <small>+30</small>}
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h2>兼容与结果</h2>
        <label className="toggle-row">
          <span>
            <strong>旧版本降级</strong>
            <small>受众侧恢复默认样式</small>
          </span>
          <input type="checkbox" checked={oldVersion} onChange={(event) => onOldVersion(event.target.checked)} />
          <i />
        </label>
        <button type="button" className="workbench-action" onClick={onCompletion}>
          <Sparkles size={17} />
          查看完成弹窗
        </button>
      </section>
      <div className="workbench-note">
        <Clock3 size={16} />
        <span>同一帖文的不同目的可并行投放，单次刷新只展示其中一条。</span>
      </div>
    </aside>
  );
}

function App() {
  const [route, setRoute] = useState("purchase");
  const [purpose, setPurpose] = useState("default");
  const [boostCount, setBoostCount] = useState(500);
  const [oldVersion, setOldVersion] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [completionPurpose, setCompletionPurpose] = useState(null);
  const [purchaseNotice, setPurchaseNotice] = useState("");

  const choosePurpose = (nextPurpose) => {
    setPurpose(nextPurpose);
  };

  const continueWithPurpose = (nextPurpose) => {
    choosePurpose(nextPurpose);
    setRoute("purchase");
    setPurchaseNotice(
      PURPOSES[nextPurpose].paid
        ? `已继承“${PURPOSES[nextPurpose].label}”，本次仍加收 30 COINS`
        : "已继承默认推广目的",
    );
  };

  useEffect(() => {
    if (!purchaseNotice) return undefined;
    const timer = window.setTimeout(() => setPurchaseNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [purchaseNotice]);

  return (
    <div className="app-shell">
      <Workbench
        route={route}
        purpose={purpose}
        oldVersion={oldVersion}
        onRoute={setRoute}
        onPurpose={choosePurpose}
        onOldVersion={setOldVersion}
        onCompletion={() => setCompletionPurpose(purpose)}
      />
      <div className="phone-frame">
        {route === "purchase" && (
          <PurchasePage
            purpose={purpose}
            boostCount={boostCount}
            onBoostCount={setBoostCount}
            onPurpose={choosePurpose}
            onHistory={() => setRoute("history")}
            onPurchase={(total) => {
              setPurchaseNotice(`已支付 ${total} COINS，进入受众侧预览`);
              setRoute("feed");
            }}
          />
        )}
        {route === "feed" && (
          <FeedPage
            purpose={purpose}
            oldVersion={oldVersion}
            refreshIndex={refreshIndex}
            onRefresh={() => setRefreshIndex((value) => value + 1)}
            onBack={() => setRoute("purchase")}
            onChat={() => setRoute("chat")}
          />
        )}
        {route === "chat" && <ChatPage onBack={() => setRoute("feed")} />}
        {route === "history" && (
          <HistoryPage
            purpose={purpose}
            onBack={() => setRoute("purchase")}
            onContinue={continueWithPurpose}
            onDuplicate={continueWithPurpose}
            onCompletion={setCompletionPurpose}
          />
        )}
        {completionPurpose && (
          <CompletionModal purpose={completionPurpose} onClose={() => setCompletionPurpose(null)} />
        )}
        {purchaseNotice && <div className="global-notice" role="status">{purchaseNotice}</div>}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
