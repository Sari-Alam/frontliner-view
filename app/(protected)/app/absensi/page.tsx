import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AttendanceRecordingPage() {
  return (
    <section className="relative flex h-dvh flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
        </CardHeader>

        <CardContent>
          <div></div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Selanjutnya</Button>
        </CardFooter>
      </Card>
    </section>
  )
}
