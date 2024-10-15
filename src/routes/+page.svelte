<script lang="ts">
	import { Child, Column, layers } from "$lib/child.svelte"
	import ColumnC from "$lib/components/Column.svelte"
	import child from "$lib/decode"
	import { onMount } from "svelte"

	const ls: Column[] = [new Column([child])]
	for (let i = 0; ls[i].nodes.length > 0; i++)
		ls[i + 1] = new Column(ls[i].nodes.flatMap(c => c.children))

	ls.pop()
	layers.l = ls
	$inspect(layers.l)

	onMount(() => {
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
				case "ArrowDown": {
					const currentLayer = layers.l[c.layer]
					if (currentLayer.nodes.length === 0) return

					const prevI =
						currentLayer.nodes.indexOf(c) +
						(e.key === "ArrowUp" ? -1 : 1)
					if (prevI < 0 || prevI >= currentLayer.nodes.length) return

					currentLayer.nodes[prevI].select()
					break
				}
				case "ArrowLeft":
					c.parent?.select()
					break
				case "ArrowRight":
					currentlyScrolled[i + 1]?.select()
					break
				case "e": {
					// new child
					const l = c.layer + 1

					const newC = new Child("", l)
					c.addChild(newC)

					// requestAnimationFrame(() => {
					// 	newC.select()
					// 	newC.modifying = true
					// })
					break
				}
				case "s": {
					if (!c.parent) return
					// new sibling
					const l = c.layer

					const newC = new Child("hi", l)
					c.parent.addChild(newC, c)

					// requestAnimationFrame(() => {
					// 	newC.select()
					// 	newC.modifying = true
					// })
					break
				}
				default:
			}
		}
</script>

<div class="h-screen flex box-border py-4 px-2 overflow-y-hidden">
	{#each layers.l as column, i}
		<ColumnC {i} reselect={reselect(i)} bind:currentlyScrolled {column} />
	{/each}
</div>
