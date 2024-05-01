<script lang="ts">
    import Clock from "../components/icons/clock.svelte"
    import CheckMark from "../components/icons/check-mark.svelte"
    import ExclamationCircle from "../components/icons/exclamation-circle.svelte"
    import type { Post } from "../api"
    import Attachment from "./attachment.svelte"

    export let post: Post

    const dtf = Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    })
    $: date = dtf.format(post.date * 1000)
</script>

<div class="post post--{post.status}">
    <div class="post__content">
        {#if post.attachments}
            <div class="post__attachment">
                {#each post.attachments as attachment}
                    <Attachment {...attachment} />
                {/each}
            </div>
        {/if}
        <div class="post__text">{post.text}</div>
        <div class="post__date">{date}</div>
    </div>
    <div class="post__status">
        {#if post.status === "ban"}
            Не опубликовано <ExclamationCircle />
        {:else if post.status === "process"}
            Проверяется <Clock />
        {:else if post.status === "publish"}
            Опубликовано <CheckMark />
        {/if}
    </div>
</div>

<style>
    .post__content {
        padding: 30px 25px;
        background-color: white;
        border-radius: 10px;
        padding-bottom: 10px;
        border: 2px solid transparent;
    }
    .post__attachment {
        margin-bottom: 1em;
    }
    .post__text {
        word-break: break-word;
        white-space: pre-line;
    }
    .post__date {
        margin-top: 21px;
        text-align: right;
        opacity: 0.5;
    }
    .post__status {
        display: flex;
        justify-content: end;
        gap: 6px;
        align-items: center;
        margin-top: 6px;
    }
    .post__status :global(.icon) {
        font-size: 12px;
    }
    .post--publish .post__status {
        color: #05a573;
    }
    .post--ban .post__status {
        color: #f40b0b;
    }
    .post--process .post__status {
        color: #7c7c7c;
    }
    .post--ban,
    .post--process {
        opacity: 0.7;
    }
    .post--publish .post__content {
        border-color: #05a573;
    }
    .post--process {
        animation: pulse linear 1s infinite;
    }
    @keyframes pulse {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 0.9;
        }
        100% {
            opacity: 0.5;
        }
    }
</style>
