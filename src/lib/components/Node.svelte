<script lang="ts">
	import Node from "./Node.svelte"
	import type { Child, Path } from "$lib/child"

	type NodeType = Child & {
		parentNode?: HTMLDivElement
		addNode: (path: Path) => number
		recomputePaths: () => void
		parent?: NodeType
	}
	// Do whatcha gotta do, grarrrr
	let {
		text,
		id,
		children,
		parentNode,
		addNode,
		recomputePaths,
		parent
	}: NodeType = $props()

	function leftSibling() {
		const children = parent?.children
		if (!children) return

		const s = children.findIndex(c => c.id === id) - 1
		return s >= 0 ? children[s] : undefined
	}

	const getDepthBelow = (c: { children?: Child[] }): number =>
		Math.max(...(c.children?.map(getDepthBelow) || [0])) + 1

	let sibling = leftSibling()
	if (sibling) console.log(getDepthBelow(sibling), sibling.text)

	let domNode = $state<HTMLDivElement | undefined>()
	let added = false

	$effect(() => {
		if (!parentNode || !domNode || added) return
		addNode({
			parent: parentNode.getBoundingClientRect(),
			node: domNode.getBoundingClientRect()
		})
		added = true
	})
	$effect(recomputePaths)
</script>

<span class="bg-neutral/20 h-full">
	<div
		class="bg-black p-2 rounded-2 w-25 mx-auto border-gray border-1 border-solid text-center"
		bind:this={domNode}
		role="button"
		tabindex="0">
		{text}
	</div>
	{#if children}
		<span class="flex pt-10 gap-2.5">
			{#each children as child}
				<Node
					{...child}
					parent={{
						text,
						id,
						children,
						parentNode,
						addNode,
						recomputePaths,
						parent
					}}
					parentNode={domNode}
					{addNode}
					{recomputePaths} />
			{/each}
		</span>
	{/if}
</span>
