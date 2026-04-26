import Navbar from '#/components/navbar/navbar'
import { verifySession } from '#/utils/session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const hasSession = await verifySession()

    if (!hasSession) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-[#f0eef2] h-screen'>
      <div className='max-w-7xl mx-auto'>
        <Navbar />

        <main className='px-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
