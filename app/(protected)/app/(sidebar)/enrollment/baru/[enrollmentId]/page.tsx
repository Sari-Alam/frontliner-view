import { fetchEnrollment } from "@/services/enrollments-services"

import { ScrollArea } from "@/components/ui/scroll-area"
import BackButton from "@/components/back-button"
import FaceEnrollmentForm from "@/components/forms/face-enrollment-form"

interface NewEnrollmentPageProps {
  params: {
    enrollmentId: string
  }
}

export default async function NewEnrollmentPage({
  params,
}: NewEnrollmentPageProps) {
  const routeParams = await params
  const enrollment = await fetchEnrollment(routeParams.enrollmentId)

  return (
    <section className="relative flex flex-1 flex-col gap-2">
      <div className="absolute top-0 left-0 z-20 flex w-full shrink-0 items-center justify-between">
        <BackButton href="/app/enrollment" />
      </div>

      <ScrollArea className="h-[calc(100dvh-50px-24px)] w-full">
        <div className="flex w-full justify-center">
          <FaceEnrollmentForm enrollment={enrollment} />
        </div>
      </ScrollArea>
    </section>
  )
}
