import { useEffect, useState, useMemo } from "react"
import { Box } from "../types/user"
import { fetchstore } from "../utils/mail/fetchstore"
import { showDanger } from "../Components/UI/Toast/Toast-Context"

export interface EmailDetailsData {
  body: string
  subject: string
  id: string
  image: string
  name: string
  from: string
  seen: boolean
  date: number
}

export function useEmailDetails(box: Box | null) {
  const [user, setUser] = useState<EmailDetailsData | null | undefined>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!box) {
      setUser(null)
      return
    }

    setLoading(true)
    setError(null)

    fetchstore(box)
      .then((data) => {
        if (data) {
          setUser(data)
        } else {
          setUser(undefined)
        }
      })
      .catch((error) => {
        const errorMessage = "Error fetching email details: " + error.message
        showDanger(errorMessage)
        setError(errorMessage)
        setUser(undefined)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [box])

  // Memoize the return value to prevent unnecessary re-renders
  const result = useMemo(() => ({
    user,
    loading,
    error,
    isLoading: loading,
    hasError: !!error,
    isEmpty: user === undefined,
    hasData: !!user
  }), [user, loading, error])

  return result
}
