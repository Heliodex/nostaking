<script lang="ts">
	import { onMount } from "svelte"
	import Column from "$lib/components/Column.svelte"
	import child from "$lib/decode"

	onMount(() => {
		child.select()
	})

	const layers = child.layers
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-hidden">
	{#each layers as layer}
		<Column {layer} />
	{/each}
</div>
