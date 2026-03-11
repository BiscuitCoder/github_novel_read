import Link from "next/link"
import { Github, BookOpen } from "lucide-react"

const REPO_URL = "https://github.com/BiscuitCoder/github_novel_read"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container max-w-screen-2xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-medium">KK 科幻空间</span>
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>BiscuitCoder/github_novel_read</span>
          </a>
        </div>
        <div className="mt-4 pt-4 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>输入带 txt 的仓库地址，自动生成分类与阅读页面 · © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
