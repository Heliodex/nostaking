<script lang="ts">
	import Node from "./Node.svelte"

	type Child = {
		text: string
		children?: Child[]
	}

	let { text, children, parentNode, addNode, recomputePaths } = $props<
		Child & {
			parentNode?: HTMLDivElement
			addNode: (path: {
				parent: HTMLDivElement
				node: HTMLDivElement
			}) => number
			recomputePaths: () => void
		}
	>()

	let node: HTMLDivElement | undefined = $state()
	let added = false

	$effect(() => {
		if (parentNode && node && !added) {
			addNode({
				parent: parentNode,
				node: node
			})
			added = true
		}
	})

	$effect(() => {
		console.log("recomputing paths 2")
		if (text) recomputePaths()
	})
</script>

<span>
	<div
		class="bg-black p-2 rounded-2 w-25 mx-a
	border-gray border-1 border-solid text-center"
		bind:this={node}
		role="button"
		tabindex="0">
		{text}
	</div>
	{#if (children || []).length > 0}
		<span class="children flex pt-10 gap-2.5">
			{#each children || [] as child}
				<Node {...child} parentNode={node} {addNode} {recomputePaths} />
			{/each}
		</span>
	{/if}
</span>
