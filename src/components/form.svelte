<script lang="ts">
    import PaperPlane from "./icons/paper-plane.svelte"
    import Attach from "./icons/attach.svelte"
    import { post } from "../api"

    let text = ""
    let sending = false
    const onsubmit = async (event: SubmitEvent) => {
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        sending = true
        await post(formData)
        form.reset()
        sending = false
    }
    let files: FileList = [] as any

    $: disabled = sending || (text.length < 1 && files.length < 1)

    const readFile = (file: File) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = (e) => resolve(e.target?.result)
            fileReader.onerror = (e) => reject(e.target?.result)
        })
</script>

<form on:submit|preventDefault={onsubmit}>
    <div class="input">
        <textarea
            name=""
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
                    <div class="file">
                        {#await readFile(file)}
                            Loading
                        {:then src}
                            <img {src} alt="" />
                        {/await}
                    </div>
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
    .file {
        width: 100px;
        height: 100px;
        background-color: #c4c4c4;
        border-radius: 10px;
    }
    .file img {
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
        padding-top: 0;
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
