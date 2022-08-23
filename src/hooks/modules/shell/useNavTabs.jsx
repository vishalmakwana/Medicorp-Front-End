import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Context } from '@medicorp'

const useNavTabs = () => {
    const url = useLocation()
    const { menus } = useContext(Context)
    const location = url.pathname.toLowerCase()
    const base = location.split('/')[1]
    const tabItems = (menus.find(item => item.id === base && item.isVisible)?.children ?? [])?.filter(item => item?.isVisible === true)
    const selectedIndex = tabItems.length > 0 ?
        tabItems.findIndex(item => item.to.split('/').join('') === location.split('/').join('')) : -1

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (selectedIndex >= 0 && selectedIndex !== value) {
            setValue(selectedIndex)
        }
    }, [selectedIndex])

    return {
        tabItems,
        value,
        handleChange
    }
}

export default useNavTabs
