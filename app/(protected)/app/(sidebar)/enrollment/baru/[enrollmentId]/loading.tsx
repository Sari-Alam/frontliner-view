import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="relative flex justify-center">
      <Card className="w-[492px]">
        <CardContent>
          <AspectRatio ratio={1 / 1}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-8 w-full rounded-xl" />
        </CardFooter>
      </Card>
    </section>
  )
}
