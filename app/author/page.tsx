import { redirect } from 'next/navigation'

export default async function AuthorPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; repo?: string }>
}) {
  const params = await searchParams
  const author = params.name || ''
  const repo = params.repo || ''

  const query = new URLSearchParams()
  if (author) query.set('author', author)
  if (repo) query.set('repo', repo)

  redirect(`/?${query.toString()}`)
}
