<script lang="ts">
	import type { Child } from "$lib/child.svelte"

	type Props = {
		child: Child
		scrollTo: (top: number, c: Child) => void
		column: HTMLDivElement
		i: number
		reselect: (e: KeyboardEvent) => void
		currentlyScrolled: Child[]
	}
	let {
		child,
		scrollTo,
		column,
		i,
		reselect,
		currentlyScrolled = $bindable()
	}: Props = $props()

	function statusClass(): string {
		const s = child.status
		if (s === "none") return "bg-neutral-700"
		if (s === "highlighted") return "bg-neutral-400"
		return "bg-white"
	}
	let borderClass = $derived(
		child.children.length === 0 && i < currentlyScrolled.length - 1
			? "border-(r-3 solid neutral-500)"
			: ""
	)

	let textarea = $state<HTMLParagraphElement>()

	child.scrollTo = (): void => {
		if (!child.button) return
		// find position of button in parent
		const parentRect = column.getBoundingClientRect()
		const buttonRect = child.button.getBoundingClientRect()
		scrollTo(parentRect.top - buttonRect.top, child)
	}

	function finish(): void {
		child.flush()
		child.select()
	}

	function setCursorToEnd(): void {
		if (!textarea) return
		const range = document.createRange()
		const selection = window.getSelection()
		range.selectNodeContents(textarea)
		range.collapse(false)
		selection?.removeAllRanges()
		selection?.addRange(range)
	}
</script>

{#if child.modifying}
	{textarea?.focus()}
	{setCursorToEnd()}
	<p
		class="textarea p-1 px-2 rounded-1 bg-black text-white {borderClass}"
		bind:this={textarea}
		bind:textContent={child.modifyingText}
		contenteditable="true"
		onblur={finish}
		onkeypress={e => {
			if (e.key === "Enter") finish()
		}}
		onkeydown={e => {
			if (e.key === "Escape") {
				child.modifying = false
				child.modifyingText = ""
			}
		}}>
	</p>
{:else}
	<button
		class="p-1 px-2 rounded-1 text-left break-words border-0 {statusClass()} {borderClass}"
		bind:this={child.button}
		tabindex="0"
		onclick={e => {
			if (child.status === "selected") {
				child.modifying = true
				child.modifyingText = child.text
			} else child.select()
		}}
		onkeydown={reselect}>
		{child.text}
	</button>
{/if}
