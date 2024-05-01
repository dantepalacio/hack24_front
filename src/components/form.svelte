<script lang="ts">
    import PaperPlane from "./icons/paper-plane.svelte"
    import Attach from "./icons/attach.svelte"
    import { post } from "../api"
    import { getFile } from "../api/utils"
    import Attachment from "./attachment.svelte"
    import Cross from "./icons/cross.svelte"

    let text = ""
    const onsubmit = (event: SubmitEvent) => {
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        post(formData)
        text = ""
        clearFiles()
    }
    let files: FileList = [] as any

    const clearFiles = () => (files = [] as any)

    $: disabled = text.length < 1 && files.length < 1
    // TODO Проверять видео на длительность
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
                    {#await getFile(file)}
                        <div class="file file--loading">Loading</div>
                    {:then attachment}
                        <div class="file">
                            <div class="file__attachment">
                                <button on:click={clearFiles} class="delete"
                                    ><Cross /></button
                                >
                                <Attachment {...attachment} />
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
        <PaperPlane />
    </button>
</form>

<style>
    form {
        display: grid;
        grid-template-columns: auto max-content;
        gap: 19px;
        width: var(--container-width);
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
        font-size: 23px;
    }
    .button--primary {
        color: white;
        background-color: black;
        border-radius: 50%;
        padding: 8px;
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
