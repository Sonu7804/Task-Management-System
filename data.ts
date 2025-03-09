import { db } from "@/lib/db"

export async function getTasks() {
  try {
    const tasks = await db.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return tasks
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return []
  }
}

export async function getTaskById(id: string) {
  try {
    const task = await db.task.findUnique({
      where: {
        id,
      },
    })

    return task
  } catch (error) {
    console.error(`Failed to fetch task with id ${id}:`, error)
    return null
  }
}

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}:`, error)
    return null
  }
}

