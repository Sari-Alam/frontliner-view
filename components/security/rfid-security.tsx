"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"
import { useShallow } from "zustand/shallow"
import { useRFIDSecurity } from "@/stores/use-rfid-security"

const isInProtectedRoute = (path: string) => {
  switch (path) {
    case "/app/absensi":
      return true
    case "/app/enrollment":
      return true
    case "/app/data-pegawai":
      return true
    default:
      return false
  }
}

export default function RFIDSecurity() {
  const { setRegisteredIds, registeredIds } = useRFIDSecurity(
    useShallow((state) => ({
      setRegisteredIds: state.setRegisteredIds,
      registeredIds: state.registeredIds,
    }))
  )

  const pathname = usePathname()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isInProtectedRoute(pathname)) {
      const isRegistered = registeredIds.some((x) => x[pathname])
      if (!isRegistered) {
        setIsOpen(true)
      }
    }
  }, [pathname])

  const handleClick = () => {
    setRegisteredIds({ [pathname]: pathname })
    setIsOpen(false)
  }

  const onCloseDialog = () => {
    setIsOpen(false)
    router.push("/app")
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Verfikasi Akses</DialogTitle>
          <DialogDescription>
            Verifikasi identitas anda terlebih dahulu sebelum masuk ke halaman
            ini
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Silahkan letakan kartu pekerja anda ke RFID scanner
          </p>

          <div className="mx-auto w-full max-w-[80%] dark:opacity-50">
            <AspectRatio ratio={1 / 1}>
              <img
                src="/assets/images/rfid-image.webp"
                alt=""
                aria-hidden="true"
              />
            </AspectRatio>
          </div>

          <DialogClose asChild>
            <button onClick={handleClick}>Bypass</button>
          </DialogClose>
        </div>

        <DialogFooter>
          <Button onClick={onCloseDialog} variant="outline" className="w-full">
            Batalkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
