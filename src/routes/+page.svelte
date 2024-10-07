<script lang="ts">
	import { onMount } from "svelte"
	import Column from "$lib/components/Column.svelte"
	import child from "$lib/decode"
	import type { Child } from "$lib/child.svelte"

	onMount(() => {
		child.select()
	})

	const layers = child.layers
	let currentlyScrolled = $state<Child[]>([])
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-hidden">
	{#each layers as layer, i}
		<Column {layer} {i} bind:currentlyScrolled />
	{/each}
</div>
