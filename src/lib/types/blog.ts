export type Post = {
    id: number,
    title: string,
    slug: string,
    type: "project" | "other",
    content: string
}

export type Book = {
    id: number,
    title: string,
    slug: string,
    read_date: string | null, // ISO date (YYYY-MM-DD)
    content: string
}
