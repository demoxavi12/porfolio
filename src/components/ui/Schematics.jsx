// Coded, animated schematics of each project's interface. They illustrate
// what each system does (features from the résumé) — they are not screenshots
// and carry no invented numbers.

const BARS = [0.42, 0.66, 0.5, 0.82, 0.58, 0.9, 0.7, 0.48, 0.76, 0.62, 0.86, 0.54];

const STREAM = [
  ["auth", "user.login", "200"],
  ["notify", "email.queued", "202"],
  ["events", "event.ingested", "201"],
  ["gateway", "rate.limited", "429"],
  ["cache", "stats.read", "HIT"],
  ["notify", "push.sent", "200"],
];

export function PulseOpsUI() {
  return (
    <div className="ui pulse">
      <div className="pulse__side">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className={i === 1 ? "is-on" : ""} />
        ))}
      </div>
      <div className="pulse__main">
        <div className="pulse__head">
          <b>Events</b>
          <span className="pulse__role">role · admin</span>
        </div>
        <div className="pulse__chart">
          {BARS.map((h, i) => (
            <i key={i} style={{ "--h": h, "--i": i }} />
          ))}
        </div>
        <div className="pulse__stream">
          <ul>
            {[...STREAM, ...STREAM].map(([svc, evt, status], i) => (
              <li key={i}>
                <span>{svc}</span>
                <span>{evt}</span>
                <em data-status={status}>{status}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const MESSAGES = [
  { from: "sys", text: "socket connected · #general" },
  { from: "them", text: "is the private room live?" },
  { from: "me", text: "yes — JWT-gated, try it" },
  { from: "them", text: "in. messages are instant" },
];

export function ChatUI() {
  return (
    <div className="ui chat">
      <div className="chat__rooms">
        <b>Rooms</b>
        <span className="is-on"># general</span>
        <span># dev</span>
        <span className="chat__lock">◆ private</span>
      </div>
      <div className="chat__main">
        <div className="chat__head">
          <b># general</b>
          <span className="chat__dot">ws</span>
        </div>
        <div className="chat__log">
          {MESSAGES.map((m, i) => (
            <p key={i} className={`chat__msg chat__msg--${m.from}`} style={{ "--i": i }}>
              {m.text}
            </p>
          ))}
          <p className="chat__typing">
            <i />
            <i />
            <i />
          </p>
        </div>
        <div className="chat__input">Message #general</div>
      </div>
    </div>
  );
}

export function ShopUI() {
  return (
    <div className="ui shop">
      <div className="shop__nav">
        <b>ELEVÉ</b>
        <span>collections · about</span>
        <span className="shop__bag">
          bag
          <em>
            <span>
              0<br />1<br />2
            </span>
          </em>
        </span>
      </div>
      <div className="shop__title">Latest Arrivals</div>
      <div className="shop__grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="shop__tile" key={i} style={{ "--t": i }}>
            <i className="shop__img" />
            <i className="shop__line" />
            <i className="shop__line shop__line--short" />
            {i === 1 && <span className="shop__add">Add to bag</span>}
          </div>
        ))}
      </div>
      <div className="shop__sheet">
        <span>Checkout</span>
        <i className="shop__card" />
        <b>Pay with Stripe</b>
      </div>
    </div>
  );
}

export function CodeUI() {
  return (
    <pre className="ui code">
      <code>
        <span className="c-k">router</span>.post(<span className="c-s">&apos;/events&apos;</span>,{"\n"}
        {"  "}auth(<span className="c-s">&apos;admin&apos;</span>),{"\n"}
        {"  "}rateLimit(),{"\n"}
        {"  "}cache.bust(<span className="c-s">&apos;stats&apos;</span>),{"\n"}
        {"  "}ingest)<span className="code__caret" />
      </code>
    </pre>
  );
}

export function TokenUI() {
  return (
    <div className="ui token">
      <p className="token__raw">
        <span className="t-h">eyJhbGciOi</span>.<span className="t-p">eyJyb2xlIjoi</span>.
        <span className="t-s">SflKxwRJSM</span>
      </p>
      <p className="token__decoded">
        {"{ "}
        <span className="t-p">role</span>: <span className="c-s">&quot;admin&quot;</span>
        {" }"}
      </p>
    </div>
  );
}


// ---- Small technical fragments (secondary layer in the hero). Each one is a
// concept from the real projects: rate limiting, MongoDB events, Git.

export function HttpUI() {
  return (
    <div className="ui frag frag--http">
      <p className="frag__code">
        HTTP/1.1 <b>429</b>
      </p>
      <p className="frag__muted">Too Many Requests</p>
      <p className="frag__muted">rateLimit() · PulseOps</p>
    </div>
  );
}

export function MongoUI() {
  return (
    <div className="ui frag frag--mongo">
      <p className="frag__muted">mongosh</p>
      <p className="frag__code">
        db.events.find(&#123; <span className="c-k">type</span>: <span className="c-s">&quot;notification&quot;</span> &#125;)
      </p>
      <p className="frag__muted">MongoDB · Mongoose</p>
    </div>
  );
}

export function GitUI() {
  return (
    <div className="ui frag frag--git">
      <p className="frag__code">
        <span className="c-k">$</span> git push origin main
      </p>
      <p className="frag__muted">
        → vercel · deploy<span className="code__caret" />
      </p>
    </div>
  );
}
