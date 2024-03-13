export type State = "resting" | "fetching" | "uploading" | "updating" | "error";

export type Item = {
    id?: string,
    name: string,
    image: string | File,
    value?: any
}

export type Eup = {
    // State
    draft: Item
    value: Item
    items: Item[]
    state: State,
    error: string,

    // Methods
    save: () => Promise<void>
    reset: () => void
    set: {
        name: (value: string) => void
        image: (value: File[]) => void
    },
    add: {
        item: (data: Item) => Promise<void>
    }
}

export const ITEM: (data: Item) => Item = () => ({
    name: "",
    image: ""
})

