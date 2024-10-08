<script lang="ts">
	import { Child } from "$lib/child.svelte"
	import Node from "$lib/components/Node.svelte"
	import { spring } from "svelte/motion"

	type Props = {
		layer: Child[]
		i: number
		reselect: (c: Child) => (e: KeyboardEvent) => void
		currentlyScrolled: Child[]
	}
	let { layer, i, reselect, currentlyScrolled = $bindable() }: Props = $props()

	let column = $state<HTMLDivElement>()
	// transitions could be done with CSS, but it's not as smooth and doesn't gain much performance
	let topPos = spring<number | null>(0, {
		// magic numbers
		stiffness: 0.15,
		damping: 0.55
	})

	function scrollTo(top: number, c: Child) {
		currentlyScrolled[i] = c
		$topPos = top + window.innerHeight / 2.5
	}
</script>

<div
	class="relative px-0.5 flex flex-col gap-1 min-w-45 w-45"
	style="top: {$topPos}px"
	bind:this={column}>
	{#each layer as child, j}
		{#if j > 0 && layer[j - 1].parent !== child.parent}
			<div class="min-h-1"></div>
		{/if}
		<Node {child} {i} reselect={reselect(child)} bind:currentlyScrolled {scrollTo} {column} />
	{/each}
</div>
