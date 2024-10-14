<script lang="ts">
	import { Child } from "$lib/child.svelte"
	import Column from "$lib/components/Column.svelte"
	import child from "$lib/decode"
	import { onMount } from "svelte"

	let layers: Child[][] = $state([])

	function computeLayers(): void {
		const newLayers = [[child]]
		for (let i = 0; newLayers[i]?.length > 0; i++)
			newLayers.push(newLayers[i].flatMap(c => c.children))
		newLayers.pop()
		layers = newLayers
	}

	onMount(() => {
		computeLayers()
		child.select()
	})

	let currentlyScrolled = $state<Child[]>([])

	// lolll
	const reselect =
		(i: number) =>
		(c: Child) =>
		(e: KeyboardEvent): void => {
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
				case "e": {
					const newC = new Child("", c.layer + 1)
					c.addChild(newC)

					computeLayers()
					requestAnimationFrame(() => {
						newC.select()
						newC.modifying = true
					})
					break
				}
				case "s": {
					if (!c.parent) return
					const newC = new Child("", c.layer)
					c.parent.addChild(newC, c)

					computeLayers()
					requestAnimationFrame(() => {
						newC.select()
						newC.modifying = true
					})
					break
				}
				default:
			}
		}
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-y-hidden">
	{#each layers as _, i}
		<Column bind:layers {i} reselect={reselect(i)} bind:currentlyScrolled />
	{/each}
</div>
