import React from 'react'
import { Box, Typography, Divider, Grid, Paper } from '@mui/material'

const SmartLayout = (props) => {
    const leftPanel = props.children.filter(item => item.props.panel === 'left')
    const rightPanel = props.children.filter(item => item.props.panel === 'right')

    if (leftPanel.length > 0 && rightPanel.length > 0) {
        return (
            <Box sx={{ width: '100%' }}>
                {props.heading && <Typography variant="body1" sx={{ textAlign: 'center' }}>{props.heading}</Typography>}
                <Box sx={{ my: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }} elevation={6}>
                                <Grid container spacing={2}>
                                    {leftPanel}
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }} elevation={6}>
                                <Grid container spacing={2}>
                                    {rightPanel}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                {props.withDivider && <Divider variant="middle" />}
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            {props.heading && <Typography variant="body1">{props.heading}</Typography>}
            <Box sx={{ my: 3 }}>
                <Grid container spacing={2}>
                    {props.children}
                </Grid>
            </Box>
            {props.withDivider && <Divider variant="middle" />}
        </Box>
    )
}

export default SmartLayout