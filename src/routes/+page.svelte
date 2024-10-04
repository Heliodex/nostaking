<script lang="ts">
	import { Child } from "$lib/child.svelte"
	import { onMount } from "svelte"
	import Column from "$lib/components/Column.svelte"

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

	onMount(() => {
		child.select()
	})

	const layers = child.layers
</script>

<div class="h-screen flex box-border py-4 px-2">
	{#each layers as layer}
		<div class="w-35 px-2 overflow-hidden">
			<Column {layer} />
		</div>
	{/each}
</div>
