export class Child {
	text = $state("")
	id: string = ""
	children: Child[] = []
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")
	modifying = $state(false)
	scrollTo = () => {}
	focus = () => {}

	get siblings() {
		return this.parent?.children || []
	}

	get layers(): Child[][] {
		const layers: Child[][] = [
			[this], // top layer of the tree
		]
		let layer = layers[0]
		while (layer.length > 0) {
			const nextLayer: Child[] = []
			for (const child of layer) nextLayer.push(...child.children)
			if (nextLayer.length > 0) layers.push(nextLayer)
			layer = nextLayer
		}
		return layers
	}
	get currentLayer() {
		let parent = this.parent
		while (parent?.parent) parent = parent.parent

		return parent?.layers.find(l => l.includes(this))
	}

	get ancestors(): Child[] {
		const ancestors: Child[] = []
		let parent = this.parent
		while (parent) {
			ancestors.push(parent)
			parent = parent.parent
		}
		return ancestors
	}

	applyToAncestors(fn: (n: Child) => void) {
		for (const a of this.ancestors) fn(a)
	}

	applyToSubtree(fn: (n: Child) => void) {
		for (const l of this.layers) for (const c of l) if (c !== this) fn(c)
	}

	applyToTree(fn: (n: Child) => void) {
		let parent = this as Child
		while (parent?.parent) parent = parent.parent

		fn(parent)
		parent.applyToSubtree(fn)
	}

	applyToSiblings(fn: (n: Child) => void) {
		for (const s of this.siblings) if (s !== this) fn(s)
	}

	scrollToTree() {
		for (const a of this.ancestors) a.scrollTo()
		this.scrollTo()
		for (const l of this.layers)
			l[Math.floor((l.length - 1) / 2)].scrollTo()
	}

	select() {
		this.applyToTree(n => {
			n.status = "none"
			n.modifying = false
		})
		this.status = "selected"

		function highlight(n: Child) {
			n.status = "highlighted"
		}
		this.applyToSubtree(highlight)
		this.applyToAncestors(highlight)
		this.applyToSiblings(highlight)

		requestAnimationFrame(() => {
			this.scrollToTree()
			this.focus()
		})
	}

	get previous(): Child | undefined {
		const layer = this.currentLayer || []
		const i = layer.indexOf(this)
		if (i > 0) return layer[i - 1]
	}
	get next(): Child | undefined {
		const layer = this.currentLayer || []
		const i = layer.indexOf(this)
		if (i < layer.length - 1) return layer[i + 1]
	}
	selectPrevious() {
		const { previous } = this
		if (previous) previous.select()
	}
	selectNext() {
		const { next } = this
		if (next) next.select()
	}

	addChild(c: Child) {
		c.parent = this
		this.children.push(c)
	}

	constructor(text: string) {
		this.text = text
		this.id = Math.random().toString(36).substring(2, 9)
	}
}
