export async function verifySession() {
  const res = await fetch('http://localhost:4000/api/me', {
    credentials: "include"
  })

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("error", data);
    return false;
  }

  console.log("data", data);

  return true
}
