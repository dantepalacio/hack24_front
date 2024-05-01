<script>
    export let src
    export let type
</script>

{#if type.startsWith("video")}
    <video controls={false} muted class="attachment">
        <source {type} {src} />
    </video>
{:else}
    <img {src} alt="" class="attachment" />
{/if}

<style>
    .attachment {
        display: block;
        max-width: 100%;
        object-fit: cover;
    }
</style>
