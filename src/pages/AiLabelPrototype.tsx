import { useLayoutEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gauge,
  Headphones,
  Lock,
  Megaphone,
  MessageSquareText,
  Mic2,
  PenLine,
  Route,
  Sparkles,
  Upload,
  X,
  Settings,
  UsersRound,
  Calendar,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type View =
  | "connectArtist"
  | "setup"
  | "labelHQ"
  | "staffWorkspace"
  | "managerOffice"
  | "conversationWorkspace"
  | "investigation"
  | "decisionPackage"
  | "missionsWorkspace"
  | "tasksWorkspace"
  | "testLabWorkspace"
  | "briefsWorkspace"
  | "artistProfileWorkspace"
  | "lockedAgentWorkspace"
  | "reviewWorkspace";

type DrawerKind = "evidence" | "decisionRecord" | "workDraft" | "intelligence" | null;

type Agent = {
  id: string;
  name: string;
  title: string;
  status: "available" | "locked";
  icon: typeof BriefcaseBusiness;
  purpose: string;
  tools: string[];
  evidence: string[];
  connectedSources: string[];
  requiredSources: string[];
  optionalSources: string[];
  sourceActions: string[];
  managerCanPrepare: string;
  color: string;
};

type ArtistProfile = {
  name: string;
  spotify: string;
  genre: string;
  market: string;
  release: string;
  goal: string;
  budget: string;
  stage: string;
  tiktok: string;
  instagram: string;
  youtube: string;
  x: string;
};

type Mission = {
  id: string;
  title: string;
  status: "active" | "review" | "blocked" | "complete";
  progress: number;
  tasks: number;
  tests: number;
  briefs: number;
  review: string;
  summary: string;
  archived?: boolean;
};

type RecentConversation = {
  id: string;
  topic: string;
  lastUpdate: string;
  status: string;
  prompt: string;
  summary: string;
  archived?: boolean;
  messages: ConversationMessage[];
};

type ConversationMessage = {
  id: string;
  speaker: "artist" | "manager";
  label: string;
  body: string;
  budgetAction?: string;
  heldBack?: string;
  reviewPoint?: string;
  whyThisCall?: string[];
  rejectedMoves?: string[];
  workCreated?: { type: "mission" | "task" | "test"; title: string; body: string; id?: string };
};

const artist = {
  name: "Sable Day",
  spotify: "Sable Day - verified artist",
  genre: "Alternative R&B",
  market: "Atlanta",
  release: "Night Bus",
  goal: "Validate the single before scale spend",
  budget: "$5,000",
  stage: "Developing artist with breakout signals",
  tiktok: "@sableday",
  instagram: "@sableday",
  youtube: "@sableday",
  x: "@sableday",
};

const agents: Agent[] = [
  {
    id: "manager",
    name: "AI Manager",
    title: "Available now",
    status: "available",
    icon: BriefcaseBusiness,
    purpose: "Runs the artist operating rhythm: priorities, decisions, missions, tests, check-ins, and department briefs.",
    tools: ["Decision gates", "Mission planner", "Artist check-ins", "Quality gate"],
    evidence: ["Artist profile", "catalog signals", "social evidence", "budget context", "prior decisions"],
    connectedSources: ["Spotify public identity", "Artist profile", "TikTok public signal", "YouTube public signal"],
    requiredSources: ["Spotify artist identity"],
    optionalSources: ["Spotify for Artists export", "Smart-link clicks", "Royalty statements"],
    sourceActions: ["Connect Spotify for Artists", "Upload smart-link CSV"],
    managerCanPrepare: "Already active.",
    color: "#9A3BDC",
  },
  {
    id: "marketing",
    name: "Marketing Lead",
    title: "Locked",
    status: "locked",
    icon: Megaphone,
    purpose: "Campaign planning, content tests, creators, paid/organic growth, and platform strategy.",
    tools: ["Content test planner", "creator map", "campaign calendar", "paid spend gate"],
    evidence: ["TikTok/Instagram/YouTube analytics", "campaign history", "smart-link data", "comment themes"],
    connectedSources: ["TikTok public signal", "YouTube public signal", "Artist replies"],
    requiredSources: ["content analytics", "campaign history"],
    optionalSources: ["creator list", "smart-link clicks", "paid spend history"],
    sourceActions: ["Connect social analytics", "Upload campaign history"],
    managerCanPrepare: "Campaign brief, content test, budget recommendation.",
    color: "#ffc7a3",
  },
  {
    id: "syncDeals",
    name: "Sync & Deals",
    title: "Locked",
    status: "locked",
    icon: Headphones,
    purpose: "Finds sync, brand, partnership, and deal opportunities only when rights and pitch materials are credible.",
    tools: ["Opportunity fit map", "rights readiness gate", "pitch package builder", "deal-risk checklist"],
    evidence: ["rights clarity", "pitch assets", "catalog metadata", "audience proof", "brand-fit notes"],
    connectedSources: ["Catalog metadata", "Night Bus operating read"],
    requiredSources: ["rights clarity", "pitch assets"],
    optionalSources: ["one-sheet", "clean instrumental", "prior deal notes", "brand target list"],
    sourceActions: ["Upload pitch materials", "Add rights documents"],
    managerCanPrepare: "Sync/deals readiness brief, missing-material checklist, and pitch questions.",
    color: "#dfccff",
  },
  {
    id: "touring",
    name: "Touring Agent",
    title: "Locked",
    status: "locked",
    icon: Route,
    purpose: "City validation, show readiness, routing, and live-market opportunity.",
    tools: ["City signal map", "route planner", "show readiness gate", "partner path"],
    evidence: ["Streaming geography", "YouTube geography", "social demand", "ticketing proxies", "comment locations"],
    connectedSources: ["Streaming geography", "YouTube geography", "comment locations"],
    requiredSources: ["city demand signals", "live history"],
    optionalSources: ["ticketing proxies", "venue notes", "promoter list"],
    sourceActions: ["Connect live history", "Upload venue notes"],
    managerCanPrepare: "Market validation brief without claiming show readiness.",
    color: "#bdeecb",
  },
  {
    id: "financeRights",
    name: "Finance/Rights",
    title: "Locked",
    status: "locked",
    icon: CircleDollarSign,
    purpose: "Budget guardrails, royalty questions, payout timing, ownership, splits, metadata, and rights hygiene.",
    tools: ["Budget gate", "royalty statement intake", "split risk map", "rights checklist", "metadata review"],
    evidence: ["Royalty statements", "payout history", "split sheets", "distributor metadata", "publishing/master ownership"],
    connectedSources: ["Budget context", "Distributor metadata placeholder"],
    requiredSources: ["royalty statements", "split sheets"],
    optionalSources: ["payout history", "publishing ownership", "master ownership", "ISRC metadata"],
    sourceActions: ["Upload royalty statement", "Upload split sheet"],
    managerCanPrepare: "Finance and rights intake brief with missing-evidence checklist.",
    color: "#aee7ff",
  },
];

const managerQuestions = [
  {
    id: "budget",
    question: "Is the full $5,000 deployable, or does some need to stay reserved for creative?",
    suggested: "Full budget is available, but keep at least $2,000 uncommitted until the test reports back.",
  },
  {
    id: "capacity",
    question: "Can the artist commit to a 10-day content sprint around Night Bus?",
    suggested: "Yes. Sable can post daily for 10 days if the formats are low-lift and repeatable.",
  },
  {
    id: "focus",
    question: "Is Night Bus still the focus, or are we protecting the next single?",
    suggested: "Night Bus is the focus for now. Do not split attention with the next single this week.",
  },
];

const investigationSteps = [
  "Understanding the management decision",
  "Checking artist operating profile",
  "Mapping evidence needs to source capabilities",
  "Reviewing catalog and release signals",
  "Comparing attention, participation, conversion, and leverage",
  "Checking budget, timing, rights, and team-capacity red flags",
  "Creating execution package",
  "Running quality gate",
];

const baseMissions: Mission[] = [
  {
    id: "night-bus-validation",
    title: "Achieve Nigerian Market Breakout",
    status: "active",
    progress: 18,
    tasks: 4,
    tests: 1,
    briefs: 4,
    review: "72-hour signal review",
    summary: "Initialize the Night Bus campaign for the Lagos metropolitan area and verify demand conversion before scaling global spend.",
  },
  {
    id: "profile-completeness",
    title: "Establish Full Data Sovereignty",
    status: "blocked",
    progress: 35,
    tasks: 3,
    tests: 0,
    briefs: 1,
    review: "Waiting on uploads",
    summary: "Unify all private artist data sources to enable high-confidence AI decisions on budget, rights, and marketing spend.",
  },
  {
    id: "rights-hygiene",
    title: "Institutionalize Artist Rights",
    status: "review",
    progress: 52,
    tasks: 2,
    tests: 0,
    briefs: 2,
    review: "Rights metadata needed",
    summary: "Standardize ownership and metadata hygiene across the catalog to prepare for professional sync and brand partnerships.",
  },
  {
    id: "march-rollout",
    title: "Consolidate Q1 Performance Records",
    status: "complete",
    progress: 100,
    tasks: 5,
    tests: 1,
    briefs: 2,
    review: "Completed Apr 04",
    summary: "Review and archive all Q1 release data to inform the next operating cycle's budget and creative strategy.",
    archived: true,
  },
];

const taskRows = [
  {
    id: "approve-budget",
    title: "Approve capped campaign test budget",
    owner: "Manager / artist team",
    deadline: "Today",
    approvalState: "needs approval",
    purpose: "Sets the spend ceiling before any paid activation can be treated as runnable.",
    steps: ["Confirm the maximum test cap", "Confirm the holdback amount", "Record approval before activation"],
    evidenceIds: ["EV-ART-0007"],
    dependency: "Artist confirms deployable budget and campaign focus.",
    why: "The Manager cannot activate paid spend without human approval.",
  },
  {
    id: "post-hooks",
    title: "Post three Night Bus hook variations",
    owner: "Artist",
    deadline: "48 hours",
    approvalState: "active",
    purpose: "Creates comparable creative signals before the team spends more money.",
    steps: ["Pick three repeatable hook formats", "Post one version per day", "Tag each post for tracking"],
    evidenceIds: ["EV-TTK-0426", "EV-YT-1190"],
    dependency: "Artist capacity for a 10-day sprint.",
    why: "Creates enough signal to compare attention against demand.",
  },
  {
    id: "track-conversion",
    title: "Track saves, clicks, follows, and demand comments",
    owner: "Marketing",
    deadline: "10 days",
    approvalState: "active",
    purpose: "Separates empty attention from early listener demand.",
    steps: ["Track daily post performance", "Pull smart-link clicks if available", "Flag save/comment/follow movement at review"],
    evidenceIds: ["EV-TTK-0426", "EV-YT-1190", "EV-SP-3302"],
    dependency: "Content posts and measurable links are live.",
    why: "These are the signals that determine whether the budget can scale.",
  },
  {
    id: "upload-spotify",
    title: "Upload Spotify for Artists CSV",
    owner: "Manager",
    deadline: "Optional",
    approvalState: "blocked",
    purpose: "Raises confidence by adding private conversion and source-of-stream context.",
    steps: ["Export track-level Spotify data", "Upload the CSV", "Normalize saves, skips, source-of-stream, and listener movement"],
    evidenceIds: ["EV-SP-3302"],
    dependency: "Artist or team has Spotify for Artists access.",
    why: "Private saves and source-of-stream data would raise confidence.",
  },
];

const evidence = [
  {
    id: "EV-TTK-0426",
    source: "TikTok",
    sourceKind: "mock/demo",
    type: "Social performance",
    subject: "Night Bus hook clips",
    window: "Last 14 days",
    metric: "4.8x baseline views",
    lens: "Attention",
    freshness: "Today",
    confidence: "Medium",
    provenance: "Connected social report",
    limitation: "Views do not prove listener demand.",
    rawRef: "snapshot/tiktok/night-bus-14d",
  },
  {
    id: "EV-YT-1190",
    source: "YouTube",
    sourceKind: "mock/demo",
    type: "Comment evidence",
    subject: "Night Bus short + visualizer comments",
    window: "Last 30 days",
    metric: "Repeated release-request comments",
    lens: "Participation",
    freshness: "Today",
    confidence: "Medium",
    provenance: "Public comments",
    limitation: "Sample is noisy and not linked to streaming conversion.",
    rawRef: "snapshot/youtube/night-bus-comments",
  },
  {
    id: "EV-SP-3302",
    source: "Spotify",
    sourceKind: "real API",
    type: "Catalog metadata",
    subject: "Sable Day catalog",
    window: "Current public profile",
    metric: "Catalog identity and public metadata",
    lens: "Conversion",
    freshness: "Today",
    confidence: "Low-medium",
    provenance: "Public API",
    limitation: "Private saves, skips, source-of-stream, and listener saves are not connected.",
    rawRef: "snapshot/spotify/public-catalog",
  },
  {
    id: "EV-ART-0007",
    source: "Artist reply",
    sourceKind: "user-supplied",
    type: "Capacity context",
    subject: "10-day content sprint",
    window: "This campaign",
    metric: "Daily posting commitment confirmed",
    lens: "Context",
    freshness: "Now",
    confidence: "High",
    provenance: "Manager question reply",
    limitation: "Applies to this campaign window only.",
    rawRef: "memory/artist-replies/may-budget",
  },
];

const testCheckpoints = [
  { id: "setup", title: "Setup confirmation", detail: "Budget cap, focus asset, content capacity, and tracking sources confirmed." },
  { id: "early", title: "Early execution check", detail: "First hook posts live; Manager verifies the test is actually running." },
  { id: "signal", title: "First signal review", detail: "72-hour read on attention, participation, and conversion proxies." },
  { id: "midpoint", title: "Midpoint adjustment", detail: "Manager shifts hooks or audience only if the evidence supports it." },
  { id: "final", title: "Final decision review", detail: "Scale, continue, or stop based on threshold evidence." },
];

const departmentBriefs = [
  {
    id: "manager-marketing-request",
    route: "Manager -> Marketing Lead",
    briefType: "Request",
    subject: "Prepare the Night Bus hook test",
    message: "I need a tight 10-day content sprint that lets us learn without burning the budget. Please turn the current Night Bus signals into three repeatable hook formats and a posting cadence Sable can actually keep.",
    sourceBasis: "TikTok hook use is 4.8x above baseline, YouTube comments show lyric participation, and the artist confirmed daily posting capacity.",
    recommendedAction: "Prepare the creative prompt set, tag the first 72-hour checkpoint, and do not recommend paid scale until saves/clicks move together.",
    status: "Prepared handoff",
    linkedMission: "Validate Night Bus before scale spend",
  },
  {
    id: "marketing-manager-finding",
    route: "Marketing Lead -> Manager",
    briefType: "Run finding",
    subject: "Creative demand exists, conversion is not proven",
    message: "My run says the song has repeatable social language, but the conversion path is still thin. The strongest angle is the late-night transit hook; the weakest angle is generic heartbreak copy.",
    sourceBasis: "Public TikTok usage, YouTube comment themes, creator-caption repeats, and the current mission budget cap.",
    recommendedAction: "Let the Manager keep the $1,850 cap and ask for Spotify for Artists export before day-10 scale advice.",
    status: "Shared with Manager",
    linkedMission: "Validate Night Bus before scale spend",
  },
  {
    id: "finance-manager-update",
    route: "Finance/Rights -> Manager",
    briefType: "Source request",
    subject: "Spend advice is directional until rights and royalty sources arrive",
    message: "I can support the cap logic, but I cannot validate revenue recovery, ownership exposure, or payout timing yet. I need royalty statements and split sheets before the mission record should treat scale spend as financially clean.",
    sourceBasis: "Budget answer is confirmed; royalty statements, payout history, split sheets, and distributor ownership records are not connected.",
    recommendedAction: "Keep the recommendation as a capped test, request uploads, and avoid legal/accounting conclusions.",
    status: "Waiting on sources",
    linkedMission: "Validate Night Bus before scale spend",
  },
  {
    id: "manager-sync-request",
    route: "Manager -> Sync & Deals",
    briefType: "Future specialist request",
    subject: "Hold deal exploration until pitch and rights inputs are ready",
    message: "Night Bus may become pitchable if the test proves demand, but I need this treated as readiness work for now. Do not imply deal availability until rights clarity and pitch assets are uploaded.",
    sourceBasis: "Mission heat is emerging; rights clarity, pitch assets, clean instrumental, and ownership documents are missing.",
    recommendedAction: "Create a readiness checklist and prepare questions for the artist team before any brand/sync outreach.",
    status: "Prepared for locked agent",
    linkedMission: "Prepare rights hygiene for future deals",
  },
];

const decisionRecord = {
  missionTitle: "Validate Night Bus before scale spend",
  currentState: "The mission is active and still constrained by evidence gaps. Tasks are moving, the test is prepared, briefs have been exchanged, and the next decisive checkpoint is scheduled.",
  finalCall: "Run a capped 10-day validation test before scaling campaign spend.",
  aiMemory: "Before answering future Night Bus questions, the AI should remember that the goal is to prove whether social heat converts into durable demand, not to maximize spend this week.",
  latestTestResult: "Pending. Early creative signals are useful, but conversion proof needs Spotify saves/source-of-stream or smart-link clicks.",
  alternativesRejected: ["Spend the full $5,000 on paid media", "Fund a full video now", "Split attention across multiple songs"],
  confidence: "Medium",
  missingEvidence: ["Spotify for Artists saves/skips/source-of-stream", "Smart-link click-through", "Royalty statements for revenue questions"],
  changeDecision: "Cross-platform conversion improves, private Spotify saves confirm demand, or 72-hour signals fail the stop rule.",
  reviewDate: "72-hour signal review",
  qualityGate: "Passed with constraint: recommendation is a test, not a scale decision.",
  override: "None recorded",
};

const workDrafts = [
  {
    type: "Creator brief",
    title: "Night Bus 10-day hook sprint",
    body: "Three repeatable hook formats, daily posting cadence, direct stream path, and a 72-hour evidence read before paid scale.",
  },
  {
    type: "Team task recap",
    title: "May budget operating note",
    body: "One focus asset, capped validation spend, held reserve, evidence upload request, and day-10 decision review.",
  },
  {
    type: "DSP pitch note",
    title: "Night Bus focus note",
    body: "Night Bus remains the active focus. Pitch language waits for test results; no external send without approval.",
  },
];

const baseConversations: RecentConversation[] = [
  {
    id: "night-bus-budget",
    topic: "Night Bus budget allocation",
    lastUpdate: "Last week",
    status: "Capped test recommended; waiting for new signal",
    prompt: "Continue the Night Bus budget allocation conversation. What changed since the last recommendation?",
    summary: "Budget thread for deciding how much of the $5,000 can move before demand is proven.",
    messages: [
      {
        id: "night-bus-budget-q1",
        speaker: "artist",
        label: "You asked",
        body: "We have $5,000. What should we do this month?",
      },
      {
        id: "night-bus-budget-a1",
        speaker: "manager",
        label: "Manager answered",
        body: "Use $1,850 for a 10-day Night Bus validation test. Hold back $2,250 until the 72-hour signal review, and do not fund a full video or a full paid-media push yet.",
        budgetAction: "$1,850 capped test",
        heldBack: "$2,250 uncommitted",
        reviewPoint: "72-hour signal read",
        whyThisCall: [
          "Attention is real enough to test, but not enough to scale.",
          "Artist capacity supports a 10-day sprint if formats stay repeatable.",
          "Private conversion evidence is missing, so spend should stay reversible."
        ],
        rejectedMoves: [
          "Fund full Night Bus music video",
          "Commit $3,000 to Meta/TikTok paid scale",
          "Lock release date before test proof"
        ]
      },
      {
        id: "night-bus-budget-work",
        speaker: "manager",
        label: "Work created",
        body: "Created the Night Bus validation mission, a capped test, department briefs, and a decision record.",
        workCreated: {
          type: "mission",
          title: "Validate Night Bus before scale spend",
          body: "Capped $1,850 test watching acoustic hook saves and smart-link conversion.",
          id: "night-bus-validation"
        }
      },
    ],
  },
  {
    id: "tiktok-momentum",
    topic: "TikTok momentum check",
    lastUpdate: "3 days ago",
    status: "Acoustic hook flagged as the strongest demand proxy",
    prompt: "Continue the TikTok momentum check. Are the new video uses turning into listener demand?",
    summary: "Signal thread for separating empty attention from durable listener demand.",
    messages: [
      {
        id: "tiktok-q1",
        speaker: "artist",
        label: "You asked",
        body: "Is this TikTok attention real momentum?",
      },
      {
        id: "tiktok-a1",
        speaker: "manager",
        label: "Manager answered",
        body: "The attention is worth testing, but the acoustic hook needs save, click, and repeat-comment proof before it becomes a scale signal.",
      },
    ],
  },
  {
    id: "rights-gap",
    topic: "Rights and royalty evidence gap",
    lastUpdate: "Last Monday",
    status: "Needs royalty statements before revenue conclusions",
    prompt: "Continue the rights and royalty evidence gap conversation. What should we upload first?",
    summary: "Evidence thread for knowing what revenue and rights claims are currently safe.",
    messages: [
      {
        id: "rights-q1",
        speaker: "artist",
        label: "You asked",
        body: "Can we trust the revenue drop enough to change the plan?",
      },
      {
        id: "rights-a1",
        speaker: "manager",
        label: "Manager answered",
        body: "Not yet. Upload royalty statements, payout history, split sheets, and distributor metadata before making a revenue or rights conclusion.",
      },
    ],
  },
];

const statusText: Record<View, string> = {
  connectArtist: "Connect artist",
  setup: "Setup",
  labelHQ: "Label HQ",
  staffWorkspace: "Staff",
  managerOffice: "Manager office",
  conversationWorkspace: "Conversation",
  investigation: "Manager run",
  decisionPackage: "Decision",
  missionsWorkspace: "Missions",
  tasksWorkspace: "Tasks",
  testLabWorkspace: "Test Lab",
  briefsWorkspace: "Briefs",
  artistProfileWorkspace: "Artist Profile",
  lockedAgentWorkspace: "Locked department",
  reviewWorkspace: "Review",
};

const BrandMark = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <span
    aria-hidden="true"
    className={cn(
      "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-foreground/10 bg-[#111] shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
      size === "sm" ? "h-8 w-8" : "h-10 w-10",
    )}
  >
    <img src="/logo.png" alt="" className="h-full w-full object-cover" />
  </span>
);

const Badge = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-200",
      active ? "border-brand-accent/20 bg-brand-ghost text-brand-accent" : "border-foreground/10 bg-background/70 text-muted-foreground",
    )}
  >
    {children}
  </span>
);

const ProductButton = ({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 font-ui text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 disabled:pointer-events-none disabled:opacity-40",
      variant === "primary" && "bg-brand-accent text-primary-foreground shadow-[0_20px_58px_-34px_hsla(var(--brand-accent),0.75)] hover:-translate-y-0.5 hover:bg-brand-accent/90 active:translate-y-0",
      variant === "secondary" && "border border-foreground/10 bg-background/80 text-foreground hover:border-brand-accent/30 hover:bg-background",
      variant === "quiet" && "border border-transparent bg-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
    )}
  >
    {children}
  </button>
);

const ArtifactField = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-foreground/10 bg-background/70 p-4 transition-colors hover:border-foreground/20">
    <p className="font-ui text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className="mt-2 text-sm leading-6 text-foreground/80">{value}</p>
  </div>
);

const WorkspaceShell = ({
  eyebrow,
  title,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
    <div className="mb-10 flex items-center justify-between">
      <button
        onClick={onBack}
        className="group flex items-center gap-3 text-[13px] font-bold text-muted-foreground/60 transition-all hover:text-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/5 bg-foreground/[0.02] transition-all group-hover:border-foreground/10 group-hover:bg-foreground/[0.04]">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back
      </button>
    </div>
    <div className="mb-8">
      <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent">{eyebrow}</p>
      <h1 className="font-display mt-4 text-2xl font-bold tracking-tight text-foreground">{title}.</h1>
    </div>
    {children}
  </div>
);

export default function AiLabelPrototype() {
  const [view, setView] = useState<View>("connectArtist");
  const [profile, setProfile] = useState<ArtistProfile>(artist);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentEntryPoint, setAgentEntryPoint] = useState<"labelHQ" | "staff">("labelHQ");
  const [selectedMissionId, setSelectedMissionId] = useState(baseMissions[0].id);
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [activeQuestion, setActiveQuestion] = useState(managerQuestions[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [askText, setAskText] = useState("We have $5,000. What should we do this month?");
  const [conversations, setConversations] = useState<RecentConversation[]>(baseConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(baseConversations[0].id);
  const [conversationDraft, setConversationDraft] = useState("");
  const [threadReplies, setThreadReplies] = useState<Record<string, ConversationMessage[]>>({});
  const [approvedTasks, setApprovedTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [testCheckpoint, setTestCheckpoint] = useState<"setup" | "signal" | "complete">("setup");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === managerQuestions.length;
  const missionProgress = Math.max(
    baseMissions[0].progress,
    Math.round(((completedTasks.length + (testCheckpoint === "complete" ? 2 : testCheckpoint === "signal" ? 1 : 0)) / 6) * 100),
  );
  const missions = useMemo(
    () =>
      baseMissions.map((mission) =>
        mission.id === "night-bus-validation"
          ? { ...mission, progress: missionProgress, status: testCheckpoint === "complete" ? "review" : mission.status }
          : mission,
      ),
    [missionProgress, testCheckpoint],
  );
  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) ?? missions[0];
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0];
  const selectedConversationMessages = [...selectedConversation.messages, ...(threadReplies[selectedConversation.id] ?? [])];
  const activeQuestionObject = managerQuestions.find((question) => question.id === activeQuestion) ?? managerQuestions[0];
  const postSetup = !["connectArtist", "setup"].includes(view);
  const railActive =
    view === "artistProfileWorkspace"
      ? "settings"
      : view === "staffWorkspace" ||
          (agentEntryPoint === "staff" && ["managerOffice", "lockedAgentWorkspace", "conversationWorkspace", "investigation", "decisionPackage"].includes(view))
        ? "staff"
      : ["missionsWorkspace", "tasksWorkspace", "testLabWorkspace", "briefsWorkspace"].includes(view)
        ? "missions"
        : "labelHQ";

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [view]);

  const goTo = (next: View) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setView(next);
    window.setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const openMission = (missionId = "night-bus-validation") => {
    setSelectedMissionId(missionId);
    goTo("missionsWorkspace");
  };

  const openManager = (entryPoint: "labelHQ" | "staff" = "labelHQ") => {
    setAgentEntryPoint(entryPoint);
    goTo("managerOffice");
  };

  const openLockedAgent = (agent: Agent, entryPoint: "labelHQ" | "staff" = "labelHQ") => {
    setSelectedAgent(agent);
    setAgentEntryPoint(entryPoint);
    goTo("lockedAgentWorkspace");
  };

  const openConversation = (conversation: RecentConversation) => {
    setSelectedConversationId(conversation.id);
    setConversationDraft("");
    goTo("conversationWorkspace");
  };

  const sendThreadFollowUp = () => {
    const trimmed = conversationDraft.trim();
    if (!trimmed) return;

    const nextMessages: ConversationMessage[] = [
      {
        id: `${selectedConversation.id}-followup-${Date.now()}`,
        speaker: "artist",
        label: "You followed up",
        body: trimmed,
      },
      {
        id: `${selectedConversation.id}-answer-${Date.now()}`,
        speaker: "manager",
        label: "Manager continued",
        body: "Keep the same cap until the 72-hour read. If Chicago keeps rising, shift the next creative prompt toward that market, but do not increase spend until saves, clicks, and repeat demand comments move together.",
      },
    ];

    setThreadReplies((current) => ({
      ...current,
      [selectedConversation.id]: [...(current[selectedConversation.id] ?? []), ...nextMessages],
    }));
    setConversationDraft("");
  };

  const startManagerRun = () => {
    if (!allAnswered) return;
    
    // Create a new conversation object
    const newId = `conv-${Date.now()}`;
    const newConv: RecentConversation = {
      id: newId,
      topic: askText.length > 30 ? askText.substring(0, 30) + "..." : askText,
      lastUpdate: "",
      status: "Analyzing...",
      prompt: "Continue this new conversation.",
      summary: "Fresh management thread initialized from the Manager Office.",
      messages: [
        {
          id: `${newId}-q1`,
          speaker: "artist",
          label: "You asked",
          body: askText,
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setSelectedConversationId(newId);
    setAskText("");
    goTo("conversationWorkspace");
  };

  const saveAnswer = () => {
    const next = managerQuestions.find((question) => !answers[question.id] && question.id !== activeQuestionObject.id);
    if (next) setActiveQuestion(next.id);
  };

  return (
    <div className="app-light min-h-screen bg-background text-foreground selection:bg-brand-accent/20">
      {postSetup ? (
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_-10%,hsla(var(--brand-accent),0.08),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(217,119,87,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(46,28%,94%)_100%)]" />
      ) : (
        <>
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,hsla(var(--brand-accent),0.10),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(217,119,87,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(46,28%,94%)_100%)]" />
          <div className="pointer-events-none fixed inset-0 opacity-[0.38] [background-image:linear-gradient(hsla(var(--foreground),.035)_1px,transparent_1px),linear-gradient(90deg,hsla(var(--foreground),.035)_1px,transparent_1px)] [background-size:72px_72px]" />
        </>
      )}

      {postSetup && (
        <div className="relative z-20 mx-auto grid min-h-screen w-full max-w-[1760px] gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-8">
          <LabelHQRail
            active={railActive}
            onLabelHQ={() => goTo("labelHQ")}
            onStaff={() => goTo("staffWorkspace")}
            onMissions={() => goTo("missionsWorkspace")}
            onSettings={() => goTo("artistProfileWorkspace")}
          />
          <main className="min-w-0 py-2 lg:py-8">
            {view === "labelHQ" && (
              <LabelHQScreen
                profile={profile}
                missions={missions}
                conversations={conversations}
                onManager={() => openManager("labelHQ")}
                onLockedAgent={openLockedAgent}
                onMission={openMission}
                onWorkspace={goTo}
                onDrawer={setDrawer}
              />
            )}
            {view === "staffWorkspace" && (
              <StaffWorkspace
                onManager={() => openManager("staff")}
                onLockedAgent={(agent) => openLockedAgent(agent, "staff")}
              />
            )}
            {view === "managerOffice" && (
              <ManagerOfficeFocused
                answers={answers}
                setAnswers={setAnswers}
                activeQuestion={activeQuestion}
                setActiveQuestion={setActiveQuestion}
                activeQuestionObject={activeQuestionObject}
                answeredCount={answeredCount}
                allAnswered={allAnswered}
                askText={askText}
                setAskText={setAskText}
                saveAnswer={saveAnswer}
                startManagerRun={startManagerRun}
                onBack={() => goTo(agentEntryPoint === "staff" ? "staffWorkspace" : "labelHQ")}
                onConversation={openConversation}
                conversations={conversations}
              />
            )}
            {view === "conversationWorkspace" && (
              <ConversationWorkspace
                conversation={selectedConversation}
                messages={selectedConversationMessages}
                draft={conversationDraft}
                setDraft={setConversationDraft}
                onSend={sendThreadFollowUp}
                onBack={() => goTo("managerOffice")}
              />
            )}
            {view === "investigation" && <InvestigationScreen onBack={() => goTo("managerOffice")} />}
            {view === "decisionPackage" && <DecisionPackageScreen conversations={conversations} onBack={() => goTo("managerOffice")} onMission={openMission} onWorkspace={goTo} onDrawer={setDrawer} onConversation={openConversation} />}
            {view === "missionsWorkspace" && (
              <MissionsWorkspace
                missions={missions}
                selectedMission={selectedMission}
                setSelectedMissionId={setSelectedMissionId}
                onBack={() => goTo("labelHQ")}
                onWorkspace={goTo}
                onDrawer={setDrawer}
              />
            )}
            {view === "tasksWorkspace" && (
              <TasksWorkspace
                onBack={() => openMission(selectedMissionId)}
                approvedTasks={approvedTasks}
                completedTasks={completedTasks}
                onApproveTask={(id) => setApprovedTasks((current) => Array.from(new Set([...current, id])))}
                onCompleteTask={(id) => {
                  setCompletedTasks((current) => Array.from(new Set([...current, id])));
                  if (id === "post-hooks") setTestCheckpoint("signal");
                  if (id === "track-conversion") setTestCheckpoint("complete");
                }}
              />
            )}
            {view === "testLabWorkspace" && <TestLabWorkspace onBack={() => openMission(selectedMissionId)} testCheckpoint={testCheckpoint} />}
            {view === "briefsWorkspace" && <BriefsWorkspace onBack={() => openMission(selectedMissionId)} />}
            {view === "artistProfileWorkspace" && <ArtistProfileWorkspace profile={profile} onBack={() => goTo("labelHQ")} />}
            {view === "lockedAgentWorkspace" && (
              <LockedAgentWorkspace
                agent={selectedAgent ?? agents[1]}
                onBack={() => goTo(agentEntryPoint === "staff" ? "staffWorkspace" : "labelHQ")}
              />
            )}
            {view === "reviewWorkspace" && <ReviewWorkspace onBack={() => goTo("labelHQ")} onMission={openMission} />}
          </main>
        </div>
      )}

      {!postSetup && (
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-[1500px] px-5 py-5 sm:px-7 lg:px-9">
        {
          <header className="flex items-center justify-between">
            <button onClick={() => goTo("labelHQ")} className="flex items-center gap-3 text-left">
              <BrandMark size="sm" />
              <div>
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/42">Ordersounds</p>
                <h1 className="font-display text-2xl font-display font-bold leading-none tracking-tight">AI Record Label</h1>
              </div>
            </button>
            <Badge>{statusText[view]}</Badge>
          </header>
        }

        {view === "connectArtist" && <ConnectArtistScreen profile={profile} onContinue={() => goTo("setup")} />}
        {view === "setup" && <SetupScreen profile={profile} setProfile={setProfile} onBack={() => goTo("connectArtist")} onContinue={() => goTo("labelHQ")} />}
      </main>
      )}

      <EvidenceDrawer drawer={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}

const ConnectArtistScreen = ({ profile, onContinue }: { profile: ArtistProfile; onContinue: () => void }) => (
  <section className="mx-auto flex max-w-4xl flex-col items-center pt-[8vh] text-center">
    <p className="font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-brand-accent">Onboarding / Phase 01</p>
    <h2 className="font-display mt-6 text-[clamp(2.8rem,6vw,4.2rem)] font-bold leading-[1.1] tracking-tight text-foreground">
      Establish your<br />artist identity.
    </h2>
    <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-foreground/60 font-medium">
      Connect your primary Spotify profile to initialize the AI Record Label, configure your dedicated Manager, and begin evidence gathering.
    </p>

    <div className="mt-16 w-full max-w-2xl text-left">
      <p className="font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Verified Identity</p>
      <div className="surface-panel mt-4 flex items-center justify-between rounded-[28px] p-6 shadow-xl transition-all hover:scale-[1.01]">
        <div className="flex items-center gap-6">
          <div className="surface-intelligence h-20 w-20 shrink-0 rounded-[22px] bg-foreground/5 flex items-center justify-center">
             <BrandMark size="sm" />
          </div>
          <div>
            <h3 className="font-display text-[22px] font-bold text-foreground tracking-tight">{profile.name}</h3>
            <p className="font-ui mt-1 text-[14px] font-bold text-brand-accent opacity-80">{profile.spotify}</p>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success border border-success/10">
          <Check className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-12 flex justify-center">
        <button 
          onClick={onContinue} 
          className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-10 text-[15px] font-bold text-background transition-all hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl"
        >
          Continue to Context
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </section>
);

const SetupScreen = ({
  profile,
  setProfile,
  onBack,
  onContinue,
}: {
  profile: ArtistProfile;
  setProfile: React.Dispatch<React.SetStateAction<ArtistProfile>>;
  onBack: () => void;
  onContinue: () => void;
}) => {
  const update = (key: keyof ArtistProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  return (
    <section className="mx-auto max-w-6xl py-12">
      <button 
        onClick={onBack} 
        className="group inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/50 px-5 py-2 text-[13px] font-bold text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
        Back to Identity
      </button>

      <div className="mt-12 grid gap-16 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* Left Col: Titles */}
        <div className="sticky top-12">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-brand-accent">Onboarding / Phase 02</p>
          <h2 className="font-display mt-6 text-[3rem] font-bold leading-tight tracking-tight text-foreground">
            Enrich the<br />artist context.
          </h2>
          <p className="mt-6 text-[16px] font-medium leading-relaxed text-foreground/60">
            These parameters define how the Manager prioritizes missions, identifies evidence gaps, and drafts specialist briefs.
          </p>
          
          <div className="surface-intelligence mt-10 rounded-[20px] p-6">
             <p className="font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-brand-accent">Why this matters</p>
             <p className="mt-3 text-[13px] font-medium leading-relaxed text-foreground/80">
               Accuracy here results in high-integrity decisions. The Manager uses this as the "ground truth" for all subsequent runs.
             </p>
          </div>
        </div>

        {/* Right Col: Forms */}
        <div className="surface-panel rounded-[32px] p-8 lg:p-12 shadow-xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <SetupInput label="Artist name" value={profile.name} onChange={(v) => update("name", v)} />
            <SetupInput label="Spotify identity" value={profile.spotify} onChange={(v) => update("spotify", v)} active />
            <SetupInput label="Artist stage" value={profile.stage} onChange={(v) => update("stage", v)} />
            <SetupInput label="Home market" value={profile.market} onChange={(v) => update("market", v)} />
            <SetupInput label="Genre" value={profile.genre} onChange={(v) => update("genre", v)} />
            <SetupInput label="Current goal" value={profile.goal} onChange={(v) => update("goal", v)} />
            <SetupInput label="Active release" value={profile.release} onChange={(v) => update("release", v)} />
            <SetupInput label="Monthly budget" value={profile.budget} onChange={(v) => update("budget", v)} />
            <SetupInput label="TikTok" value={profile.tiktok} onChange={(v) => update("tiktok", v)} />
            <SetupInput label="Instagram" value={profile.instagram} onChange={(v) => update("instagram", v)} />
            <SetupInput label="YouTube" value={profile.youtube} onChange={(v) => update("youtube", v)} />
            <SetupInput label="X" value={profile.x} onChange={(v) => update("x", v)} />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border-t border-foreground/5 pt-10">
            <p className="max-w-md text-[13px] font-bold leading-relaxed text-warning">
              <span className="uppercase tracking-wider">Note:</span> Private analytics (save rate, conversion) will stay locked until secure connection is verified.
            </p>
            
            <div className="flex shrink-0 gap-4">
              <button onClick={onContinue} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background px-8 text-[14px] font-bold text-foreground transition-all hover:bg-foreground/5">
                Skip for now
              </button>
              <button 
                onClick={onContinue} 
                className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-[14px] font-bold text-background transition-all hover:scale-105 shadow-xl active:scale-95"
              >
                Enter Workspace
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SetupInput = ({ label, value, onChange, active = false }: { label: string; value: string; onChange: (value: string) => void; active?: boolean }) => (
  <div className={cn(
    "group rounded-[16px] border bg-background p-4 transition-all duration-300", 
    active ? "border-brand-accent ring-4 ring-brand-accent/5 shadow-lg" : "border-foreground/10 focus-within:border-brand-accent/50 focus-within:ring-4 focus-within:ring-brand-accent/5"
  )}>
    <label className="font-ui block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 transition-colors group-focus-within:text-brand-accent">{label}</label>
    <input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="mt-2 w-full bg-transparent text-[15px] font-bold text-foreground outline-none placeholder:text-muted-foreground/30" 
    />
  </div>
);

const LabelHQScreen = ({
  profile,
  missions,
  conversations,
  onManager,
  onLockedAgent,
  onMission,
  onWorkspace,
  onDrawer,
}: {
  profile: ArtistProfile;
  missions: Mission[];
  conversations: RecentConversation[];
  onManager: () => void;
  onLockedAgent: (agent: Agent) => void;
  onMission: (id?: string) => void;
  onWorkspace: (view: View) => void;
  onDrawer: (drawer: DrawerKind) => void;
}) => (
  <section className="text-foreground max-w-7xl mx-auto px-4 lg:px-8">
    <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-foreground/5 pb-10">
      <div>
        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent">Operating Dashboard</p>
        <h1 className="font-display mt-3 text-[3.2rem] font-bold leading-none tracking-tight text-foreground">Label HQ.</h1>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onWorkspace("artistProfileWorkspace")} className="group flex h-11 items-center gap-2 rounded-full border border-foreground/10 bg-background/50 px-5 text-[13px] font-bold text-foreground transition-all hover:bg-foreground/5 hover:border-foreground/20 active:scale-95 shadow-sm backdrop-blur-sm">
          <Settings className="h-4 w-4 opacity-40 transition-transform group-hover:rotate-45" />
          Workspace
        </button>
      </div>
    </div>
    
    <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr_320px]">
      <div className="grid min-w-0 content-start gap-12">
        <LightMorningBriefPanel profile={profile} onManager={onManager} onEvidence={() => onDrawer("evidence")} />
        
        {/* REFINED STAFF GRID */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Department Heads</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">5 active AI units</span>
           </div>
           <LightAgentBench onManager={onManager} onLockedAgent={onLockedAgent} />
        </div>
        
        {/* COMPACT MISSIONS */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Active Missions</p>
              <button onClick={() => onWorkspace("missionsWorkspace")} className="text-[11px] font-bold text-brand-accent hover:underline">See all missions →</button>
           </div>
           <LightMissionCards missions={missions.filter(m => m.status !== "complete")} onMission={onMission} onWorkspace={onWorkspace} />
        </div>
      </div>

      <div className="sticky top-8 grid min-w-0 content-start gap-12 self-start pt-2">
        <LightAttentionSummary onDrawer={onDrawer} onWorkspace={onWorkspace} />
      </div>
    </div>
  </section>
);

const StaffWorkspace = ({
  onManager,
  onLockedAgent,
}: {
  onManager: () => void;
  onLockedAgent: (agent: Agent) => void;
}) => {
  const onlineCount = agents.filter((agent) => agent.status === "available").length;
  const lockedCount = agents.length - onlineCount;

  return (
    <section className="text-foreground">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-brand-accent">Department Heads</p>
          <h1 className="font-display mt-2 text-[3.2rem] font-bold leading-tight tracking-tight text-foreground">The Staff.</h1>
          <p className="mt-2 max-w-2xl text-[16px] font-medium leading-relaxed text-muted-foreground/80">
            A specialized roster of AI specialists trained on your artist's identity, market activity, and creative DNA.
          </p>
        </div>
        <div className="grid w-full max-w-md grid-cols-3 overflow-hidden rounded-[24px] border border-foreground/10 surface-panel shadow-sm">
          <StaffStat label="Roster" value={`${agents.length}`} />
          <StaffStat label="Ready" value={`${onlineCount}`} />
          <StaffStat label="Needs Context" value={`${lockedCount}`} />
        </div>
      </div>

      <div className="grid gap-5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const available = agent.status === "available";
          const actionLabel = available ? "Open Manager Office" : `Open ${agent.name} office`;

          return (
            <button
              key={agent.id}
              onClick={() => (available ? onManager() : onLockedAgent(agent))}
              className={cn(
                "group grid w-full gap-6 rounded-[24px] border bg-background p-6 text-left shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(0,0,0,0.08)] lg:grid-cols-[260px_minmax(0,1fr)_240px]",
                available ? "border-brand-accent/20" : "border-foreground/10",
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-foreground/5 transition-colors duration-300",
                    available ? "bg-brand-accent text-primary-foreground" : "bg-muted text-foreground/40"
                  )}
                  style={!available ? { backgroundColor: agent.color + '20', color: agent.color, borderColor: agent.color + '30' } : {}}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-[18px] font-display font-bold tracking-tight text-foreground">{agent.name}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em]",
                        available ? "bg-success/10 text-success" : "bg-foreground/5 text-muted-foreground",
                      )}
                    >
                      {available ? "Online" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{agent.purpose}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <StaffSourceBlock title="Required sources" items={agent.requiredSources} muted={!available} />
                <StaffSourceBlock title="Connected sources" items={agent.connectedSources} />
                <StaffSourceBlock title="Can prepare now" items={[agent.managerCanPrepare]} accent />
                <StaffSourceBlock title="Optional context" items={agent.optionalSources.slice(0, 3)} muted />
              </div>

              <div className="flex flex-col justify-between rounded-[18px] border border-foreground/5 bg-foreground/5 p-5 transition-colors group-hover:bg-foreground/10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Next action</p>
                  <p className="mt-3 text-[14px] font-bold leading-snug text-foreground">{actionLabel}</p>
                </div>
                <span
                  className={cn(
                    "mt-6 inline-flex items-center gap-2 text-[12px] font-bold transition-all duration-300",
                    available ? "text-brand-accent" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {available ? <MessageSquareText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {available ? "Start decision thread" : "Review unlock needs"}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const StaffStat = ({ label, value }: { label: string; value: string }) => (
  <div className="border-r border-foreground/5 px-5 py-4 last:border-r-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{label}</p>
    <p className="mt-1 text-[22px] font-display font-bold tracking-tight text-foreground">{value}</p>
  </div>
);

const StaffSourceBlock = ({
  title,
  items,
  muted = false,
  accent = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
  accent?: boolean;
}) => (
  <div className={cn("rounded-[16px] border p-4", accent ? "border-brand-accent/15 bg-brand-accent/[0.04]" : "border-foreground/5 bg-black/[0.015]")}>
    <p className={cn("text-[10px] font-bold uppercase tracking-[0.08em]", accent ? "text-brand-accent" : "text-muted-foreground/60")}>{title}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            accent
              ? "border-brand-accent/15 bg-white text-[#5f2489]"
              : muted
                ? "border-foreground/5 bg-white/60 text-muted-foreground/60"
                : "border-foreground/5 bg-white text-muted-foreground/80",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const LabelHQRail = ({
  active,
  onLabelHQ,
  onStaff,
  onMissions,
  onSettings,
}: {
  active: "labelHQ" | "staff" | "missions" | "settings";
  onLabelHQ: () => void;
  onStaff: () => void;
  onMissions: () => void;
  onSettings: () => void;
}) => {
  const railItems = [
    { label: "Label HQ", icon: Gauge, onClick: onLabelHQ, active: active === "labelHQ" },
    { label: "Staff", icon: UsersRound, onClick: onStaff, active: active === "staff" },
    { label: "Missions", icon: ClipboardCheck, onClick: onMissions, active: active === "missions" },
  ];

  return (
    <nav
      aria-label="Record label navigation"
      className="flex min-w-0 flex-col justify-between overflow-y-auto rounded-[20px] border border-foreground/10 bg-background p-2 shadow-2xl shadow-black/[0.05] lg:sticky lg:top-4 lg:max-h-[calc(100vh-32px)]"
    >
      {/* TOP: brand + nav */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-3">
          <BrandMark size="sm" />
          <div className="min-w-0">
            <p className="font-display truncate text-[14px] font-display font-bold tracking-tight text-foreground">Ordersounds</p>
            <p className="font-ui text-[9px] font-bold tracking-[0.1em] text-muted-foreground uppercase opacity-70">AI RECORD LABEL</p>
          </div>
        </div>

        <div className="mx-3 h-px shrink-0 bg-foreground/5" />

        <div className="flex shrink-0 flex-col gap-0.5 py-1">
          {railItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "flex h-10 w-full items-center gap-2.5 rounded-xl px-3 font-ui text-[13px] font-bold transition-all duration-200",
                  item.active
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-[15px] w-[15px] shrink-0", item.active ? "text-brand-accent" : "text-current opacity-60")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM: Settings always visible */}
      <div className="mt-4 shrink-0">
        <div className="mx-3 mb-2 h-px bg-foreground/5" />
        <button
          onClick={onSettings}
          className={cn(
            "flex h-10 w-full items-center gap-2.5 rounded-xl px-3 font-ui text-[13px] font-bold transition-all duration-200",
            active === "settings"
              ? "bg-foreground text-background shadow-md"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          <Settings className={cn("h-[15px] w-[15px] shrink-0", active === "settings" ? "text-brand-accent" : "text-current opacity-60")} />
          <span>Settings</span>
        </button>
      </div>
    </nav>
  );
};



const LightMorningBriefPanel = ({ profile, onManager, onEvidence }: { profile: ArtistProfile; onManager: () => void; onEvidence: () => void }) => (
  <div className="flex flex-col overflow-hidden rounded-[32px] border border-foreground/5 bg-background shadow-2xl shadow-black/[0.02]">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-foreground/5 bg-foreground/[0.01] px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Today's Operating Read</p>
          <p className="text-[13px] font-bold text-foreground opacity-90">{profile.name} · {profile.release}</p>
        </div>
      </div>
      <button
        onClick={onManager}
        className="rounded-full bg-foreground px-6 py-2 text-[12px] font-bold text-background transition-all hover:opacity-90 active:scale-95 shadow-md"
      >
        Talk to Manager
      </button>
    </div>

    {/* Brief Body */}
    <div className="px-8 py-10">
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground max-w-2xl">
        Momentum is durably building. Commitment is pending review.
      </h2>
      
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
           <p className="font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-success">Confirmed Momentum</p>
           <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.01] p-6">
              <p className="text-[15px] font-medium leading-relaxed text-foreground/80">
                128.4k tracked streams. TikTok hook uses are 4.8x above baseline. Regional growth in Chicago (+31%) and Lagos confirmed.
              </p>
           </div>
        </div>
        <div className="space-y-4">
           <p className="font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-brand-accent">Required Context</p>
           <div className="rounded-2xl border border-brand-accent/10 bg-brand-accent/[0.02] p-6">
              <p className="text-[15px] font-medium leading-relaxed text-foreground/80">
                Spotify save rate, payout-per-stream, and smart-link conversion are currently missing. Signal review scheduled in 72h.
              </p>
           </div>
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-foreground/5 pt-10 text-[16px] font-medium leading-relaxed text-muted-foreground/80 max-w-3xl">
        <p>
          The current signal is strong but reversible. Night Bus has successfully transitioned from "noise" to "demand" in three key markets, with YouTube comments shifting from passive views to release requests.
        </p>
        <p>
          The Manager's Read: Attention is real enough to test, but not enough to scale the full $5,000 budget. We are holding $2,250 in reserve until conversion integrity is verified.
        </p>
      </div>

      {/* Today's directive */}
      <div className="mt-10 rounded-[24px] border border-foreground/5 bg-foreground/[0.01] p-8">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Today's Directive</p>
        <p className="mt-3 text-[15px] font-bold leading-relaxed text-foreground opacity-90">
          Continue the content sprint. Maintain the $1,850 spend cap. Let the 72-hour review decide whether to scale — do not commit early.
        </p>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onEvidence}
          className="text-[12px] font-bold text-muted-foreground/60 underline-offset-4 hover:text-brand-accent hover:underline transition-all"
        >
          View supporting evidence →
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 italic">Generated by AI Manager 08:30 AM</span>
      </div>
    </div>
  </div>
);

const LightAttentionSummary = ({ onDrawer, onWorkspace }: { onDrawer: (drawer: DrawerKind) => void; onWorkspace: (view: View) => void }) => (
  <div className="flex flex-col gap-12">
    <section className="space-y-6">
      <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Intelligence Alerts</p>
      <div className="flex flex-col gap-4">
        <button onClick={() => onWorkspace("testLabWorkspace")} className="group flex flex-col gap-3 rounded-[24px] border border-foreground/5 bg-background p-6 text-left transition-all hover:border-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/[0.02]">
          <div className="flex items-center gap-2.5">
             <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <BadgeDollarSign className="h-4 w-4" />
             </div>
             <p className="text-[13px] font-bold text-foreground tracking-tight">Approve Test Budget</p>
          </div>
          <p className="text-[12px] font-medium text-muted-foreground/80 leading-relaxed">
             The Manager is waiting on your approval for the <span className="text-foreground font-bold italic">$1,850</span> Nigeria content sprint.
          </p>
        </button>
        <button onClick={() => onDrawer("evidence")} className="group flex flex-col gap-3 rounded-[24px] border border-foreground/5 bg-background p-6 text-left transition-all hover:border-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/[0.02]">
          <div className="flex items-center gap-2.5">
             <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                <Upload className="h-4 w-4" />
             </div>
             <p className="text-[13px] font-bold text-foreground tracking-tight">Upload Evidence</p>
          </div>
          <p className="text-[12px] font-medium text-muted-foreground/80 leading-relaxed">
             Adding a Spotify for Artists export would increase signal confidence for the Nigeria sprint.
          </p>
        </button>
      </div>
    </section>

    <section className="space-y-6">
      <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Recent Activity</p>
      <div className="space-y-8 pl-1">
        {[
          { label: "Milestone", title: "Started content testing", time: "2h ago" },
          { label: "Staff", title: "Creative brief sent to Marketing", time: "5h ago" },
          { label: "System", title: "Nigeria signal verified by Manager", time: "Yesterday" }
        ].map((item, i) => (
          <div key={i} className="relative flex flex-col gap-2 pl-6 before:absolute before:left-0 before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-foreground/5">
            <p className="text-[12px] font-bold text-foreground leading-tight tracking-tight">{item.title}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{item.label} · {item.time}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const LightAgentBench = ({
  onManager,
  onLockedAgent,
}: {
  onManager: () => void;
  onLockedAgent: (agent: Agent) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {agents.map((agent) => {
      const Icon = agent.icon;
      const available = agent.status === "available";

      return (
        <button
          key={agent.id}
          onClick={() => (agent.id === "manager" ? onManager() : onLockedAgent(agent))}
          className={cn(
            "group relative flex flex-col items-center gap-5 rounded-[28px] border p-8 text-center transition-all duration-500",
            available 
              ? "border-foreground/10 bg-background shadow-lg shadow-black/[0.02] hover:border-brand-accent/30 hover:shadow-xl hover:shadow-brand-accent/5 hover:-translate-y-1" 
              : "border-foreground/5 bg-foreground/[0.01] opacity-60 hover:opacity-100"
          )}
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-[20px] transition-all duration-500",
              available ? "bg-foreground text-background shadow-lg" : "bg-foreground/5 text-foreground/20",
            )}
          >
            {available ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-[14px] font-bold leading-tight tracking-tight", available ? "text-foreground" : "text-muted-foreground")}>{agent.name.replace("AI ", "")}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-tight">
               {available ? "Active Now" : "Locked"}
            </p>
          </div>
          {available && (
             <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          )}
        </button>
      );
    })}
  </div>
);

const LightMissionCards = ({
  missions,
  onMission,
  onWorkspace,
}: {
  missions: Mission[];
  onMission: (id?: string) => void;
  onWorkspace: (view: View) => void;
}) => (
  <div className="grid gap-6 md:grid-cols-2">
    {missions.filter(m => !m.archived).map((mission) => {
      const statusColor = mission.status === "blocked" ? "bg-warning" : mission.status === "review" ? "bg-amber-500" : "bg-brand-accent";
      return (
        <button
          key={mission.id}
          onClick={() => onMission(mission.id)}
          className="group surface-panel relative flex flex-col overflow-hidden rounded-[32px] border border-foreground/5 p-8 text-left transition-all duration-500 hover:border-brand-accent/20 hover:shadow-2xl hover:shadow-brand-accent/[0.03]"
        >
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <span className={cn("h-1.5 w-1.5 rounded-full", statusColor)} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{mission.status}</span>
             </div>
             <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold text-foreground">{mission.progress}%</p>
                <div className="h-1 w-10 overflow-hidden rounded-full bg-foreground/5">
                   <div className={cn("h-full rounded-full transition-all duration-1000", statusColor)} style={{ width: `${mission.progress}%` }} />
                </div>
             </div>
          </div>
          <p className="font-display text-lg font-bold text-foreground tracking-tight group-hover:text-brand-accent transition-colors">
            {mission.title}.
          </p>
          <p className="mt-4 text-[14px] font-medium leading-relaxed text-muted-foreground/80 line-clamp-2">
            {mission.summary}
          </p>
          <div className="mt-8 flex items-center justify-between border-t border-foreground/5 pt-6">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{mission.review}</p>
             <ChevronRight className="h-4 w-4 text-muted-foreground/20 transition-all group-hover:translate-x-1 group-hover:text-brand-accent" />
          </div>
        </button>
      );
    })}
  </div>
);

const LightMissionCount = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center">
    <span className="block text-sm font-bold text-black">{value}</span>
    <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</span>
  </div>
);

const OperatingState = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[18px] border border-foreground/5 bg-white/[0.045] p-3">
    <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/40">{label}</p>
    <p className="mt-1 text-sm leading-5 text-foreground/70">{value}</p>
  </div>
);

const ManagerOfficeFocused = ({
  answers,
  setAnswers,
  activeQuestion,
  setActiveQuestion,
  activeQuestionObject,
  answeredCount,
  allAnswered,
  askText,
  setAskText,
  saveAnswer,
  startManagerRun,
  onBack,
  onConversation,
  conversations,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeQuestion: string;
  setActiveQuestion: (id: string) => void;
  activeQuestionObject: (typeof managerQuestions)[number];
  answeredCount: number;
  allAnswered: boolean;
  askText: string;
  setAskText: (value: string) => void;
  saveAnswer: () => void;
  startManagerRun: () => void;
  onBack: () => void;
  onConversation: (conversation: RecentConversation) => void;
  conversations: RecentConversation[];
}) => (
  <WorkspaceShell eyebrow="Manager Office" title="Direct Briefing" onBack={onBack}>
    <div className="max-w-5xl">
      <ManagerDeskPanel
        answers={answers}
        setAnswers={setAnswers}
        activeQuestion={activeQuestion}
        setActiveQuestion={setActiveQuestion}
        activeQuestionObject={activeQuestionObject}
        answeredCount={answeredCount}
        allAnswered={allAnswered}
        askText={askText}
        setAskText={setAskText}
        saveAnswer={saveAnswer}
        startManagerRun={startManagerRun}
        onContinueConversation={onConversation}
        conversations={conversations}
      />
      
      {allAnswered && (
        <div className="mt-12 surface-panel rounded-[28px] p-8">
           <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                 <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-brand-accent">Decision Intelligence</p>
                 <h4 className="font-display mt-2 text-lg font-bold text-foreground">How the Manager thinks.</h4>
                 <p className="mt-2 text-[14px] leading-relaxed text-foreground/50 font-medium">
                    Uses multi-agent validation to cross-reference context with market signals before outputting decision packages.
                 </p>
              </div>
              <div className="flex items-center gap-6">
                 {["Context", "Signal", "Validation", "Decision"].map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2">
                       <div className="h-9 w-9 rounded-full bg-brand-accent flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow-lg shadow-brand-accent/20">
                          {i + 1}
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{step}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  </WorkspaceShell>
);

const MorningBriefNarrative = ({ profile }: { profile: ArtistProfile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-7 border-t border-foreground/5 pt-6">
      <p className="max-w-3xl text-2xl font-semibold tracking-tight leading-9 text-foreground">
        Momentum is real, but spend is not cleared yet.
      </p>
      <div className="mt-5 max-w-4xl space-y-5 text-base leading-8 text-foreground/68">
        <p>
          Across the connected hub, {profile.name} is sitting on <span className="text-brand-accent">128,400 tracked streams</span> for the current read, and the story is not flat: Atlanta is still the center, but Chicago is up <span className="text-brand-accent">31%</span> week over week and Lagos comments are starting to repeat the same Night Bus lyric. TikTok is the loudest movement right now, with video uses around the hook up <span className="text-brand-accent">4.8x above baseline</span>, while YouTube is adding release-request comments instead of just passive views.
        </p>
        {expanded && (
          <p>
            The money signal is more cautious. Public catalog and social data say attention is building, but private Spotify saves, source-of-stream, smart-link clicks, and royalty statements are still missing, so the Manager should not treat this as proof that the full {profile.budget} is ready to deploy. The practical read is that Night Bus has enough heat to test, not enough proof to scale.
          </p>
        )}
      </div>
      <div className="mt-6 rounded-[22px] border border-brand-accent/25 bg-brand-accent/10 px-5 py-4">
        <p className="text-sm leading-6 text-foreground/76">
          <span className="font-semibold text-brand-accent">What matters today:</span> keep the artist focused on one repeatable content sprint, cap the first campaign move, and use the 72-hour review to decide whether this is demand or just noise.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-5 text-muted-foreground/40">
          Read from connected public catalog, social activity, YouTube comments, and artist replies. Evidence details stay in the source drawer.
        </p>
        <button
          onClick={() => setExpanded((current) => !current)}
          className="rounded-full border border-foreground/5 px-3 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[0.13em] text-foreground/58 hover:border-brand-accent/30 hover:text-foreground"
        >
          {expanded ? "Collapse brief" : "Read full brief"}
        </button>
      </div>
    </div>
  );
};

const ManagerDeskPanel = ({
  answers,
  setAnswers,
  activeQuestion,
  setActiveQuestion,
  activeQuestionObject,
  answeredCount,
  allAnswered,
  askText,
  setAskText,
  saveAnswer,
  startManagerRun,
  onContinueConversation,
  conversations,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeQuestion: string;
  setActiveQuestion: (id: string) => void;
  activeQuestionObject: (typeof managerQuestions)[number];
  answeredCount: number;
  allAnswered: boolean;
  askText: string;
  setAskText: (value: string) => void;
  saveAnswer: () => void;
  startManagerRun: () => void;
  onContinueConversation: (conversation: RecentConversation) => void;
  conversations: RecentConversation[];
}) => (
  <div className="flex flex-col gap-10">
    {!allAnswered ? (
      /* BLOCKING GATE: Questions must be answered before anything else */
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Left: Question navigator */}
        <aside className="space-y-6">
          <div className="surface-panel rounded-2xl p-5">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Readiness</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1 rounded-full bg-foreground/5">
                <div className="h-full rounded-full bg-brand-accent transition-all duration-1000" style={{ width: `${(answeredCount / managerQuestions.length) * 100}%` }} />
              </div>
              <span className="text-[10px] font-bold text-foreground">{answeredCount}/{managerQuestions.length}</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            {managerQuestions.map((q, i) => {
              const isSelected = activeQuestion === q.id;
              const isAnswered = !!answers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestion(q.id)}
                  className={cn(
                    "group flex w-full flex-col gap-1 rounded-xl px-4 py-3 text-left transition-all",
                    isSelected ? "bg-foreground/5" : "hover:bg-foreground/[0.02] opacity-60 hover:opacity-100"
                  )}
                >
                  <p className={cn("truncate text-[13px] font-bold leading-tight tracking-tight", isSelected ? "text-foreground" : "text-muted-foreground")}>
                    {q.id.charAt(0).toUpperCase() + q.id.slice(1)} Context
                  </p>
                  <div className="flex items-center gap-2">
                     <span className={cn("h-1 w-1 rounded-full", isAnswered ? "bg-success" : "bg-foreground/10")} />
                     <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">{isAnswered ? "Complete" : "Pending"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Active question — fills the screen */}
        <div className="rounded-[28px] border border-foreground/5 bg-background p-8 shadow-2xl shadow-black/[0.02]">
          <div className="max-w-2xl">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Context Intake {managerQuestions.findIndex(q => q.id === activeQuestion) + 1} / {managerQuestions.length}</p>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-foreground">
              {activeQuestionObject.question}
            </h2>
            <textarea
              value={answers[activeQuestionObject.id] ?? ""}
              onChange={(event) => setAnswers((current) => ({ ...current, [activeQuestionObject.id]: event.target.value }))}
              placeholder="Start typing your response..."
              className="mt-6 min-h-[160px] w-full resize-none rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-5 font-ui text-[15px] leading-relaxed text-foreground outline-none transition-all focus:bg-background focus:border-brand-accent/40 shadow-inner"
            />
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setAnswers((current) => ({ ...current, [activeQuestionObject.id]: activeQuestionObject.suggested }))}
                className="text-[11px] font-bold text-muted-foreground/40 underline-offset-4 hover:text-brand-accent hover:underline"
              >
                Use suggested context
              </button>
              <button
                onClick={saveAnswer}
                disabled={!answers[activeQuestionObject.id]}
                className="rounded-full bg-foreground px-6 py-2.5 text-[13px] font-bold text-background transition-all hover:opacity-90 disabled:opacity-20 active:scale-95 shadow-lg"
              >
                {answeredCount < managerQuestions.length - 1 ? "Next Question" : "Submit Context"}
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* UNLOCKED STATE: All questions answered — show full interface */
      <>
        {/* Ask the Manager */}
        <div className="surface-panel rounded-[28px] p-8 shadow-2xl shadow-black/[0.02]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-success/20 text-success">
                <Check className="h-2 w-2" />
              </span>
              <p className="font-ui text-[9px] font-bold uppercase tracking-[0.1em] text-success/70">Context Synchronized</p>
            </div>
            
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Manager Directive
            </h2>
            <p className="mt-1 text-[13px] font-medium text-muted-foreground/50 leading-relaxed">
              The Manager is ready to process directives or review artist signals.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {["Budget Review", "Momentum Signal", "Marketing Plan", "Strategy Check"].map((p) => (
                <button
                  key={p}
                  onClick={() => setAskText(
                    p === "Budget Review" ? "What should we do with the $5,000 budget this month?"
                    : p === "Momentum Signal" ? "Is the current TikTok heat sustainable?"
                    : p === "Marketing Plan" ? "Draft a 10-day content sprint for Night Bus."
                    : "How should we pivot if the Chicago signals cool off?"
                  )}
                  className="rounded-full border border-foreground/5 bg-foreground/[0.03] px-4 py-2 text-[11px] font-bold text-foreground/60 transition-all hover:border-brand-accent/20 hover:bg-brand-accent/5 hover:text-brand-accent"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="relative mt-6">
              <textarea
                value={askText}
                onChange={(event) => setAskText(event.target.value)}
                placeholder="Ask the Manager for a directive or review..."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-5 font-ui text-[15px] leading-relaxed text-foreground outline-none transition-all focus:bg-background focus:border-brand-accent/40 shadow-inner"
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={startManagerRun}
                  disabled={!askText}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-primary-foreground shadow-lg transition-all hover:scale-105 disabled:opacity-20"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Conversations — only visible after unlock */}
        <RecentConversationsPanel conversations={conversations} onContinueConversation={onContinueConversation} />
      </>
    )}
  </div>
);

const RecentConversationsPanel = ({
  conversations,
  onContinueConversation,
}: {
  conversations: RecentConversation[];
  onContinueConversation: (conversation: RecentConversation) => void;
}) => (
  <div className="mt-10">
    <div className="flex items-center justify-between px-2 mb-4 border-b border-foreground/5 pb-4">
      <div>
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">Conversation History</p>
        <p className="mt-1 text-[12px] text-muted-foreground/50">Pick up a prior thread or start a new run.</p>
      </div>
      <button className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-accent hover:underline">See full history</button>
    </div>
    <div className="flex flex-col gap-1">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onContinueConversation(conversation)}
          className="group flex items-center justify-between p-4 text-left transition-all hover:bg-foreground/[0.02] rounded-xl border border-transparent hover:border-foreground/5"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/40 group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
              <MessageSquareText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-foreground transition-colors group-hover:text-brand-accent truncate leading-tight">{conversation.topic}</p>
              <p className="mt-1 text-[12px] text-muted-foreground/50 truncate max-w-md">{conversation.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">{conversation.lastUpdate}</span>
            <ChevronRight className="h-4 w-4 text-foreground/10 group-hover:text-brand-accent transition-colors" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

const MissionListPanel = ({
  missions,
  onMission,
  onWorkspace,
}: {
  missions: Mission[];
  onMission: (id?: string) => void;
  onWorkspace: (view: View) => void;
}) => (
  <div className="rounded-[28px] border border-white/12 bg-white/[0.055] p-5 lg:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/5 pb-4">
      <div>
        <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">Active missions</p>
        <p className="mt-1 text-sm text-foreground/58">Compact operating list. Open a mission to see tasks, tests, briefs, and records.</p>
      </div>
      <ProductButton variant="secondary" onClick={() => onWorkspace("missionsWorkspace")}>View all missions</ProductButton>
    </div>
    <div className="mt-4 grid gap-3">
      {missions.slice(0, 3).map((mission) => (
        <button
          key={mission.id}
          onClick={() => onMission(mission.id)}
          className="rounded-[22px] border border-foreground/5 bg-foreground/5 p-4 text-left transition hover:border-brand-accent/35"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base text-foreground">{mission.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-foreground/38">{mission.status} / {mission.review}</p>
            </div>
            <span className="text-sm text-foreground/62">{mission.progress}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-brand-accent" style={{ width: `${mission.progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/48">
            <span>{mission.tasks} tasks</span>
            <span>{mission.tests} tests</span>
            <span>{mission.briefs} briefs</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const AttentionPanel = ({ onDrawer, onWorkspace }: { onDrawer: (drawer: DrawerKind) => void; onWorkspace: (view: View) => void }) => (
  <div className="rounded-[28px] border border-white/12 bg-white/[0.055] p-5 lg:p-6">
    <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">Needs attention</p>
    <div className="mt-4 space-y-3">
      <AttentionButton icon={BadgeDollarSign} text="$1,850 test budget needs approval." onClick={() => onWorkspace("testLabWorkspace")} />
      <AttentionButton icon={Upload} text="Spotify for Artists CSV would raise confidence." onClick={() => onDrawer("evidence")} />
      <AttentionButton icon={CalendarClock} text="72-hour signal review scheduled." onClick={() => onWorkspace("reviewWorkspace")} />
    </div>
  </div>
);

const AttentionButton = ({ icon: Icon, text, onClick }: { icon: typeof BadgeDollarSign; text: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex w-full gap-3 rounded-2xl border border-foreground/5 bg-foreground/5 p-4 text-left text-sm text-foreground/62 hover:border-brand-accent/35">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
    <span>{text}</span>
  </button>
);


const ConversationWorkspace = ({
  conversation,
  messages,
  draft,
  setDraft,
  onSend,
  onBack,
}: {
  conversation: RecentConversation;
  messages: ConversationMessage[];
  draft: string;
  setDraft: (val: string) => void;
  onSend: () => void;
  onBack: () => void;
}) => {
  return (
    <WorkspaceShell eyebrow="Direct Message" title={conversation.topic} onBack={onBack}>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-10">
          {/* Chat Stream */}
          <div className="flex flex-col gap-10 pb-32">
             {messages.map((msg, idx) => {
                const isAI = msg.speaker === "manager";
                return (
                   <div key={msg.id} className={cn("flex flex-col gap-4", !isAI && "items-end")}>
                      <div className={cn("flex items-center gap-3", !isAI && "flex-row-reverse")}>
                         <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg shadow-sm",
                            isAI ? "bg-foreground text-background" : "bg-brand-accent text-primary-foreground"
                         )}>
                            {isAI ? <Sparkles className="h-4 w-4" /> : <UsersRound className="h-4 w-4" />}
                         </div>
                         <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">{msg.label}</p>
                      </div>
                      <div className={cn(
                         "rounded-2xl border transition-all max-w-2xl",
                         idx === 0 ? "p-5" : "p-6",
                         isAI ? "rounded-tl-none border-foreground/5 bg-foreground/[0.02] text-foreground/80 shadow-sm" : "rounded-tr-none border-brand-accent/20 bg-brand-accent text-primary-foreground shadow-lg shadow-brand-accent/10"
                      )}>
                         <p className={cn("font-medium leading-relaxed", idx === 0 ? "text-[14px]" : "text-[15px]")}>
                            {msg.body}
                         </p>
                         
                         {/* Work Created Artifact */}
                         {msg.workCreated && (
                            <div className="mt-6 rounded-xl border border-foreground/10 bg-background/50 p-5 shadow-inner">
                               <div className="flex items-center gap-3 mb-3">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent text-primary-foreground">
                                     {msg.workCreated.type === "mission" ? <Route className="h-3.5 w-3.5" /> : 
                                      msg.workCreated.type === "task" ? <ClipboardCheck className="h-3.5 w-3.5" /> : 
                                      <Gauge className="h-3.5 w-3.5" />}
                                  </div>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                                     {msg.workCreated.type} created
                                  </p>
                               </div>
                               <h4 className="text-[14px] font-bold text-foreground">{msg.workCreated.title}</h4>
                               <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/70">{msg.workCreated.body}</p>
                               <button className="mt-4 w-full rounded-lg bg-foreground/[0.03] py-2 text-[11px] font-bold uppercase tracking-wider text-foreground/40 hover:bg-foreground/[0.06] transition-all">
                                  View in Workspace
                               </button>
                            </div>
                         )}

                         {isAI && idx === 0 && (
                            <div className="mt-6 flex items-center gap-4 border-t border-foreground/5 pt-5">
                               <div className="flex items-center gap-2">
                                  <span className="h-1 w-1 rounded-full bg-success" />
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Verified Insight</span>
                               </div>
                               <div className="h-px w-6 bg-foreground/10" />
                               <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">Signal referenced</span>
                            </div>
                         )}
                      </div>
                   </div>
                );
             })}
          </div>

          {/* Input Area */}
          <div className="fixed bottom-12 left-0 right-0 px-4 z-50">
             <div className="mx-auto max-w-3xl rounded-[32px] border border-foreground/10 bg-background/80 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative flex items-center gap-3">
                   <textarea
                     value={draft}
                     onChange={(e) => setDraft(e.target.value)}
                     placeholder="Type a message to the Manager..."
                     className="min-h-[56px] w-full resize-none bg-transparent px-5 py-4 font-ui text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30"
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         onSend();
                       }
                     }}
                   />
                   <button 
                     onClick={onSend}
                     disabled={!draft.trim()}
                     className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-20"
                   >
                      <ArrowRight className="h-5 w-5" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};

const MissionLane = ({ icon: Icon, title, meta, text, onClick }: { icon: typeof ClipboardCheck; title: string; meta: string; text: string; onClick: () => void }) => (
  <button onClick={onClick} className="group flex flex-col p-6 text-left transition-all surface-panel rounded-[24px] border border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.02]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
         <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground opacity-60 group-hover:opacity-100">
           <Icon className="h-4 w-4" />
         </span>
         <div>
            <p className="text-[14px] font-bold tracking-tight text-foreground">{title}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{meta}</p>
         </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/20 transition-all group-hover:translate-x-1" />
    </div>
    <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground/60 group-hover:text-muted-foreground/80 font-medium">{text}</p>
  </button>
);

const TasksWorkspace = ({
  onBack,
  approvedTasks,
  completedTasks,
  onApproveTask,
  onCompleteTask,
}: {
  onBack: () => void;
  approvedTasks: string[];
  completedTasks: string[];
  onApproveTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}) => (
  <WorkspaceShell eyebrow="Tasks" title="Owner-ready work" onBack={onBack}>
    <div className="space-y-4">
      {taskRows.map((task) => {
        const approved = approvedTasks.includes(task.id);
        const done = completedTasks.includes(task.id);
        const completionBlocked = task.approvalState === "needs approval" && !approved;
        return (
          <div key={task.id} className="surface-panel rounded-[28px] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">
                  {done ? "done" : approved ? "approved" : task.approvalState}
                </p>
                <p className="mt-2 text-[18px] font-bold leading-snug text-foreground">{task.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground/80">Owner: <span className="font-semibold text-foreground">{task.owner}</span>. Deadline: {task.deadline}.</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  onClick={() => onApproveTask(task.id)}
                  disabled={approved || done}
                  className="rounded-[10px] border border-foreground/10 px-4 py-2 text-[12px] font-semibold text-muted-foreground/80 transition-colors hover:bg-foreground/5 hover:text-black disabled:opacity-40"
                >
                  Approve
                </button>
                <button
                  onClick={() => onCompleteTask(task.id)}
                  disabled={done || completionBlocked}
                  className="group rounded-full px-6 py-2.5 font-ui text-[12px] font-bold uppercase tracking-[0.1em] shadow-lg transition-all hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                  style={{backgroundColor: '#111', color: '#fff'}}
                >
                  Mark done
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[16px] border border-foreground/5 bg-foreground/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Purpose</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{task.purpose}</p>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Dependency</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{task.dependency}</p>
                {completionBlocked && (
                  <p className="mt-4 rounded-[12px] border border-[#f97316]/20 bg-[#f97316]/10 p-4 text-[13px] leading-snug text-[#c2410c]">
                    Approval is required before this task can be marked done.
                  </p>
                )}
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Linked evidence</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{task.evidenceIds.join(", ")}</p>
              </div>
              <div className="rounded-[16px] border border-foreground/5 bg-foreground/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Steps</p>
                <div className="mt-3 space-y-3">
                  {task.steps.map((step, index) => (
                    <div key={step} className="flex gap-3 text-[13px] leading-relaxed text-foreground/80">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[11px] font-bold text-muted-foreground/80">{index + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Completion note</span>
                  <input className="mt-3 h-11 w-full rounded-[10px] border border-foreground/10 bg-white px-4 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-brand-accent/40 focus:ring-2 focus:ring-[#9A3BDC]/10" placeholder="Add what changed when this task is done..." />
                </label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </WorkspaceShell>
);

const TestLabWorkspace = ({ onBack, testCheckpoint }: { onBack: () => void; testCheckpoint: "setup" | "signal" | "complete" }) => {
  const [capDecision, setCapDecision] = useState<"pending" | "approved" | "editing" | "rejected">("pending");

  const capCopy = {
    pending: "Pending approval. The Manager can prepare the test, but it is not runnable until the cap is approved.",
    approved: "Approved for prototype flow. The cap is recorded; this does not spend money automatically.",
    editing: "Editing requested. Keep the test paused until the new cap is confirmed.",
    rejected: "Rejected. The validation test stays blocked until a new budget decision is made.",
  }[capDecision];

  return (
  <WorkspaceShell eyebrow="Test Lab" title="10-day validation test" onBack={onBack}>
    <div className="grid gap-5 lg:grid-cols-[1fr_0.65fr]">
      <div className="surface-panel rounded-[28px] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ArtifactField label="Hypothesis" value="Night Bus can convert social attention into streams, saves, follows, and repeated demand comments." />
          <ArtifactField label="Budget" value="$1,850 capped test / fixed budget mode" />
          <ArtifactField label="Decision rule" value="Scale only if saves/clicks rise and demand comments repeat by day 10." />
          <ArtifactField label="Signals watched" value="Views, comments, saves, smart-link clicks, follows, and source-of-stream if uploaded." />
        </div>
        <div className="mt-6 rounded-[16px] border border-foreground/5 bg-foreground/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Intermediate checkpoints</p>
          <div className="mt-4 space-y-3">
            {testCheckpoints.map((checkpoint, index) => {
              const reached = testCheckpoint === "complete" || checkpoint.id === "setup" || (testCheckpoint === "signal" && ["early", "signal"].includes(checkpoint.id));
              return (
                <div key={checkpoint.id} className={cn("flex gap-4 rounded-[14px] border p-4", reached ? "border-brand-accent/20 bg-brand-accent/[0.05]" : "border-foreground/5 bg-white")}>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", reached ? "bg-brand-accent text-foreground" : "bg-black/[0.06] text-muted-foreground/60")}>
                    {reached ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <div>
                    <span className="block text-[14px] font-semibold text-foreground">{checkpoint.title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-foreground/70">{checkpoint.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rounded-[20px] border border-brand-accent/20 bg-brand-accent/[0.04] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-accent">Approval state</p>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">{capCopy}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setCapDecision("approved")}
            disabled={capDecision === "approved"}
            className="rounded-[10px] bg-brand-accent px-5 py-2.5 text-[13px] font-bold text-primary-foreground transition-all disabled:opacity-40"
          >
            Approve cap
          </button>
          <button onClick={() => setCapDecision("editing")} className="rounded-[10px] border border-foreground/10 px-5 py-2.5 text-[13px] font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-black">
            Edit amount
          </button>
          <button onClick={() => setCapDecision("rejected")} className="rounded-[10px] px-5 py-2.5 text-[13px] font-semibold text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-[#f97316]">
            Reject
          </button>
        </div>
      </div>
    </div>
  </WorkspaceShell>
  );
};

const BriefsWorkspace = ({ onBack }: { onBack: () => void }) => (
  <WorkspaceShell eyebrow="Briefs" title="Agent-to-agent updates" onBack={onBack}>
    <div className="surface-panel rounded-[28px] p-8 shadow-2xl shadow-black/[0.02] lg:p-8">
      <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/70">
        These are the useful messages moving through the Night Bus mission. They are written for people to understand quickly: who asked who, what was found, what evidence supports it, and what should happen next.
      </p>
      <div className="mt-8 divide-y divide-foreground/5">
      {departmentBriefs.map((brief) => (
        <article key={brief.id} className="py-7 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-brand-accent">{brief.route}</p>
              <h3 className="mt-1.5 text-[22px] font-display font-bold tracking-tight text-foreground">{brief.subject}</h3>
            </div>
            <span className="rounded-full bg-foreground/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground/70">{brief.status}</span>
          </div>
          <p className="mt-5 max-w-4xl text-[16px] leading-relaxed text-foreground/80">{brief.message}</p>
          <div className="mt-6 space-y-2 rounded-[14px] border border-foreground/5 bg-foreground/5 p-5">
            <p className="text-[13px] leading-relaxed text-black/70">
              <span className="font-bold text-foreground">{brief.id === "manager-marketing-request" ? "Source basis:" : "Source context:"}</span> {brief.sourceBasis}
            </p>
            <p className="text-[13px] leading-relaxed text-black/70">
              <span className="font-bold text-foreground">{brief.id === "manager-marketing-request" ? "Recommended next action:" : "Next action:"}</span> {brief.recommendedAction}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{brief.briefType} / {brief.linkedMission}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-[10px] border border-foreground/10 px-5 py-2.5 text-[13px] font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-black">Approve for use</button>
            <button className="rounded-[10px] px-5 py-2.5 text-[13px] font-semibold text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-black">Export</button>
          </div>
        </article>
      ))}
      </div>
    </div>
  </WorkspaceShell>
);

const MissionsWorkspace = ({
  missions,
  selectedMission,
  setSelectedMissionId,
  onBack,
  onWorkspace,
  onDrawer,
}: {
  missions: Mission[];
  selectedMission: Mission;
  setSelectedMissionId: (id: string) => void;
  onBack: () => void;
  onWorkspace: (view: View) => void;
  onDrawer: (drawer: DrawerKind) => void;
}) => {
  const activeMissions = missions.filter((m) => !m.archived);
  const archivedMissions = missions.filter((m) => m.archived);

  return (
    <WorkspaceShell eyebrow="Operating Rhythm" title="Missions" onBack={onBack}>
      <div className="grid gap-10 xl:grid-cols-[260px_1fr] items-start">
        <aside className="sticky top-12 flex flex-col gap-8 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Active</p>
                <span className="text-[10px] font-bold text-muted-foreground/30">{activeMissions.length}</span>
             </div>
             <div className="flex flex-col gap-0.5">
                {activeMissions.map((mission) => {
                  const isSelected = selectedMission.id === mission.id;
                  const statusColor = mission.status === "blocked" ? "bg-warning" : mission.status === "review" ? "bg-amber-500" : "bg-brand-accent";
                  return (
                    <button
                      key={mission.id}
                      onClick={() => setSelectedMissionId(mission.id)}
                      className={cn(
                        "group flex w-full flex-col gap-1 rounded-xl px-4 py-3 text-left transition-all",
                        isSelected ? "bg-foreground/5" : "hover:bg-foreground/[0.02] opacity-60 hover:opacity-100",
                      )}
                    >
                      <p className={cn("truncate text-[13px] font-bold leading-tight tracking-tight", isSelected ? "text-foreground" : "text-muted-foreground")}>
                        {mission.title}
                      </p>
                      <div className="flex items-center gap-2">
                         <span className={cn("h-1 w-1 rounded-full", statusColor)} />
                         <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">{mission.progress}% · {mission.review}</p>
                      </div>
                    </button>
                  );
                })}
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Completed</p>
                <span className="text-[10px] font-bold text-muted-foreground/30">{archivedMissions.length}</span>
             </div>
             <div className="flex flex-col gap-0.5">
                {archivedMissions.map((mission) => {
                  const isSelected = selectedMission.id === mission.id;
                  return (
                    <button
                      key={mission.id}
                      onClick={() => setSelectedMissionId(mission.id)}
                      className={cn(
                        "group flex w-full flex-col gap-1 rounded-xl px-4 py-3 text-left transition-all",
                        isSelected ? "bg-foreground/5" : "hover:bg-foreground/[0.02] opacity-30 hover:opacity-80",
                      )}
                    >
                      <p className="truncate text-[13px] font-bold leading-tight tracking-tight text-foreground">{mission.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Archived</p>
                    </button>
                  );
                })}
             </div>
          </div>
        </aside>

        <div className="max-w-4xl">
          <div className="pb-10 border-b border-foreground/5">
             <div className="flex items-center gap-3">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border",
                  selectedMission.status === "blocked" ? "bg-warning/10 text-warning border-warning/10" :
                  selectedMission.status === "complete" ? "bg-success/10 text-success border-success/10" :
                  "bg-brand-accent/10 text-brand-accent border-brand-accent/10"
                )}>
                  {selectedMission.status}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Mission Profile</span>
             </div>
             <h3 className="font-display mt-6 text-2xl font-bold leading-tight text-foreground tracking-tight">{selectedMission.title}.</h3>
             <p className="mt-4 text-[15px] font-medium leading-relaxed text-muted-foreground/80">{selectedMission.summary}</p>
             <div className="mt-8 flex items-center justify-between border-t border-foreground/5 pt-8">
                <div className="flex items-center gap-6">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Operational Status</p>
                      <p className="mt-1 text-[13px] font-bold text-foreground">{selectedMission.review}</p>
                   </div>
                   <div className="h-8 w-px bg-foreground/10" />
                   <div className="flex items-center gap-3">
                      <p className="text-[13px] font-bold text-foreground">{selectedMission.progress}%</p>
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/5">
                         <div className={cn("h-full rounded-full transition-all duration-1000", selectedMission.status === "blocked" ? "bg-warning" : "bg-brand-accent")} style={{ width: `${selectedMission.progress}%` }} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div className="grid gap-6 mt-10 sm:grid-cols-2">
            <MissionLane icon={ClipboardCheck} title="Tasks" meta={`${selectedMission.tasks} items`} text="Pending approvals and execution logs." onClick={() => onWorkspace("tasksWorkspace")} />
            <MissionLane icon={Gauge} title="Tests" meta={`${selectedMission.tests} active`} text="Validation metrics and market signals." onClick={() => onWorkspace("testLabWorkspace")} />
            <MissionLane icon={FileText} title="Briefs" meta={`${selectedMission.briefs} reports`} text="Department handoffs and requirements." onClick={() => onWorkspace("briefsWorkspace")} />
            <MissionLane icon={FileCheck2} title="History" meta="Full Log" text="Archive of decisions and evidence." onClick={() => onDrawer("decisionRecord")} />
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-foreground/5 pt-8">
             <div className="flex gap-4">
                <button className="rounded-full bg-foreground px-6 py-2 text-[12px] font-bold text-background transition-all hover:opacity-90 active:scale-95 shadow-lg">Resume Mission</button>
                <button className="rounded-full border border-foreground/10 px-6 py-2 text-[12px] font-bold text-foreground transition-all hover:bg-foreground/5">Archive</button>
             </div>
             <p className="text-[12px] font-medium text-muted-foreground/40 italic">Last updated by AI Manager 4 hours ago</p>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};

const ArtistProfileWorkspace = ({ profile, onBack }: { profile: ArtistProfile; onBack: () => void }) => (
  <WorkspaceShell eyebrow="Artist Dossier" title={profile.name} onBack={onBack}>
    <div className="flex flex-col gap-10">
      
      {/* Top Banner / Hero Card */}
      <div className="relative flex flex-col justify-end overflow-hidden rounded-[32px] border border-foreground/10 bg-foreground/5 p-10 md:min-h-[360px]">
        {/* Premium Background Elements */}
        <div className="absolute right-0 top-0 h-full w-[60%] bg-gradient-to-l from-brand-accent/15 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsla(var(--brand-accent),0.05),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-8">
            <div className="surface-intelligence h-32 w-32 shrink-0 rounded-[28px] bg-background border border-foreground/10 shadow-2xl flex items-center justify-center">
               <BrandMark size="md" />
            </div>
            <div>
              <p className="font-ui text-[12px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">Primary Identity</p>
              <h3 className="font-display text-[4rem] font-bold leading-none tracking-tight text-foreground">{profile.name}.</h3>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {[profile.genre, profile.market, profile.stage].map(val => (
                   <span key={val} className="rounded-full border border-foreground/10 bg-background/50 backdrop-blur-sm px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/70">
                      {val}
                   </span>
                ))}
              </div>
            </div>
          </div>
          <button className="group shrink-0 rounded-full bg-foreground px-10 py-3.5 text-[14px] font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20">
            Edit Global Profile
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Focus Block */}
        <div className="flex flex-col gap-4 surface-panel rounded-[28px] p-6 md:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Current Focus</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground/80">Active Release</p>
              <p className="mt-1 text-[16px] font-bold text-foreground">{profile.release}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground/80">Core Goal</p>
              <p className="mt-1 text-[16px] font-bold text-foreground">{profile.goal}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground/80">Available Budget</p>
              <p className="mt-1 text-[16px] font-bold text-foreground">{profile.budget}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground/80">Spotify Identity</p>
              <p className="mt-1 text-[16px] font-bold text-foreground">{profile.spotify}</p>
            </div>
          </div>
        </div>

        {/* Connected Sources & Health */}
        <div className="flex flex-col gap-4 surface-panel rounded-[28px] p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Connection Health</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <p className="text-[13px] font-medium text-foreground">TikTok</p>
              <span className="text-[12px] text-muted-foreground/80">{profile.tiktok}</span>
            </div>
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <p className="text-[13px] font-medium text-foreground">YouTube</p>
              <span className="text-[12px] text-muted-foreground/80">{profile.youtube}</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <p className="text-[13px] font-medium text-foreground">Instagram</p>
              <span className="text-[12px] text-muted-foreground/80">{profile.instagram}</span>
            </div>
          </div>
          <div className="mt-2 rounded-[12px] bg-[#f97316]/[0.06] p-3">
             <p className="text-[11px] leading-relaxed text-[#c2410c]"><span className="font-bold">Warning:</span> Private analytics, statements, and smart-link conversion are missing.</p>
          </div>
        </div>
      </div>
    </div>
  </WorkspaceShell>
);

const LockedAgentWorkspace = ({ agent, onBack }: { agent: Agent; onBack: () => void }) => (
  <WorkspaceShell eyebrow="Department" title={agent.name} onBack={onBack}>
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      {/* Left side: Locked Chat Interface */}
      <div className="flex min-h-[500px] flex-col rounded-[24px] border border-foreground/5 bg-background shadow-xl shadow-black/[0.03] surface-panel overflow-hidden">
        <div className="flex items-center gap-4 border-b border-foreground/5 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: agent.color }}>
            <agent.icon className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-foreground">{agent.name}</h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground/80">{agent.purpose}</p>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground/60">
            <Lock className="h-6 w-6" />
          </div>
          <p className="mt-5 text-[16px] font-bold text-foreground">This agent is locked</p>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground/80">
            You cannot start a conversation with the {agent.name} until the required documents are uploaded.
          </p>
        </div>

        <div className="border-t border-foreground/5 p-6">
          <div className="relative">
            <input 
              disabled
              placeholder={`Upload documents to talk to ${agent.name}...`}
              className="h-12 w-full rounded-[12px] border border-foreground/10 bg-foreground/5 pl-4 pr-12 text-[13px] text-muted-foreground/60 outline-none cursor-not-allowed"
            />
            <button disabled className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-[8px] bg-foreground/5 text-muted-foreground/60 cursor-not-allowed">
              <MessageSquareText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Upload & Requirements */}
      <div className="flex flex-col gap-5">
        <div className="surface-panel rounded-[28px] p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Unlock requirements</p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/70">Upload the required context to activate this specialist.</p>
          
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#f97316]">Required</p>
              <div className="mt-3 space-y-2">
                {agent.requiredSources.map(req => (
                  <div key={req} className="flex items-center gap-3 rounded-[12px] border border-foreground/5 p-3 text-[13px] font-medium text-foreground">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground/60">
                      <Upload className="h-3 w-3" />
                    </div>
                    {req}
                  </div>
                ))}
              </div>
            </div>
            
            {agent.connectedSources.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-600">Connected</p>
                <div className="mt-3 space-y-2">
                  {agent.connectedSources.map(conn => (
                    <div key={conn} className="flex items-center gap-3 rounded-[12px] border border-foreground/5 bg-foreground/5 p-3 text-[13px] font-medium text-foreground/70">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </div>
                      {conn}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="mt-6 flex w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-foreground/10 bg-black/[0.01] p-6 text-center transition-colors hover:bg-foreground/5">
            <Upload className="mx-auto h-6 w-6 text-muted-foreground/60" />
            <p className="mt-3 text-[13px] font-bold text-foreground">Upload files</p>
            <p className="mt-1 text-[12px] text-muted-foreground/80">PDF, CSV, or images</p>
          </button>
        </div>

        {agent.optionalSources.length > 0 && (
          <div className="surface-panel rounded-[28px] p-6">
             <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Optional context</p>
             <div className="mt-4 flex flex-wrap gap-2">
               {agent.optionalSources.map(opt => (
                 <span key={opt} className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-[11px] font-semibold text-foreground/70">
                   {opt}
                 </span>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  </WorkspaceShell>
);

const ReviewWorkspace = ({ onBack, onMission }: { onBack: () => void; onMission: (id?: string) => void }) => (
  <WorkspaceShell eyebrow="Review / What Changed" title="72-hour signal review" onBack={onBack}>
    <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
      <div className="rounded-[20px] border border-brand-accent/20 bg-brand-accent/[0.04] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-accent">Review triggered</p>
        <p className="mt-4 text-[16px] leading-relaxed text-foreground">
          New evidence arrived from the first hook posts. The recommendation remains constrained: keep the cap, shift effort toward the acoustic hook, and wait for conversion proof before scale spend.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ArtifactField label="Previous recommendation" value="Run capped validation before scale spend." />
          <ArtifactField label="What changed" value="Acoustic hook produced stronger repeat comments and save proxy." />
          <ArtifactField label="What did not change" value="Paid-audience conversion is still weak." />
          <ArtifactField label="Manager comparison" value="Mission updated; scale decision remains blocked by missing private analytics." />
        </div>
      </div>
      <div className="surface-panel rounded-[28px] p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Review actions</p>
        <div className="mt-5 flex flex-col gap-3">
          <button onClick={() => onMission("night-bus-validation")} className="rounded-[10px] border border-foreground/10 px-5 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-foreground/5">Open updated mission</button>
          <button className="rounded-[10px] border border-foreground/10 px-5 py-2.5 text-[13px] font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-black">Run review</button>
          <button className="rounded-[10px] px-5 py-2.5 text-[13px] font-semibold text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-black">Snooze review</button>
        </div>
      </div>
    </div>
  </WorkspaceShell>
);

const PreviewBlock = ({ title, rows }: { title: string; rows: string[] }) => (
  <div className="surface-panel rounded-[28px] p-6">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{title}</p>
    <div className="mt-4 space-y-3">
      {rows.map((row) => (
        <p key={row} className="text-[13px] leading-relaxed text-foreground/80">{row}</p>
      ))}
    </div>
  </div>
);

const EvidenceDrawer = ({ drawer, onClose }: { drawer: DrawerKind; onClose: () => void }) => (
  <Sheet open={Boolean(drawer)} onOpenChange={(open) => !open && onClose()}>
    <SheetContent className="w-full overflow-y-auto border-l border-foreground/5 bg-white text-foreground sm:max-w-3xl">
      {drawer === "evidence" && (
        <DrawerBody kicker="Evidence Drawer" title="Evidence file" description="Normalized evidence used by the Manager. Each item includes source, lens, freshness, confidence, provenance, and limitations.">
          <div className="space-y-4">
            {evidence.map((item) => (
              <div key={item.id} className="surface-panel overflow-hidden rounded-[28px] p-8 shadow-2xl shadow-black/[0.03] transition-all hover:scale-[1.01]">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-brand-accent">{item.id} · {item.source}</p>
                    <h4 className="font-display mt-2 text-[22px] font-bold text-foreground tracking-tight">{item.subject}.</h4>
                  </div>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border",
                    item.confidence === "High" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                  )}>
                    {item.confidence} Confidence
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ArtifactField label="Evidence type" value={item.type} />
                  <ArtifactField label="Source kind" value={item.sourceKind} />
                  <ArtifactField label="Time window" value={item.window} />
                  <ArtifactField label="Metric / value" value={item.metric} />
                  <ArtifactField label="Lens" value={item.lens} />
                  <ArtifactField label="Freshness" value={item.freshness} />
                  <ArtifactField label="Provenance" value={item.provenance} />
                  <ArtifactField label="Raw snapshot ref" value={item.rawRef} />
                </div>
                <p className="mt-6 rounded-[14px] border border-[#f97316]/20 bg-[#f97316]/[0.05] p-5 text-[13px] leading-relaxed text-[#c2410c]">Limitation: {item.limitation}</p>
              </div>
            ))}
          </div>
        </DrawerBody>
      )}
      {drawer === "decisionRecord" && (
        <DrawerBody kicker="Mission Record" title="Mission memory" description="This is what the AI reads to understand the mission before answering future questions, updating work, or recommending the next move.">
          <div className="surface-panel rounded-[28px] p-8 shadow-2xl shadow-black/[0.02] text-foreground">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{decisionRecord.missionTitle}</p>
                <h3 className="mt-2 text-[22px] font-display font-bold tracking-tight text-foreground">{decisionRecord.finalCall}</h3>
              </div>
              <span className="rounded-full bg-foreground/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground/70">{decisionRecord.confidence}</span>
            </div>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/80">
              <p>
                We approved the structure of a capped validation test, not a full campaign scale. The mission is active, the creative sprint has a working shape, and the team is still waiting on private Spotify and smart-link proof before the recommendation can graduate from test mode.
              </p>
              <p>
                The first task sequence is doing what it should: Sable stays focused on Night Bus, the first hooks are live, and the Marketing Lead has a clear read on which creative language is repeating. Spotify saves are up 72% in the early read, but that number still needs source-of-stream and click-through context before it becomes a spend decision.
              </p>
              <p>
                Finance/Rights has not cleared the mission for aggressive spend. Royalty statements, payout history, split sheets, and distributor metadata are still missing, so the record should continue to treat revenue recovery and ownership certainty as unresolved.
              </p>
              <p>
                The next useful move is not another card or task. It is the 72-hour read: compare saves, comments, clicks, and repeat demand language, then decide whether the capped test continues, changes hook direction, or stops before more money moves.
              </p>
            </div>

            <div className="mt-8 border-t border-foreground/5 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Evidence and decision limits</p>
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/70">
                Evidence used: EV-TTK-0426, EV-YT-1190, EV-SP-3302, EV-ART-0007. Rejected moves: {decisionRecord.alternativesRejected.join(", ")}. Missing evidence: {decisionRecord.missingEvidence.join(", ")}. The decision changes if cross-platform conversion improves, private Spotify saves confirm demand, or the 72-hour signals fail the stop rule.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/70">
                Review date: {decisionRecord.reviewDate}. Override state: {decisionRecord.override}. Quality gate: {decisionRecord.qualityGate}.
              </p>
            </div>
          </div>
        </DrawerBody>
      )}
      {drawer === "workDraft" && (
        <DrawerBody kicker="Work drafts" title="Not sent automatically" description="Operational drafts for approval, editing, export, or future sending.">
          <div className="space-y-4">
            {workDrafts.map((draft) => (
              <div key={draft.type} className="surface-panel rounded-[28px] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{draft.type}</p>
                <p className="mt-2 text-[18px] font-bold text-foreground">{draft.title}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-black/70">{draft.body}</p>
              </div>
            ))}
          </div>
        </DrawerBody>
      )}
    </SheetContent>
  </Sheet>
);

const InvestigationScreen = ({ onBack }: { onBack: () => void }) => (
  <WorkspaceShell eyebrow="Intelligence" title="Investigation" onBack={onBack}>
    <div className="surface-panel rounded-[24px] p-8">
      <p className="text-[15px] font-medium text-muted-foreground/80 leading-relaxed">Investigation workspace — cross-referencing signals and market data.</p>
    </div>
  </WorkspaceShell>
);

const DecisionPackageScreen = ({ conversations, onBack, onMission, onWorkspace, onDrawer, onConversation }: { conversations: RecentConversation[]; onBack: () => void; onMission: (id?: string) => void; onWorkspace: (view: View) => void; onDrawer: (drawer: DrawerKind) => void; onConversation: (conv: RecentConversation) => void }) => (
  <WorkspaceShell eyebrow="Decision Package" title="Manager Decision" onBack={onBack}>
    <div className="surface-panel rounded-[24px] p-8">
      <p className="text-[15px] font-medium text-muted-foreground/80 leading-relaxed">Decision package ready for review. The Manager has finalized a recommendation based on current signals.</p>
    </div>
  </WorkspaceShell>
);

const DrawerBody = ({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="p-8">
    <SheetHeader>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{kicker}</p>
      <SheetTitle className="font-display mt-2 text-[2.8rem] font-display font-bold tracking-tight text-foreground">
        {title}
      </SheetTitle>
      <SheetDescription className="mt-3 text-[15px] leading-relaxed text-foreground/70">{description}</SheetDescription>
    </SheetHeader>
    <div className="mt-10">{children}</div>
  </div>
);
