import React from "react"
import { Box, Avatar, Stack, Typography, TextField, CircularProgress, Grid } from "@mui/material"
import { grey } from "@mui/material/colors"
import { LocalizationProvider, AdapterMoment, StaticDatePicker, useOverview, DatePicker } from "@medicorp"

const Overview = () => {
    const {
        items,
        value,
        handleDateChange,
        overviewLoading
    } = useOverview()

    const JobItem = ({ item }) => (
        <Box sx={{ minWidth: '18%', m: 1 }}>
            <Stack direction='row' spacing={2}>
                <Avatar
                    sx={{
                        bgcolor: item.iconBg,
                        width: 56,
                        height: 56,
                        boxShadow: `0px 5px 5px -3px ${item.iconBg}33, 0px 8px 10px 1px ${item.iconBg}14, 0px 3px 14px 2px ${item.iconBg}1F`
                    }}
                    variant="rounded"
                >
                    <item.icon sx={{ width: 32, height: 32 }} />
                </Avatar>
                <Stack>
                    <Typography color={grey[500]} gutterBottom variant="subtitle2" sx={{ fontWeight: '300' }}>{item.title}</Typography>
                    <Typography variant="h6" color={grey[800]}>
                        {
                            <Stack direction={"column"} spacing={0.5}>
                                {
                                    overviewLoading === true ?
                                        <Box>
                                            <CircularProgress size="1.35rem" /></Box> : item.subtitle
                                }
                            </Stack>
                        }
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )

    return (
        <Grid container spacing={2} sx={{
            display: "flex",
            flexDirection: "row"
        }}>
            {/* <Grid item xs={12} md={2} sx={{
                mr: 1.5,
                marginTop: 1
                //borderRadius: 5,
                // boxShadow: `0px 5px 5px -3px ${grey[500]}33, 0px 8px 10px 1px ${grey[500]}14, 0px 3px 14px 2px ${grey[500]}1F`,
                // '& .PrivatePickersToolbar-root': {
                //     pt: 0,
                //     borderRadius: 5
                // },
                // '& .PrivatePickersSlideTransition-root': {
                //     minHeight: 240,
                //     borderRadius: 5
                // }
            }}
            >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        displayStaticWrapperAs="desktop"
                        value={value}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{
                            pt: '0px'
                        }}
                    />
                </LocalizationProvider>
            </Grid> */}
            <Grid item xs={12} md={12}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: 'wrap',
                    flexGrow: 1,
                    alignContent: 'flex-start',
                    justifyContent: "space-between"
                }}
            >
                {items.map((item, index) => <JobItem key={index} item={item} />)}
            </Grid>
        </Grid>
    )
}

export default Overview