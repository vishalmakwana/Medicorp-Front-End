import { Box, Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDashboard, Overview, RecentScreens, RequiresAttentionScreen, SystemOverviewScreen } from "@medicorp"
const Dashboard = () => {
    const {

    } = useDashboard()
    return (
        <Stack mt={2} spacing={2}>
            <Card raised>
                <CardHeader title="Overview" />
                <CardContent>
                    <Overview />
                </CardContent>
            </Card>
            {/* <Grid container>
                <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
                    <Card raised>
                        <CardHeader title="Recent Jobs" />
                        <CardContent>
                            <RecentScreens />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card raised>
                        <CardHeader title="Requires Attention" />
                        <CardContent>
                            <RequiresAttentionScreen />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}
            <Card raised>
                <CardHeader title="System Overview" />
                <CardContent>
                    <SystemOverviewScreen />
                </CardContent>
            </Card>
        </Stack>
    )
}

export default Dashboard