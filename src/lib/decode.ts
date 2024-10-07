import { Child } from "$lib/child.svelte"

const notes = await (await fetch("/notes.txt")).text()

const lines = notes.split("\n")
lines.pop() // remove the last empty line

const nodes: Child[] = []
for (const line of lines) {
	// each line begins with a number of tabs
	const tabs = line.match(/^\t*/)?.[0].length || 0

	const parent = nodes[tabs - 1]
	const text = line.trim()
	const newChild = new Child(text)
	parent?.addChild(newChild)
	nodes[tabs] = newChild
}


export default nodes[0]
