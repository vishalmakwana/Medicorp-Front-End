import MaterialTable from '@material-table/core'
import { usePresentationDetailPanel, useStyles } from '@medicorp'
import { Edit } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Grid, Tab } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PresentationDetailPanel = ({ presentationId, isEditOption = false }) => {
    const {
        value,
        handleChange,
        productsColumn,
        producstsData,
        presentationProductLoading
    } = usePresentationDetailPanel(presentationId)

    const { materialTableStyle: tableStyle } = useStyles()
    const navigate = useNavigate()
    console.log(producstsData);
    return (
        <>
            <Box sx={{ typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                        <Grid direction="row" >
                            <Grid item xs={11} sx={{ alignSelf: 'center' }}>
                                <TabList onChange={handleChange} aria-label="Job Tab" variant="scrollable"
                                    scrollButtons="auto">
                                    <Tab label="ProductList" value="1" />
                                    {/* <Tab label="Doctors Details" value="2" /> */}

                                    {isEditOption === true ? <Button

                                        endIcon={<Edit />}
                                        onClick={() => { navigate(`/jobscheduling/jobs/${presentationId}`) }}
                                    >
                                    </Button> : <></>}
                                </TabList>
                            </Grid>
                        </Grid>
                    </Box>

                    <TabPanel sx={{ backgroundColor: 'grey.200' }} value="1">
                        <MaterialTable
                            columns={productsColumn}
                            data={producstsData ? producstsData : []}
                            components={{
                                Toolbar: props => <></>
                            }}
                            isLoading={presentationProductLoading}
                            options={{
                                ...tableStyle,
                                selection: false,
                                search: false,
                                filtering: false,
                                selection: false,
                                grouping: false,
                                columnsButton: false,
                                showTitle: false,
                                sorting: false,
                                paging: false
                            }} />
                    </TabPanel>

                    {/* <TabPanel sx={{ backgroundColor: 'grey.200' }} value="2">
                        <MaterialTable
                            columns={doctorsCoumns}
                            data={doctorsData?.data}
                            components={{
                                Toolbar: props => <></>
                            }}
                            options={{
                                ...tableStyle,
                                selection: false,
                                search: false,
                                filtering: false,
                                selection: false,
                                grouping: false,
                                columnsButton: false,
                                showTitle: false,
                                sorting: false,
                                paging: false
                            }} />
                    </TabPanel> */}
                </TabContext>
            </Box>
        </>
    )
}

export default PresentationDetailPanel