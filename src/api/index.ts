import { writable } from "svelte/store"

export interface Post {
    date: number
    status: "process" | "ban" | "publish"
    text?: string
    attachments?: {}[]
}

export async function post(formData: FormData) {
    const post = {
        date: Math.floor(Date.now() / 1000),
        status: "process",
        text: formData.get("text"),
    }
    await new Promise((r) => setTimeout(r, 1000))
    posts.update(($posts) => {
        $posts.push()
        return $posts
    })
}

const posts = writable<Post[]>([])
