<script>
    import More from "./icons/more.svelte"
    import { clickOutside } from "../actions/click-outside"
    let active = false

    export let onsend

    let popupActive = false

    const openPopup = () => {
        popupActive = true
        active = false
    }
    const closePopup = () => {
        popupActive = false
        text = ""
    }
    let text = ""
    const onsubmit = () => {
        onsend(text)
        closePopup()
    }
</script>

<div class="appellation" class:active>
    <button
        class="appellation__button"
        on:click={() => (active = !active)}
        use:clickOutside={() => (active = false)}><More /></button
    >
    <div class="appellation__menu">
        <button on:click={openPopup}>Подать апелляцию</button>
    </div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="appellation__popup"
    class:active={popupActive}
    on:click={closePopup}
>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <form
        on:submit|preventDefault={onsubmit}
        class="popup__content"
        on:click|stopPropagation
    >
        <label>
            Опишите проблему
            <textarea name="text" bind:value={text} rows="10"></textarea>
        </label>
        <button disabled={!text}>Отправить</button>
    </form>
</div>

<style>
    .appellation__menu {
        position: absolute;
        display: none;
        width: 250px;
        background-color: white;
        padding: 0.5em;
        border-radius: 10px;
        box-shadow: 0 0 1em 0 #0003;
        z-index: 1;
    }
    .appellation__popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0003;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
    }
    .appellation__popup.active {
        opacity: 1;
        pointer-events: all;
    }
    label {
        display: block;
    }
    textarea {
        display: block;
        font: inherit;
        margin-top: 1em;
        margin-bottom: 1em;
        width: 100%;
    }
    form button {
        display: block;
        margin-left: auto;
    }
    .popup__content {
        background-color: white;
        border-radius: 10px;
        padding: 1em;
        width: 30vw;
    }
    .appellation {
        position: relative;
    }
    .appellation.active .appellation__menu {
        display: block;
    }
    .appellation__button {
        background-color: transparent;
        font-size: 20px;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-right: -0.5em;
    }
    .appellation__menu button {
        width: 100%;
        background-color: transparent;
        text-align: left;
        border: none;
        font: inherit;
        padding: 0.5em 1em;
        border-radius: 10px;
        cursor: pointer;
    }
    .appellation__menu button:hover {
        background-color: #eee;
    }
</style>
