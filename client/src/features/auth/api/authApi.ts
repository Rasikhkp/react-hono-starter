export async function fetchSession() {
  const res = await fetch('/api/me', {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Unauthorized')
  }

  return res.json()
}
