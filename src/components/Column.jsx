import React from 'react'
import { Paper, Typography, TextField, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import { Droppable } from 'react-beautiful-dnd'
import { Widget, styled, useTableIcons, useStyles } from '@medicorp'

const ItemsContainer = styled('div')(({ theme, isDraggingOver }) => ({
    padding: theme.spacing(1),
    background: isDraggingOver ? '#ccc' : 'white',
    flexGrow: 1,
    height: '47vh', overflowY: 'auto'
}))
const Placeholder = styled('div')(({ isDropDisabled }) => ({
    display: isDropDisabled ? 'none' : 'block'
}))
const Column = ({
    columnId,
    title,
    searchable,
    filterWidgets,
    widgets,
    isDropDisabled,
    index,
    onEditClick,
    onDeleteClick,
    onSave,
    onCancel
}) => {
    const { tableIcons } = useTableIcons()
    const classes = useStyles()

    return (
        <Paper variant="outlined" sx={{ height: '60vh' }}>
            <Typography variant='body1' sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
            {searchable && (
                <TextField
                    fullWidth
                    variant="filled"
                    size="small"
                    label="Search Text"
                    onChange={filterWidgets}
                    sx={classes.searchField}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                    }}
                />
            )}
            <Droppable droppableId={columnId} isDropDisabled={isDropDisabled}>
                {
                    (provided, snapshot) => (
                        <ItemsContainer
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {
                                widgets.map((widget, i) => (
                                    <Widget
                                        key={widget.id}
                                        widget={widget}
                                        index={i}
                                        colIndex={index}
                                        onEditClick={onEditClick}
                                        onDeleteClick={onDeleteClick}
                                        actions={[
                                            {
                                                label: "Save",
                                                icon: tableIcons.DoneAction,
                                                isSubmit: true,
                                                color: 'success',
                                                size: 'small',
                                                sx: { marginRight: 1 },
                                                action: (data) => onSave(i, data)
                                            },
                                            {
                                                label: "Cancel",
                                                icon: tableIcons.CancelAction,
                                                color: 'error',
                                                size: 'small',
                                                sx: { marginRight: 1 },
                                                action: onCancel
                                            }
                                        ]} />
                                ))
                            }
                            <Placeholder isDropDisabled={isDropDisabled}>{provided.placeholder}</Placeholder>
                        </ItemsContainer>
                    )
                }
            </Droppable>
        </Paper>
    )
}

export default Column