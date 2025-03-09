"use server"

import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

// User actions
export async function registerUser({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role for registration
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}

export async function createUser({
  name,
  email,
  password,
  role,
}: {
  name: string
  email: string
  password: string
  role: "USER" | "ADMIN"
}) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("User creation error:", error)
    return { error: "Failed to create user" }
  }
}

export async function updateUser({
  id,
  name,
  email,
  password,
  role,
}: {
  id: string
  name: string
  email: string
  password?: string
  role: "USER" | "ADMIN"
}) {
  try {
    const data: any = {
      name,
      email,
      role,
    }

    // Only update password if provided
    if (password) {
      data.password = await hash(password, 10)
    }

    // Update user
    await db.user.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/users")
    revalidatePath(`/users/${id}`)
    return { success: true }
  } catch (error) {
    console.error("User update error:", error)
    return { error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    // Delete user's tasks first
    await db.task.deleteMany({
      where: {
        assignedToId: id,
      },
    })

    // Delete user
    await db.user.delete({
      where: {
        id,
      },
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("User deletion error:", error)
    return { error: "Failed to delete user" }
  }
}

// Task actions
export async function createTask({
  title,
  description,
  dueDate,
  priority,
  status,
  assignedToId,
}: {
  title: string
  description: string
  dueDate: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "PENDING" | "COMPLETED"
  assignedToId: string
}) {
  try {
    await db.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        status,
        assignedToId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Task creation error:", error)
    return { error: "Failed to create task" }
  }
}

export async function updateTask({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  assignedToId,
}: {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "PENDING" | "COMPLETED"
  assignedToId: string
}) {
  try {
    await db.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        dueDate,
        priority,
        status,
        assignedToId,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/tasks/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Task update error:", error)
    return { error: "Failed to update task" }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await db.task.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/tasks/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Task status update error:", error)
    return { error: "Failed to update task status" }
  }
}

export async function updateTaskPriority(id: string, priority: string) {
  try {
    await db.task.update({
      where: {
        id,
      },
      data: {
        priority,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Task priority update error:", error)
    return { error: "Failed to update task priority" }
  }
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Task deletion error:", error)
    return { error: "Failed to delete task" }
  }
}

