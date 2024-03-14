export const COLORS: Color[] = ["green", "pink", "blue", "orange", "purple"];

export type State = "resting" | "fetching" | "uploading" | "updating" | "error";

export type Color = "green" | "pink" | "blue" | "orange" | "purple";

export type User = {
    id?: string,
    name: string,
    image?: string,
    description?: string,
    color?: Color
    discord?: string
    twitter?: string
    telegram?: string
    website?: string
}

// Item type with some properties overriden for drafting pending details.
export type DraftUser = User & {
    name: string,
    imageToUpload?: File,
    changed?: boolean
};

export type Eup = {
    // State
    draft: User
    user: User
    state: State,
    error: string,

    // Methods
    save: () => void
    reset: () => void
    set: {
        color: (color: string) => void
    }
    input: {
        name: (e: React.ChangeEvent<HTMLInputElement>) => void
        description: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
        image: (e: React.ChangeEvent<HTMLInputElement>) => void
        discord: (e: React.ChangeEvent<HTMLInputElement>) => void
        twitter: (e: React.ChangeEvent<HTMLInputElement>) => void
        website: (e: React.ChangeEvent<HTMLInputElement>) => void
        telegram: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
};