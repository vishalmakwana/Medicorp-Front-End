import React, { useEffect, useState, useContext } from 'react'
import {
    Drawer, Toolbar, SwipeableDrawer, Paper, Grid, Box, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography, IconButton, Divider,
} from "@mui/material"
import { ChevronRight, Menu as MenuIcon } from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStyles, PropTypes, appSettings, Context } from '@medicorp'

const FlyoutMenuItem = ({ item, classes, nav }) => {
    const Component = Array.isArray(item.children) ? MultiLevel : SingleLevel
    return item.isVisible ? <Component item={item} classes={classes} nav={nav} /> : <></>
}

const SingleLevel = ({ item, classes, nav }) => {
    const { id, icon: ItemIcon, title, to, hasDivider } = item
    const navigate = useNavigate()
    const selected = nav.base === id
    return (

        <>
            {hasDivider && <Divider sx={classes.lightDivider} />}
            {hasDivider && <Divider sx={classes.lightDivider} />}
            <MenuItem
                onClick={() => navigate(to, { replace: true })}
                component={Link}
                to={to}
                selected={selected}
                sx={[classes.menuList, { padding: "8px 20px" }]}
            >
                {ItemIcon && <ListItemIcon><ItemIcon /></ListItemIcon>}
                <ListItemText primary={title} />
            </MenuItem>
        </>
    )
}

const MultiLevel = ({ item, classes, nav }) => {
    const { id: itemId, icon: ItemIcon, title, children } = item
    const navigate = useNavigate()
    const { menuItem } = useStyles()
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedListItem, setSelectedListItem] = useState(false)
    const selectedMenuIndex = children.length > 0 ?
        children.findIndex(cItem => cItem.to.split('/').join('') === nav.location.split('/').join('')) : -1
    useEffect(() => {
        setSelectedListItem(nav.base === itemId)
    }, [nav])

    const handleClick = ({ currentTarget }) => {
        setAnchorEl(currentTarget)
        setSelectedListItem(true)
    }
    const handleClose = () => {
        setAnchorEl(null)
        setSelectedListItem(false)
    }
    const handleMenuClick = (navigateTo) => {
        navigate(navigateTo, { replace: true })
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? itemId : undefined

    return (
        <>
            <ListItemButton onClick={handleClick} sx={classes.menuList} selected={selectedListItem}>
                <ListItemIcon><ItemIcon /></ListItemIcon>
                <ListItemText primary={title} sx={{ flex: '1 0 auto' }} />
                <ChevronRight />
            </ListItemButton>
            <Menu
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                component={Link}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={classes.menu}
                PaperProps={{
                    elevation: 0
                }}
            >
                <Toolbar variant='dense' disableGutters>
                    <Typography variant="subtitle2" color="InactiveCaptionText">{title}</Typography>
                </Toolbar>
                {children.map((child, index) => child.isVisible && (
                    <MenuItem
                        sx={menuItem}
                        key={child.id}
                        onClick={() => setAnchorEl(null)}
                        selected={index === selectedMenuIndex}
                    >
                        {child.title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

const Flyout = (props) => {
    const { window, menuObj } = props
    const { mobileOpen, handleDrawerToggle, open } = menuObj
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    const { menus } = useContext(Context)
    const classes = useStyles()
    const url = useLocation()

    const location = url.pathname.toLowerCase()
    const base = location.split('/')[2]

    const container = window !== undefined ? () => window().document.body : undefined

    const menuItems = menus.map((item, key) => {
        return <FlyoutMenuItem key={key} item={item} classes={classes} nav={{ base, location }} />
    })
    const drawerClass = open ? classes.drawerOpen : classes.drawerClose
    return (
        <>
            {
                menuItems &&
                <Box
                    component="nav"
                    sx={classes.drawer}>
                    <SwipeableDrawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={() => handleDrawerToggle(true)}
                        onOpen={() => handleDrawerToggle(true)}
                        sx={[classes.smUp, classes.drawerPaper]}
                        ModalProps={{
                            keepMounted: false,
                        }}>
                        <Paper sx={classes.paddedMenuMobile} square elevation={1}>
                            <Grid item sx={classes.title}>
                                {/* <img src={appSettings.appLogo} alt="Medicorp" style={{ height: '1.5rem' }} /> */}
                                <Typography variant="h6" gutterBottom component="div" style={{ color: "#94121a", fontWeight: 'bold', height: '1.5rem' }}>
                                    MEDICORP
                                </Typography>
                            </Grid>
                        </Paper>
                        <Box component="div" sx={classes.drawerContainer} >
                            {menuItems}
                        </Box>
                    </SwipeableDrawer>
                    <Drawer
                        sx={[classes.smDown, drawerClass]}
                        variant="permanent">
                        <Toolbar variant="dense" disableGutters>
                            <Grid container spacing={2}>
                                <Grid item xs={4} >
                                    <IconButton
                                        onClick={() => {
                                            handleDrawerToggle(false)
                                            setIsMenuOpen(!isMenuOpen)
                                        }} sx={[classes.smDown, classes.menuIcon]}>
                                        <MenuIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={8} sx={classes.title}>
                                    <Typography variant="h6" gutterBottom component="div" style={{ color: "#94121a", fontWeight: 'bold', margin: '4px', display: isMenuOpen ? 'block' : 'none' }}>
                                        MEDICORP
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                        <Divider sx={classes.lightDivider} />
                        <Box component="div" sx={classes.drawerContainer}>
                            {menuItems}
                        </Box>
                    </Drawer>
                </Box>
            }
        </>
    )
}
Flyout.propTypes = {
    window: PropTypes.func,
}
export default Flyout
