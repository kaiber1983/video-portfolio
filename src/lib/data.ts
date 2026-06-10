import fs from "fs";
import path from "path";

// ============ 类型定义 ============

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  platform: string;
  tags: string;
  featured: boolean;
  createdAt: string;
}

export interface About {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string;
  socialJson: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============ JSON 文件后端（本地开发） ============

function readJson<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), "data", filename);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeJson<T>(filename: string, data: T[]): void {
  const filePath = path.join(process.cwd(), "data", filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function getNextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// ============ GitHub API 后端（Vercel 生产环境） ============

const REPO_OWNER = "kaiber1983";
const REPO_NAME = "video-portfolio";
const BRANCH = "master";

function hasGithubToken(): boolean {
  return !!process.env.GITHUB_TOKEN;
}

// 从 GitHub 读取 JSON 文件
async function readJsonFromGithub<T>(filename: string): Promise<T[]> {
  // 加时间戳绕过 GitHub CDN 缓存，确保读到最新提交
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${filename}?ref=${BRANCH}&t=${Date.now()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`GitHub 读取失败: ${res.status}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(content) as T[];
}

// 写入 JSON 文件到 GitHub
async function writeJsonToGitHub<T>(filename: string, data: T[], message: string): Promise<void> {
  // 先获取当前文件 SHA（如果存在）
  let sha = "";
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${filename}?ref=${BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (res.ok) {
      const fileData = await res.json();
      sha = fileData.sha;
    }
  } catch {
    // 文件不存在，忽略
  }

  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64");

  const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${filename}`;
  const body: Record<string, string> = {
    message,
    content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub 写入失败: ${res.status} ${err}`);
  }
}

// ============ 作品数据 ============

export function readProjects(): Project[] {
  return readJson<Project>("projects.json");
}

export async function readProjectsRemote(): Promise<Project[]> {
  if (!hasGithubToken()) return readProjects();
  try {
    return await readJsonFromGithub<Project>("projects.json");
  } catch (e) {
    console.error("GitHub 读取作品失败:", e);
    return readProjects();
  }
}

export function writeProjects(projects: Project[]): void {
  writeJson("projects.json", projects);
}

export async function writeProjectsRemote(projects: Project[], message?: string): Promise<void> {
  if (hasGithubToken()) {
    await writeJsonToGitHub("projects.json", projects, message || "更新作品数据");
  } else {
    writeProjects(projects);
  }
}

export function getNextProjectId(projects: Project[]): number {
  return getNextId(projects);
}

// ============ 关于我数据 ============

export function readAbout(): About | null {
  const list = readJson<About>("about.json");
  return list.length > 0 ? list[0] : null;
}

export async function readAboutRemote(): Promise<About | null> {
  if (!hasGithubToken()) return readAbout();
  try {
    const list = await readJsonFromGithub<About>("about.json");
    return list.length > 0 ? list[0] : null;
  } catch (e) {
    console.error("GitHub 读取关于失败:", e);
    return readAbout();
  }
}

export function writeAbout(about: About): void {
  writeJson("about.json", [about]);
}

export async function writeAboutRemote(about: About): Promise<void> {
  if (hasGithubToken()) {
    await writeJsonToGitHub("about.json", [about], "更新关于我信息");
  } else {
    writeAbout(about);
  }
}

// ============ 留言数据 ============

export function readMessages(): ContactMessage[] {
  return readJson<ContactMessage>("messages.json");
}

export async function readMessagesRemote(): Promise<ContactMessage[]> {
  if (!hasGithubToken()) return readMessages();
  try {
    return await readJsonFromGithub<ContactMessage>("messages.json");
  } catch (e) {
    console.error("GitHub 读取留言失败:", e);
    return readMessages();
  }
}

export function writeMessages(messages: ContactMessage[]): void {
  writeJson("messages.json", messages);
}

export async function writeMessagesRemote(messages: ContactMessage[]): Promise<void> {
  if (hasGithubToken()) {
    await writeJsonToGitHub("messages.json", messages, "更新留言数据");
  } else {
    writeMessages(messages);
  }
}

export function getNextMessageId(messages: ContactMessage[]): number {
  return getNextId(messages);
}
