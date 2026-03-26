"use client"

import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { AspectRatio } from "../ui/aspect-ratio"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import {
  CameraIcon,
  GlassesIcon,
  HardHatIcon,
  InfoIcon,
  ScanFaceIcon,
  VenetianMaskIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { toast } from "sonner"
import { enrollFaceData } from "@/services/enrollments-services"
import { Spinner } from "../ui/spinner"

interface EmployeeData {
  id: string
  name: string
  nip: string
  has_face: boolean
}

interface FaceEnrollmentFormProps {
  enrollment: EmployeeData | null
}

type EnrollmentData = {
  front: string
  left: string
  right: string
  up: string
  down: string
}

export default function FaceEnrollmentForm({
  enrollment,
}: FaceEnrollmentFormProps) {
  const [capturedImages, setCapturedImages] = useState<EnrollmentData>({
    front: "",
    left: "",
    right: "",
    up: "",
    down: "",
  })

  const captureImage = (key: string, value: string) => {
    setCapturedImages((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="flex gap-4">
      <Instructions />
      <Form
        capturedImages={capturedImages}
        captureImage={captureImage}
        enrolledData={enrollment}
      />
      <CapturedImagePreview capturedImages={capturedImages} />
    </div>
  )
}

type FormProps = {
  capturedImages: EnrollmentData
  captureImage: (key: string, value: string) => void
  enrolledData: EmployeeData | null
}

const CAPTURE_STEPS: Record<
  number,
  { label: string; key: string; instruction: string; hint: string }
> = {
  1: {
    label: "Depan",
    key: "front",
    instruction: "Hadapkan wajah Anda ke kamera",
    hint: "Pastikan wajah Anda berada di tengah",
  },
  2: {
    label: "Kiri",
    key: "left",
    instruction: "Palingkan wajah Anda ke kiri",
    hint: "Kepala miring ke kiri sekitar 45°",
  },
  3: {
    label: "Kanan",
    key: "right",
    instruction: "Palingkan wajah Anda ke kanan",
    hint: "Kepala miring ke kanan sekitar 45°",
  },
  4: {
    label: "Atas",
    key: "up",
    instruction: "Tengadahkan kepala ke atas",
    hint: "Arahkan pandangan ke atas",
  },
  5: {
    label: "Bawah",
    key: "down",
    instruction: "Tundukkan kepala ke bawah",
    hint: "Arahkan pandangan ke bawah",
  },
}

function Form({ captureImage, enrolledData, capturedImages }: FormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const webcamRef = useRef<Webcam>(null)

  const isFinishedTakingPicture = currentStep + 1 === 7

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return

    captureImage(CAPTURE_STEPS[currentStep].key, imageSrc)

    // Auto-advance to next capture step (or review)
    setCurrentStep((s) => s + 1)
  }, [currentStep, webcamRef])

  const clearImages = useCallback(() => {
    captureImage("front", "")
    captureImage("left", "")
    captureImage("right", "")
    captureImage("up", "")
    captureImage("down", "")

    setCurrentStep(1)
  }, [captureImage])

  const enrollPicture = async () => {
    try {
      setIsSubmitting(true)

      await enrollFaceData({
        id: enrolledData?.id || "",
        ...capturedImages,
      })

      clearImages()
      toast.success("Wajah berhasil didaftarkan")
    } catch (error: any) {
      toast.error("Gagal mendaftarkan wajah")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-[492px]">
      <CardContent>
        <AspectRatio ratio={1 / 1} className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            className="h-[460px] w-[460px] rotate-y-180 overflow-hidden rounded-md object-cover"
            videoConstraints={{
              width: 100,
              height: 100,
              facingMode: "user",
            }}
          />

          {currentStep < 6 && (
            <div className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-center">
              <Alert className="max-w-md border-amber-200/70 bg-amber-100/70 backdrop-blur-sm dark:border-amber-900 dark:bg-amber-950/70">
                <InfoIcon />
                <AlertTitle className="text-amber-900 dark:text-amber-50">
                  {CAPTURE_STEPS[currentStep].instruction}
                </AlertTitle>
                <AlertDescription className="text-amber-900/80 dark:text-amber-50/80">
                  {CAPTURE_STEPS[currentStep].hint}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <CameraOverlay />
        </AspectRatio>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          className={cn(
            "w-full cursor-pointer",
            !isFinishedTakingPicture ? "hidden" : "flex"
          )}
          onClick={enrollPicture}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <ScanFaceIcon data-icon="inline-start" />
          )}
          Daftarkan wajah
        </Button>

        <Button
          className={cn(
            "w-full cursor-pointer",
            isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
          )}
          onClick={capture}
          disabled={isSubmitting}
        >
          <CameraIcon />
          Ambil gambar
        </Button>

        <Button
          className={cn(
            "w-full cursor-pointer",
            !isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
          )}
          onClick={clearImages}
          variant="outline"
          disabled={isSubmitting}
        >
          Ambil ulang gambar
        </Button>
      </CardFooter>
    </Card>
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

function Instructions() {
  return (
    <Card className="h-max w-[132px]">
      <CardContent className="space-y-4">
        <div className="bg-card-muted">
          <AspectRatio
            ratio={1 / 1}
            className="grid place-items-center rounded-xl bg-muted"
          >
            <GlassesIcon className="h-16 w-16" strokeWidth={1.5} />
          </AspectRatio>

          <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
            Lepaskan kacamata
          </p>
        </div>

        <div className="bg-card-muted">
          <AspectRatio
            ratio={1 / 1}
            className="grid place-items-center rounded-xl bg-muted"
          >
            <HardHatIcon className="h-16 w-16" strokeWidth={1.5} />
          </AspectRatio>

          <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
            Lepaskan topi
          </p>
        </div>

        <div className="bg-card-muted">
          <AspectRatio
            ratio={1 / 1}
            className="grid place-items-center rounded-xl bg-muted"
          >
            <VenetianMaskIcon className="h-16 w-16" strokeWidth={1.5} />
          </AspectRatio>

          <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
            Lepaskan masker
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

type CapturedImagePreviewProps = {
  capturedImages: EnrollmentData
}

function CapturedImagePreview({ capturedImages }: CapturedImagePreviewProps) {
  const isEmpty = Object.values(capturedImages).every((img) => img.length === 0)

  if (isEmpty) return <div className="w-[132px]"></div>

  return (
    <Card className="h-max">
      <CardHeader className="sr-only">
        <CardTitle>Pratinjau</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {capturedImages.front.length > 0 && (
          <PreviewCard imgSrc={capturedImages.front} />
        )}
        {capturedImages.left.length > 0 && (
          <PreviewCard imgSrc={capturedImages.left} />
        )}
        {capturedImages.right.length > 0 && (
          <PreviewCard imgSrc={capturedImages.right} />
        )}
        {capturedImages.up.length > 0 && (
          <PreviewCard imgSrc={capturedImages.up} />
        )}
        {capturedImages.down.length > 0 && (
          <PreviewCard imgSrc={capturedImages.down} />
        )}
      </CardContent>
    </Card>
  )
}

type PreviewCardProps = {
  imgSrc: string
}

function PreviewCard({ imgSrc }: PreviewCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-25 w-25 p-0">
          <img
            src={imgSrc}
            alt=""
            className="h-full w-full rounded-md object-cover"
          />
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Foto</DialogTitle>
        </DialogHeader>
        <AspectRatio ratio={1 / 1}>
          <img src={imgSrc} alt="" className="h-full w-full object-cover" />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  )
}
