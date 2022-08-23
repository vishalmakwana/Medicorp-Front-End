import { Avatar, Button, Chip, Grid, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { SearchBox, useStyles, useTableIcons, SearchBox2 } from "@medicorp"
import React from "react"

const SearchBar = ({ options, CTAButtons, CTAButton2, clearCTAButton, filterReportLabel }) => {
    const { title, searchItems, handleSearch, spacing, variant } = options
    const classes = useStyles()
    const { tableIcons } = useTableIcons()

    // const searchNodes = searchItems.map(sitem => (
    //     <Grid item xs={12} sm={6} md key={sitem.name}>
    //         <SearchBox2 variant={variant} {...sitem} />
    //     </Grid>
    // ))
    const searchAction = CTAButtons?.length > 0 &&
        CTAButtons.map(item => (
            <Button
                key={item.title}
                onClick={item.handleClick}
                variant="contained"
                color="info"
                size="small"
            >
                {item.title}
            </Button>))

    const favoriteAction = CTAButton2?.length > 0 &&
        CTAButton2.map(item => (
            <Button
                key={item.title}
                onClick={item.handleClick}
                variant="contained"
                color="secondary"
                size="small"
            >
                {item.title}
            </Button>))

    return (
        <Paper elevation={4} sx={classes.searchContentRoot} >
            <Grid container spacing={spacing ?? 3} alignItems="center" sx={classes.mb2}>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Stack direction="row" justifyContent="end" spacing={1.5}>{favoriteAction}</Stack>
                </Grid>
                <SearchBox2
                    variant={variant}
                    formContent={searchItems}
                />
            </Grid>
            <Grid container direction="row" alignContent='çenter'>
                <Grid item xs={4} sx={{ alignSelf: 'center' }}>
                    <Stack direction="row" spacing={2}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mr: 1.5 }}>Report Label:</Typography>
                        <Stack direction="row" spacing={1}>
                            {
                                filterReportLabel && filterReportLabel.map((val) =>
                                    <Chip label={val} color="primary" />
                                )
                            }
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={3} sx={{ alignSelf: 'center' }}>
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                        <Button
                            key={clearCTAButton.title}
                            onClick={clearCTAButton.handleClick}
                            variant="contained"
                            sx={classes.grayButton}
                            size="small"
                        >
                            {clearCTAButton.title}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={5}>
                    <Stack direction="row" justifyContent="end" spacing={1.5}>{searchAction}</Stack>
                </Grid>
            </Grid>
        </Paper>
    )

}

export { SearchBar }