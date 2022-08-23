import React from "react"
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import { useRecentScreens } from '@medicorp'

const RecentScreens = () => {
    const { statusEnum, recentsWprksData } = useRecentScreens()

    const getMappedItem = ({ id, title, statusId, status }) => {
        const { StatusIcon, iconBg } = statusEnum[statusId]
        return (
            <ListItem
                key={id}
                sx={{ pl: 1 }}
            >
                <ListItemAvatar >
                    <Avatar
                        sx={{
                            width: 30, height: 30,
                            bgcolor: iconBg,
                            boxShadow: `0px 5px 5px -3px ${iconBg}33, 0px 8px 10px 1px ${iconBg}14, 0px 3px 14px 2px ${iconBg}1F`
                        }}
                    >
                        <StatusIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography
                            color={grey[800]}>
                            <b>{title}</b>
                        </Typography>
                    }
                    secondary={
                        <Typography
                            color={grey[800]}
                            variant="subtitle2"
                            sx={{ fontWeight: '300' }}>
                            {status}
                        </Typography>
                    } />
            </ListItem>
        )
    }

    return <List sx={{ overflow: 'auto', height: 238 }}>
        {/* {recentsWprksData?.map((item) => getMappedItem(item))} */}
    </List>
}

export default RecentScreens