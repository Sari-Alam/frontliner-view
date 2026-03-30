"use client"

import z from "zod"
import { toast } from "sonner"
import { memo, useState, Dispatch, SetStateAction, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "../../ui/button"
import { CardContent, CardFooter } from "../../ui/card"
import { Separator } from "../../ui/separator"
import { AspectRatio } from "../../ui/aspect-ratio"
import { Input } from "../../ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "../../ui/field"
import { useAttendanceStore } from "@/stores/attendance-store"
import { useShallow } from "zustand/shallow"
import { Spinner } from "@/components/ui/spinner"
import { fetchEnrollment } from "@/services/enrollments-services"

const rfidSchema = z.object({
  nip: z
    .string()
    .min(5, "NIP harus diisi")
    .max(32, "NIP tidak boleh lebih dari 32 karakter"),
})

type Props = {
  setFormCurrentStep: Dispatch<SetStateAction<number>>
}

function RFIDStep({ setFormCurrentStep }: Props) {
  const [subStep, setSubStep] = useState<number>(0)

  const subStepRenderer = {
    0: <SubStep1 setSubStep={setSubStep} />,
    1: (
      <SubStep2
        setSubStep={setSubStep}
        setFormCurrentStep={setFormCurrentStep}
      />
    ),
    2: <SubStep3 setSubStep={setSubStep} />,
  }

  return subStepRenderer[subStep as keyof typeof subStepRenderer]
}

type SubStep1Props = {
  setSubStep: Dispatch<SetStateAction<number>>
}

function SubStep1({ setSubStep }: SubStep1Props) {
  const {
    setEmployeeNIP,
    setEmployeeData,
    isLoading,
    setIsLoading,
    employeeData,
  } = useAttendanceStore(
    useShallow((s) => ({
      setEmployeeNIP: s.setEmployeeNIP,
      setEmployeeData: s.setEmployeeData,
      isLoading: s.isLoading,
      setIsLoading: s.setIsLoading,
      employeeData: s.employeeData,
    }))
  )

  useEffect(() => {
    if (employeeData) setSubStep(1)
  }, [employeeData])

  let buffer = ""
  let lastKeyTime = Date.now()

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentTime = Date.now()

      if (currentTime - lastKeyTime > 30) {
        buffer = ""
      }

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          setIsLoading(true)

          const employee = await fetchEnrollment(buffer)
          setIsLoading(false)

          console.log({ buffer, employee })

          if (employee) {
            form.setValue("nip", buffer)
            setEmployeeNIP(buffer)
            setEmployeeData(employee)
            setSubStep(1)
          } else {
            toast.error("Pegawai tidak ditemukan")
            setSubStep(2)
          }

          buffer = "" // Clear for next scan
        }
      } else buffer += e.key

      lastKeyTime = currentTime
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const form = useForm<z.infer<typeof rfidSchema>>({
    resolver: zodResolver(rfidSchema),
    defaultValues: {
      nip: "",
    },
  })

  async function onSubmit(data: z.infer<typeof rfidSchema>) {
    try {
      setIsLoading(true)
      const employee = await fetchEnrollment(data.nip)

      if (employee) {
        setSubStep(1)
        setEmployeeNIP(data.nip)
        setEmployeeData(employee)
      } else {
        toast.error("Pegawai tidak ditemukan")
        setSubStep(2)
      }
    } catch (error) {
      toast.error("Gagal mengambil data pegawai")
    } finally {
      setIsLoading(false)
    }
  }

  const isRFIDFilled = isLoading || form.watch("nip").length

  return (
    <>
      <CardContent>
        <div className="mt-10 flex flex-col items-center gap-4 px-20">
          <p className="text-center text-sm text-muted-foreground">
            Tempelkan Kartu RFID Anda pada Mesin
          </p>

          <AspectRatio ratio={1 / 1}>
            <img
              src="/assets/images/rfid-image.webp"
              alt="RFID Placeholder"
              className="h-full w-full object-contain dark:opacity-50"
              onClick={() => form.setValue("nip", "10000001")}
            />
          </AspectRatio>
        </div>

        <div className="relative mt-10 flex items-center gap-4">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-nowrap text-muted-foreground">
            Atau masukan NIP secara manual
          </span>
          <Separator />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <form
            id="rfid-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            <FieldGroup>
              <Controller
                name="nip"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nip-form-title">
                      Nomor Induk Pegawai (NIP)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="nip-form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan NIP Anda"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          type="submit"
          form="rfid-form"
          className="w-full cursor-pointer"
          disabled={!isRFIDFilled}
        >
          {isLoading && <Spinner data-icon="inline-start" />}
          Selanjutnya
        </Button>
      </CardFooter>
    </>
  )
}

type SubStep2Props = {
  setSubStep: Dispatch<SetStateAction<number>>
  setFormCurrentStep: Dispatch<SetStateAction<number>>
}

function SubStep2({ setSubStep, setFormCurrentStep }: SubStep2Props) {
  const { employeeData, clearData } = useAttendanceStore(
    useShallow((s) => ({
      employeeData: s.employeeData,
      clearData: s.clearData,
    }))
  )

  const handleBackButton = () => {
    clearData()
    setSubStep(0)
  }

  return (
    <>
      <CardContent>
        <div className="mt-10 flex flex-col items-center gap-4 px-26">
          <p className="text-center text-sm text-muted-foreground">
            Pastikan data sudah benar
          </p>

          <AspectRatio ratio={1 / 1}>
            <img
              src="/assets/images/user-star.png"
              alt="RFID Placeholder"
              className="h-full w-full object-contain dark:opacity-50"
            />
          </AspectRatio>
        </div>

        <div className="mt-10">
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
        <Button
          className="flex-1 cursor-pointer"
          onClick={() => setFormCurrentStep(1)}
        >
          Ya, lanjutkan
        </Button>
      </CardFooter>
    </>
  )
}

type SubStep3Props = {
  setSubStep: Dispatch<SetStateAction<number>>
}

function SubStep3({ setSubStep }: SubStep3Props) {
  return (
    <>
      <CardContent>
        <div className="mt-10 flex flex-col items-center gap-4 px-26">
          <p className="text-center text-sm text-muted-foreground">
            Data tidak ditemukan, silahkan coba lagi
          </p>

          <AspectRatio ratio={1 / 1}>
            <img
              src="/assets/images/user-star.png"
              alt="RFID Placeholder"
              className="h-full w-full object-contain dark:opacity-50"
            />
          </AspectRatio>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex gap-2">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => setSubStep(0)}
        >
          Scan ulang
        </Button>
      </CardFooter>
    </>
  )
}

export default memo(RFIDStep)
