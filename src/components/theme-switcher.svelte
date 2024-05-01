<script>
    let theme = "light"

    const themes = [
        {
            value: "light",
        },
        {
            value: "system",
        },
        {
            value: "dark",
        },
    ]
</script>

<fieldset class="theme-switcher">
    {#each themes as { value }}
        <label class="item">
            <input type="radio" name="theme" {value} bind:group={theme} />
            <div class="icon">
                <div class="ICON"></div>
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
    .ICON {
        width: 1em;
        height: 1em;
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
