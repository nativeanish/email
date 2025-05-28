export type UpdateEntry = {
    date: string
    log: string
}

export interface UpdateList {
    entries: UpdateEntry[]
    push: (entry: UpdateEntry) => void
}

export interface User {
    address: string
    username: string
    image: string
    bio: string
    privateKey: string
    publicKey: string
    registeredDate: string
    isArns: boolean
    sent: number
    received: number
    sendBoxnumber: number
    receiveBoxnumber: number
    updates: UpdateList
}