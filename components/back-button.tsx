import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

type Props = {
  href: string
}

export default function BackButton({ href }: Props) {
  return (
    <Link href={href} className="flex items-center gap-2 p-2 text-sm">
      <ArrowLeftIcon className="h-4 w-4" /> Kembali
    </Link>
  )
}
