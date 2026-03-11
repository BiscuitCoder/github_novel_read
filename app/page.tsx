
import { Suspense } from 'react'
import { Bookshelf } from "@/components/bookshelf"
import { Loader2 } from 'lucide-react'

export default function Home() {
  return (
    <main className="w-full min-h-screen max-w-screen-2xl mx-auto bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <Bookshelf />
      </Suspense>
    </main>
  )
}
