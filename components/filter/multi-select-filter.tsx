"use client"

import { useState, memo, useTransition, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Spinner } from "../ui/spinner"

type Props = {
  buttonLabel: string
  checkBoxLabel: string
  initialState: string[]
  checkBoxItems: { label: string; value: string }[]
  searchParamsKey: string
}

export default function MultiSelectFilter({
  buttonLabel,
  checkBoxLabel,
  initialState,
  checkBoxItems,
  searchParamsKey,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const [values, setValues] = useState<string[]>(initialState)

  const handleCheckedChange = (id: string) => {
    const isIdExist = values.includes(id)
    const nextValues = isIdExist
      ? values.filter((value) => value !== id)
      : [...values, id]

    setValues(nextValues)

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextValues.length > 0) {
        params.set(searchParamsKey, nextValues.join(","))
      } else {
        params.delete(searchParamsKey)
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <MemoizedDropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPending={isPending}
      buttonLabel={buttonLabel}
      checkBoxLabel={checkBoxLabel}
      checkBoxItems={checkBoxItems}
      values={values}
      handleCheckedChange={handleCheckedChange}
    />
  )
}

type DropdownProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isPending: boolean
  buttonLabel: string
  checkBoxLabel: string
  checkBoxItems: { label: string; value: string }[]
  values: string[]
  handleCheckedChange: (id: string) => void
}

const Dropdown = ({
  isOpen,
  setIsOpen,
  isPending,
  buttonLabel,
  checkBoxLabel,
  checkBoxItems,
  values,
  handleCheckedChange,
}: DropdownProps) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "cursor-pointer gap-2 bg-card! transition-opacity",
            isPending && "opacity-70"
          )}
        >
          {buttonLabel}
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            {checkBoxLabel}
            {isPending && (
              <Spinner data-icon="inline-end" className="h-2 w-2" />
            )}
          </DropdownMenuLabel>
          {checkBoxItems.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={values.includes(item.value)}
              onCheckedChange={() => handleCheckedChange(item.value)}
              onSelect={(e) => e.preventDefault()}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const MemoizedDropdown = memo(Dropdown)

// "use client"

// import { useState, memo } from "react"
// import { usePathname, useSearchParams, useRouter } from "next/navigation"
// import { ChevronDownIcon } from "lucide-react"
// import { cn } from "@/lib/utils"

// import { Button } from "../ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"

// type Props = {
//   buttonLabel: string
//   checkBoxLabel: string
//   initialState: string[]
//   checkBoxItems: { label: string; value: string }[]
//   searchParamsKey: string
// }

// export default function MultiSelectFilter({
//   buttonLabel,
//   checkBoxLabel,
//   initialState,
//   checkBoxItems,
//   searchParamsKey,
// }: Props) {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const router = useRouter()

//   const [isOpen, setIsOpen] = useState(false)
//   const [values, setValues] = useState<string[]>(initialState)

//   const handleCheckedChange = (id: string) => {
//     const isIdExist = values.includes(id)
//     let newValues = []
//     if (isIdExist) newValues = values.filter((value) => value !== id)
//     else newValues = [...values, id]

//     setValues(newValues)
//     setTimeout(() => {
//       changeParams()
//     }, 100)
//   }

//   const changeParams = () => {
//     const params = new URLSearchParams(searchParams.toString())
//     if (values.length > 0) params.set(searchParamsKey, values.join(","))
//     else params.delete(searchParamsKey)

//     router.push(`${pathname}?${params.toString()}`, { scroll: false })
//   }

//   return (
//     <MemoizedDropdown
//       isOpen={isOpen}
//       setIsOpen={setIsOpen}
//       buttonLabel={buttonLabel}
//       checkBoxLabel={checkBoxLabel}
//       checkBoxItems={checkBoxItems}
//       values={values}
//       handleCheckedChange={handleCheckedChange}
//     />
//   )
// }

// type DropdownProps = {
//   isOpen: boolean
//   setIsOpen: (isOpen: boolean) => void
//   buttonLabel: string
//   checkBoxLabel: string
//   checkBoxItems: { label: string; value: string }[]
//   values: string[]
//   handleCheckedChange: (id: string) => void
// }

// const Dropdown = ({
//   isOpen,
//   setIsOpen,
//   buttonLabel,
//   checkBoxLabel,
//   checkBoxItems,
//   values,
//   handleCheckedChange,
// }: DropdownProps) => {
//   return (
//     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="cursor-pointer gap-2 bg-card!">
//           {buttonLabel}
//           <ChevronDownIcon
//             className={cn(
//               "h-4 w-4 transition-transform duration-200",
//               isOpen ? "rotate-180" : "rotate-0"
//             )}
//           />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-max">
//         <DropdownMenuGroup>
//           <DropdownMenuLabel>{checkBoxLabel}</DropdownMenuLabel>
//           {checkBoxItems.map((item) => (
//             <DropdownMenuCheckboxItem
//               key={item.value}
//               checked={values.includes(item.value)}
//               onCheckedChange={() => handleCheckedChange(item.value)}
//             >
//               {item.label}
//             </DropdownMenuCheckboxItem>
//           ))}
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// const MemoizedDropdown = memo(Dropdown)
