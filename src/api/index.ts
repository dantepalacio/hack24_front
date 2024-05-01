import { writable } from "svelte/store"
import { getFile } from "./utils"

export interface Post {
    date: number
    status: "process" | "ban" | "publish" | "same"
    text?: string
    attachments?: {
        src: string
        type: string
    }[]
    id: number
}

export async function post(formData: FormData) {
    const postId = Math.random() + Date.now()

    const attachment = formData.get("attachment")
    const post: Post = {
        date: Math.floor(Date.now() / 1000),
        status: "process",
        text: formData.get("text")?.toString().trim(),
        id: postId,
    }
    if (attachment && typeof attachment !== "string" && attachment.size > 0) {
        post.attachments = [await getFile(attachment)]
    }

    posts.update(($posts) => {
        $posts.push(post)
        return $posts
    })
    await new Promise((r) => setTimeout(r, 1000))
    posts.update(($posts) => {
        const post = $posts.find(({ id }) => id === postId)
        if (!post) return $posts
        post.status = Math.random() > 0.3 ? "ban" : "publish"
        return $posts
    })
}

export const posts = writable<Post[]>([])
