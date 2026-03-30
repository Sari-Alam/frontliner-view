"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { login } from "@/services/user-service"

const formSchema = z.object({
  nip: z.string().min(1, "NIP tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
})

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nip: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await login(data)
      console.log(response)
      toast.success("Login berhasil")
    } catch (error) {
      console.log(error)
      toast.error("Login gagal")
    }

    router.push("/app")
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isFormFilled = form.watch("nip").length && form.watch("password").length

  return (
    <div>
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="nip"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-nip">
                  Nomor Induk Pegawai (NIP)
                </FieldLabel>
                <Input
                  {...field}
                  id="login-form-nip"
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
                <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="login-form-password"
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
