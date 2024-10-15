export class Column {
	nodes: Child[] = $state([])
	column = $state<HTMLDivElement>()

	constructor(nodes: Child[]) {
		this.nodes = nodes
	}
}

export const layers = new (class {
	l = $state<Column[]>([])
})()

export class Child {
	text = $state("")
	modifyingText = $state("")
	id = ""
	children: Child[] = $state([])
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")
	modifying = $state(false)
	layer: number
	button = $state<HTMLButtonElement>()
	columnScrollTo = (_top: number, _c: this): void => {}

	get column(): HTMLDivElement {
		const col = layers.l[this.layer].column
		if (!col) throw new Error("column not found")
		return col
	}

	scrollTo(): void {
		// find position of button in parent
		const parentRect = this.column.getBoundingClientRect()
		const buttonRect = this.button.getBoundingClientRect()
		this.columnScrollTo(parentRect.top - buttonRect.top, this)
	}

	get layers(): Child[][] {
		const layers: Child[][] = []
		let layer: Child[] = [this] // top layer of the tree
		while (layer.length > 0) {
			layers.push(layer)
			layer = layer.flatMap(c => c.children)
		}
		return layers
	}

	flush(): void {
		this.text = this.modifyingText
		this.modifying = false
		requestAnimationFrame(() => {
			this.modifyingText = ""
		})
	}

	select(): void {
		const ancestors: Child[] = []
		let p: Child = this
		while (p.parent) {
			p = p.parent
			ancestors.push(p)
		}

		for (const l of p.layers)
			for (const c of l) {
				c.status = "none"
				c.modifying = false
			}
		for (const c of [
			...ancestors,
			...(this.parent?.children.filter(c => c !== this) || []),
			...this.layers.flat(),
		])
			c.status = "highlighted"
		this.status = "selected"

		requestAnimationFrame(() => {
			for (const a of ancestors) a.scrollTo()
			this.scrollTo()
			for (const l of this.layers)
				l[Math.floor((l.length - 1) / 2)].scrollTo()
			this.button?.focus()
		})
	}

	addChild(c: Child, after?: Child): void {
		c.parent = this
		if (!after) {
			this.children.push(c)
			if (layers.l.length > 0) {
				const { nodes } = layers.l[c.layer]
				nodes.push(c)
			}
			return
		}
		if (after.parent !== this) return

		this.children.splice(this.children.indexOf(after) + 1, 0, c)
		if (layers.l.length > 0) {
			const { nodes } = layers.l[c.layer]
			nodes.splice(nodes.indexOf(after) + 1, 0, c)
		}
	}

	constructor(text: typeof this.text, layer: typeof this.layer) {
		this.text = text
		this.layer = layer
		this.id = Math.random().toString(36).substring(2, 9)
	}
}
