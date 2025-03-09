export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: string
  priority: string
  assignedToId: string
  createdAt: string
  updatedAt: string
}

