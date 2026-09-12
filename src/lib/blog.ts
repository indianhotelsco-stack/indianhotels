import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')
const marked = new Marked()

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  dateISO: string
  keywords: string[]
  destinationSlug?: string
  readMins: number
  content: string
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    dateISO: String(data.dateISO ?? ''),
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    destinationSlug: data.destinationSlug ? String(data.destinationSlug) : undefined,
    readMins: Number(data.readMins ?? 6),
    content,
  }
}

export function getAllBlogPosts(): Omit<BlogPost, 'content'>[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
  return files
    .map(f => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
      const { content: _content, ...rest } = parsePost(f.replace(/\.md$/, ''), raw)
      return rest
    })
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parsePost(slug, fs.readFileSync(filePath, 'utf8'))
}

export function renderBlogMarkdown(content: string): string {
  const result = marked.parse(content)
  return typeof result === 'string' ? result : ''
}
