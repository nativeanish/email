import { create } from "zustand"
import { User } from "../types/user"

interface State {
    user: User | undefined
}

const useUser = create<State>(() => {
    const storedUser = localStorage.getItem("user")
    let parsedUser: User | undefined = undefined

    if (storedUser) {
        try {
            const data = JSON.parse(storedUser)
            if (
                data &&
                typeof data === "object" &&
                "address" in data &&
                "username" in data &&
                "image" in data
            ) {
                parsedUser = data as User
            } else {
                parsedUser = undefined
            }
        } catch {
            console.error("Failed to parse user data from localStorage", storedUser)
            parsedUser = undefined
        }
    }

    return {
        user: parsedUser
    }
})

export default useUser
