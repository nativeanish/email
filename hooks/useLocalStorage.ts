import { useState, useEffect } from "react"

function useLocalStorage<T>(key: string, initialValue?: T) {
    const isWritable = initialValue !== undefined

    const [storedValue, setStoredValue] = useState<T | undefined>(() => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    const setValue = (value: T | ((val: T | undefined) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                setStoredValue(JSON.parse(event.newValue))
            }
        }
        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
    }, [key])

    return isWritable ? [storedValue, setValue] as const : [storedValue] as const
}

export default useLocalStorage
