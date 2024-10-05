export class Child {
	text: string = ""
	id: string = ""
	children: Child[] = []
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")
	modifying = $state(false)
	scrollTo = () => {}

	get siblings() {
		return this.parent?.children || []
	}

	get layers() {
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

	get ancestors(): Child[] {
		const ancestors: Child[] = []
		let parent = this.parent
		while (parent) {
			ancestors.push(parent)
			parent = parent.parent
		}
		return ancestors
	}

	setTreeStatus(status: typeof this.status) {
		let parent = this as Child
		while (parent?.parent) parent = parent.parent

		parent.status = status
		parent.setSubtreeStatus(status)
	}

	setAncestorStatus(status: typeof this.status) {
		for (const a of this.ancestors) a.status = status
	}
	setSubtreeStatus(status: typeof this.status) {
		for (const l of this.layers)
			for (const c of l) if (c !== this) c.status = status
	}
	setSiblingStatus(status: typeof this.status) {
		for (const s of this.siblings) if (s !== this) s.status = status
	}

	scrollToTree() {
		for (const a of this.ancestors) a.scrollTo()
		this.scrollTo()
		for (const l of this.layers) l[0].scrollTo()
	}

	select() {
		this.scrollToTree()
		this.setTreeStatus("none")
		this.status = "selected"
		this.setSubtreeStatus("highlighted")
		this.setAncestorStatus("highlighted")
		this.setSiblingStatus("highlighted")
	}

	constructor(text: string, ...children: Child[]) {
		this.text = text
		this.id = Math.random().toString(36).substring(2, 9)
		for (const child of children) child.parent = this
		this.children = children
	}
}
