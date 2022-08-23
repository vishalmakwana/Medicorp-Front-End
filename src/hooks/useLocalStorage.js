export default function useLocalStorage() {
    const setAppItem = (key, value) => localStorage.setItem(key, value)
    const getAppItem = (key,defaultVal) => {
        return localStorage.getItem(key) ?? defaultVal
    }
    const removeAppItem = (key) => localStorage.removeItem(key)
    const clearAll = () => localStorage.clear()
    return { setAppItem, getAppItem, removeAppItem, clearAll }
}