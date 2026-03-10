import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Next.js 16 + React 19
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl">
            现代化的 Next.js{" "}
            <span className="text-primary">静态模板</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            一个功能完善的 Next.js 模板项目，包含 50+ 精选组件、深色模式支持、
            完整的类型安全，以及静态导出配置，开箱即用。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              开始使用
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              查看文档
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">50+</span>
              <span className="text-sm">精选组件</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">100%</span>
              <span className="text-sm">TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">静态</span>
              <span className="text-sm">导出支持</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
