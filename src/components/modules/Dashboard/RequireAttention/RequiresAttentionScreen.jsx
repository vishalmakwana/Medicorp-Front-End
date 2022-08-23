import React, { Fragment } from "react"
import { List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, Typography } from "@mui/material"
import { ChevronRightOutlined } from "@mui/icons-material"
import { grey } from "@mui/material/colors"
import { useRequiresAttention } from '@medicorp'

const RequiresAttentionScreen = () => {
    const { categoryEnum, items } = useRequiresAttention()
    const getMappedItem = ({
        id,
        categoryId,
        categoryCount,
        route
    }) => {
        const { CategoryIcon, borderColor, title } = categoryEnum[categoryId]
        return (
            <Fragment key={id}>
                <ListItem
                    sx={{ pl: 1, paddingY: 0.95 }}
                // secondaryAction={
                //     <IconButton edge="end" aria-label="chevronrightoutlined">
                //         <ChevronRightOutlined />
                //     </IconButton>
                // }
                >
                    <ListItemIcon>
                        <CategoryIcon sx={{ color: borderColor, fontSize: 30 }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography
                                color={grey[800]}>
                                <b>{categoryCount}</b>
                            </Typography>
                        }
                        secondary={
                            <Typography
                                color={grey[800]}
                                variant="subtitle2"
                                sx={{ fontWeight: '300' }}>
                                {title}
                            </Typography>
                        } />
                </ListItem>
                <Divider variant="inset" component="li" />
            </Fragment>
        )
    }
    return <List>{items.map((item) => getMappedItem(item))}</List>
}

export default RequiresAttentionScreen