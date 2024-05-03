<script lang="ts">
    import PaperPlane from "./icons/paper-plane.svelte"
    import Attach from "./icons/attach.svelte"
    import { post } from "../api"
    import { getFile } from "../api/utils"
    import Attachment from "./attachment.svelte"
    import Cross from "./icons/cross.svelte"
    import { onMount } from "svelte"

    const SUBMIT_TIMEOUT = 10 * 1000

    let now = Date.now()
    onMount(() => {
        const interval = setInterval(() => (now = Date.now()), 1000)
        return () => clearInterval(interval)
    })

    let text = ""
    let lastSubmit = 0
    const onsubmit = (event: SubmitEvent) => {
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        post(formData)
        text = ""
        clearFiles()
        lastSubmit = Date.now()
        form.reset()
    }
    let files: FileList = [] as any

    let error = false

    const _getFile = async (...args: Parameters<typeof getFile>) => {
        try {
            return await getFile(...args)
        } catch (e) {
            error = true
            throw e
        }
    }

    $: if (files) {
        error = false
    }

    const clearFiles = () => (files = [] as any)

    $: deltaTime = now - lastSubmit
    $: disabled =
        (text.length < 1 && files.length < 1) ||
        error ||
        deltaTime < SUBMIT_TIMEOUT
</script>

<form on:submit|preventDefault={onsubmit}>
    <div class="input">
        <textarea
            name="text"
            id=""
            rows="1"
            bind:value={text}
            placeholder="Написать пост..."
        ></textarea>
        <label>
            <input
                type="file"
                name="attachment"
                accept="image/*, video/*"
                bind:files
            />
            <div class="button"><Attach /></div>
        </label>
        {#if files.length > 0}
            <div class="files">
                {#each files as file}
                    {#await _getFile(file)}
                        <div class="file file--loading">Loading</div>
                    {:then attachment}
                        <div class="file">
                            <div class="file__attachment">
                                <Attachment {...attachment} />
                                <button on:click={clearFiles} class="delete"
                                    ><Cross /></button
                                >
                            </div>
                        </div>
                    {:catch e}
                        <div class="file file--error">
                            {e instanceof Error
                                ? e.message
                                : "Неизвестная ошибка"}
                        </div>
                    {/await}
                {/each}
            </div>
        {/if}
    </div>
    <button class="button button--primary" type="submit" {disabled}>
        {#if deltaTime < SUBMIT_TIMEOUT}
            {Math.ceil((SUBMIT_TIMEOUT - deltaTime) / 1000)}
        {:else}
            <PaperPlane />
        {/if}
    </button>
</form>

<style>
    form {
        display: grid;
        grid-template-columns: auto max-content;
        gap: 19px;
        width: var(--container-width);
        align-items: end;
    }

    input {
        margin: 0;
        padding: 0;
        position: absolute;
        width: 1px;
        height: 1px;
        clip: rect(0 0 0 0);
    }
    label {
        display: flex;
        align-items: center;
        padding-inline: 13px;
    }
    .delete {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 10px;
        color: white;
        border-radius: 100vw;
        background-color: #0008;
        border: none;
        padding: 0.6em;
        margin: 0.5em;
        cursor: pointer;
        z-index: 1;
    }
    .file {
        width: 100px;
        height: 100px;
        background-color: #c4c4c4;
        border-radius: 10px;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .file--error {
        background-color: #f001;
        color: red;
    }
    .file__attachment {
        position: relative;
        width: inherit;
        height: inherit;
        border-radius: inherit;
    }
    .file :global(.attachment) {
        display: block;
        width: inherit;
        height: inherit;
        border-radius: inherit;
        object-fit: cover;
    }
    .button {
        background-color: transparent;
        font: inherit;
        border: none;
        display: block;
        cursor: pointer;
        aspect-ratio: 1;
    }
    .button :global(.icon) {
        font-size: 23px;
    }
    .button--primary {
        color: white;
        background-color: black;
        border-radius: 50%;
        padding: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .button:disabled {
        pointer-events: none;
        opacity: 0.5;
    }
    .input {
        background-color: #eee;
        border-radius: 10px;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: auto max-content;
    }
    .files {
        grid-column: 1 / -1;
        padding: 12px 15px;
    }
    textarea {
        display: block;
        font: inherit;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
        width: 100%;
        resize: none;
        font-size: 14px;
        line-height: 17px;
        padding: 12px 15px;
    }
    textarea:focus {
        outline: none;
    }
</style>
