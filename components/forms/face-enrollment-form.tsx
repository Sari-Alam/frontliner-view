"use client"

import { useCallback, useEffect, useRef, useState, memo } from "react"
import Webcam from "react-webcam"
import * as faceapi from "face-api.js"
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
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { toast } from "sonner"
import { setEmployeeFace } from "@/services/enrollments-services"
import { Spinner } from "../ui/spinner"
import { useAttendanceStore } from "@/stores/attendance-store"

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
  descriptors: Record<string, number[]>
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

export default function FaceEnrollmentForm({
  enrollment,
}: FaceEnrollmentFormProps) {
  const setEmployeeData = useAttendanceStore((s) => s.setEmployeeData)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [capturedImages, setCapturedImages] = useState<EnrollmentData>({
    front: "",
    left: "",
    right: "",
    up: "",
    down: "",
    descriptors: {},
  })

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/model/weights"
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
      } catch (err) {
        toast.error("Gagal memuat model AI. Periksa folder /public/models")
      }
    }
    loadModels()
  }, [])

  const captureImage = (key: string, value: string, descriptor: number[]) => {
    setCapturedImages((prev) => ({
      ...prev,
      [key]: value,
      descriptors: { ...prev.descriptors, [key]: descriptor },
    }))
  }

  if (!modelsLoaded) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse text-muted-foreground">
          Memuat AI Engine...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full items-center justify-center gap-4">
      <Instructions />
      <Form
        capturedImages={capturedImages}
        captureImage={captureImage}
        enrolledData={enrollment}
        setCapturedImages={setCapturedImages}
      />
      <CapturedImagePreview capturedImages={capturedImages} />
    </div>
  )
}

function Form({
  captureImage,
  enrolledData,
  capturedImages,
  setCapturedImages,
}: any) {
  const setEmployeeData = useAttendanceStore((s) => s.setEmployeeData)

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const webcamRef = useRef<Webcam>(null)
  const isFinishedTakingPicture = currentStep === 6

  const capture = useCallback(async () => {
    if (!webcamRef.current?.video) return

    try {
      setIsProcessing(true)
      const video = webcamRef.current.video

      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        toast.error("Wajah tidak terdeteksi. Silakan sesuaikan posisi Anda.")
        return
      }

      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        captureImage(
          CAPTURE_STEPS[currentStep].key,
          imageSrc,
          Array.from(detection.descriptor)
        )
        setCurrentStep((s) => s + 1)
      }
    } catch (error) {
      toast.error("Gagal memproses gambar.")
    } finally {
      setIsProcessing(false)
    }
  }, [currentStep, captureImage])

  const clearImages = () => {
    setCapturedImages({
      front: "",
      left: "",
      right: "",
      up: "",
      down: "",
      descriptors: {},
    })
    setCurrentStep(1)
  }

  const enrollPicture = async () => {
    try {
      setIsSubmitting(true)

      // Check if we actually have the descriptors
      if (Object.keys(capturedImages.descriptors).length < 5) {
        toast.error("Mohon lengkapi semua 5 posisi wajah.")
        return
      }

      // Prepare the payload: sending the MATH, not the images
      const payload = {
        // We send the descriptors (arrays of 128 numbers)
        front: capturedImages.descriptors.front,
        left: capturedImages.descriptors.left,
        right: capturedImages.descriptors.right,
        up: capturedImages.descriptors.up,
        down: capturedImages.descriptors.down,

        // OPTIONAL: Keep images only if your server needs them for a profile preview
        // image_front: capturedImages.front,
      }

      const data = await setEmployeeFace(enrolledData?.nip || "", payload)
      console.log(data)
      setEmployeeData(data)

      toast.success("Wajah berhasil didaftarkan")
      clearImages()
    } catch (error: any) {
      console.error("Enrollment Error:", error)
      toast.error("Gagal mendaftarkan data descriptor ke server")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardContent className="p-6">
        <AspectRatio
          ratio={16 / 11}
          className="relative overflow-hidden rounded-md bg-black"
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="h-full w-full rotate-y-180 object-cover"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          />

          {currentStep < 6 && (
            <div className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-center">
              <Alert className="max-w-md border-amber-200/70 bg-amber-100/70 backdrop-blur-sm">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>
                  {CAPTURE_STEPS[currentStep].instruction}
                </AlertTitle>
                <AlertDescription>
                  {CAPTURE_STEPS[currentStep].hint}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <CameraOverlay />
        </AspectRatio>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 p-6">
        <Button
          className={cn("w-full", !isFinishedTakingPicture ? "hidden" : "flex")}
          onClick={enrollPicture}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : <ScanFaceIcon className="mr-2" />}
          Simpan Data Wajah
        </Button>

        <Button
          className={cn(
            "w-full",
            isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
          )}
          onClick={capture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <CameraIcon className="mr-2" />
          )}
          {isProcessing ? "Menganalisa..." : "Ambil Gambar"}
        </Button>

        <Button
          className={cn(
            "w-full",
            !isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
          )}
          onClick={clearImages}
          variant="outline"
        >
          Ulangi Proses
        </Button>
      </CardFooter>
    </Card>
  )
}

function CameraOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="h-3/4 w-1/2 rounded-[100px] border-2 border-dashed border-white/30" />
    </div>
  )
}

function Instructions() {
  return (
    <Card className="h-max w-[140px] space-y-4 p-2">
      <InstructionItem Icon={GlassesIcon} label="Lepas Kacamata" />
      <InstructionItem Icon={HardHatIcon} label="Lepas Topi" />
      <InstructionItem Icon={VenetianMaskIcon} label="Lepas Masker" />
    </Card>
  )
}

function InstructionItem({ Icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid h-16 w-16 place-items-center rounded-xl bg-muted">
        <Icon className="h-8 w-8" />
      </div>
      <p className="text-center text-[10px] font-medium text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

function CapturedImagePreview({ capturedImages }: any) {
  const steps = ["front", "left", "right", "up", "down"]
  const hasImages = steps.some((s) => capturedImages[s])

  if (!hasImages) return <div className="w-[132px]" />

  return (
    <Card className="h-max space-y-2 p-2">
      {steps.map(
        (step) =>
          capturedImages[step] && (
            <PreviewCard key={step} imgSrc={capturedImages[step]} />
          )
      )}
    </Card>
  )
}

function PreviewCard({ imgSrc }: { imgSrc: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-20 w-20 overflow-hidden border p-0"
        >
          <img
            src={imgSrc}
            className="h-full w-full object-cover"
            alt="preview"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <img src={imgSrc} className="w-full rounded-lg" alt="full preview" />
      </DialogContent>
    </Dialog>
  )
}

// "use client"

// import { useCallback, useEffect, useRef, useState } from "react"
// import Webcam from "react-webcam"
// import { cn } from "@/lib/utils"

// import { Button } from "../ui/button"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card"
// import { AspectRatio } from "../ui/aspect-ratio"
// import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
// import {
//   CameraIcon,
//   GlassesIcon,
//   HardHatIcon,
//   InfoIcon,
//   ScanFaceIcon,
//   VenetianMaskIcon,
// } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog"
// import { toast } from "sonner"
// import { setEmployeeFace } from "@/services/enrollments-services"
// import { Spinner } from "../ui/spinner"

// interface EmployeeData {
//   id: string
//   name: string
//   nip: string
//   has_face: boolean
// }

// interface FaceEnrollmentFormProps {
//   enrollment: EmployeeData | null
// }

// type EnrollmentData = {
//   front: string
//   left: string
//   right: string
//   up: string
//   down: string
// }

// export default function FaceEnrollmentForm({
//   enrollment,
// }: FaceEnrollmentFormProps) {
//   const [capturedImages, setCapturedImages] = useState<EnrollmentData>({
//     front: "",
//     left: "",
//     right: "",
//     up: "",
//     down: "",
//   })

//   const captureImage = (key: string, value: string) => {
//     setCapturedImages((prev) => ({
//       ...prev,
//       [key]: value,
//     }))
//   }

//   return (
//     <div className="mx-auto flex w-full items-center justify-center gap-4">
//       <Instructions />
//       <Form
//         capturedImages={capturedImages}
//         captureImage={captureImage}
//         enrolledData={enrollment}
//       />
//       <CapturedImagePreview capturedImages={capturedImages} />
//     </div>
//   )
// }

// type FormProps = {
//   capturedImages: EnrollmentData
//   captureImage: (key: string, value: string) => void
//   enrolledData: EmployeeData | null
// }

// const CAPTURE_STEPS: Record<
//   number,
//   { label: string; key: string; instruction: string; hint: string }
// > = {
//   1: {
//     label: "Depan",
//     key: "front",
//     instruction: "Hadapkan wajah Anda ke kamera",
//     hint: "Pastikan wajah Anda berada di tengah",
//   },
//   2: {
//     label: "Kiri",
//     key: "left",
//     instruction: "Palingkan wajah Anda ke kiri",
//     hint: "Kepala miring ke kiri sekitar 45°",
//   },
//   3: {
//     label: "Kanan",
//     key: "right",
//     instruction: "Palingkan wajah Anda ke kanan",
//     hint: "Kepala miring ke kanan sekitar 45°",
//   },
//   4: {
//     label: "Atas",
//     key: "up",
//     instruction: "Tengadahkan kepala ke atas",
//     hint: "Arahkan pandangan ke atas",
//   },
//   5: {
//     label: "Bawah",
//     key: "down",
//     instruction: "Tundukkan kepala ke bawah",
//     hint: "Arahkan pandangan ke bawah",
//   },
// }

// function Form({ captureImage, enrolledData, capturedImages }: FormProps) {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const webcamRef = useRef<Webcam>(null)

//   const isFinishedTakingPicture = currentStep + 1 === 7

//   const capture = useCallback(() => {
//     console.log(webcamRef.current)

//     const imageSrc = webcamRef.current?.getScreenshot()
//     if (!imageSrc) return

//     captureImage(CAPTURE_STEPS[currentStep].key, imageSrc)

//     // Auto-advance to next capture step (or review)
//     setCurrentStep((s) => s + 1)
//   }, [currentStep, webcamRef])

//   const clearImages = useCallback(() => {
//     captureImage("front", "")
//     captureImage("left", "")
//     captureImage("right", "")
//     captureImage("up", "")
//     captureImage("down", "")

//     setCurrentStep(1)
//   }, [captureImage])

//   const enrollPicture = async () => {
//     try {
//       setIsSubmitting(true)

//       await setEmployeeFace({
//         id: enrolledData?.id || "",
//         ...capturedImages,
//       })

//       clearImages()
//       toast.success("Wajah berhasil didaftarkan")
//     } catch (error: any) {
//       toast.error("Gagal mendaftarkan wajah")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-5xl">
//       <CardContent>
//         <AspectRatio ratio={16 / 11} className="relative">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             screenshotQuality={0.85}
//             className="h-[680px] w-[992px] rotate-y-180 overflow-hidden rounded-md object-cover"
//             videoConstraints={{
//               width: 400,
//               height: 400,
//               facingMode: "user",
//             }}
//           />

//           {currentStep < 6 && (
//             <div className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-center">
//               <Alert className="max-w-md border-amber-200/70 bg-amber-100/70 backdrop-blur-sm dark:border-amber-900 dark:bg-amber-950/70">
//                 <InfoIcon />
//                 <AlertTitle className="text-amber-900 dark:text-amber-50">
//                   {CAPTURE_STEPS[currentStep].instruction}
//                 </AlertTitle>
//                 <AlertDescription className="text-amber-900/80 dark:text-amber-50/80">
//                   {CAPTURE_STEPS[currentStep].hint}
//                 </AlertDescription>
//               </Alert>
//             </div>
//           )}

//           <CameraOverlay />
//         </AspectRatio>
//       </CardContent>

//       <CardFooter className="flex flex-col gap-2">
//         <Button
//           className={cn(
//             "w-full cursor-pointer",
//             !isFinishedTakingPicture ? "hidden" : "flex"
//           )}
//           onClick={enrollPicture}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <Spinner data-icon="inline-start" />
//           ) : (
//             <ScanFaceIcon data-icon="inline-start" />
//           )}
//           Daftarkan wajah
//         </Button>

//         <Button
//           className={cn(
//             "w-full cursor-pointer",
//             isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
//           )}
//           onClick={capture}
//           disabled={isSubmitting}
//         >
//           <CameraIcon />
//           Ambil gambar
//         </Button>

//         <Button
//           className={cn(
//             "w-full cursor-pointer",
//             !isFinishedTakingPicture || isSubmitting ? "hidden" : "flex"
//           )}
//           onClick={clearImages}
//           variant="outline"
//           disabled={isSubmitting}
//         >
//           Ambil ulang gambar
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// function CameraOverlay() {
//   return (
//     <img
//       src="/assets/images/camera-feed-cover.png"
//       alt=""
//       aria-hidden="true"
//       className="absolute top-0 left-0 z-10 h-full w-full"
//     />
//   )
// }

// function Instructions() {
//   return (
//     <Card className="mt-10 h-max w-[132px]">
//       <CardContent className="space-y-4">
//         <div className="bg-card-muted">
//           <AspectRatio
//             ratio={1 / 1}
//             className="grid place-items-center rounded-xl bg-muted"
//           >
//             <GlassesIcon className="h-16 w-16" strokeWidth={1.5} />
//           </AspectRatio>

//           <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
//             Lepaskan kacamata
//           </p>
//         </div>

//         <div className="bg-card-muted">
//           <AspectRatio
//             ratio={1 / 1}
//             className="grid place-items-center rounded-xl bg-muted"
//           >
//             <HardHatIcon className="h-16 w-16" strokeWidth={1.5} />
//           </AspectRatio>

//           <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
//             Lepaskan topi
//           </p>
//         </div>

//         <div className="bg-card-muted">
//           <AspectRatio
//             ratio={1 / 1}
//             className="grid place-items-center rounded-xl bg-muted"
//           >
//             <VenetianMaskIcon className="h-16 w-16" strokeWidth={1.5} />
//           </AspectRatio>

//           <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
//             Lepaskan masker
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// type CapturedImagePreviewProps = {
//   capturedImages: EnrollmentData
// }

// function CapturedImagePreview({ capturedImages }: CapturedImagePreviewProps) {
//   const isEmpty = Object.values(capturedImages).every((img) => img.length === 0)

//   if (isEmpty) return <div className="w-[132px]"></div>

//   return (
//     <Card className="h-max">
//       <CardHeader className="sr-only">
//         <CardTitle>Pratinjau</CardTitle>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-2">
//         {capturedImages.front.length > 0 && (
//           <PreviewCard imgSrc={capturedImages.front} />
//         )}
//         {capturedImages.left.length > 0 && (
//           <PreviewCard imgSrc={capturedImages.left} />
//         )}
//         {capturedImages.right.length > 0 && (
//           <PreviewCard imgSrc={capturedImages.right} />
//         )}
//         {capturedImages.up.length > 0 && (
//           <PreviewCard imgSrc={capturedImages.up} />
//         )}
//         {capturedImages.down.length > 0 && (
//           <PreviewCard imgSrc={capturedImages.down} />
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// type PreviewCardProps = {
//   imgSrc: string
// }

// function PreviewCard({ imgSrc }: PreviewCardProps) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" className="h-25 w-25 p-0">
//           <img
//             src={imgSrc}
//             alt=""
//             className="h-full w-full rounded-md object-cover"
//           />
//         </Button>
//       </DialogTrigger>

//       <DialogContent showCloseButton={false} className="w-full max-w-lg">
//         <DialogHeader className="sr-only">
//           <DialogTitle>Foto</DialogTitle>
//         </DialogHeader>
//         <AspectRatio ratio={1 / 1}>
//           <img src={imgSrc} alt="" className="h-full w-full object-cover" />
//         </AspectRatio>
//       </DialogContent>
//     </Dialog>
//   )
// }
