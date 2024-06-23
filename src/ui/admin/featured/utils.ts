export function itemsDifferCheckOrder(p1: { id: number }[], p2: { id: number }[]): boolean {
    return p1.length !== p2.length || p1.some((item, index) => item.id !== p2[index].id)
}

export function tagsDifferCheckOrder(t1: {tag: { id: number }}[], t2: {tag: { id: number }}[]): boolean {
    return t1.length !== t2.length || t1.some((item, index) => item.tag.id !== t2[index].tag.id)
}

export function itemsDifferIgnoreOrder(p1: { id: number }[], p2: { id: number }[]): boolean {
    return p1.length !== p2.length || p1.some(item => !p2.find(p => p.id === item.id))
}