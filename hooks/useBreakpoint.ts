import { useEffect, useState } from "react"

type ButtonSize = "sm" | "md" | "lg"

const getButtonSize = (width: number): ButtonSize => {
  if (width < 640) return "sm"      // small screens (mobile)
  if (width < 1024) return "md"     // medium screens (tablet)
  return "lg"                       // large screens (desktop)
}

export default function useBreakpoint(): ButtonSize {
  const [size, setSize] = useState<ButtonSize>(getButtonSize(window.innerWidth))

  useEffect(() => {
    const handleResize = () => {
      setSize(getButtonSize(window.innerWidth))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

