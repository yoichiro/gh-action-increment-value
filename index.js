const { Toolkit } = require('actions-toolkit');
const fs = require('fs');

if (process.env.INPUT_TARGET_DIRECTORY) {
  process.env.GITHUB_WORKSPACE = `${process.env.GITHUB_WORKSPACE}/${process.env.INPUT_TARGET_DIRECTORY}`;
  process.chdir(process.env.GITHUB_WORKSPACE);
}

Toolkit.run(async tools => {
  try {
    // Read the target file
    const targetFile = process.env.INPUT_TARGET_FILE;
    console.log(process.env.GITHUB_WORKSPACE);
    console.log(`targetFile: ${targetFile}`);
    const content = fs.readFileSync(`./${targetFile}`, 'utf8');
    // Increment value
    const prefix = process.env.INPUT_PREFIX;
    const suffix = process.env.INPUT_SUFFIX;
    const firstPart = content.substring(0, content.indexOf(prefix) + prefix.length);
    const lastPart = content.substring(content.indexOf(suffix));
    const targetPart = content.substring(content.indexOf(prefix) + prefix.length, content.indexOf(suffix));
    const current = Number(targetPart);
    const next = current + 1;
    // Write the target file
    const newContent = `${firstPart}${String(next)}${lastPart}`;
    fs.writeFileSync(targetFile, newContent);
    console.log(`Incremented the value from ${current} to ${next}.`);
    // Set git user
    await tools.exec(`git config user.name "${process.env.GITHUB_USER || 'Automated Increment value'}"`);
    await tools.exec(`git config user.email "${process.env.GITHUB_EMAIL || 'gh-action-increment-value@users.noreply.github.com'}"`);
    // Fetch current branch name
    let currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF)[1];
    let isPullRequest = false;
    if (process.env.GITHUB_HEAD_REF) {
      currentBranch = process.env.GITHUB_HEAD_REF;
      isPullRequest = true;
    }
    console.log(`Current branch: ${currentBranch}`);
    // Commit
    await tools.exec(`git commit -a -m "ci: Increment the value to ${next}"`);
    // Push
    const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
    await tools.exec(`git push ${remoteRepo}`);
    tools.exit.success('Incrementing the value successfully.');
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed to increment the value.');
  }
});
