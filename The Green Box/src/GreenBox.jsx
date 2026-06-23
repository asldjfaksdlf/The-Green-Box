import { useState, useRef, useEffect } from "react";
import { Play, Search, Upload, User, Home, Mic, Film, Smartphone, X, ChevronRight, ThumbsUp, MessageSquare, Share2, Clock, Eye, Plus, Menu, Bell, Check } from "lucide-react";

// ---------- MOCK DATA ----------

const CHANNEL = {
  name: "The Green Box",
  handle: "@thegreenbox",
};

const PODCASTS = [
  { id: "p1", title: "Cage Side Debrief: Title Fight Fallout", series: "Cage Side Debrief", ep: 142, duration: "58:12", views: "12K", time: "2 days ago", thumb: "ring" },
  { id: "p2", title: "The Judging Problem Nobody Wants To Fix", series: "Cage Side Debrief", ep: 141, duration: "1:04:30", views: "9.8K", time: "1 week ago", thumb: "gloves" },
  { id: "p3", title: "Guest: A Former Ranked Contender Tells All", series: "Cage Side Debrief", ep: 140, duration: "1:22:05", views: "21K", time: "2 weeks ago", thumb: "mic" },
  { id: "p4", title: "Weigh-In Week: Who's Actually Ready", series: "Cage Side Debrief", ep: 139, duration: "47:40", views: "7.1K", time: "3 weeks ago", thumb: "scale" },
  { id: "p5", title: "Camp Reports: Three Fighters, Three Cities", series: "Cage Side Debrief", ep: 138, duration: "1:11:00", views: "15K", time: "3 weeks ago", thumb: "ring" },
  { id: "p6", title: "The Rankings Are Broken — Let's Fix Them", series: "Cage Side Debrief", ep: 137, duration: "39:55", views: "6.4K", time: "1 month ago", thumb: "gloves" },
];

const SHORTS_FILMS = [
  { id: "f1", title: "Last Round", desc: "A retired fighter takes one final amateur bout to settle a debt only he remembers.", duration: "14:22", views: "31K", time: "4 days ago", thumb: "cinematic-1" },
  { id: "f2", title: "Corner Work", desc: "Two cutmen, one chair, and ninety seconds to decide if the fight goes on.", duration: "9:47", views: "18K", time: "2 weeks ago", thumb: "cinematic-2" },
  { id: "f3", title: "The Weight", desc: "A documentary short on the week before fight night, told entirely through the scale.", duration: "21:10", views: "44K", time: "1 month ago", thumb: "cinematic-3" },
  { id: "f4", title: "Tape", desc: "A coach rewatches the same three seconds of film, looking for what he missed.", duration: "11:05", views: "9.3K", time: "1 month ago", thumb: "cinematic-1" },
];

const VERTICALS = [
  { id: "v1", title: "The Gym Doesn't Sleep", part: "Part 1", duration: "1:42", views: "88K", thumb: "v1" },
  { id: "v2", title: "The Gym Doesn't Sleep", part: "Part 2", duration: "1:38", views: "76K", thumb: "v2" },
  { id: "v3", title: "The Gym Doesn't Sleep", part: "Part 3", duration: "1:51", views: "61K", thumb: "v3" },
  { id: "v4", title: "Cut Day", part: "Part 1", duration: "1:29", views: "102K", thumb: "v1" },
  { id: "v5", title: "Cut Day", part: "Part 2", duration: "1:33", views: "94K", thumb: "v2" },
  { id: "v6", title: "Cut Day", part: "Part 3", duration: "1:47", views: "85K", thumb: "v3" },
  { id: "v7", title: "Locker Talk", part: "Part 1", duration: "1:21", views: "53K", thumb: "v2" },
  { id: "v8", title: "Locker Talk", part: "Part 2", duration: "1:35", views: "49K", thumb: "v3" },
];

const COMMENTS = [
  { id: "c1", user: "danno_mma", text: "the cutman segment was wild, didn't know it got that technical under time pressure", time: "2h", likes: 24 },
  { id: "c2", user: "ringside.kel", text: "been listening since episode 40, the judging breakdown this week was the best one yet", time: "5h", likes: 41 },
  { id: "c3", user: "fight_iq", text: "more of these short films please, the production on this is way above what I expected", time: "1d", likes: 88 },
];

// Thumbnail color treatments standing in for real video frames
const THUMB_STYLES = {
  ring: "linear-gradient(135deg, #14201A 0%, #0B0F0D 60%)",
  gloves: "linear-gradient(135deg, #1A1410 0%, #0B0F0D 60%)",
  mic: "linear-gradient(135deg, #101A16 0%, #0B0F0D 65%)",
  scale: "linear-gradient(135deg, #181812 0%, #0B0F0D 60%)",
  "cinematic-1": "linear-gradient(160deg, #1C2620 0%, #0B0F0D 70%)",
  "cinematic-2": "linear-gradient(160deg, #261C18 0%, #0B0F0D 70%)",
  "cinematic-3": "linear-gradient(160deg, #16201C 0%, #0B0F0D 70%)",
  v1: "linear-gradient(180deg, #1B2620 0%, #0B0F0D 80%)",
  v2: "linear-gradient(180deg, #241A14 0%, #0B0F0D 80%)",
  v3: "linear-gradient(180deg, #15201A 0%, #0B0F0D 80%)",
};

// ---------- SHARED UI BITS ----------

function TallyDot({ size = 8, pulse = true }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#3FFF8F",
        boxShadow: "0 0 8px rgba(63,255,143,0.8)",
        animation: pulse ? "tallyPulse 1.8s ease-in-out infinite" : "none",
        flexShrink: 0,
      }}
    />
  );
}

function OnAirTag({ label = "ON AIR" }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 9px 4px 7px",
        borderRadius: 3,
        background: "rgba(11,15,13,0.78)",
        border: "1px solid rgba(63,255,143,0.45)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.08em",
        color: "#3FFF8F",
        textTransform: "uppercase",
      }}
    >
      <TallyDot size={6} />
      {label}
    </div>
  );
}

function Thumb({ thumbKey, duration, badge, aspect = "16/9", icon }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        borderRadius: 6,
        overflow: "hidden",
        background: THUMB_STYLES[thumbKey] || THUMB_STYLES.ring,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {badge && (
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <OnAirTag label={badge} />
        </div>
      )}
      {duration && (
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            background: "rgba(11,15,13,0.85)",
            color: "#F2EFE6",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            padding: "2px 5px",
            borderRadius: 3,
            letterSpacing: "0.02em",
          }}
        >
          {duration}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ eyebrow, title, onSeeAll }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "#3FFF8F",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F2EFE6",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            color: "#7A8580",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            cursor: "pointer",
            padding: "6px 4px",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F2EFE6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7A8580")}
        >
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ---------- NAV ----------

function TopNav({ onNavigate, onUploadClick, active, onSearch, searchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(11,15,13,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <button
          onClick={() => setMenuOpen((m) => !m)}
          style={{
            background: "none",
            border: "none",
            color: "#F2EFE6",
            cursor: "pointer",
            display: "none",
          }}
          className="gb-menu-btn"
        >
          <Menu size={22} />
        </button>

        <div
          onClick={() => onNavigate("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 5,
              background: "#3FFF8F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 14px rgba(63,255,143,0.45)",
            }}
          >
            <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid #0B0F0D", marginLeft: 2 }} />
          </div>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 19,
              color: "#F2EFE6",
              letterSpacing: "0.01em",
              textTransform: "uppercase",
            }}
            className="gb-wordmark"
          >
            The Green Box
          </span>
        </div>

        <nav style={{ display: "flex", gap: 4 }} className="gb-nav-links">
          {[
            { key: "home", label: "Home", icon: Home },
            { key: "podcasts", label: "Podcasts", icon: Mic },
            { key: "films", label: "Short Films", icon: Film },
            { key: "verticals", label: "Verticals", icon: Smartphone },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: active === key ? "rgba(63,255,143,0.12)" : "none",
                border: "none",
                color: active === key ? "#3FFF8F" : "#C9CFC9",
                padding: "8px 13px",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1, maxWidth: 420, marginLeft: "auto" }} className="gb-search-wrap">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            <Search size={15} color="#7A8580" />
            <input
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search episodes, films, clips..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#F2EFE6",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            onClick={onUploadClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "#3FFF8F",
              border: "none",
              color: "#0B0F0D",
              padding: "9px 14px",
              borderRadius: 6,
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
            className="gb-upload-btn"
          >
            <Upload size={15} />
            <span className="gb-upload-label">Upload</span>
          </button>
          <button
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F2EFE6",
              cursor: "pointer",
            }}
          >
            <User size={16} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="gb-mobile-menu" style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { key: "home", label: "Home", icon: Home },
            { key: "podcasts", label: "Podcasts", icon: Mic },
            { key: "films", label: "Short Films", icon: Film },
            { key: "verticals", label: "Verticals", icon: Smartphone },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                onNavigate(key);
                setMenuOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: active === key ? "rgba(63,255,143,0.12)" : "none",
                border: "none",
                color: active === key ? "#3FFF8F" : "#C9CFC9",
                padding: "10px 12px",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                fontSize: 14.5,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ---------- HOME PAGE ----------

function Hero({ onPlay }) {
  return (
    <div
      style={{
        position: "relative",
        margin: "0 auto",
        maxWidth: 1400,
        padding: "20px 20px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 75% 30%, rgba(63,255,143,0.16), transparent 55%), linear-gradient(135deg, #141C17 0%, #0B0F0D 70%)",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "clamp(28px, 6vw, 64px)",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <OnAirTag label="LATEST EPISODE" />
        </div>
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(32px, 6vw, 60px)",
            lineHeight: 1.02,
            color: "#F2EFE6",
            margin: "0 0 14px",
            textTransform: "uppercase",
            maxWidth: 720,
          }}
        >
          Cage Side Debrief: Title Fight Fallout
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "#C9CFC9",
            maxWidth: 560,
            lineHeight: 1.55,
            margin: "0 0 26px",
          }}
        >
          The judges' scorecards didn't match the room, the champion's corner had words after the final bell,
          and we break down every angle from press row.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => onPlay("p1")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "#3FFF8F",
              border: "none",
              color: "#0B0F0D",
              padding: "13px 22px",
              borderRadius: 7,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <Play size={16} fill="#0B0F0D" />
            Watch Episode 142
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#7A8580", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={13} /> 58:12
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Eye size={13} /> 12K views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodcastCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)} style={{ cursor: "pointer", flex: "0 0 auto", width: 300 }} className="gb-card">
      <Thumb thumbKey={item.thumb} duration={item.duration} aspect="16/9" icon={<Mic size={34} color="#3FFF8F" />} />
      <div style={{ paddingTop: 10 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3FFF8F", letterSpacing: "0.05em", marginBottom: 4 }}>
          EP {item.ep} · {item.series.toUpperCase()}
        </div>
        <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#F2EFE6", margin: "0 0 4px", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580" }}>
          {item.views} views · {item.time}
        </div>
      </div>
    </div>
  );
}

function FilmCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)} style={{ cursor: "pointer", flex: "0 0 auto", width: 340 }} className="gb-card">
      <Thumb thumbKey={item.thumb} duration={item.duration} badge="SHORT FILM" aspect="16/9" icon={<Film size={34} color="#3FFF8F" />} />
      <div style={{ paddingTop: 10 }}>
        <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600, color: "#F2EFE6", margin: "0 0 5px" }}>
          {item.title}
        </h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9AA39C", margin: "0 0 6px", lineHeight: 1.4 }}>
          {item.desc}
        </p>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580" }}>
          {item.views} views · {item.time}
        </div>
      </div>
    </div>
  );
}

function VerticalCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)} style={{ cursor: "pointer", flex: "0 0 auto", width: 168 }} className="gb-card">
      <Thumb thumbKey={item.thumb} duration={item.duration} aspect="9/16" icon={<Smartphone size={28} color="#3FFF8F" />} />
      <div style={{ paddingTop: 8 }}>
        <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#F2EFE6", margin: "0 0 2px" }}>
          {item.title}
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7A8580" }}>
          {item.part} · {item.views}
        </div>
      </div>
    </div>
  );
}

function Rail({ children }) {
  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "thin" }} className="gb-rail">
      {children}
    </div>
  );
}

function HomePage({ onPlay, onNavigate }) {
  return (
    <div>
      <Hero onPlay={onPlay} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "44px 20px" }}>
        <section style={{ marginBottom: 48 }}>
          <SectionHeader eyebrow="The Show" title="Latest Podcast Episodes" onSeeAll={() => onNavigate("podcasts")} />
          <Rail>
            {PODCASTS.map((p) => (
              <PodcastCard key={p.id} item={p} onClick={onPlay} />
            ))}
          </Rail>
        </section>

        <section style={{ marginBottom: 48 }}>
          <SectionHeader eyebrow="Original" title="Short Films" onSeeAll={() => onNavigate("films")} />
          <Rail>
            {SHORTS_FILMS.map((f) => (
              <FilmCard key={f.id} item={f} onClick={onPlay} />
            ))}
          </Rail>
        </section>

        <section>
          <SectionHeader eyebrow="Quick Hits" title="Verticals" onSeeAll={() => onNavigate("verticals")} />
          <Rail>
            {VERTICALS.map((v) => (
              <VerticalCard key={v.id} item={v} onClick={onPlay} />
            ))}
          </Rail>
        </section>
      </div>
    </div>
  );
}

// ---------- CATEGORY PAGE ----------

function CategoryPage({ type, onPlay }) {
  const config = {
    podcasts: { eyebrow: "The Show", title: "Podcasts", data: PODCASTS, Card: PodcastCard, grid: "repeat(auto-fill, minmax(280px, 1fr))" },
    films: { eyebrow: "Original", title: "Short Films", data: SHORTS_FILMS, Card: FilmCard, grid: "repeat(auto-fill, minmax(320px, 1fr))" },
    verticals: { eyebrow: "Quick Hits", title: "Verticals", data: VERTICALS, Card: VerticalCard, grid: "repeat(auto-fill, minmax(160px, 1fr))" },
  }[type];

  const { eyebrow, title, data, Card, grid } = config;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 20px 60px" }}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div style={{ display: "grid", gridTemplateColumns: grid, gap: 20 }}>
        {data.map((item) => (
          <Card key={item.id} item={item} onClick={onPlay} />
        ))}
      </div>
    </div>
  );
}

// ---------- WATCH PAGE ----------

function VideoPlayerShell({ thumbKey, title, isVertical }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: isVertical ? "9/16" : "16/9",
        maxHeight: isVertical ? "78vh" : "none",
        margin: isVertical ? "0 auto" : 0,
        borderRadius: 8,
        overflow: "hidden",
        background: THUMB_STYLES[thumbKey] || THUMB_STYLES.ring,
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setPlaying((p) => !p)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, rgba(63,255,143,0.07), transparent 60%)",
        }}
      />
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: "rgba(11,15,13,0.65)",
          border: "1px solid rgba(63,255,143,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {playing ? (
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 6, height: 22, background: "#3FFF8F", borderRadius: 1 }} />
            <div style={{ width: 6, height: 22, background: "#3FFF8F", borderRadius: 1 }} />
          </div>
        ) : (
          <Play size={26} color="#3FFF8F" fill="#3FFF8F" style={{ marginLeft: 3 }} />
        )}
      </div>
      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
        <OnAirTag label={playing ? "PLAYING" : "PAUSED"} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 46,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.5))",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          zIndex: 2,
        }}
      >
        <div style={{ height: 3, flex: 1, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: playing ? "37%" : "12%", background: "#3FFF8F", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: active ? "rgba(63,255,143,0.14)" : "rgba(255,255,255,0.06)",
        border: active ? "1px solid rgba(63,255,143,0.4)" : "1px solid rgba(255,255,255,0.1)",
        color: active ? "#3FFF8F" : "#F2EFE6",
        padding: "9px 14px",
        borderRadius: 6,
        fontFamily: "Inter, sans-serif",
        fontSize: 13.5,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      <Icon size={15} fill={active && Icon === ThumbsUp ? "#3FFF8F" : "none"} />
      {label}
    </button>
  );
}

function findItem(id) {
  return (
    PODCASTS.find((p) => p.id === id) ||
    SHORTS_FILMS.find((f) => f.id === id) ||
    VERTICALS.find((v) => v.id === id)
  );
}

function getItemKind(id) {
  if (PODCASTS.find((p) => p.id === id)) return "podcast";
  if (SHORTS_FILMS.find((f) => f.id === id)) return "film";
  if (VERTICALS.find((v) => v.id === id)) return "vertical";
  return "podcast";
}

function WatchPage({ videoId, onPlay, onNavigate }) {
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const item = findItem(videoId) || PODCASTS[0];
  const kind = getItemKind(videoId);
  const isVertical = kind === "vertical";

  const title = item.title;
  const meta =
    kind === "podcast"
      ? `EP ${item.ep} · ${item.series}`
      : kind === "film"
      ? "Short Film"
      : item.part;

  const upNext = kind === "podcast" ? PODCASTS.filter((p) => p.id !== videoId) : kind === "film" ? SHORTS_FILMS.filter((f) => f.id !== videoId) : VERTICALS.filter((v) => v.id !== videoId);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr" : "minmax(0, 1fr) 360px",
          gap: 28,
          alignItems: "start",
        }}
        className="gb-watch-grid"
      >
        <div style={{ maxWidth: isVertical ? 420 : "none", margin: isVertical ? "0 auto" : 0, width: "100%" }}>
          <VideoPlayerShell thumbKey={item.thumb} title={title} isVertical={isVertical} />

          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#3FFF8F", letterSpacing: "0.05em", marginBottom: 6, textTransform: "uppercase" }}>
              {meta}
            </div>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(20px, 3vw, 28px)", color: "#F2EFE6", margin: "0 0 14px", textTransform: "uppercase", lineHeight: 1.15 }}>
              {title}
            </h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1C2620, #0B0F0D)",
                    border: "1px solid rgba(63,255,143,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Anton', sans-serif",
                    color: "#3FFF8F",
                    fontSize: 15,
                  }}
                >
                  GB
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14.5, color: "#F2EFE6" }}>{CHANNEL.name}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7A8580" }}>{item.views || "12K"} views {item.time ? `· ${item.time}` : ""}</div>
                </div>
                <button
                  onClick={() => setSubscribed((s) => !s)}
                  style={{
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: subscribed ? "rgba(255,255,255,0.08)" : "#3FFF8F",
                    border: "none",
                    color: subscribed ? "#F2EFE6" : "#0B0F0D",
                    padding: "9px 16px",
                    borderRadius: 6,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  {subscribed && <Check size={14} />}
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <ActionButton icon={ThumbsUp} label="Like" active={liked} onClick={() => setLiked((l) => !l)} />
                <ActionButton icon={Share2} label="Share" onClick={() => {}} />
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 28,
              }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#C9CFC9", margin: 0, lineHeight: 1.6 }}>
                {kind === "film"
                  ? item.desc
                  : kind === "podcast"
                  ? "Breaking down fight week, the decisions that mattered, and what's next for the division. Recorded live from press row."
                  : "Behind the scenes, no script, no second take."}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, color: "#F2EFE6", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={16} color="#3FFF8F" /> {COMMENTS.length} Comments
              </h3>

              <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={15} color="#7A8580" />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.15)",
                      color: "#F2EFE6",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13.5,
                      padding: "6px 2px",
                      outline: "none",
                    }}
                  />
                  {commentDraft && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                      <button onClick={() => setCommentDraft("")} style={{ background: "none", border: "none", color: "#7A8580", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                      <button onClick={() => setCommentDraft("")} style={{ background: "#3FFF8F", border: "none", color: "#0B0F0D", fontWeight: 700, fontSize: 13, padding: "6px 14px", borderRadius: 5, cursor: "pointer" }}>Comment</button>
                    </div>
                  )}
                </div>
              </div>

              {COMMENTS.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1C2620, #0B0F0D)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#F2EFE6" }}>{c.user}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#7A8580" }}>{c.time} ago</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#C9CFC9", margin: "0 0 6px", lineHeight: 1.5 }}>{c.text}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#7A8580" }}>
                      <ThumbsUp size={12} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5 }}>{c.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isVertical && (
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#7A8580", textTransform: "uppercase", marginBottom: 14 }}>
              Up Next
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {upNext.slice(0, 5).map((up) => (
                <div key={up.id} onClick={() => onPlay(up.id)} style={{ display: "flex", gap: 10, cursor: "pointer" }}>
                  <div style={{ width: 130, flexShrink: 0 }}>
                    <Thumb thumbKey={up.thumb} duration={up.duration} aspect="16/9" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#F2EFE6", margin: "0 0 4px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {up.title}
                    </h4>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#7A8580" }}>{CHANNEL.name}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#7A8580" }}>{up.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- UPLOAD MODAL ----------

function UploadModal({ onClose }) {
  const [step, setStep] = useState("select"); // select, details, done
  const [category, setCategory] = useState("podcast");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setStep("details");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#101512",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          width: "100%",
          maxWidth: 560,
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: "#F2EFE6", margin: 0, textTransform: "uppercase" }}>
            {step === "done" ? "Upload Complete" : "Upload to The Green Box"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7A8580", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === "select" && (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: "2px dashed rgba(63,255,143,0.3)",
                  borderRadius: 10,
                  padding: "48px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(63,255,143,0.03)",
                }}
              >
                <Upload size={32} color="#3FFF8F" style={{ marginBottom: 14 }} />
                <div style={{ fontFamily: "Inter, sans-serif", color: "#F2EFE6", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                  Drop a video file or click to browse
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", color: "#7A8580", fontSize: 12.5 }}>
                  MP4, MOV, or WebM — vertical or horizontal
                </div>
                <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} style={{ display: "none" }} />
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7A8580", marginTop: 16, textAlign: "center" }}>
                This is a UI demo — selecting a file simulates the upload flow without actually transferring data.
              </p>
            </div>
          )}

          {step === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12 }}>
                <div style={{ width: 64, height: 36, borderRadius: 4, background: THUMB_STYLES.ring, flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#F2EFE6", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fileName}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3FFF8F" }}>Ready</div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580", marginBottom: 6 }}>Title</label>
                <input
                  placeholder="Give it a title"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#F2EFE6",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    padding: "10px 12px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580", marginBottom: 6 }}>Description</label>
                <textarea
                  placeholder="What's this one about?"
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#F2EFE6",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    padding: "10px 12px",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580", marginBottom: 8 }}>Category</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { key: "podcast", label: "Podcast", icon: Mic },
                    { key: "film", label: "Short Film", icon: Film },
                    { key: "vertical", label: "Vertical", icon: Smartphone },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "12px 8px",
                        borderRadius: 7,
                        background: category === key ? "rgba(63,255,143,0.12)" : "rgba(255,255,255,0.04)",
                        border: category === key ? "1px solid rgba(63,255,143,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        color: category === key ? "#3FFF8F" : "#C9CFC9",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                      }}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#7A8580", marginBottom: 8 }}>Visibility</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Public", "Unlisted", "Private"].map((v, i) => (
                    <button
                      key={v}
                      style={{
                        flex: 1,
                        padding: "9px 8px",
                        borderRadius: 6,
                        background: i === 0 ? "rgba(63,255,143,0.12)" : "rgba(255,255,255,0.04)",
                        border: i === 0 ? "1px solid rgba(63,255,143,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        color: i === 0 ? "#3FFF8F" : "#C9CFC9",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("done")}
                style={{
                  marginTop: 6,
                  background: "#3FFF8F",
                  border: "none",
                  color: "#0B0F0D",
                  padding: "13px",
                  borderRadius: 7,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  cursor: "pointer",
                }}
              >
                Publish
              </button>
            </div>
          )}

          {step === "done" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(63,255,143,0.15)",
                  border: "1px solid rgba(63,255,143,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <Check size={26} color="#3FFF8F" />
              </div>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#F2EFE6", marginBottom: 8 }}>Published</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#7A8580", marginBottom: 22 }}>
                Your upload is live on The Green Box.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#F2EFE6",
                  padding: "10px 20px",
                  borderRadius: 6,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- ROOT APP ----------

export default function GreenBoxApp() {
  const [page, setPage] = useState("home");
  const [videoId, setVideoId] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (key) => {
    setPage(key);
    setVideoId(null);
    window.scrollTo(0, 0);
  };

  const handlePlay = (id) => {
    setVideoId(id);
    setPage("watch");
    window.scrollTo(0, 0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0F0D",
        color: "#F2EFE6",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); borderRadius: 4px; }
        @keyframes tallyPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .gb-card { transition: transform 0.15s ease; }
        .gb-card:hover { transform: translateY(-2px); }
        button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid #3FFF8F;
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .gb-nav-links { display: none !important; }
          .gb-menu-btn { display: flex !important; align-items: center; }
          .gb-search-wrap { max-width: none !important; flex: 1; }
          .gb-wordmark { font-size: 16px !important; }
        }
        @media (max-width: 600px) {
          .gb-search-wrap { display: none !important; }
          .gb-upload-label { display: none; }
          .gb-watch-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <TopNav
        onNavigate={handleNavigate}
        onUploadClick={() => setUploadOpen(true)}
        active={page === "watch" ? null : page}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {page === "home" && <HomePage onPlay={handlePlay} onNavigate={handleNavigate} />}
      {(page === "podcasts" || page === "films" || page === "verticals") && (
        <CategoryPage type={page} onPlay={handlePlay} />
      )}
      {page === "watch" && <WatchPage videoId={videoId} onPlay={handlePlay} onNavigate={handleNavigate} />}

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#7A8580", letterSpacing: "0.04em" }}>
          THE GREEN BOX — A PROTOTYPE BUILT WITH CLAUDE
        </div>
      </footer>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  );
}
