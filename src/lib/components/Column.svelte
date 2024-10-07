<script lang="ts">
	import type { Child } from "$lib/child.svelte"
	import Node from "$lib/components/Node.svelte"
	import { spring } from "svelte/motion"

	type Props = {
		layer: Child[]
	}
	const { layer }: Props = $props()

	let column = $state<HTMLDivElement>()
	let smoothTopPos = spring<number | null>(0, {
		stiffness: 0.15,
		damping: 1
	})

	function scrollTo(top: number) {
		$smoothTopPos = top + window.innerHeight / 2.5
	}
</script>

<div
	class="relative px-0.5 flex flex-col gap-1 min-w-45 w-45"
	style="top: {$smoothTopPos}px"
	bind:this={column}>
	{#each layer as child, i}
		{#if i > 0 && layer[i - 1].parent !== child.parent}
			<div class="min-h-1"></div>
		{/if}
		<Node {child} {scrollTo} {column} />
	{/each}
</div>
