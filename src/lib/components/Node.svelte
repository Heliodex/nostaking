<script lang="ts">
	import type { Child } from "$lib/child.svelte"

	type Props = {
		child: Child
	}
	let { child }: Props = $props()
</script>

<button
	class="p-2 px-3 rounded-2 border-0 text-left"
	class:opacity-50={child.status === "none"}
	class:opacity-75={child.status === "highlighted"}
	onclick={() => {
		if (child.status === "selected") {
			child.setTreeStatus("none")
		} else {
			child.setTreeStatus("none")
			child.status = "selected"
			child.setSubtreeStatus("highlighted")
			child.setAncestorStatus("highlighted")
		}
	}}>
	{child.text}
	<br />
	{child.status}
</button>
