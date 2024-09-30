export type Child = {
	text: string
	id: string
	children?: Child[]
}

export type Path = {
	parent: DOMRect
	node: DOMRect
}

export const id = () => Math.random().toString(36).substring(2, 9)
