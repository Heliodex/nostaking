export class Child {
	text = $state("")
	modifyingText = $state("")
	id: string = ""
	children: Child[] = $state([])
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")
	modifying = $state(false)
	scrollTo = () => {}
	button = $state<HTMLButtonElement>()

	get layers(): Child[][] {
		const layers: Child[][] = []
		let layer: Child[] = [this] // top layer of the tree
		while (layer.length > 0) {
			layers.push(layer)
			layer = layer.flatMap(c => c.children)
		}
		return layers
	}

	flush() {
		this.text = this.modifyingText
		this.modifying = false
		requestAnimationFrame(() => {
			this.modifyingText = ""
		})
	}

	select() {
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

	selectSibling(n: number) {
		let p: Child = this
		while (p.parent) p = p.parent

		const l = p.layers.find(l => l.includes(this)) || []
		l[l.indexOf(this) + n]?.select()
	}

	addChild(c: Child, after?: Child) {
		c.parent = this
		if (after) {
			if (after.parent !== this) return
			this.children.splice(this.children.indexOf(after) + 1, 0, c)
		} else this.children.push(c)
	}

	constructor(text: string) {
		this.text = text
		this.id = Math.random().toString(36).substring(2, 9)
	}
}
