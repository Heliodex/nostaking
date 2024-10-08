export class Child {
	text = $state("")
	id: string = ""
	children: Child[] = $state([])
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")
	modifying = $state(false)
	scrollTo = () => {}
	focus = () => {}

	get layers(): Child[][] {
		const layers: Child[][] = []
		let layer: Child[] = [this] // top layer of the tree
		while (layer.length > 0) {
			layers.push(layer)
			layer = layer.flatMap(c => c.children)
		}
		return layers
	}

	get ancestors(): Child[] {
		const ancestors: Child[] = []
		let p = this.parent
		while (p) {
			ancestors.push(p)
			p = p.parent
		}
		return ancestors
	}

	// got root?
	get root() {
		let p = this as Child
		while (p.parent) p = p.parent
		return p
	}

	applyToAncestors(fn: (n: Child) => void) {
		for (const a of this.ancestors) fn(a)
	}

	applyToSubtree(fn: (n: Child) => void) {
		for (const l of this.layers) for (const c of l) if (c !== this) fn(c)
	}

	applyToTree(fn: (n: Child) => void) {
		const { root } = this
		fn(root)
		root.applyToSubtree(fn)
	}

	applyToSiblings(fn: (n: Child) => void) {
		for (const s of this.parent?.children || []) if (s !== this) fn(s)
	}

	select() {
		function unHighlight(n: Child) {
			n.status = "none"
			n.modifying = false
		}
		function highlight(n: Child) {
			n.status = "highlighted"
		}

		const { root } = this
		unHighlight(root)
		root.applyToSubtree(unHighlight)
		this.applyToSubtree(highlight)
		this.applyToAncestors(highlight)
		this.applyToSiblings(highlight)
		this.status = "selected"

		requestAnimationFrame(() => {
			for (const a of this.ancestors) a.scrollTo()
			this.scrollTo()
			for (const l of this.layers)
				l[Math.floor((l.length - 1) / 2)].scrollTo()
			this.focus()
		})
	}

	selectSibling(n: number) {
		const l = this.root.layers.find(l => l.includes(this)) || []
		l[l.indexOf(this) + n]?.select()
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
