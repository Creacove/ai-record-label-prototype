const fs = require('fs');
const file = 'src/pages/AiLabelPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `onCompleteTask={(id, note) => {
                  setCompletedTasks((current) => Array.from(new Set([...current, id])));
                  if (note) {
                    taskResults.push({
                      taskId: id,
                      status: "completed",
                      summary: "Task marked done by Manager",
                      userNote: note,
                      interpretation: "Manager completed this task with context.",
                      missionEffect: "Advanced the mission.",
                      followUp: "Proceed with next steps."
                    });
                  }
                  if (id === "post-hooks") setTestCheckpoint("signal");
                  if (id === "track-conversion") setTestCheckpoint("complete");
                }}`;

// Finding the original code block to replace
const original = `onCompleteTask={(id) => {
                  setCompletedTasks((current) => Array.from(new Set([...current, id])));
                  if (id === "post-hooks") setTestCheckpoint("signal");
                  if (id === "track-conversion") setTestCheckpoint("complete");
                }}`;

if (content.includes(original)) {
  const newContent = content.replace(original, replacement);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log("Successfully updated AiLabelPrototype onCompleteTask.");
} else {
  console.log("Failed to find original onCompleteTask block.");
}
