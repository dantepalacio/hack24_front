import { writable } from "svelte/store"
import { getFile } from "./utils"

const apiPath = (path: string) => `http://217.151.230.141:5000${path}`
export interface Post {
    date: number
    status: "process" | "ban" | "publish" | "same"
    text?: string
    attachments?: {
        src: string
        type: string
    }[]
    id: number
    action?: "like" | "dislike"
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

    try {
        const response = await fetch(apiPath("/process_post_request"), {
            method: "POST",
            body: formData,
        })
        if (response.status !== 200) {
            deletePostById(postId)
            return
        }

        const body = await response.json()

        posts.update(($posts) => {
            const post = $posts.find(({ id }) => id === postId)
            if (!post) return $posts
            post.status = body.status
            post.id = body.id
            if (body.unix_timestamp) post.date = body.unix_timestamp
            return $posts
        })
    } catch (e) {
        deletePostById(postId)
    }
}

const deletePostById = (postId: number) => {
    posts.update(($posts) => {
        const index = $posts.findIndex(({ id }) => id === postId)
        if (index < 0) return $posts
        $posts.splice(index, 1)
        return $posts
    })
}

export const fetchPosts = async () => {
    try {
        const { results } = await fetch(apiPath("/get_posts_request")).then(
            (r) => r.json()
        )

        posts.set(
            results.map((post) => {
                const p = {
                    date: post.unix_timestamp ?? Date.now() / 1000,
                    id: post.id,
                    status: post.status,
                } as Post
                if (post.action !== null) {
                    p.action = post.action === 0 ? "dislike" : "like"
                }
                if (post.comment) {
                    p.text = post.comment
                }
                if (post.image) {
                    p.attachments = [
                        { src: apiPath("/" + post.image), type: "image/*" },
                    ]
                }
                if (post.video) {
                    p.attachments = [
                        { src: apiPath("/" + post.video), type: "video/*" },
                    ]
                }
                return p
            })
        )
    } catch (e) {
        console.log(e)
    }
}

export const posts = writable<Post[]>([])

export const ratePost = async (postId: number, action: "like" | "dislike") => {
    const { status } = await fetch(
        apiPath(`/rate?id=${postId}&action=${action}`)
    )
    return status === 200
}

export const sendAppellation = async (postId: number, text: string) => {
    const data = new FormData()
    data.set("id", postId.toString())
    data.set("text", text)

    await fetch(apiPath("/send_appelation"), {
        method: "POST",
        body: data,
    })
}
