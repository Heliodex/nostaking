export class Child {
	text: string = ""
	id: string = ""
	children: Child[] = []
	parent?: Child
	rect: DOMRect = $state(new DOMRect())

	get siblings() {
		return this.parent?.children || []
	}

	get depthBelow(): number {
		return Math.max(...(this.children?.map(c => c.depthBelow) || [0])) + 1
	}

	get descendants(): Child[] {
		return [this, ...this.children.flatMap(c => c.descendants)]
	}

	constructor(text: string, ...children: Child[]) {
		this.text = text
		this.id = Math.random().toString(36).substring(2, 9)
		for (const child of children) child.parent = this
		this.children = children
	}
}

