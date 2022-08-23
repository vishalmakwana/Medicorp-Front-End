import MaterialTable from "@material-table/core";
import {
    presentationHistoryDataColumns,
    SmartDialog,
    Strings,
    usePresentationHistory,
    useStyles,
} from "@medicorp";
import { Card } from "@mui/material";
const PresentationHistory = () => {
    const {
        tableRef,
        AllPresentationHistory,
        AllPresentationHistoryLoading,
        presentationHistoryColumns,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
        handleModalClose,
        openDialog,
        actions
    } = usePresentationHistory();

    const { materialTableStyle: tableStyle } = useStyles();

    return (
        <>
            <Card>
                <MaterialTable
                    columns={presentationHistoryColumns}
                    tableRef={tableRef}
                    data={AllPresentationHistory?.data ?? []}
                    title={Strings.MENU_PRESENTATIONSS_TITLE}
                    actions={actions}
                    // detailPanel={detailPanel}
                    isLoading={AllPresentationHistoryLoading}
                    options={{
                        ...tableStyle,
                        selection: true,
                        filtering: false,
                        grouping: false,
                        columnsButton: false,
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 30, 50, 100],
                        padding: "dense",

                    }}
                />
            </Card>


            <SmartDialog
                open={openDialog}
                handleClose={handleModalClose}
                modalHeader={modalHeader}
                modalContent={modalContent}
                modalActions={modalActions}
                modalFormResetKeys={modalFormResetKeys}
                modalTaskRunning={modalTaskRunning}
            />
        </>
    );
};

export default PresentationHistory;
