import { exec } from "child_process";
import util from "util";
import { escapeArgForShell } from "./util.js";

export const execWithPromise = util.promisify(exec);

export const runExec = async ({
  exec,
  basePath,
  outputPodcastPath,
  episodeFilename,
  episodeAudioUrl,
}) => {
  const episodeFilenameBase = episodeFilename.substring(
    0,
    episodeFilename.lastIndexOf(".")
  );

  // Allow optional whitespace within placeholders (e.g., `{{ episode_path }}`) so user templates are more forgiving.
  const execCmd = exec
    .replace(/{{\s*episode_path\s*}}/g, escapeArgForShell(outputPodcastPath))
    .replace(/{{\s*episode_path_base\s*}}/g, escapeArgForShell(basePath))
    .replace(/{{\s*episode_filename\s*}}/g, escapeArgForShell(episodeFilename))
    .replace(
      /{{\s*episode_filename_base\s*}}/g,
      escapeArgForShell(episodeFilenameBase)
    )
    .replace(/{{\s*url\s*}}/g, escapeArgForShell(episodeAudioUrl));

  await execWithPromise(execCmd, { stdio: "ignore" });
};
