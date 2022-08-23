import { useState, useEffect } from 'react'
import { useLocalStorage } from '@medicorp'

function useMenuState() {
    const { setAppItem, getAppItem } = useLocalStorage()
    const [mobileOpen, setMobileOpen] = useState(false)
    const getMenuStateFromStorage = getAppItem('_menuOpened', "true") === "true"
    const [open, setOpen] = useState(getMenuStateFromStorage)
    useEffect(() => {
        setAppItem('_menuOpened', open)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
    const handleDrawerToggle = (isMobile = false) => {
        if (isMobile) setMobileOpen(!mobileOpen)
        else setOpen(!open)
    }
    return { mobileOpen, handleDrawerToggle, open }
}

export default useMenuState