"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { updateTaskStatus } from "@/lib/actions"

interface UpdateStatusButtonProps {
  id: string
  currentStatus: string
}

export default function UpdateStatusButton({ id, currentStatus }: UpdateStatusButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isCompleted = currentStatus === "COMPLETED"
  const newStatus = isCompleted ? "PENDING" : "COMPLETED"

  const handleUpdateStatus = async () => {
    setIsLoading(true)

    try {
      await updateTaskStatus(id, newStatus)
      router.refresh()
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to update task status:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleUpdateStatus} disabled={isLoading} variant={isCompleted ? "outline" : "default"}>
      {isLoading ? (
        "Updating..."
      ) : isCompleted ? (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Mark as Pending
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Completed
        </>
      )}
    </Button>
  )
}

