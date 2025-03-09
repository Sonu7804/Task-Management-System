"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TaskPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function TaskPagination({ currentPage, totalPages, onPageChange }: TaskPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-sm">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

