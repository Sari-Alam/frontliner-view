"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { memo } from "react"

import { Separator } from "../../ui/separator"

type Props = {
  formCurrentStep: number
}

function FormStepper({ formCurrentStep }: Props) {
  return (
    <div className="relative flex items-center justify-between">
      <Step
        step={1}
        title="Langkah 1"
        description="RFID"
        isActive={formCurrentStep === 0}
        isCompleted={formCurrentStep > 0}
      />
      <Step
        step={2}
        title="Langkah 2"
        description="Shift"
        isActive={formCurrentStep === 1}
        isCompleted={formCurrentStep > 1}
      />
      <Step
        step={3}
        title="Langkah 3"
        description="Verifikasi Wajah"
        isActive={formCurrentStep === 2}
        isCompleted={formCurrentStep > 2}
      />

      <Separator className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}

type StepProps = {
  step: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
}

function Step({ step, title, description, isActive, isCompleted }: StepProps) {
  const isStepActive = isActive || isCompleted

  return (
    <div
      className={cn(
        "relative z-10 flex gap-2 rounded-full border border-border bg-muted p-1 pr-4",
        isStepActive &&
          "border-teal-600 bg-teal-500 dark:border-teal-900 dark:bg-teal-800"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm text-card-foreground">
        {isCompleted ? (
          <CheckIcon className="text-teal-500 dark:text-teal-700" />
        ) : (
          step
        )}
      </div>
      <div>
        <p className="text-left text-sm text-card-foreground">{title}</p>
        <p className="text-left text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default memo(FormStepper)
