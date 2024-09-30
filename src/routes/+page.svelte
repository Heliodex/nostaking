<script lang="ts">
	import Node from "$lib/components/Node.svelte"
	import { id, type Child, type Path } from "$lib/child"
	import { untrack } from "svelte"

	const map: Child = {
		text: "top node",
		id: id(),
		children: [
			{
				text: "first",
				id: id(),
				children: [
					{
						text: "first",
						id: id()
					}
				]
			},
			{
				text: "second",
				id: id(),
				children: [
					{
						text: "first",
						id: id(),
						children: [
							{
								text: "third lv1",
								id: id()
							},
							{
								text: "third lv2",
								id: id()
							}
						]
					},
					{
						text: "second",
						id: id()
					}
				]
			},
			{
				text: "third",
				id: id()
			}
		]
	}

	let nodes: Path[] = $state([])
	let paths: Path[] = $state([])

	const addNode = (n: Path) => nodes.push(n)

	function recomputePaths() {
		console.log("recomputing paths")
		paths = []

		let scrollX = window.scrollX
		let scrollY = window.scrollY

		untrack(() => {
			for (const n of nodes) {
				const pr = n.parent
				const nr = n.node
				const parent = new DOMRect(
					pr.x + scrollX,
					pr.y + scrollY,
					pr.width,
					pr.height
				)
				const node = new DOMRect(
					nr.x + scrollX,
					nr.y + scrollY,
					nr.width,
					nr.height
				)
				paths.push({ parent, node })
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
