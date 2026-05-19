const fs = require('fs');
const file = 'src/pages/AiLabelPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /onCompleteTask=\{\(id\) => \{\s*setCompletedTasks\(\(current\) => Array\.from\(new Set\(\[\.\.\.current, id\]\)\)\);\s*if \(id === "post-hooks"\) setTestCheckpoint\("signal"\);\s*if \(id === "track-conversion"\) setTestCheckpoint\("complete"\);\s*\}\}/;

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

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success.");
} else {
  console.log("Regex didn't match.");
}
