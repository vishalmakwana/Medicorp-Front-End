import React from 'react'
import { Box, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import { PropTypes, styled, TreeItem, treeItemClasses } from '@medicorp'

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}))

export const StyledTreeItem = ({
  bgColor,
  color,
  labelIcon: LabelIcon,
  labelInfo,
  label: labelText,
  linkTo,
  ...other
}) => {
  return (
    <>
      {
        linkTo ?
          <NavLink to={linkTo} style={{ textDecoration: 'none', color: 'inherit' }}>
            <StyledTreeItemRoot
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                  <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                    {labelText}
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    {labelInfo}
                  </Typography>
                </Box>
              }
              style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
              }}
              {...other}
            />
          </NavLink>
          :
          <StyledTreeItemRoot
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                  {labelText}
                </Typography>
                <Typography variant="caption" color="inherit">
                  {labelInfo}
                </Typography>
              </Box>
            }
            style={{
              '--tree-view-color': color,
              '--tree-view-bg-color': bgColor,
            }}
            {...other}
          />
      }
    </>
  )
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType,
  labelInfo: PropTypes.string,
  label: PropTypes.string.isRequired,
  linkTo: PropTypes.string
}