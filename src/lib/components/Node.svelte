<script lang="ts">
	import Node from "./Node.svelte"
	import type { Child } from "$lib/child.svelte"
	import { onMount, untrack } from "svelte"

	type Props = {
		child: Child
	}
	let { child }: Props = $props()

	// We can collapse nodes together if they're not the same depth
	function depthPadding(): number | undefined {
		const { siblings } = child
		if (!siblings) return

		const currentI = siblings.findIndex(c => c.id === child.id)
		const sibling = siblings[currentI - 1]
		if (!sibling) return
		if (sibling.depthBelow === child.depthBelow) {
			for (const d of child.descendants) {
				d.shiftedLeft += sibling.shiftedLeft
				d.x -= sibling.shiftedLeft
			}
			return -sibling.shiftedLeft
		}

		// calculate how much we can move the current node to the left
		const diff = 0

		for (const d of child.descendants) {
			d.shiftedLeft += diff
			d.x -= diff
			console.log("aded to", d.id, "\t", d.shiftedLeft)
		}
		return -diff
	}

	let pad: number | undefined = $state()
	let totalNode = $state<HTMLLIElement | undefined>()
	let domNode = $state<HTMLDivElement | undefined>()

	onMount(() => {
		const rect = domNode?.getBoundingClientRect()
		const totalRect = totalNode?.getBoundingClientRect()
		if (!rect || !totalRect) return

		child.x = rect.x
		child.y = rect.y
		child.width = rect.width
		child.height = rect.height
		child.totalWidth = totalRect.width

		untrack(() => {
			pad = depthPadding()
		})
	})
</script>

<li
	class="flex flex-col items-center"
	style={pad ? `translate: ${pad}px` : null}
	bind:this={totalNode}>
	<div
		class="bg-black p-2 rounded-2 w-25 border-gray border-1 border-solid text-center"
		bind:this={domNode}
		role="button"
		tabindex="0">
		{child.text}
		<!-- {#if pad}
			<span class="text-green">
				{Math.round(pad)}
			</span>
		{/if} -->
	</div>
	{#if child.children}
		<ul class="flex gap-2.5 p-0 pt-10">
			{#each child.children as grandchild}
				<Node child={grandchild} />
			{/each}
		</ul>
	{/if}
</li>
