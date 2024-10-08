<script lang="ts">
	import Column from "$lib/components/Column.svelte"
	import child from "$lib/decode"
	import { Child } from "$lib/child.svelte"
	import { onMount } from "svelte"

	let layers: Child[][] = $state([])

	function computeLayers() {
		layers = [[child]]
		for (let i = 0; layers[i]?.length > 0; i++)
			layers.push(layers[i].flatMap(c => c.children))
		layers.pop()
	}

	onMount(() => {
		computeLayers()
		child.select()
	})

	let currentlyScrolled = $state<Child[]>([])

	// lolll
	const reselect = (i: number) => (c: Child) => (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowUp":
				c.selectSibling(-1)
				break
			case "ArrowDown":
				c.selectSibling(1)
				break
			case "ArrowLeft":
				c.parent?.select()
				break
			case "ArrowRight":
				currentlyScrolled[i + 1]?.select()
				break
			case "e":
				console.log("new node")
				const newC = new Child("hi")
				c.addChild(newC)

				// recompute time
				computeLayers()

				requestAnimationFrame(() => {
					newC.select()
				})

				break
			default:
		}
	}
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-y-hidden">
	{#each layers as layer, i}
		<Column {layer} {i} reselect={reselect(i)} bind:currentlyScrolled />
	{/each}
</div>
