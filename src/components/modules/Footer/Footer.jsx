import React from 'react'
import { Strings, useStyles } from '@medicorp'
import { Link } from '@mui/material'

const Footer = (props) => {
    const { mainClass } = props
    const classes = useStyles()
    return (
        <Link href="https://psoftcs.com/" target={"_blank"} sx={[mainClass, classes.footer]}>{Strings.COPYRIGHT}</Link>
    )
}

export default Footer