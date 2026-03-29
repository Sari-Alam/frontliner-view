"use client"

import { memo } from "react"

import { Button } from "../../ui/button"
import { CardContent, CardFooter } from "../../ui/card"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "../../ui/field"

import { useAttendanceStore } from "@/stores/attendance-store"

type ShiftConfirmationStepProps = {
  setFormCurrentStep: (step: number) => void
}

function ShiftConfirmationStep({
  setFormCurrentStep,
}: ShiftConfirmationStepProps) {
  const setShiftData = useAttendanceStore((s) => s.setShiftData)

  const handleSetShiftData = (shift: string) => {
    setShiftData({
      id: shift,
      name: shift,
    })
  }

  return (
    <>
      <CardContent>
        <div className="flex flex-col gap-4 rounded-lg border border-card-foreground/10 bg-card-foreground/5 p-4">
          <div className="flex flex-col gap-1.5">
            <p>Pilih shit</p>

            <RadioGroup
              defaultValue="1"
              className="grid w-full grid-cols-3 gap-2"
            >
              <FieldLabel htmlFor="shift-pagi" className="bg-card!">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Shift Pagi</FieldTitle>
                    <FieldDescription className="text-xs">
                      08.00 - 16.00
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="1" id="shift-pagi" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="shift-siang" className="bg-card!">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Shift Siang</FieldTitle>
                    <FieldDescription className="text-xs">
                      16.00 - 00.00
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="2" id="shift-siang" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="shift-malam" className="bg-card!">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Shift Malam</FieldTitle>
                    <FieldDescription className="text-xs">
                      00.00 - 08.00
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="3" id="shift-malam" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <p>Tipe absensi</p>

            <RadioGroup
              defaultValue="check-in"
              className="grid w-full grid-cols-2 gap-2"
            >
              <FieldLabel htmlFor="check-in" className="bg-card!">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Check-in</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="check-in" id="check-in" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="check-out" className="bg-card!">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Check-out</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="check-out" id="check-out" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => setFormCurrentStep(0)}
        >
          Kembali
        </Button>
        <Button
          type="submit"
          form="rfid-form"
          className="flex-1 cursor-pointer"
          onClick={() => setFormCurrentStep(2)}
        >
          Selanjutnya
        </Button>
      </CardFooter>
    </>
  )
}

export default memo(ShiftConfirmationStep)
