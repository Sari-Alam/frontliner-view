"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const formSchema = z.object({
  nip: z
    .string()
    .min(5, "NIP harus diisi")
    .max(32, "NIP tidak boleh lebih dari 32 karakter"),
  password: z
    .string()
    .min(8, { message: "Password harus diisi" })
    .regex(/[a-z]/, {
      message: "Password harus mengandung huruf kecil",
    })
    .regex(/[A-Z]/, {
      message: "Password harus mengandung huruf besar",
    })
    .regex(/\d/, {
      message: "Password harus mengandung angka",
    })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character (@$!%*?&)",
    }),
})

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nip: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise<{ name: string; success: boolean }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Adela", success: true }), 2000)
        ),
      {
        loading: "Loading...",
        success: (data) => `Selamat datang ${data.name}`,
        error: "Error",
      }
    )
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isFormFilled =
    form.getValues("nip").length && form.getValues("password").length

  return (
    <div>
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="nip"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-title">
                  Nomor Induk Pegawai (NIP)
                </FieldLabel>
                <Input
                  {...field}
                  id="login-form-title"
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
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-description">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="login-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan Password Anda"
                    autoComplete="off"
                    type={isPasswordVisible ? "text" : "password"}
                  />

                  {
                    <Button
                      onClick={togglePasswordVisibility}
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      className="absolute top-1/2 right-1 -translate-y-1/2"
                    >
                      {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </Button>
                  }
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="mt-10">
        <Button
          type="submit"
          form="login-form"
          className="w-full cursor-pointer"
          disabled={!isFormFilled}
        >
          Masuk
        </Button>
      </Field>
    </div>
  )
}
