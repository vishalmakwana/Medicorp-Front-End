import React from "react"
import {
    Toolbar,
    Grid,
    IconButton,
    Typography,
    Tooltip
} from "@mui/material"
import { useStyles } from "@medicorp"

const SmartToolBar = ({ title, icons, onAction, canCreate }) => {
    const classes = useStyles()
    return (
        <>
            <Toolbar>
                <Grid item xs sx={classes.title}>
                    <Typography variant="h6">{title}</Typography>
                </Grid>
                {canCreate === true && (
                    <Tooltip title="Add">
                        <IconButton onClick={onAction} edge="end">
                            <icons.Add />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </>
    )
}
export default SmartToolBar