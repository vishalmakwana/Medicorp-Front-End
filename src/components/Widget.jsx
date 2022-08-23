import React from 'react'
import { styled } from '@mui/system'
import { Collapse, Grid, IconButton, Paper, Stack } from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
import { Draggable } from 'react-beautiful-dnd'
import { SmartContent } from '@medicorp'

const Item = styled('div')(
    ({ theme, isDragging, background, colIndex }) => `
    display: ${colIndex === 0 && 'flex'};
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    align-items: flex-start;
    align-content: flex-start;
    line-height: 1.5;
    border-radius: 3px;
    background: ${background};
    border: 1px
        ${isDragging ? 'dashed #4099ff' : 'solid #ddd'};
`)
const Clone = styled(Item)(
    ({ background }) => `
    + div {
        background: ${background};
    }    
`)
const Header = styled("div")`
  display: flex;
  flex-grow: 1;
`;

const Widget = ({ widget, index, colIndex, onEditClick, onDeleteClick, actions }) => {
    return (
        <Draggable draggableId={widget.id} index={index}>
            {
                (provided, snapshot) => (
                    <>
                        {
                            colIndex === 0 ?
                                <Item
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    background={widget.background}
                                    isDragging={snapshot.isDragging}
                                    colIndex={colIndex}>
                                    {widget.title}
                                </Item>
                                :
                                <Item
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    background={widget.background}
                                    isDragging={snapshot.isDragging}
                                    colIndex={colIndex}>
                                    <Header>
                                        <Grid container alignItems="center">
                                            <Grid item xs={10}>
                                                {widget.title}
                                            </Grid>
                                            <Grid container item xs justifyContent="flex-end">
                                                <>
                                                    {widget.editable && !widget.open && (
                                                        <IconButton onClick={() => onEditClick(widget.id, index)}>
                                                            <Edit />
                                                        </IconButton>
                                                    )}
                                                    <IconButton onClick={() => onDeleteClick(widget.id, index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </>
                                            </Grid>
                                        </Grid>
                                    </Header>
                                    <Collapse in={widget.open}>
                                        <Paper elevation={6} sx={{ padding: 2 }}>
                                            <Stack spacing={2}>
                                                <SmartContent
                                                    formHeader={{ alignActions: 'flex-start' }}
                                                    formContent={widget.data}
                                                    formActions={actions} />
                                            </Stack>
                                        </Paper>
                                    </Collapse>
                                </Item>
                        }
                        {colIndex === 0 && snapshot.isDragging && (<Clone background={widget.background}>{widget.title}</Clone>)}
                    </>
                )
            }

        </Draggable>
    )
}
export default Widget