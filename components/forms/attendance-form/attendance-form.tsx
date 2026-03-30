"use client"

import { useState } from "react"

import { Card, CardHeader, CardTitle } from "../../ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "../../ui/separator"
import FormStepper from "./form-stepper"
import RfidStep from "./rfid-step"
import ShiftConfirmationStep from "./shift-confirmation-step"
import FaceVerificationStep from "./face-verification-step"

import { useAttendanceStore } from "@/stores/attendance-store"
import { cn } from "@/lib/utils"

export default function AttendanceForm() {
  const [formCurrentStep, setFormCurrentStep] = useState<number>(0)

  const formRenderer = {
    0: <RfidStep setFormCurrentStep={setFormCurrentStep} />,
    1: <ShiftConfirmationStep setFormCurrentStep={setFormCurrentStep} />,
    2: <FaceVerificationStep setFormCurrentStep={setFormCurrentStep} />,
  }

  return (
    <>
      <Card className="relative z-10 h-full w-full max-w-lg">
        <CardHeader className="gap-4">
          <CardTitle>Absensi</CardTitle>
          <Separator />

          <FormStepper formCurrentStep={formCurrentStep} />
        </CardHeader>

        {formRenderer[formCurrentStep as keyof typeof formRenderer]}
      </Card>

      <LoadingIndicator />
    </>
  )
}

function LoadingIndicator() {
  const isLoading = useAttendanceStore((s) => s.isLoading)

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 z-1 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 animate-spin opacity-5 duration-1000 fill-mode-forwards dark:opacity-10",
        !isLoading && "paused"
      )}
    >
      <AspectRatio ratio={1 / 1} className="relative">
        <div className="flex h-full w-full items-center justify-center">
          <img src="/assets/images/attendance-loading-indicator.png" alt="" />
        </div>
      </AspectRatio>
    </div>
  )
}
