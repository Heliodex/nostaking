<script lang="ts">
	import Node from "./Node.svelte"
	import type { Child } from "$lib/child.svelte"
	import { onMount } from "svelte"

	type Props = {
		child: Child
	}
	let { child }: Props = $props()

	function leftSibling() {
		const children = child.siblings
		if (!children) return

		const s = children.findIndex(c => c.id === child.id) - 1
		return s >= 0 ? children[s] : undefined
	}

	// We can collapse nodes together if they're not the same depth
	function depthPadding() {
		const sibling = leftSibling()
		if (sibling && sibling.depthBelow !== child.depthBelow) return sibling
	}
	// console.log(depthPadding())

	let domNode = $state<HTMLDivElement | undefined>()

	onMount(() => {
		if (!child.parent?.rect || !domNode) return
		child.rect = domNode.getBoundingClientRect()
	})
</script>

<span class="bg-neutral/20 h-full">
	<div
		class="bg-black p-2 rounded-2 w-25 mx-auto border-gray border-1 border-solid text-center"
		bind:this={domNode}
		role="button"
		tabindex="0">
		{child.text}
	</div>
	{#if child.children}
		<span class="flex pt-10 gap-2.5">
			{#each child.children as grandchild}
				<Node child={grandchild} />
			{/each}
		</span>
	{/if}
</span>
