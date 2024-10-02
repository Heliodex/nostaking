export class Child {
	text: string = ""
	id: string = ""
	children: Child[] = []
	parent?: Child
	shiftedLeft = $state(0)
	x = $state(0)
	y = $state(0)
	width = $state(0)
	height = $state(0)
	totalWidth = $state(0)

	get siblings() {
		return this.parent?.children || []
	}

	get depthBelow(): number {
		return this.children.length > 0
			? Math.max(...(this.children?.map(c => c.depthBelow) || [0])) + 1
			: 1
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
