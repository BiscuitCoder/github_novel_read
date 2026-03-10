import { ArrowRight, Github, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            准备好开始了吗？
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl">
            立即下载或克隆这个模板，开始构建您的下一个项目。
            完全免费，开源，并持续维护。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              <Download className="h-5 w-5" />
              下载模板
            </Button>
          </div>

          <div className="mt-12 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur">
            <code className="text-sm font-mono">
              npx create-next-app@latest -e https://github.com/your-template
            </code>
          </div>
        </div>
      </div>
    </section>
  )
}
