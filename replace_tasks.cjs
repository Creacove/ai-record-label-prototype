const fs = require('fs');
const file = 'src/pages/AiLabelPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `const TasksWorkspace = ({
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
}) => {
  const taskResultById = new Map(taskResults.map((result) => [result.taskId, result]));
  const activeBlocker = missionCheckpoints.find((checkpoint) => checkpoint.status === "Needs revision");
  const [activeCheckpointId, setActiveCheckpointId] = useState<string>(activeBlocker?.id ?? missionCheckpoints[0].id);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  
  const scrollToGroup = (checkpointId: string) => {
    setActiveCheckpointId(checkpointId);
    document.getElementById(\`task-group-\${checkpointId}\`)?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };
  
  const toggleTaskDetails = (taskId: string) => {
    setExpandedTaskIds((current) => (current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]));
  };

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = missionCheckpoints
      .map((checkpoint) => document.getElementById(\`task-group-\${checkpoint.id}\`))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        const checkpointId = visible?.target.getAttribute("data-checkpoint-id");
        if (checkpointId) setActiveCheckpointId(checkpointId);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.08, 0.22, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <WorkspaceShell eyebrow="Tasks" title="Release tasks" onBack={onBack}>
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-6">
        <aside className="min-w-0 overflow-hidden rounded-[20px] border border-foreground/8 bg-background/75 p-4 shadow-sm lg:sticky lg:top-6 lg:self-start lg:rounded-[24px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent">Mission Phases</p>
          <p className="mt-2 text-[13px] font-semibold leading-relaxed text-foreground/70">
            Work through the release step-by-step. Completing all tasks in a phase unlocks the next one.
          </p>
          <div data-testid="mobile-task-stepper" className="mt-4 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:mt-5 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {missionCheckpoints.map((checkpoint, index) => {
              const inView = activeCheckpointId === checkpoint.id;
              const phaseTasks = taskRows.filter(t => t.checkpointId === checkpoint.id);
              const doneCount = phaseTasks.filter(t => completedTasks.includes(t.id)).length;
              return (
                <button
                  key={checkpoint.id}
                  data-testid={\`task-group-tab-\${checkpoint.id}\`}
                  aria-current={inView ? "true" : undefined}
                  onClick={() => scrollToGroup(checkpoint.id)}
                  className={cn("relative flex min-w-[170px] gap-3 rounded-[14px] border px-2 py-2 text-left transition-all lg:w-full lg:min-w-0", inView ? "border-foreground bg-foreground text-background" : "border-foreground/8 bg-background text-foreground hover:bg-foreground/[0.04]")}
                >
                  {index < missionCheckpoints.length - 1 && <span className="absolute left-[13px] top-8 hidden h-[calc(100%-8px)] w-px bg-foreground/10 lg:block" />}
                  <span className={cn("relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold", inView ? "border-brand-accent bg-brand-accent text-foreground" : "border-foreground/10 bg-background text-muted-foreground")}>
                    {checkpoint.status === "Met" ? <Check className="h-3.5 w-3.5" /> : checkpoint.phase}
                  </span>
                  <div className="min-w-0">
                    <p className={cn("truncate text-[12px] font-bold", inView ? "text-background" : "text-foreground")}>{checkpoint.title}</p>
                    <p className={cn("mt-0.5 text-[10px] font-bold uppercase tracking-[0.08em]", inView ? "text-background/65" : "text-muted-foreground/55")}>{doneCount}/{phaseTasks.length} tasks</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4 lg:space-y-5">
          {activeBlocker && (
            <div className="rounded-[20px] border border-[#f97316]/20 bg-[#fff8f3] p-4 text-[#9a3412] shadow-sm lg:rounded-[24px] lg:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]">Needs attention</p>
              <p className="mt-2 max-w-4xl text-[18px] font-bold leading-snug text-[#7c2d12]">
                {activeBlocker.blockedReason}
              </p>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed">
                {activeBlocker.nextAction}
              </p>
            </div>
          )}

          {missionCheckpoints.map((checkpoint) => {
            const sectionActive = activeCheckpointId === checkpoint.id;
            const phaseTasks = taskRows.filter(t => t.checkpointId === checkpoint.id);
            const blockedBy = getBlockingDependency(checkpoint);
            const isLocked = blockedBy !== undefined;

            return (
              <section
                key={checkpoint.id}
                id={\`task-group-\${checkpoint.id}\`}
                data-testid={\`task-group-\${checkpoint.id}\`}
                data-checkpoint-id={checkpoint.id}
                data-active={sectionActive ? "true" : "false"}
                className={cn("scroll-mt-24 overflow-hidden rounded-[20px] border p-4 shadow-sm transition-all lg:scroll-mt-6 lg:rounded-[24px] lg:p-5", sectionActive ? "border-brand-accent/35 bg-brand-accent/[0.045] shadow-lg" : "border-foreground/8 bg-background/85", isLocked && !sectionActive && "opacity-70")}
              >
                <div className="border-b border-foreground/8 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-accent">Phase {checkpoint.phase}</p>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", checkpoint.status === "Needs revision" ? "border-[#f97316]/30 bg-[#fff8f3] text-[#9a3412]" : checkpoint.status === "Met" || checkpoint.status === "Ready for AI review" ? "border-brand-accent/25 bg-brand-accent/[0.07] text-brand-accent" : "border-foreground/8 bg-background text-muted-foreground")}>{checkpoint.status}</span>
                  </div>
                  <h3 className="mt-2 text-[18px] font-bold text-foreground">{checkpoint.title}</h3>
                  <p className="mt-1 text-[13px] font-semibold leading-relaxed text-muted-foreground/80">{checkpoint.question}</p>
                  {isLocked && blockedBy && (
                    <div className="mt-3 grid gap-2 rounded-[14px] border border-[#f59e0b]/20 bg-[#fffbeb] p-3 text-[12px] font-semibold leading-relaxed text-[#92400e]">
                      <p className="font-bold">Waiting on: {blockedBy.title}</p>
                      <p>{checkpoint.dependencyImpact}</p>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-foreground/7">
                  {phaseTasks.map((task) => {
                    const approved = approvedTasks.includes(task.id);
                    const done = completedTasks.includes(task.id);
                    const completionBlocked = task.approvalState === "needs approval" && !approved;
                    const result = taskResultById.get(task.id);
                    const showResult = Boolean(result && (done || result.status === "completed" || result.status === "blocked" || result.status === "revised"));
                    const blocked = result?.status === "blocked" || task.approvalState === "blocked";
                    const availability = getTaskAvailability(task, checkpoint);
                    const detailsOpen = expandedTaskIds.includes(task.id);
                    return (
                      <div key={task.id} className={cn("grid min-w-0 gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_180px] lg:py-5", availability.disabled && !blocked && "opacity-75")}>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("h-2.5 w-2.5 rounded-full", blocked ? "bg-[#f97316]" : done || result?.status === "completed" ? "bg-brand-accent" : "bg-foreground/20")} />
                            <p className="text-[15px] font-bold leading-snug text-foreground">{task.title}</p>
                            <span className="rounded-full bg-foreground/[0.045] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground/65">{getTaskStatusLabel(task, approved, done, result)}</span>
                            {availability.label !== "Open" && (
                              <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", getDependencyToneClass(availability.tone))}>
                                {availability.label}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-muted-foreground/75">{task.owner} / {task.deadline}</p>
                          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-foreground/72"><span className="font-bold text-foreground">Why it matters:</span> {task.purpose}</p>
                          <button
                            type="button"
                            aria-label={\`\${detailsOpen ? "Hide" : "Show"} details \${task.title}\`}
                            onClick={() => toggleTaskDetails(task.id)}
                            className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-accent hover:underline"
                          >
                            {detailsOpen ? "Hide task details" : "Show task details"}
                          </button>
                          {detailsOpen && (
                            <div className="mt-3 grid gap-3 rounded-[14px] border border-foreground/8 bg-foreground/[0.025] p-3">
                              <div className="grid gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/55">Steps</p>
                              {task.steps.map((step, index) => (
                                <p key={step} className="text-[12px] leading-relaxed text-foreground/72">{index + 1}. {step}</p>
                              ))}
                              </div>
                              <p className="text-[12px] leading-relaxed text-muted-foreground/75"><span className="font-bold text-foreground">Risk if late:</span> {task.riskIfLate}</p>
                              {showResult && result && (
                                <div className="border-l-2 border-brand-accent/50 pl-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-accent">Manager note</p>
                                  <p className="mt-1 text-[13px] font-semibold leading-relaxed text-foreground">{result.summary}</p>
                                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/75"><span className="font-bold text-foreground">Task result:</span> {result.userNote}</p>
                                  <p className="mt-1 text-[12px] leading-relaxed text-foreground/70">{result.interpretation}</p>
                                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/75"><span className="font-bold text-foreground">Effect on mission:</span> {result.missionEffect}</p>
                                  <p className="mt-2 text-[12px] font-bold leading-relaxed text-brand-accent">{result.followUp}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {completionBlocked && (
                            <p className="mt-3 rounded-[12px] border border-[#f97316]/20 bg-[#f97316]/10 p-3 text-[12px] font-semibold leading-snug text-[#c2410c]">
                              Approval is required before this task can be marked done.
                            </p>
                          )}
                          {availability.reason && (
                            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[12px] border border-foreground/8 bg-foreground/[0.025] p-3 text-[12px] font-semibold leading-snug text-foreground/72">
                              <span>{availability.reason}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-wrap items-start justify-start gap-2 lg:justify-end">
                          {task.approvalState === "needs approval" && (
                            <button
                              onClick={() => onApproveTask(task.id)}
                              disabled={approved || done}
                              className="rounded-[10px] border border-foreground/10 px-3 py-2 text-[11px] font-bold text-muted-foreground/80 transition-colors hover:bg-foreground/5 hover:text-black disabled:opacity-40"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            aria-label={\`Mark done \${task.title}\`}
                            onClick={() => onCompleteTask(task.id)}
                            disabled={done || completionBlocked || task.approvalState === "blocked" || availability.disabled}
                            className="rounded-[10px] bg-foreground px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-background transition-all hover:opacity-90 disabled:opacity-35"
                          >
                            Mark done
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </WorkspaceShell>
  );
};`;

const regex = /const TasksWorkspace = \(\{[\s\S]*?WorkspaceShell>\s*\);\s*};/;
const newContent = content.replace(regex, replacement);

if (newContent !== content) {
  fs.writeFileSync(file, newContent, 'utf8');
  console.log("Successfully replaced TasksWorkspace component.");
} else {
  console.log("Failed to find TasksWorkspace component for replacement.");
}
