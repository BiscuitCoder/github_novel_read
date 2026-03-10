
'use server'

import { fetchRepoContents, fetchFileContent, parseGitHubUrl } from "@/lib/github";

export async function getRepoContentsAction(url: string, path: string = "") {
  const repoInfo = parseGitHubUrl(url);
  if (!repoInfo) {
    return { error: "Invalid GitHub URL" };
  }
  
  try {
    const contents = await fetchRepoContents(repoInfo.owner, repoInfo.repo, path);
    return { contents };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getFileContentAction(downloadUrl: string) {
  try {
    const content = await fetchFileContent(downloadUrl);
    return { content };
  } catch (e: any) {
    return { error: e.message };
  }
}
