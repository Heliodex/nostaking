import { Child } from "$lib/child.svelte"

const notes = await (await fetch("/notes.txt")).text()

const l = notes.split("\n")
const lines = l.slice(0, 15)

const nodes: Child[] = []
for (const line of lines) {
	// each line begins with a number of tabs
	const layer = line.match(/^\t*/)?.[0].length
	if (layer === undefined) continue

	const parent = nodes[layer - 1]
	const text = line.trim()
	const newChild = new Child(text, layer)
	parent?.addChild(newChild)
	nodes[layer] = newChild
}

export default nodes[0]
