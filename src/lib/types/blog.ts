export type Post = {
    id: number,
    title: string,
    slug: string,
    type: "book" | "project" | "other",
    file: string
}
