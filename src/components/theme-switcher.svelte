<script>
    import Sun from "./icons/sun.svelte"
    import Moon from "./icons/moon.svelte"
    import SunAndMoon from "./icons/sun-and-moon.svelte"
    let theme = "light"

    const themes = [
        {
            value: "light",
            icon: Sun,
        },
        {
            value: "system",
            icon: SunAndMoon,
        },
        {
            value: "dark",
            icon: Moon,
        },
    ]
</script>

<fieldset class="theme-switcher">
    {#each themes as { value, icon }}
        <label class="item">
            <input type="radio" name="theme" {value} bind:group={theme} />
            <div class="icon">
                <svelte:component this={icon} />
            </div>
        </label>
    {/each}
</fieldset>

<style>
    .theme-switcher {
        background-color: #eeeeee;
        padding: 4px 6px;
        border-radius: 100vw;
        display: flex;
        border: none;
        margin: 0;
    }
    .icon {
        font-size: 19px;
        padding: 6px;
        border-radius: 50%;
    }
    input {
        margin: 0;
        padding: 0;
        position: absolute;
        width: 1px;
        height: 1px;
        clip: rect(0 0 0 0);
    }
    input:checked + .icon {
        background-color: white;
    }
</style>
