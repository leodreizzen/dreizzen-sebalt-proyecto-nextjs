export function itemsDifferCheckOrder(p1: { id: number }[], p2: { id: number }[]): boolean {
    return p1.length !== p2.length || p1.some((product, index) => product.id !== p2[index].id)
}

export function itemsDifferIgnoreOrder(p1: { id: number }[], p2: { id: number }[]): boolean {
    return p1.length !== p2.length || p1.some(product => !p2.find(p => p.id === product.id))
}