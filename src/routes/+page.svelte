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

	const layers = child.layers
</script>

<div class="h-screen flex box-border py-4 px-2">
	{#each layers as layer}
		<div class="px-2 flex flex-col gap-4 w-35">
			{#each layer as child}
				<Node {child} />
			{/each}
		</div>
	{/each}
</div>
