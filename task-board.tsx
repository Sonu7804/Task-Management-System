"use client"

import { useState } from "react"
import type { Task, User } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { updateTaskPriority } from "@/lib/actions"
import Link from "next/link"
import TaskPagination from "./task-pagination"

const ITEMS_PER_PAGE = 5

interface TaskBoardProps {
  tasks: Task[]
  users: User[]
  currentUser: {
    id: string
    role: string
  }
}

export default function TaskBoard({ tasks, users, currentUser }: TaskBoardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [localTasks, setLocalTasks] = useState(tasks)

  // Filter tasks based on user role
  const filteredTasks =
    currentUser.role === "ADMIN" ? localTasks : localTasks.filter((task) => task.assignedToId === currentUser.id)

  // Group tasks by priority
  const highPriorityTasks = filteredTasks.filter((task) => task.priority === "HIGH")
  const mediumPriorityTasks = filteredTasks.filter((task) => task.priority === "MEDIUM")
  const lowPriorityTasks = filteredTasks.filter((task) => task.priority === "LOW")

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const paginatedHighTasks = highPriorityTasks.slice(startIndex, endIndex)
  const paginatedMediumTasks = mediumPriorityTasks.slice(startIndex, endIndex)
  const paginatedLowTasks = lowPriorityTasks.slice(startIndex, endIndex)

  const totalPages = Math.ceil(
    Math.max(highPriorityTasks.length, mediumPriorityTasks.length, lowPriorityTasks.length) / ITEMS_PER_PAGE,
  )

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    // Update task priority
    const newPriority = destination.droppableId
    const taskId = draggableId

    // Optimistically update UI
    setLocalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, priority: newPriority as "HIGH" | "MEDIUM" | "LOW" } : task)),
    )

    // Update in database
    await updateTaskPriority(taskId, newPriority)
  }

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Priority Column */}
          <div>
            <Card className="border-t-4 border-t-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">High Priority</CardTitle>
              </CardHeader>
              <Droppable droppableId="HIGH">
                {(provided) => (
                  <CardContent className="min-h-[300px]" ref={provided.innerRef} {...provided.droppableProps}>
                    {paginatedHighTasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No high priority tasks</div>
                    ) : (
                      <div className="space-y-3">
                        {paginatedHighTasks.map((task, index) => (
                          <TaskItem key={task.id} task={task} index={index} users={users} />
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>

          {/* Medium Priority Column */}
          <div>
            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Medium Priority</CardTitle>
              </CardHeader>
              <Droppable droppableId="MEDIUM">
                {(provided) => (
                  <CardContent className="min-h-[300px]" ref={provided.innerRef} {...provided.droppableProps}>
                    {paginatedMediumTasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No medium priority tasks</div>
                    ) : (
                      <div className="space-y-3">
                        {paginatedMediumTasks.map((task, index) => (
                          <TaskItem key={task.id} task={task} index={index} users={users} />
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>

          {/* Low Priority Column */}
          <div>
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Low Priority</CardTitle>
              </CardHeader>
              <Droppable droppableId="LOW">
                {(provided) => (
                  <CardContent className="min-h-[300px]" ref={provided.innerRef} {...provided.droppableProps}>
                    {paginatedLowTasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No low priority tasks</div>
                    ) : (
                      <div className="space-y-3">
                        {paginatedLowTasks.map((task, index) => (
                          <TaskItem key={task.id} task={task} index={index} users={users} />
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>
        </div>
      </DragDropContext>

      <TaskPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

function TaskItem({ task, index, users }: { task: Task; index: number; users: User[] }) {
  const assignedUser = users.find((user) => user.id === task.assignedToId)

  const statusColor = task.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Link href={`/tasks/${task.id}`}>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="p-3 bg-card rounded-md border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{task.title}</h3>
              <Badge className={statusColor}>{task.status}</Badge>
            </div>

            <div className="text-sm text-muted-foreground line-clamp-2 mb-2">{task.description}</div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>

              {assignedUser && (
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {assignedUser.name.charAt(0)}
                  </div>
                  <span>{assignedUser.name}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      )}
    </Draggable>
  )
}

