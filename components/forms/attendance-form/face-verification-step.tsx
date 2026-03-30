"use client"

import { memo, useRef, useState, useEffect, useCallback } from "react"
import { InfoIcon, Loader2, CameraIcon } from "lucide-react"
import Webcam from "react-webcam"
import { toast } from "sonner"
import { useAttendanceStore } from "@/stores/attendance-store"
import { useShallow } from "zustand/shallow"
import { format } from "date-fns"
import * as faceapi from "face-api.js"

import { CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { AspectRatio } from "../../ui/aspect-ratio"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"

type Props = {
  setFormCurrentStep: (step: number) => void
}

function FaceVerificationStep({ setFormCurrentStep }: Props) {
  const [subStep, setSubStep] = useState<number>(0)
  const [modelsLoaded, setModelsLoaded] = useState(false)

  // Load models once when the component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Ensure these files exist in your /public/models folder
        const MODEL_URL = "/model/weights"
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
      } catch (error) {
        console.error(error)
        toast.error("Gagal memuat AI model. Pastikan folder /models tersedia.")
      }
    }
    loadModels()
  }, [])

  if (!modelsLoaded) {
    return (
      <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Menyiapkan sistem pengenalan wajah...
        </p>
      </CardContent>
    )
  }

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
  const [isVerifying, setIsVerifying] = useState(false)

  const { employeeData } = useAttendanceStore(
    useShallow((s) => ({
      employeeData: s.employeeData,
    }))
  )

  console.log(employeeData)

  const captureAndVerify = async () => {
    // 1. Check if we have the reference data to compare against
    if (!employeeData?.face_data?.face_descriptor) {
      toast.error("Data wajah referensi tidak ditemukan untuk karyawan ini.")
      return
    }

    if (!webcamRef.current?.video) return

    try {
      setIsVerifying(true)
      const video = webcamRef.current.video

      // 2. Detect face and extract descriptor from live feed
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        toast.error(
          "Wajah tidak terdeteksi. Silakan posisikan wajah di tengah."
        )
        setIsVerifying(false)
        return
      }

      // 3. Compare descriptors
      // Convert stored descriptor (usually an array) to Float32Array
      const savedDescriptor = new Float32Array(
        employeeData?.face_data?.face_descriptor.front as unknown as number[]
      )
      const distance = faceapi.euclideanDistance(
        detection.descriptor,
        savedDescriptor
      )

      // Threshold: < 0.6 is usually a match. < 0.45 is very strict.
      if (distance < 0.6) {
        toast.success("Verifikasi berhasil!")
        setSubStep(1)
      } else {
        toast.error(
          "Wajah tidak cocok. Pastikan Anda adalah pemilik kartu ini."
        )
      }

      console.log({ distance })
    } catch (error: any) {
      console.error(error)
      toast.error("Gagal memproses verifikasi wajah.")
    } finally {
      setIsVerifying(false)
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
            screenshotQuality={0.9}
            className="h-[480px] w-[480px] rotate-y-180 overflow-hidden rounded-md object-cover"
            videoConstraints={{
              width: 640, // Increased resolution for AI accuracy
              height: 640,
              facingMode: "user",
            }}
          />

          <div className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-center">
            <Alert className="max-w-md border-amber-200/70 bg-amber-100/70 backdrop-blur-sm dark:border-amber-900 dark:bg-amber-950/70">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle className="text-amber-900 dark:text-amber-50">
                Pencahayaan & Aksesoris
              </AlertTitle>
              <AlertDescription className="text-amber-900/80 dark:text-amber-50/80">
                Mohon lepas kacamata hitam, masker, atau topi agar verifikasi
                akurat.
              </AlertDescription>
            </Alert>
          </div>

          <CameraOverlay />
        </AspectRatio>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        <Button
          className="flex-1 cursor-pointer"
          onClick={captureAndVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CameraIcon className="mr-2 h-4 w-4" />
          )}
          {isVerifying ? "Memproses..." : "Verifikasi & Catat Kehadiran"}
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

  const handleBackButton = () => setSubStep(0)

  const handleSubmitButton = () => {
    // Here you would typically call your API to save the attendance record
    clearData()
    setFormCurrentStep(0)
    toast.success("Kehadiran berhasil dicatat!")
  }

  return (
    <>
      <CardContent className="space-y-4">
        <div className="mt-4 flex flex-col items-center gap-4 px-10">
          <p className="text-center text-sm font-semibold text-primary">
            Verifikasi Identitas Berhasil
          </p>

          <div className="w-full px-30">
            <AspectRatio ratio={1 / 1}>
              <img
                src="/assets/images/user-star.png"
                alt="Success"
                className="h-full w-full object-contain"
              />
            </AspectRatio>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
            <InfoField label="Nama" value={employeeData?.name} />
            <InfoField label="NIP" value={employeeData?.nip} />
            <InfoField
              label="Departemen"
              value={employeeData?.departement?.name}
            />
            <InfoField label="Jabatan" value={employeeData?.position?.name} />
          </div>

          <div className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-4">
            <InfoField
              label="Waktu Absensi"
              value={format(new Date(), "dd MMMM yyyy HH:mm:ss")}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleBackButton}>
          Bukan saya
        </Button>
        <Button className="flex-1" onClick={handleSubmitButton}>
          Konfirmasi Kehadiran
        </Button>
      </CardFooter>
    </>
  )
}

// Small helper component for the summary view
function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">
        {label}
      </span>
      <p className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
        {value || "-"}
      </p>
    </div>
  )
}

function CameraOverlay() {
  return (
    <img
      src="/assets/images/camera-feed-cover.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full opacity-50"
    />
  )
}

export default memo(FaceVerificationStep)
