"use client"
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomSpinnerProps { className?: string }
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

const CustomSpinner = ({ className }: CustomSpinnerProps) => {
  return (
    <div className="flex items-center gap-4">
      <Spinner className={`${className}`} />
    </div>
  )
}

export default CustomSpinner
