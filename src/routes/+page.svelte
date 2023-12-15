<script lang="ts">
	import Node from "$lib/components/Node.svelte"
</script>

<div class="canvas h-full absolute p-10 box-border flex overflow-x-auto">
	{#each { length: 1 } as _}
		<Node text="helo world" depth={0} />
	{/each}
</div>

<style lang="stylus">
	.canvas
		background #111
</style>
