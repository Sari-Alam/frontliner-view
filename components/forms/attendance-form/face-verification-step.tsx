"use client"

import { memo, useRef, useState } from "react"
import { InfoIcon } from "lucide-react"
import Webcam from "react-webcam"
import { toast } from "sonner"
import { useAttendanceStore } from "@/stores/attendance-store"
import { useShallow } from "zustand/shallow"
import { format } from "date-fns"

import { CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { AspectRatio } from "../../ui/aspect-ratio"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"

type Props = {
  setFormCurrentStep: (step: number) => void
}

function FaceVerificationStep({ setFormCurrentStep }: Props) {
  const [subStep, setSubStep] = useState<number>(0)

  const formSubStepRenderer = {
    0: <SubStep1 setSubStep={setSubStep} />,
    1: (
      <FinalConfirmationStep
        setFormCurrentStep={setFormCurrentStep}
        setSubStep={setSubStep}
      />
    ),
  }

  return formSubStepRenderer[subStep as keyof typeof formSubStepRenderer]
}

type SubStep1Props = {
  setSubStep: (step: number) => void
}

function SubStep1({ setSubStep }: SubStep1Props) {
  const webcamRef = useRef<Webcam>(null)

  const captureAndRecord = async () => {
    try {
      const picture = webcamRef.current?.getScreenshot()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <CardContent>
        <AspectRatio ratio={1 / 1} className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            className="h-[480px] w-[480px] rotate-y-180 overflow-hidden rounded-md object-cover"
            videoConstraints={{
              width: 100,
              height: 100,
              facingMode: "user",
            }}
          />

          <div className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-center">
            <Alert className="max-w-md border-amber-200/70 bg-amber-100/70 backdrop-blur-sm dark:border-amber-900 dark:bg-amber-950/70">
              <InfoIcon />
              <AlertTitle className="text-amber-900 dark:text-amber-50">
                Mohon lepas kacamata hitam, masker, atau topi agar wajah
                terlihat jelas
              </AlertTitle>
              <AlertDescription className="text-amber-900/80 dark:text-amber-50/80">
                Pastikan pencahayaan cukup dan tidak ada objek yang menghalangi
                wajah
              </AlertDescription>
            </Alert>
          </div>

          <CameraOverlay />
        </AspectRatio>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        <Button
          type="submit"
          form="rfid-form"
          className="flex-1 cursor-pointer"
          onClick={() => setSubStep(1)}
        >
          Catat Kehadiran
        </Button>
      </CardFooter>
    </>
  )
}

type FinalConfirmationStepProps = {
  setFormCurrentStep: (step: number) => void
  setSubStep: (step: number) => void
}

function FinalConfirmationStep({
  setFormCurrentStep,
  setSubStep,
}: FinalConfirmationStepProps) {
  const { employeeData, clearData } = useAttendanceStore(
    useShallow((s) => ({
      employeeData: s.employeeData,
      clearData: s.clearData,
    }))
  )

  const handleBackButton = () => {
    setSubStep(0)
  }

  const handleSubmitButton = () => {
    clearData()
    setFormCurrentStep(0)
  }

  return (
    <>
      <CardContent>
        <div className="mt-4 flex flex-col items-center gap-4 px-40">
          <p className="text-center text-sm text-nowrap text-muted-foreground">
            Pastikan data sudah benar!
          </p>

          <AspectRatio ratio={1 / 1}>
            <img
              src="/assets/images/user-star.png"
              alt="RFID Placeholder"
              className="h-full w-full object-contain dark:opacity-50"
            />
          </AspectRatio>
        </div>

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-6 rounded-lg border border-card-foreground/10 bg-card-foreground/5 p-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">Nama</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {employeeData?.name}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">NIP</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {employeeData?.nip}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">Departemen</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {employeeData?.departement.name}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">Jabatan</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {employeeData?.position.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 rounded-lg border border-card-foreground/10 bg-card-foreground/5 p-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">Waktu absensi</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {format(new Date(), "dd MMMM yyyy HH:mm:ss")}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">
                Waktu terlambat check-in
              </span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {format(new Date(), "dd MMMM yyyy HH:mm:ss")}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs opacity-75">Waktu early check-out</span>
              <p className="overflow-hidden text-sm font-medium text-ellipsis">
                {format(new Date(), "dd MMMM yyyy HH:mm:ss")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex gap-2">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={handleBackButton}
        >
          Bukan saya, scan ulang
        </Button>
        <Button className="flex-1 cursor-pointer" onClick={handleSubmitButton}>
          Catat kehadiran
        </Button>
      </CardFooter>
    </>
  )
}

function CameraOverlay() {
  return (
    <img
      src="/assets/images/camera-feed-cover.png"
      alt=""
      aria-hidden="true"
      className="absolute top-0 left-0 z-10 h-full w-full"
    />
  )
}

export default memo(FaceVerificationStep)
