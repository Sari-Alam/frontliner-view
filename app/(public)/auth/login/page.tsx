import { LoginForm } from "@/components/forms/login-forms"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function LoginPage() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-slate-400 lg:p-2 dark:bg-background">
      <section className="mx-auto flex w-full flex-1 flex-col-reverse overflow-hidden border-card bg-card/80 backdrop-blur-sm lg:flex-row lg:gap-2 lg:rounded-2xl lg:border lg:p-2 lg:backdrop-blur-none">
        <div className="absolute bottom-0 left-0 z-20 flex w-full justify-center p-2 pb-16 lg:relative lg:w-auto lg:p-0">
          <div className="rounded-0 flex w-full max-w-md flex-col gap-10 rounded-lg border border-border bg-card/90 p-4 backdrop-blur-xs lg:static lg:border-none lg:p-10 lg:pl-8">
            <div className="h-15 w-13">
              <img
                src="/assets/images/sari-alam-logo-vertical.png"
                alt="Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold lg:text-xl">
                Selamat datang kembali
              </h1>
              <p className="text-sm text-muted-foreground">
                Silahkan masukkan NIP dan Password Anda
              </p>
            </div>

            <LoginForm />
          </div>
        </div>

        <div className="relative z-10 flex-1">
          <div className="absolute top-10 left-1/2 z-20 hidden w-[85%] -translate-x-1/2 lg:top-1/2 lg:block lg:-translate-y-1/2">
            <AspectRatio ratio={1512 / 982} className="w-full">
              <img
                src="/assets/images/snap-leave-page.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>

          <img
            className="absolute inset-0 z-0 h-full w-full rounded-lg object-cover"
            src="https://images.unsplash.com/photo-1517758478390-c89333af4642?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </section>
    </main>
  )
}
