const { Toolkit } = require('actions-toolkit');
const fs = require('fs');
const path = require('path');

// if (process.env.INPUT_TARGET_DIRECTORY) {
//   process.env.GITHUB_WORKSPACE = `${process.env.GITHUB_WORKSPACE}/${process.env.INPUT_TARGET_DIRECTORY}`;
//   process.chdir(process.env.GITHUB_WORKSPACE);
// }

Toolkit.run(async tools => {
  try {
    console.log(`INPUT_TARGET_DIRECTORY: ${process.env.INPUT_TARGET_DIRECTORY}`);
    console.log(`GITHUB_WORKSPACE: ${process.env.GITHUB_WORKSPACE}`);
    // Read the target file
    const targetFile = path.join(
      process.env.GITHUB_WORKSPACE,
      process.env.INPUT_TARGET_DIRECTORY,
      process.env.INPUT_TARGET_FILE
    );
    console.log(`Target file: ${targetFile}`);
    const content = fs.readFileSync(targetFile, 'utf8');
    // Increment value
    const prefix = process.env.INPUT_PREFIX;
    console.log(`prefix: ${prefix}`);
    const suffix = process.env.INPUT_SUFFIX;
    console.log(`suffix: ${suffix}`);
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
    const gitUserName = process.env.GITHUB_USER || 'Automated Increment value';
    console.log(`Set git user name: ${gitUserName}`);
    await tools.exec(`git config user.name "${gitUserName}"`);
    const gitUserEmail = process.env.GITHUB_EMAIL || 'gh-action-increment-value@users.noreply.github.com';
    console.log(`Set git user email: ${gitUserEmail}`);
    await tools.exec(`git config user.email "${gitUserEmail}"`);
    // Fetch current branch name
    let currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF)[1];
    let isPullRequest = false;
    if (process.env.GITHUB_HEAD_REF) {
      currentBranch = process.env.GITHUB_HEAD_REF;
      isPullRequest = true;
    }
    console.log(`Current branch: ${currentBranch}`);
    // Commit
    const commitMessage = process.env.INPUT_COMMIT_MESSAGE;
    await tools.exec(`git commit -a -m "ci: ${commitMessage} ${next}"`);
    console.log('Committing was successfully.');
    // Push
    const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
    await tools.exec(`git push ${remoteRepo}`);
    console.log('Pushing was successfully.');
    tools.exit.success('Incrementing the value successfully.');
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed to increment the value.');
  }
});
