<script lang="ts">
	import type { Child } from "$lib/child.svelte"

	type Props = {
		child: Child
		scrollTo: (top: number) => void
		column: HTMLDivElement
	}
	let { child, scrollTo, column }: Props = $props()

	function statusClass() {
		const s = child.status
		if (s === "none") return "opacity-33"
		if (s === "highlighted") return "opacity-66"
		return ""
	}

	let button = $state<HTMLButtonElement>()
	let input = $state<HTMLInputElement>()

	child.scrollTo = () => {
		if (!button) return
		// find position of button in parent
		const parentRect = column.getBoundingClientRect()
		const buttonRect = button.getBoundingClientRect()
		scrollTo(parentRect.top - buttonRect.top)
	}
</script>

{#if child.modifying}
	{input?.focus()}
	<input
		class="p-2 px-3 rounded-2 text-left {statusClass()} transition-opacity duration-300 bg-black text-white border-1 border-white"
		bind:this={input}
		bind:value={child.text} />
{:else}
	<button
		class="p-2 px-3 rounded-2 border-0 text-left {statusClass()} transition-opacity duration-300"
		bind:this={button}
		onclick={() => {
			if (child.status === "selected") {
				child.modifying = true
			} else child.select()
		}}>
		{child.text}
	</button>
{/if}
