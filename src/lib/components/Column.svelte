<script lang="ts">
	import type { Child } from "$lib/child.svelte"
	import Node from "$lib/components/Node.svelte"
	import { onMount } from "svelte"
	import { spring } from "svelte/motion"

	type Props = {
		layer: Child[]
	}
	const { layer }: Props = $props()

	let column = $state<HTMLDivElement>()
	let smoothTopPos = spring<number | null>(0, {
		stiffness: 0.1,
		damping: 0.5
	})

	function scrollTo(top: number) {
		$smoothTopPos = top + window.innerHeight / 2.5
	}
</script>

<div
	class="relative flex flex-col gap-4 w-35 overflow-hidden"
	style="top: {$smoothTopPos}px"
	bind:this={column}>
	<div class="padding min-h-45vh"></div>
	{#each layer as child}
		<Node {child} {scrollTo} {column} />
	{/each}
	<div class="padding min-h-45vh"></div>
</div>
