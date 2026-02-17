import { getUser } from '@/lib/auth/user'
import Dashboard from '@/components/Dashboard'
import Landing from '@/components/Landing'

export default async function Home() {
  const user = await getUser()

  if (!user) {
    return <Landing />
  }

  return <Dashboard user={user} />
}
