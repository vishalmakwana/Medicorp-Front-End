import React from "react"
import { Box, Stack, Typography, Button, styled } from "@mui/material"
import { grey } from "@mui/material/colors"
import { ArrowRight } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
import { Strings, useSystemOverview } from '@medicorp'

const InfoButton = styled(Button)(({ theme }) => ({
    borderRadius: "0 0 8px 8px",
    color: grey[50],
    backgroundColor: `${theme.palette.grey[900]}33`,
    "&:hover": {
        backgroundColor: `${theme.palette.grey[900]}55`
    }
}))
const SystemItem = ({ item }) => {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                m: 1,
                borderRadius: 2,
                background: item.background,
                boxShadow: `0px 5px 5px -3px ${item.background}45, 0px 8px 10px 1px ${item.background}28, 0px 3px 14px 2px ${item.iconBg}3F`
            }}
        >
            <Stack direction="row" p={2.5}>
                <Stack>
                    <Typography variant="h5" gutterBottom color={grey[50]}>
                        {item.subtitle}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "300", width: 160 }} color={grey[50]}>
                        {item.title}
                    </Typography>
                </Stack>
                <item.icon sx={{ width: 64, height: 64, color: `${grey[900]}33` }} />
            </Stack>
            <Box>
                {
                    item.navigate !== "" ? <>
                        <InfoButton variant="contained" disableElevation fullWidth endIcon={
                            <ArrowRight />
                        }
                            onClick={() => navigate(item.navigate)}
                        > {Strings.VIEW_DETAILS}
                        </InfoButton>
                    </> : <></>
                }
            </Box>
        </Box>
    )
}
const SystemOverviewScreen = () => {
    const { items } = useSystemOverview()
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }}
        >
            {items.map((item, index) => (
                <SystemItem key={index} item={item} />
            ))}
        </Box>
    )
}

export default SystemOverviewScreen
