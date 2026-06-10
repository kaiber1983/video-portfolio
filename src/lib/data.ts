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

// ============ 通用工具 ============

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

const PROJECTS_FILE = "projects.json";

export function readProjects(): Project[] {
  return readJson<Project>(PROJECTS_FILE);
}

export function writeProjects(projects: Project[]): void {
  writeJson(PROJECTS_FILE, projects);
}

export function getNextProjectId(projects: Project[]): number {
  return getNextId(projects);
}

// ============ 关于我数据 ============

const ABOUT_FILE = "about.json";

export function readAbout(): About | null {
  const list = readJson<About>(ABOUT_FILE);
  return list.length > 0 ? list[0] : null;
}

export function writeAbout(about: About): void {
  writeJson(ABOUT_FILE, [about]);
}

// ============ 留言数据 ============

const MESSAGES_FILE = "messages.json";

export function readMessages(): ContactMessage[] {
  return readJson<ContactMessage>(MESSAGES_FILE);
}

export function writeMessages(messages: ContactMessage[]): void {
  writeJson(MESSAGES_FILE, messages);
}

export function getNextMessageId(messages: ContactMessage[]): number {
  return getNextId(messages);
}
