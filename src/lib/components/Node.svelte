<script lang="ts">
	import type { Child } from "$lib/child.svelte"

	type Props = {
		child: Child
		scrollTo: (top: number, c: Child) => void
		column: HTMLDivElement
		i: number
		currentlyScrolled: Child[]
	}
	let {
		child,
		scrollTo,
		column,
		i,
		currentlyScrolled = $bindable()
	}: Props = $props()

	function statusClass() {
		const s = child.status
		if (s === "none") return "opacity-33"
		if (s === "highlighted") return "opacity-66"
		return ""
	}
	let borderClass = $derived(
		child.children.length > 0 ? "" : "border-(3 solid neutral-400 l t b)"
	)

	let button = $state<HTMLButtonElement>()
	let textarea = $state<HTMLParagraphElement>()

	child.scrollTo = () => {
		if (!button) return
		// find position of button in parent
		const parentRect = column.getBoundingClientRect()
		const buttonRect = button.getBoundingClientRect()
		scrollTo(parentRect.top - buttonRect.top, child)
	}
	child.focus = () => {
		button?.focus()
	}

	let modifyingText = $state("")

	function finish() {
		child.modifying = false
		child.text = modifyingText
	}

	function setCursorToEnd() {
		if (!textarea) return
		const range = document.createRange()
		const selection = window.getSelection()
		range.selectNodeContents(textarea)
		range.collapse(false)
		selection?.removeAllRanges()
		selection?.addRange(range)
	}

	function reselect(e: KeyboardEvent) {
		switch (e.key) {
			case "ArrowUp":
				child.selectPrevious()
				break
			case "ArrowDown":
				child.selectNext()
				break
			case "ArrowLeft":
				child.parent?.select()
				break
			case "ArrowRight":
				currentlyScrolled[i + 1].select()
				break
			case "Space":
				modifyingText = child.text
				child.modifying = true
				break
			default:
		}
	}
</script>

{#if child.modifying}
	{textarea?.focus()}
	{setCursorToEnd()}
	<p
		class="textarea p-1 px-2 rounded-1 bg-black text-white {borderClass}"
		bind:this={textarea}
		bind:textContent={modifyingText}
		contenteditable="true"
		onblur={finish}
		onkeypress={e => {
			if (e.key === "Enter") finish()
		}}
		onkeydown={e => {
			if (e.key === "Escape") {
				child.modifying = false
				modifyingText = child.text
			}
		}}>
	</p>
{:else}
	{child.focus()}
	<button
		class="p-1 px-2 rounded-1 text-left transition-opacity duration-300 break-words border-0 {statusClass()} {borderClass}"
		bind:this={button}
		tabindex="0"
		onclick={() => {
			if (child.status === "selected") {
				modifyingText = child.text
				child.modifying = true
			} else child.select()
		}}
		onkeydown={reselect}>
		{child.text}
	</button>
{/if}
