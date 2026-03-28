import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  HourglassIcon,
  ServerIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <section className="grid flex-1 grid-cols-4 gap-2">
      <Card className="h-max">
        <CardHeader>
          <CardTitle>Total pegawai</CardTitle>
        </CardHeader>

        <CardContent className="flex items-end justify-between gap-4">
          <p className="text-5xl font-bold text-foreground">12</p>

          <div className="grid h-11 w-11 place-items-center rounded-full border border-teal-300 bg-teal-100">
            <UserIcon className="h-6 w-6 text-teal-900" />
          </div>
        </CardContent>
      </Card>

      <Card className="h-max">
        <CardHeader>
          <CardTitle>Sudah enrollment</CardTitle>
        </CardHeader>

        <CardContent className="flex items-end justify-between gap-4">
          <p className="text-5xl font-bold text-foreground">12</p>

          <div className="grid h-11 w-11 place-items-center rounded-full border border-teal-300 bg-teal-100">
            <UserCheckIcon className="h-6 w-6 text-teal-900" />
          </div>
        </CardContent>
      </Card>

      <Card className="h-max">
        <CardHeader>
          <CardTitle>Belum enrollment</CardTitle>
        </CardHeader>

        <CardContent className="flex items-end justify-between gap-4">
          <p className="text-5xl font-bold text-foreground">12</p>

          <div className="grid h-11 w-11 place-items-center rounded-full border border-teal-300 bg-teal-100">
            <HourglassIcon className="h-6 w-6 text-teal-900" />
          </div>
        </CardContent>
      </Card>

      <Card className="h-max">
        <CardHeader>
          <CardTitle>Status server</CardTitle>
        </CardHeader>

        <CardContent className="flex items-end justify-between gap-4">
          <p className="font-bold text-foreground">Online</p>

          <div className="grid h-11 w-11 place-items-center rounded-full border border-teal-300 bg-teal-100">
            <ServerIcon className="h-6 w-6 text-teal-900" />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
