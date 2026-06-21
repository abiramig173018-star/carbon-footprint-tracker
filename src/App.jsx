import { useState, useEffect } from "react";

const palette = {
  forest: "#1B3A2D",
  moss: "#2D5A3D",
  sage: "#5C8A6A",
  mist: "#A8C5B0",
  earth: "#C4A882",
  sand: "#F0EAD6",
  leaf: "#7BC67A",
  alert: "#E07B4A",
  sky: "#E8F4F0",
  ink: "#0F2019",
};

const questions = [
  {
    id: "transport",
    category: "Transport",
    icon: "🚗",
    question: "How do you usually get around?",
    options: [
      { label: "Car (petrol/diesel)", value: 4.6, hint: "~4.6 kg CO₂/day" },
      { label: "Electric vehicle", value: 1.2, hint: "~1.2 kg CO₂/day" },
      { label: "Public transport", value: 0.9, hint: "~0.9 kg CO₂/day" },
      { label: "Cycle / Walk", value: 0, hint: "Zero emissions 🌿" },
    ],
  },
  {
    id: "flights",
    category: "Flights",
    icon: "✈️",
    question: "How often do you fly per year?",
    options: [
      { label: "Never", value: 0, hint: "Great choice!" },
      { label: "1–2 flights", value: 0.8, hint: "~0.8 tonnes/yr" },
      { label: "3–5 flights", value: 2.0, hint: "~2.0 tonnes/yr" },
      { label: "6+ flights", value: 4.5, hint: "~4.5 tonnes/yr" },
    ],
  },
  {
    id: "diet",
    category: "Diet",
    icon: "🥗",
    question: "What best describes your diet?",
    options: [
      { label: "Meat every day", value: 3.3, hint: "~3.3 kg CO₂/day" },
      { label: "Meat a few times/week", value: 2.1, hint: "~2.1 kg CO₂/day" },
      { label: "Vegetarian", value: 1.0, hint: "~1.0 kg CO₂/day" },
      { label: "Vegan", value: 0.5, hint: "~0.5 kg CO₂/day" },
    ],
  },
  {
    id: "energy",
    category: "Home Energy",
    icon: "⚡",
    question: "How do you power your home?",
    options: [
      { label: "Mostly fossil fuels", value: 3.0, hint: "~3.0 kg CO₂/day" },
      { label: "Mixed / grid average", value: 1.5, hint: "~1.5 kg CO₂/day" },
      { label: "Partly renewable", value: 0.8, hint: "~0.8 kg CO₂/day" },
      { label: "Fully renewable", value: 0.1, hint: "~0.1 kg CO₂/day" },
    ],
  },
  {
    id: "shopping",
    category: "Shopping",
    icon: "🛍️",
    question: "How often do you buy new clothes or gadgets?",
    options: [
      { label: "Very frequently", value: 2.0, hint: "~2.0 kg CO₂/day" },
      { label: "Monthly", value: 1.2, hint: "~1.2 kg CO₂/day" },
      { label: "A few times a year", value: 0.6, hint: "~0.6 kg CO₂/day" },
      { label: "Rarely / Second-hand", value: 0.2, hint: "~0.2 kg CO₂/day" },
    ],
  },
];

const tips = {
  transport: [
    "Try carpooling or switching to public transit 2 days/week — saves ~400 kg CO₂/year.",
    "Consider an EV or e-bike for your next vehicle.",
    "Work from home even 1 day/week can cut your transport footprint by 20%.",
  ],
  flights: [
    "Take a train instead of a short-haul flight when possible.",
    "Offset unavoidable flights through verified carbon offset programs.",
    "Combine trips to reduce total flights per year.",
  ],
  diet: [
    "Going meat-free just one day a week saves ~340 kg CO₂/year.",
    "Buy local and seasonal produce — lower transport emissions.",
    "Reduce food waste: 8% of global emissions come from wasted food.",
  ],
  energy: [
    "Switch to an LED bulb — uses 75% less energy.",
    "Unplug devices on standby — they account for 10% of home electricity.",
    "Ask your energy provider about renewable tariffs.",
  ],
  shopping: [
    "Before buying new, check if second-hand is available.",
    "Buy fewer, better quality items that last longer.",
    "Repair instead of replace — skills like sewing or electronics repair help.",
  ],
};

const getGrade = (total) => {
  if (total < 5) return { grade: "A", label: "Climate Champion", color: palette.leaf };
  if (total < 8) return { grade: "B", label: "Eco Aware", color: "#9BC67A" };
  if (total < 12) return { grade: "C", label: "Room to Grow", color: palette.earth };
  if (total < 16) return { grade: "D", label: "High Impact", color: palette.alert };
  return { grade: "F", label: "Critical Zone", color: "#C0392B" };
};

const Bar = ({ value, max, color }) => (
  <div style={{ background: "#D4E8DC", borderRadius: 4, height: 10, overflow: "hidden", flex: 1 }}>
    <div
      style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        background: color,
        height: "100%",
        borderRadius: 4,
        transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
      }}
    />
  </div>
);

export default function CarbonTracker() {
  const [step, setStep] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [actions, setActions] = useState({});

  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const grade = getGrade(total);

  const goNext = () => {
    if (selected === null) return;
    const q = questions[qIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: selected }));
    setAnimIn(false);
    setTimeout(() => {
      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
        setSelected(null);
        setAnimIn(true);
      } else {
        setStep("result");
      }
    }, 250);
  };

  const restart = () => {
    setStep("intro");
    setQIndex(0);
    setAnswers({});
    setSelected(null);
    setAnimIn(true);
    setActions({});
  };

  const toggleAction = (cat, tip) => {
    setActions((prev) => {
      const key = `${cat}-${tip}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const completedCount = Object.values(actions).filter(Boolean).length;

  const categoryColors = {
    transport: "#7BC67A",
    flights: "#5C8A6A",
    diet: "#A8C5B0",
    energy: "#C4A882",
    shopping: "#E07B4A",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${palette.forest} 0%, ${palette.moss} 60%, ${palette.sage} 100%)`,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* INTRO */}
        {step === "intro" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🌍</div>
            <h1
              style={{
                color: palette.sand,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-1px",
                margin: "0 0 8px",
                lineHeight: 1.1,
              }}
            >
              Your Carbon
              <br />
              Footprint
            </h1>
            <p style={{ color: palette.mist, fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
              5 quick questions. Understand your impact.
              <br />
              Get personalized actions that actually help.
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 28,
                textAlign: "left",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {["Transport", "Flights", "Diet", "Home Energy", "Shopping"].map((c, i) => (
                <div
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 0",
                    borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{["🚗", "✈️", "🥗", "⚡", "🛍️"][i]}</span>
                  <span style={{ color: palette.mist, fontSize: 14 }}>{c}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("quiz")}
              style={{
                background: palette.leaf,
                color: palette.ink,
                border: "none",
                borderRadius: 12,
                padding: "14px 36px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
                letterSpacing: "0.3px",
              }}
            >
              Calculate My Footprint →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {step === "quiz" && (
          <div
            style={{
              opacity: animIn ? 1 : 0,
              transform: animIn ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i <= qIndex ? palette.leaf : "rgba(255,255,255,0.15)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "28px 24px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ marginBottom: 4 }}>
                <span
                  style={{
                    color: palette.leaf,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  {questions[qIndex].category}
                </span>
              </div>
              <div style={{ fontSize: 36, margin: "8px 0" }}>{questions[qIndex].icon}</div>
              <h2
                style={{
                  color: palette.sand,
                  fontSize: 20,
                  fontWeight: 700,
                  margin: "0 0 24px",
                  lineHeight: 1.3,
                }}
              >
                {questions[qIndex].question}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {questions[qIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(opt.value)}
                    style={{
                      background:
                        selected === opt.value
                          ? "rgba(123,198,122,0.2)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        selected === opt.value
                          ? `2px solid ${palette.leaf}`
                          : "2px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ color: palette.sand, fontSize: 14, fontWeight: 500 }}>
                      {opt.label}
                    </span>
                    <span style={{ color: palette.mist, fontSize: 12 }}>{opt.hint}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={selected === null}
                style={{
                  marginTop: 20,
                  width: "100%",
                  background: selected !== null ? palette.leaf : "rgba(255,255,255,0.1)",
                  color: selected !== null ? palette.ink : "rgba(255,255,255,0.3)",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: selected !== null ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {qIndex + 1 === questions.length ? "See My Results" : "Next →"}
              </button>
            </div>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 12 }}>
              Question {qIndex + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <div>
            {/* Score card */}
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "28px 24px",
                border: "1px solid rgba(255,255,255,0.1)",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: grade.color,
                  color: palette.ink,
                  fontSize: 32,
                  fontWeight: 900,
                  marginBottom: 12,
                }}
              >
                {grade.grade}
              </div>
              <div style={{ color: grade.color, fontWeight: 700, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
                {grade.label}
              </div>
              <div style={{ color: palette.sand, fontSize: 38, fontWeight: 900, marginBottom: 2 }}>
                {total.toFixed(1)}
                <span style={{ fontSize: 16, fontWeight: 500, color: palette.mist }}> tonnes CO₂/yr</span>
              </div>
              <p style={{ color: palette.mist, fontSize: 13, margin: 0 }}>
                Global average is ~4.7 tonnes. Target: under 2 tonnes by 2050.
              </p>
            </div>

            {/* Breakdown */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "20px 20px",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 16,
              }}
            >
              <h3 style={{ color: palette.sand, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>
                Breakdown
              </h3>
              {questions.map((q) => (
                <div key={q.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{q.icon}</span>
                    <span style={{ color: palette.mist, fontSize: 13, flex: 1 }}>{q.category}</span>
                    <span style={{ color: palette.sand, fontSize: 13, fontWeight: 700 }}>
                      {answers[q.id]?.toFixed(1)}t
                    </span>
                  </div>
                  <Bar
                    value={answers[q.id] || 0}
                    max={Math.max(...Object.values(answers))}
                    color={categoryColors[q.id]}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "20px 20px",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ color: palette.sand, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                  Your Action Plan
                </h3>
                {completedCount > 0 && (
                  <span style={{ color: palette.leaf, fontSize: 12, fontWeight: 600 }}>
                    ✓ {completedCount} committed
                  </span>
                )}
              </div>
              {questions.map((q) => (
                <div key={q.id} style={{ marginBottom: 14 }}>
                  <div style={{ color: palette.mist, fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                    {q.icon} {q.category}
                  </div>
                  {tips[q.id].map((tip, i) => {
                    const key = `${q.id}-${tip}`;
                    const done = actions[key];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleAction(q.id, tip)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "9px 0",
                          borderBottom: i < tips[q.id].length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `2px solid ${done ? palette.leaf : "rgba(255,255,255,0.2)"}`,
                            background: done ? palette.leaf : "transparent",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 1,
                            transition: "all 0.2s",
                          }}
                        >
                          {done && <span style={{ fontSize: 11, color: palette.ink, fontWeight: 900 }}>✓</span>}
                        </div>
                        <span
                          style={{
                            color: done ? palette.mist : palette.sand,
                            fontSize: 13,
                            lineHeight: 1.5,
                            textDecoration: done ? "line-through" : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {tip}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Potential savings */}
            {completedCount > 0 && (
              <div
                style={{
                  background: "rgba(123,198,122,0.1)",
                  border: `1px solid ${palette.leaf}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <div style={{ color: palette.leaf, fontWeight: 700, fontSize: 15 }}>
                  🌱 If you commit to {completedCount} action{completedCount > 1 ? "s" : ""}…
                </div>
                <div style={{ color: palette.mist, fontSize: 13, marginTop: 4 }}>
                  You could cut your footprint by up to{" "}
                  <strong style={{ color: palette.sand }}>
                    {(completedCount * 0.4).toFixed(1)} tonnes/year
                  </strong>
                </div>
              </div>
            )}

            <button
              onClick={restart}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.08)",
                color: palette.mist,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px",
                fontSize: 14,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ↩ Recalculate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
