import AttendanceForm from "@/components/forms/attendance-form/attendance-form"

export default function AttendanceRecordingPage() {
  return (
    <section className="relative flex h-dvh flex-1 flex-col items-center justify-center overflow-hidden bg-slate-200 py-20 dark:bg-background">
      <AttendanceForm />
    </section>
  )
}
