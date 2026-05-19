const fs = require('fs');
const file = 'src/pages/AiLabelPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `const CheckpointsWorkspace = ({ onBack, testCheckpoint }: { onBack: () => void; testCheckpoint: "setup" | "signal" | "complete" }) => {
  const [selectedCheckpointId, setSelectedCheckpointId] = useState(() => missionCheckpoints.find((checkpoint) => checkpoint.status === "Needs revision")?.id ?? missionCheckpoints[0].id);
  const taskResultById = new Map(taskResults.map((result) => [result.taskId, result]));
  const clearedCount = missionCheckpoints.filter((checkpoint) => checkpoint.status === "Met" || checkpoint.status === "Ready for AI review").length;
  const activeBlocker = missionCheckpoints.find((checkpoint) => checkpoint.status === "Needs revision") ?? missionCheckpoints[0];
  const selectedCheckpoint = missionCheckpoints.find((checkpoint) => checkpoint.id === selectedCheckpointId) ?? activeBlocker;
  const selectedRequiredResults = selectedCheckpoint.requiredTaskIds.map((taskId) => taskResultById.get(taskId)?.status ?? "pending");
  const selectedResolvedCount = selectedRequiredResults.filter((status) => status !== "pending").length;
  const readinessPercent = Math.round((clearedCount / missionCheckpoints.length) * 100);
  const selectedBlockerCopy = getCheckpointBlockerCopy(selectedCheckpoint);
  const selectedDecision = getCheckpointDecision(selectedCheckpoint);
  const statusClass = (checkpoint: MissionCheckpoint) =>
    checkpoint.status === "Needs revision"
      ? "border-[#f97316]/30 bg-[#fff8f3] text-[#9a3412]"
      : checkpoint.status === "Met" || checkpoint.status === "Ready for AI review"
        ? "border-brand-accent/25 bg-brand-accent/[0.07] text-brand-accent"
        : "border-foreground/8 bg-background text-muted-foreground";

  return (
    <WorkspaceShell eyebrow="Checkpoints" title="Mission checkpoints" onBack={onBack}>
      <div className="space-y-5">
        <section data-testid="checkpoint-command-strip" className="rounded-[20px] border border-foreground/8 bg-background/85 p-4 shadow-sm lg:rounded-[24px] lg:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_520px] xl:gap-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent">Mission progress map</p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <h3 className="font-display text-[24px] font-bold leading-tight text-foreground lg:text-[30px] lg:leading-none">Night Bus / June 12</h3>
                <span className="rounded-full border border-[#f97316]/20 bg-[#f97316]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#c2410c]">Active blocker: {activeBlocker.title}</span>
              </div>
              <p className="mt-3 max-w-3xl text-[13px] font-semibold leading-relaxed text-foreground/70">
                Check each phase, review the Manager call, then continue or fix what is blocking the release.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ArtifactField label="Readiness" value={\`\${readinessPercent}%\`} />
              <ArtifactField label="Cleared" value={\`\${clearedCount}/\${missionCheckpoints.length}\`} />
              <ArtifactField label="Current call" value="Move date" />
              <ArtifactField label="Target" value="Fri Jun 12" />
            </div>
          </div>
          <div className="mt-3 rounded-[16px] border border-foreground/8 bg-foreground/[0.025] p-3 xl:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="min-w-0 truncate text-[13px] font-bold text-foreground">{selectedCheckpoint.title}</p>
              <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", statusClass(selectedCheckpoint))}>{selectedCheckpoint.status}</span>
            </div>
            <p className="mt-2 text-[12px] font-semibold leading-relaxed text-foreground/72">{selectedCheckpoint.managerRecommendation}</p>
            <p className="mt-2 text-[12px] font-bold leading-relaxed text-brand-accent">{selectedCheckpoint.nextAction}</p>
          </div>
        </section>

        <div data-testid="checkpoint-workspace-grid" className="grid gap-5 xl:h-[calc(100vh-300px)] xl:min-h-[600px] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] xl:overflow-hidden">
          <section data-testid="checkpoint-ledger-panel" className="min-w-0 overflow-hidden rounded-[24px] border border-foreground/8 bg-background/76 p-3 shadow-sm xl:flex xl:h-full xl:flex-col">
            <div className="mb-3 flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/55">Mission Phases</p>
                <p className="mt-1 text-[13px] font-semibold text-foreground/70">Complete tasks to unlock downstream phases.</p>
              </div>
              <span className="rounded-full bg-foreground/[0.045] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/65">Release Path</span>
            </div>
            <div data-testid="checkpoint-scroll-region" className="scrollbar-soft min-h-0 space-y-4 pr-1 lg:overflow-y-auto lg:pr-2 xl:flex-1 pb-4">
              <div data-testid="mobile-checkpoint-list" className="sr-only">Mobile checkpoint list</div>
              {missionCheckpoints.map((checkpoint, index) => {
                const requiredResults = checkpoint.requiredTaskIds.map((taskId) => taskResultById.get(taskId)?.status ?? "pending");
                const resolvedCount = requiredResults.filter((status) => status !== "pending").length;
                const isSelected = selectedCheckpoint.id === checkpoint.id;
                const dependencyState = getCheckpointDependencyState(checkpoint);
                const isLocked = dependencyState === "Conditional" || dependencyState === "Locked";
                const phaseTasks = taskRows.filter(t => t.checkpointId === checkpoint.id);

                return (
                  <div 
                    key={checkpoint.id} 
                    className={cn(
                      "relative rounded-[20px] border transition-all overflow-hidden", 
                      isSelected ? "border-brand-accent/40 bg-brand-accent/[0.02] shadow-lg shadow-brand-accent/5" : "border-foreground/8 bg-background/82 hover:border-foreground/16",
                      isLocked ? "opacity-60" : "opacity-100"
                    )}
                  >
                    <button
                      aria-current={isSelected ? "true" : undefined}
                      onClick={() => setSelectedCheckpointId(checkpoint.id)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                           <span className={cn(
                             "flex mt-0.5 h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", 
                             checkpoint.status === "Needs revision" ? "bg-[#f97316] text-white" : 
                             checkpoint.status === "Met" || checkpoint.status === "Ready for AI review" ? "bg-brand-accent text-background" : 
                             "bg-foreground/10 text-muted-foreground"
                           )}>
                             {checkpoint.status === "Needs revision" ? "!" : checkpoint.status === "Met" || checkpoint.status === "Ready for AI review" ? <Check className="h-3 w-3" /> : checkpoint.phase}
                           </span>
                           <div>
                             <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-accent">Phase {checkpoint.phase}</p>
                             <h4 className={cn("mt-0.5 text-[15px] font-bold leading-tight", isSelected ? "text-foreground" : "text-foreground/80")}>{checkpoint.title}</h4>
                             <p className="mt-1 text-[12px] font-semibold text-muted-foreground/75 leading-relaxed">{checkpoint.question}</p>
                           </div>
                        </div>
                        <span className={cn("shrink-0 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", statusClass(checkpoint))}>{checkpoint.status}</span>
                      </div>
                      
                      <div className="mt-4 pl-9 space-y-2">
                         {phaseTasks.map(task => {
                           const result = taskResultById.get(task.id);
                           const isDone = result?.status === "completed" || result?.status === "approved" || result?.status === "revised";
                           const isBlocked = result?.status === "blocked" || task.approvalState === "blocked";
                           return (
                             <div key={task.id} className="flex items-center gap-2">
                               <span className={cn("h-1.5 w-1.5 rounded-full", isBlocked ? "bg-[#f97316]" : isDone ? "bg-brand-accent" : "bg-foreground/20")} />
                               <span className={cn("text-[12px] font-semibold truncate", isDone ? "text-muted-foreground line-through" : "text-foreground/70")}>{task.title}</span>
                             </div>
                           )
                         })}
                      </div>
                    </button>
                    {isLocked && (
                       <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                          <div className="bg-background border border-foreground/10 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                             <Lock className="w-3 h-3 text-muted-foreground" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Locked by earlier phase</span>
                          </div>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside data-testid="checkpoint-inspector" className="scrollbar-soft min-w-0 rounded-[24px] border border-foreground/8 bg-background/88 p-5 shadow-sm lg:sticky lg:top-6 lg:self-start xl:h-full xl:overflow-y-auto">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent">Manager review</p>
                <h3 className="mt-2 text-[24px] font-display font-bold leading-tight text-foreground">{selectedCheckpoint.title}</h3>
              </div>
              <span className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", statusClass(selectedCheckpoint))}>{selectedCheckpoint.status}</span>
            </div>

            <div className="mt-4 rounded-[18px] border border-foreground/8 bg-foreground/[0.025] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/55">Manager recommendation / Current decision</p>
                <span className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", selectedDecision === "Needs fix" ? "border-[#f97316]/25 bg-[#fff8f3] text-[#9a3412]" : "border-brand-accent/25 bg-brand-accent/[0.07] text-brand-accent")}>{selectedDecision}</span>
              </div>
              <p className="mt-3 text-[15px] font-semibold leading-relaxed text-foreground">{getCheckpointReviewCopy(selectedCheckpoint)}</p>
              {getCheckpointReviewCopy(selectedCheckpoint) !== selectedCheckpoint.resultSummary && selectedCheckpoint.status !== "Needs revision" && (
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/70">{selectedCheckpoint.resultSummary}</p>
              )}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/55">Required task results</p>
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/55">{selectedResolvedCount}/{selectedCheckpoint.requiredTaskIds.length}</span>
              </div>
              <div className="mt-3 divide-y divide-foreground/7 overflow-hidden rounded-[16px] border border-foreground/8 bg-background">
                {selectedCheckpoint.requiredTaskIds.map((taskId) => {
                  const task = taskRows.find((row) => row.id === taskId);
                  const result = taskResultById.get(taskId);
                  return (
                    <div key={taskId} className="grid gap-2 p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[13px] font-bold leading-snug text-foreground">{task?.title}</p>
                          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", result?.status === "blocked" ? "bg-[#f97316]/12 text-[#c2410c]" : result ? "bg-brand-accent/10 text-brand-accent" : "bg-foreground/5 text-muted-foreground/70")}>{result?.status ?? "pending"}</span>
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground/72">{result?.userNote ?? "No review note yet."}</p>
                      </div>
                      <p className="text-[12px] font-semibold leading-relaxed text-foreground/72">{result?.interpretation ?? "Manager is waiting for this task result before judging the checkpoint."}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedBlockerCopy ? (
              <div className="mt-5 rounded-[18px] border border-[#f97316]/18 bg-[#fff8f3] p-4 text-[#9a3412]">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em]">What is blocking this</p>
                <p className="mt-2 text-[14px] font-bold leading-relaxed">{selectedBlockerCopy}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">What to do next</p>
                    <p className="mt-1 text-[13px] font-semibold leading-relaxed">{selectedCheckpoint.nextAction}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">What this holds back</p>
                    <p className="mt-1 text-[13px] font-semibold leading-relaxed">{getCheckpointHoldBackCopy(selectedCheckpoint)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[18px] border border-brand-accent/16 bg-brand-accent/[0.055] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-accent">Phase cleared</p>
                <p className="mt-2 text-[14px] font-bold leading-relaxed text-foreground">Next phase opened: {getNextOpenedCopy(selectedCheckpoint)}</p>
                <p className="mt-1 text-[13px] font-semibold leading-relaxed text-foreground/70">{selectedCheckpoint.nextAction}</p>
              </div>
            )}

            {selectedCheckpoint.status === "Needs revision" && (
              <div className="mt-3 rounded-[16px] border border-foreground/8 bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/55">New work created</p>
                <p className="mt-2 text-[13px] font-semibold leading-relaxed text-foreground/75">{missionReview.nextTaskCreated}</p>
              </div>
            )}

            <p className="mt-5 border-t border-foreground/8 pt-4 text-[12px] leading-relaxed text-muted-foreground/70">{testReviewImpact[testCheckpoint]}</p>
          </aside>
        </div>
      </div>
    </WorkspaceShell>
  );
};`;

const regex = /const CheckpointsWorkspace = \(\{\s*onBack[\s\S]*?WorkspaceShell>\s*\);\s*};/;
const newContent = content.replace(regex, replacement);

if (newContent !== content) {
  fs.writeFileSync(file, newContent, 'utf8');
  console.log("Successfully replaced CheckpointsWorkspace component.");
} else {
  console.log("Failed to find CheckpointsWorkspace component for replacement.");
}
