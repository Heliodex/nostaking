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
		new Child(
			"second",
			new Child("first", new Child("third lv1"), new Child("third lv2")),
			new Child("second")
		),
		new Child("third")
	)

	function getPaths() {
		console.log("got")
		const paths: Child[] = []

		let scrollX = window.scrollX
		let scrollY = window.scrollY

		for (const n of child.descendants) {
			if (!n.parent) continue

			n.parent.x += scrollX
			n.parent.y += scrollY
			n.x += scrollX
			n.y += scrollY
			paths.push(n)
		}

		return paths
	}
</script>

<div class="h-full absolute p-10 box-border">
	<svg class="absolute top-0 left-0 w-full h-full -z-1">
		{#each getPaths() as n}
			{#if n.parent}
				{@const p = n.parent}
				<path
					d="M {p.x + p.width / 2} {p.y + p.height}
						L {p.x + p.width / 2} {p.y + p.height + 20}
						L {n.x + n.width / 2} {p.y + p.height + 20}
						L {n.x + n.width / 2} {n.y}"
					stroke="#aaa"
					stroke-width="2"
					fill="none" />
			{/if}
		{/each}
	</svg>
	<Node {child} />
</div>
