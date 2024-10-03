export class Child {
	text: string = ""
	id: string = ""
	children: Child[] = []
	parent?: Child
	status: "none" | "highlighted" | "selected" = $state("none")

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

	setTreeStatus(status: typeof this.status) {
		let parent = this as Child
		while (parent?.parent) parent = parent.parent

		parent.status = status
		parent.setSubtreeStatus(status)
	}

	setAncestorStatus(status: typeof this.status) {
		let parent = this as Child
		while (parent?.parent) {
			parent = parent.parent
			parent.status = status
		}
	}
	setSubtreeStatus(status: typeof this.status) {
		for (const layer of this.layers)
			for (const child of layer) if (child !== this) child.status = status
	}

	constructor(text: string, ...children: Child[]) {
		this.text = text
		this.id = Math.random().toString(36).substring(2, 9)
		for (const child of children) child.parent = this
		this.children = children
	}
}
