import { userSeeder } from "./userSeeder"

const runSeeder = async () => {
  await userSeeder()
}

runSeeder()
