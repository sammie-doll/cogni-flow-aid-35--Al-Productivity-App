// Lightweight, deterministic-ish mock AI generators so the app feels real
// without any external API calls.

export interface EmailInput {
  tone: string;
  audience: string;
  purpose: string;
  keyPoints: string;
  length: "short" | "medium" | "detailed";
}

export function generateEmail(i: EmailInput) {
  const greeting = {
    formal: "Dear",
    professional: "Hello",
    friendly: "Hi",
    persuasive: "Hello",
    apologetic: "Dear",
  }[i.tone] || "Hello";

  const closingByTone: Record<string, string> = {
    formal: "Yours sincerely",
    professional: "Best regards",
    friendly: "Cheers",
    persuasive: "Looking forward to your response",
    apologetic: "With sincere apologies",
  };

  const audienceLabel: Record<string, string> = {
    client: "Client",
    manager: "Manager",
    team: "Team",
    recruiter: "Hiring Manager",
    customer: "Valued Customer",
  };

  const points = i.keyPoints
    .split(/\n|•|-/)
    .map((s) => s.trim())
    .filter(Boolean);

  const intro = {
    short: `I'm writing regarding ${i.purpose.toLowerCase()}.`,
    medium: `I hope you're doing well. I wanted to reach out regarding ${i.purpose.toLowerCase()} and share a quick update.`,
    detailed: `I hope this message finds you well. I'm writing to follow up on ${i.purpose.toLowerCase()}, summarise where things stand, and outline the next steps so we stay aligned.`,
  }[i.length];

  const bullets = points.length
    ? `\n\nKey points:\n${points.map((p) => `• ${p}`).join("\n")}`
    : "";

  const close = {
    short: "Let me know your thoughts.",
    medium: "Please let me know if you have any questions or would like to discuss further.",
    detailed:
      "Please review at your convenience and share any feedback. Happy to jump on a quick call if that's easier — I want to make sure this lands well for everyone involved.",
  }[i.length];

  const subject = `${i.purpose.replace(/\.$/, "")}${i.tone === "apologetic" ? " — Apology & Next Steps" : ""}`;

  const body = `${greeting} ${audienceLabel[i.audience] || "there"},\n\n${intro}${bullets}\n\n${close}\n\n${closingByTone[i.tone] || "Best"},\n[Your name]`;

  return { subject, body };
}

export function summarizeMeeting(notes: string) {
  const lines = notes.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const pick = (n: number) => lines.slice(0, n);

  const actions = lines
    .filter((l) => /(will|to-do|todo|action|assign|owner|by |deadline)/i.test(l))
    .slice(0, 5);

  const decisions = lines
    .filter((l) => /(decided|agreed|approved|chose|selected)/i.test(l))
    .slice(0, 4);

  return {
    summary:
      lines.length === 0
        ? "Paste meeting notes to generate a summary."
        : `The team discussed ${pick(1)[0]?.slice(0, 90) || "the agenda"} and aligned on next steps. Overall the conversation was productive with clear ownership emerging on the main initiatives.`,
    keyPoints: pick(5).map((l) => l.slice(0, 140)),
    decisions: decisions.length ? decisions : ["No explicit decisions captured."],
    actionItems: (actions.length ? actions : pick(3)).map((a, i) => ({
      task: a,
      owner: ["Alex", "Priya", "Marco", "Jordan", "Sam"][i % 5],
      due: ["Tomorrow", "Friday", "Next week", "End of sprint"][i % 4],
    })),
  };
}

export interface TaskInput {
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  estMins: number;
  due?: string;
}

export function planTasks(tasks: TaskInput[]) {
  const sorted = [...tasks].sort((a, b) => {
    const p = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
    return p[a.priority] - p[b.priority];
  });
  const blocks: { time: string; task: string; mins: number }[] = [];
  let cursor = 9 * 60; // 9:00
  for (const t of sorted) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    blocks.push({
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      task: t.title,
      mins: t.estMins,
    });
    cursor += t.estMins + 10;
    if (cursor > 12 * 60 && cursor < 13 * 60) cursor = 13 * 60; // lunch
  }
  return {
    blocks,
    matrix: {
      urgentImportant: sorted.filter((t) => t.priority === "urgent"),
      important: sorted.filter((t) => t.priority === "high"),
      schedule: sorted.filter((t) => t.priority === "medium"),
      delegate: sorted.filter((t) => t.priority === "low"),
    },
    next: sorted[0]?.title || "No tasks queued — add one to begin.",
    workloadWarning:
      sorted.reduce((s, t) => s + t.estMins, 0) > 480
        ? "Workload exceeds 8 hours. Consider deferring lower-priority items."
        : null,
  };
}

export function research(topic: string) {
  return {
    summary: `${topic} is an evolving area with active research and real-world adoption. Recent work emphasises practical reliability, ethical use, and measurable outcomes over hype.`,
    insights: [
      `Adoption of ${topic} is growing fastest in mid-sized organisations.`,
      `The biggest barriers are integration cost and change management.`,
      `Teams that pair ${topic} with clear KPIs see 2–3x better outcomes.`,
      `Regulatory attention is increasing — expect new guidelines within 12 months.`,
    ],
    recommendations: [
      "Start with a narrow, high-value pilot.",
      "Define success metrics before rollout.",
      "Invest in training and responsible-use guardrails.",
    ],
    simple: `In simple terms, ${topic} helps people get more done by automating repetitive thinking so they can focus on judgement and creativity.`,
    pros: ["Saves time", "Reduces routine errors", "Scales expertise", "Improves consistency"],
    cons: ["Can produce inaccuracies", "Risk of over-reliance", "Privacy considerations", "Requires oversight"],
    sources: [
      { title: "Industry overview (placeholder)", url: "#" },
      { title: "Academic review (placeholder)", url: "#" },
      { title: "Practitioner case study (placeholder)", url: "#" },
    ],
  };
}

export function chatReply(message: string, history: { role: string; content: string }[]) {
  const m = message.toLowerCase();
  if (/plan|schedule|day/.test(m))
    return "Here's a suggested structure: 9–11 deep work on your top priority, 11–12 email & comms, 13–15 collaborative work, 15–16 admin, 16–17 review & plan tomorrow. Want me to slot specific tasks?";
  if (/summari[sz]e/.test(m))
    return "Paste the text you'd like summarised and I'll produce a short summary, key points, and action items.";
  if (/email|draft|write/.test(m))
    return "Tell me the audience, tone, and the 2–3 points you want to land. I'll draft something you can refine.";
  if (/prioriti[sz]e/.test(m))
    return "Use urgency × importance: do urgent+important now, schedule important-not-urgent, delegate urgent-not-important, drop the rest.";
  if (/research/.test(m))
    return "Give me a topic or paste an article and I'll return a summary, key insights, pros/cons, and recommendations.";
  if (history.length === 0)
    return `Hi! I'm CogniFlow. I can help you plan your day, draft emails, summarise meetings, and research topics. What would you like to start with?`;
  return `Got it — "${message.slice(0, 80)}". Here's how I'd approach it: break the goal into 2–3 concrete steps, do the highest-leverage one first, then review. Want me to expand any step?`;
}

export function generateWeeklyReport() {
  return {
    tasksCompleted: 38,
    emailsGenerated: 22,
    meetingsSummarized: 6,
    hoursSaved: 11.5,
    productivityScore: 87,
    breakdown: [
      { feature: "Email Generator", pct: 32 },
      { feature: "Meeting Summarizer", pct: 18 },
      { feature: "Task Planner", pct: 24 },
      { feature: "Research", pct: 14 },
      { feature: "Chat", pct: 12 },
    ],
    strengths: [
      "Consistent morning focus blocks",
      "Strong follow-through on high-priority tasks",
      "Effective use of AI summaries to cut meeting time",
    ],
    improvements: [
      "Reduce context switching after 3pm",
      "Batch low-priority email replies",
      "Schedule one deep-research block per week",
    ],
    nextWeek: [
      "Protect 9–11am for deep work daily",
      "Run a Friday review session",
      "Pilot the AI planner for cross-team scheduling",
    ],
  };
}
