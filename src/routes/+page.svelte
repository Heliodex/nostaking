<script lang="ts">
	import Node from "$lib/components/Node.svelte"
	import { Child } from "$lib/child.svelte"

	const child = new Child(
		"top node",
		new Child("first", new Child("first")),
		new Child(
			"second",
			new Child("first", new Child("third lv1"), new Child("third lv2")),
			new Child("second")
		),
		new Child("third")
	)

	function getPaths() {
		console.log("getting")
		const paths: {
			parentrect: DOMRect
			rect: DOMRect
		}[] = []

		let scrollX = window.scrollX
		let scrollY = window.scrollY

		for (const n of child.descendants) {
			const parentrect = n.parent?.rect
			const { rect } = n
			if (!parentrect || !rect) continue

			parentrect.x += scrollX
			parentrect.y += scrollY
			rect.x += scrollX
			rect.y += scrollY
			paths.push({ parentrect, rect })
		}

		return paths
	}
</script>

<div class="h-full absolute p-10 box-border">
	<svg class="absolute top-0 left-0 w-full h-full -z-1">
		{#each getPaths() as path}
			{@const { x: px, y: py, width: pw, height: ph } = path.parentrect}
			{@const { x: nx, y: ny, width: nw } = path.rect}
			<path
				d="M {px + pw / 2} {py + ph}
					L {px + pw / 2} {py + ph + 20}
					L {nx + nw / 2} {py + ph + 20}
					L {nx + nw / 2} {ny}"
				stroke="#aaa"
				stroke-width="2"
				fill="none" />
		{/each}
	</svg>
	<Node {child} />
</div>
