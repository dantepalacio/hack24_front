<script lang="ts">
    import Clock from "../components/icons/clock.svelte"
    import CheckMark from "../components/icons/check-mark.svelte"
    import ExclamationCircle from "../components/icons/exclamation-circle.svelte"
    import type { Post } from "../api"
    import Attachment from "./attachment.svelte"
    import Like from "./icons/like.svelte"
    import Dislike from "./icons/dislike.svelte"
    import { ratePost } from "../api"

    export let post: Post

    const dtf = Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    })
    $: date = dtf.format(post.date * 1000)

    const unblur = (e: PointerEvent) => {
        const post = (e.target as HTMLElement).closest(".post")
        if (!post) return
        post.classList.add("post--unblur")
    }

    const rate = (action: "like" | "dislike") => async () => {
        post.action = action
        const success = await ratePost(post.id, action)
        if (!success) post.action = undefined
    }

    const actionIcon = {
        like: Like,
        dislike: Dislike,
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="post post--{post.status}"
    style:order={-post.date}
    on:click={unblur}
>
    <div class="post__content">
        {#if post.status === "ban"}
            <div class="post__text">
                Данный пост содержит запрещенный контент
            </div>
        {:else}
            {#if post.attachments}
                <div class="post__attachment">
                    {#each post.attachments as attachment}
                        <Attachment controls="true" {...attachment} />
                    {/each}
                </div>
            {/if}
            {#if post.text}
                <div class="post__text">{post.text}</div>
            {/if}
        {/if}
        <div class="post__meta">
            <div class="actions">
                {#if !post.action}
                    <button on:click={rate("like")} class="action action--like"
                        ><Like /></button
                    >
                    <button
                        on:click={rate("dislike")}
                        class="action action--dislike"><Dislike /></button
                    >
                {:else}
                    <div class="action action--{post.action} action--active">
                        <svelte:component this={actionIcon[post.action]} />
                    </div>
                {/if}
            </div>
            <div class="post__date">{date}</div>
        </div>
    </div>

    <div class="post__status">
        {#if post.status === "ban"}
            Не опубликовано <ExclamationCircle />
        {:else if post.status === "process"}
            Проверяется <Clock />
        {:else if post.status === "publish"}
            Опубликовано <CheckMark />
        {:else if post.status === "same"}
            Сомнительный контент <CheckMark />
        {/if}
    </div>
</div>

<style>
    .post {
        --color: transparent;
    }
    .post__content {
        padding: 30px 25px;
        background-color: white;
        border-radius: 10px;
        padding-bottom: 10px;
        border: 2px solid var(--color);
        display: grid;
        gap: 21px;
    }
    .actions {
        font-size: 1.2em;
        display: flex;
        gap: 0.5em;
        justify-content: end;
    }
    .action {
        margin: 0;
        padding: 0;
        font: inherit;
        color: #000;
        background-color: transparent;
        border: none;
        opacity: 0.5;
    }
    button.action {
        cursor: pointer;
    }
    .action--like {
        --color: #05a573;
    }
    .action--dislike {
        --color: #f40b0b;
    }
    .action--active,
    .action:hover {
        color: var(--color);
    }
    .action--active {
        opacity: 1;
    }
    .post__text {
        word-break: break-word;
        white-space: pre-line;
    }
    .post__date {
        opacity: 0.5;
    }
    .post__meta {
        display: flex;
        gap: 1em;
        justify-content: end;
    }
    .post__status {
        display: flex;
        justify-content: end;
        gap: 6px;
        align-items: center;
        margin-top: 6px;
        color: var(--color);
    }
    .post__status :global(.icon) {
        font-size: 12px;
    }
    .post--publish {
        --color: #05a573;
    }
    .post--ban {
        --color: #f40b0b;
    }
    .post--process {
        --color: #7c7c7c;
    }
    .post--same {
        --color: #d08700;
    }
    .post--ban,
    .post--process {
        opacity: 0.7;
    }
    .post--same :is(.post__text, .post__attachment) {
        filter: blur(1em);
    }
    .post--unblur :is(.post__text, .post__attachment) {
        filter: none;
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
