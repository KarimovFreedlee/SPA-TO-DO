export const writeLocalStorage = (key: string, value: any) => {
    const newValue = JSON.stringify(value)
    localStorage.setItem(key, newValue)
}

export const readLocalStorage = (key: string, defaultItem: string) => {
    const item: string = localStorage.getItem(key) || defaultItem
    return JSON.parse(item)
}