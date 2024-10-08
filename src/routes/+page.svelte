<script lang="ts">
	import { onMount } from "svelte"
	import Column from "$lib/components/Column.svelte"
	import child from "$lib/decode"
	import type { Child } from "$lib/child.svelte"

	let layers: Child[][] = $state([])

	onMount(() => {
		let layer: Child[] = [child] // top layer of the tree
		while (layer.length > 0) {
			layers.push(layer)
			layer = layer.flatMap(c => c.children)
		}

		child.select()
	})

	let currentlyScrolled = $state<Child[]>([])
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-y-hidden">
	{#each layers as layer, i}
		<Column {layer} {i} bind:currentlyScrolled />
	{/each}
</div>
