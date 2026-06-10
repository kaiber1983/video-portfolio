import fs from "fs";
import path from "path";

// ============ 类型定义 ============

/** 作品数据类型 */
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

/** 关于我数据类型 */
export interface About {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string;
  socialJson: string;
}

/** 留言数据类型 */
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============ 数据后端选择 ============

// Vercel 生产环境使用 KV 存储，本地开发使用 JSON 文件
let kv: typeof import("@vercel/kv").kv | null = null;

async function getKv() {
  if (kv) return kv;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const mod = await import("@vercel/kv");
    kv = mod.kv;
    return kv;
  }
  return null;
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

// ============ 作品数据 ============

const PROJECTS_KEY = "projects";

export function readProjects(): Project[] {
  return readJson<Project>("projects.json");
}

export async function readProjectsRemote(): Promise<Project[]> {
  const client = await getKv();
  if (!client) return readProjects();
  const data = await client.get<string>(PROJECTS_KEY);
  if (!data) return readProjects();
  try {
    return JSON.parse(data) as Project[];
  } catch {
    return readProjects();
  }
}

// 首页使用这个异步版本
export { readProjectsRemote as readProjectsAsync };

export function writeProjects(projects: Project[]): void {
  writeJson("projects.json", projects);
}

export async function writeProjectsRemote(projects: Project[]): Promise<void> {
  writeProjects(projects);
  const client = await getKv();
  if (client) {
    await client.set(PROJECTS_KEY, JSON.stringify(projects));
  }
}

export function getNextProjectId(projects: Project[]): number {
  return getNextId(projects);
}

// ============ 关于我数据 ============

const ABOUT_KEY = "about";

export function readAbout(): About | null {
  const list = readJson<About>("about.json");
  return list.length > 0 ? list[0] : null;
}

export async function readAboutRemote(): Promise<About | null> {
  const client = await getKv();
  if (!client) return readAbout();
  const data = await client.get<string>(ABOUT_KEY);
  if (!data) return readAbout();
  try {
    return JSON.parse(data) as About;
  } catch {
    return readAbout();
  }
}

export function writeAbout(about: About): void {
  writeJson("about.json", [about]);
}

export async function writeAboutRemote(about: About): Promise<void> {
  writeAbout(about);
  const client = await getKv();
  if (client) {
    await client.set(ABOUT_KEY, JSON.stringify(about));
  }
}

// ============ 留言数据 ============

const MESSAGES_KEY = "messages";

export function readMessages(): ContactMessage[] {
  return readJson<ContactMessage>("messages.json");
}

export async function readMessagesRemote(): Promise<ContactMessage[]> {
  const client = await getKv();
  if (!client) return readMessages();
  const data = await client.get<string>(MESSAGES_KEY);
  if (!data) return readMessages();
  try {
    return JSON.parse(data) as ContactMessage[];
  } catch {
    return readMessages();
  }
}

export function writeMessages(messages: ContactMessage[]): void {
  writeJson("messages.json", messages);
}

export async function writeMessagesRemote(messages: ContactMessage[]): Promise<void> {
  writeMessages(messages);
  const client = await getKv();
  if (client) {
    await client.set(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function getNextMessageId(messages: ContactMessage[]): number {
  return getNextId(messages);
}
