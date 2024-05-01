<script>
    import Form from "./components/form.svelte"
    import ThemeSwitcher from "./components/theme-switcher.svelte"
    import Post from "./components/post.svelte"
    import { posts } from "./api"

    let width = 0
</script>

<div class="page">
    <header>
        <div style:width="{width}px"></div>
        <Form />
        <div class="header__theme" bind:clientWidth={width}>
            <ThemeSwitcher />
        </div>
    </header>
    <div class="container">
        {#each $posts as post}
            <Post {post} />
        {/each}
    </div>
</div>

<style>
    header {
        position: sticky;
        background-color: white;
        top: 0;
        left: 0;
        width: 100%;
        padding: 25px 95px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.25);
        z-index: 1;
    }
    .container {
        margin: 25px auto;
        width: var(--container-width);
        display: grid;
        gap: 25px;
    }
</style>
