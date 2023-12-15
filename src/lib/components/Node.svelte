<script lang="ts">
	const { text, depth, parentNode, children, addPath } = $props<{
		text: string
		depth: number
		parentNode?: HTMLDivElement
		children?: () => any
		addPath?: (path: any) => void
	}>()

	let node: HTMLDivElement | undefined = $state()

	if (addPath) {
		let added = false

		$effect(() => {
			if (parentNode && node && !added) {
				addPath({
					parent: parentNode.getBoundingClientRect(),
					node: node.getBoundingClientRect(),
				})
				added = true
			}
		})
	}

	type Path = {
		parent: DOMRect
		node: DOMRect
	}

	const paths: Path[] = $state([]),
		addChildPath = (path: Path) => paths.push(path)
</script>

<svg id="lineToAboveNode" class="absolute top-0 left-0 w-full h-full z-1">
	<!-- go  -->
	{#each paths as path}
		{#if path.parent && path.node}
			{@const { x: px, y: py, width: pw, height: ph } = path.parent}
			{@const { x: nx, y: ny, width: nw } = path.node}
			<path
				d="M {px + pw / 2} {py + ph}
				L {px + pw / 2} {py + 80}
				L {nx + nw / 2} {py + 80}
				L {nx + nw / 2} {ny}"
				stroke="#aaa"
				stroke-width="2"
				fill="none" />
		{/if}
	{/each}
</svg>

<span class="px-2.5">
	<div
		class="bg-black p-2 rounded-2 w-30 mx-a border-gray border-1
		border-solid text-center"
		bind:this={node}>
		{text}
	</div>
	<div class="children flex pt-20">
		{#if depth < 5}
			<svelte:self
				depth={depth + 1}
				text="first"
				parentNode={node}
				addPath={addChildPath} />
			<svelte:self
				depth={depth + 1}
				text="second"
				parentNode={node}
				addPath={addChildPath} />
		{/if}
	</div>
</span>
