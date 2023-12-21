<script lang="ts">
	import Node from "$lib/components/Node.svelte"
	import { untrack } from "svelte"

	const map = {
		text: "top node\n\n",

		children: [
			{
				text: "first\n\n",
				children: [
					{
						text: "first",
					},
				],
			},
			{
				text: "second",
				children: [
					{
						text: "first",
					},
					{
						text: "second",
					},
				],
			},
			{
				text: "third",
			},
		],
	}

	type Node = {
		parent: HTMLDivElement
		node: HTMLDivElement
	}
	type Path = {
		parent: DOMRect
		node: DOMRect
	}

	let nodes: Node[] = $state([])
	let paths: Path[] = $state([])

	const addNode = (node: Node) => nodes.push(node)

	function recomputePaths() {
		console.log("recomputing paths")
		paths = []

		let scrollX = window.scrollX
		let scrollY = window.scrollY

		untrack(() => {
			for (const node of nodes) {
				const parentRect = node.parent.getBoundingClientRect()
				const nodeRect = node.node.getBoundingClientRect()
				paths.push({
					parent: new DOMRect(
						parentRect.x + scrollX,
						parentRect.y + scrollY,
						parentRect.width,
						parentRect.height,
					),
					node: new DOMRect(
						nodeRect.x + scrollX,
						nodeRect.y + scrollY,
						nodeRect.width,
						nodeRect.height,
					),
				})
			}
		})
	}
</script>

<div class="canvas h-full absolute p-10 box-border">
	<svg id="lineToAboveNode" class="absolute top-0 left-0 w-full h-full -z-1">
		{#each paths as path}
			{#if path.parent && path.node}
				{@const { x: px, y: py, width: pw, height: ph } = path.parent}
				{@const { x: nx, y: ny, width: nw } = path.node}
				<path
					d="M {px + pw / 2} {py + ph}
					L {px + pw / 2} {py + ph + 20}
					L {nx + nw / 2} {py + ph + 20}
					L {nx + nw / 2} {ny}"
					stroke="#aaa"
					stroke-width="2"
					fill="none" />
			{/if}
		{/each}
	</svg>
	<Node {...map} {addNode} {recomputePaths} />
</div>
