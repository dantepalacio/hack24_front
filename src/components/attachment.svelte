<script>
    export let src
    export let type
</script>

{#if type.startsWith("video")}
    <video {...$$restProps} {src} muted class="attachment"></video>
{:else}
    <img {src} {...$$restProps} alt="" class="attachment" />
{/if}

<style>
    .attachment {
        display: block;
        width: 100%;
        object-fit: cover;
    }
</style>
