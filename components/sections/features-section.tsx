import {
  Layers,
  Palette,
  Zap,
  Shield,
  Smartphone,
  Package,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    icon: Layers,
    title: "50+ 组件",
    description:
      "包含按钮、表单、对话框、表格等 50 多个精心设计的 UI 组件。",
  },
  {
    icon: Palette,
    title: "深色模式",
    description:
      "内置深色模式支持，一键切换，自动跟随系统设置。",
  },
  {
    icon: Zap,
    title: "静态导出",
    description:
      "配置好的静态导出模式，可部署到任何静态托管服务。",
  },
  {
    icon: Shield,
    title: "TypeScript",
    description:
      "100% TypeScript 编写，提供完整的类型安全和智能提示。",
  },
  {
    icon: Smartphone,
    title: "响应式设计",
    description:
      "所有组件都经过响应式设计，完美适配各种屏幕尺寸。",
  },
  {
    icon: Package,
    title: "常用库集成",
    description:
      "集成了 react-hook-form、zod、date-fns 等常用工具库。",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">功能特性</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            精心打造的现代化模板，满足您的各种开发需求
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
