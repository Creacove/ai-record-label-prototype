const fs = require('fs');
const file = 'src/pages/AiLabelPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const original = `onCompleteTask={(id) => {
                  setCompletedTasks((current) => Array.from(new Set([...current, id])));
                  if (id === "post-hooks") setTestCheckpoint("signal");
                  if (id === "track-conversion") setTestCheckpoint("complete");
                }}`;

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

if (content.indexOf(original) !== -1) {
  content = content.replace(original, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success.");
} else {
  console.log("Could not find exact string. Here is the string near onCompleteTask:");
  const idx = content.indexOf('onCompleteTask={');
  console.log(content.substring(idx, idx + 400));
}
