import { Strings } from "@medicorp"
import { Chip } from "@mui/material"
function specializationDataColumn() {
    const columns = [

        { title: Strings.COLUMN_ID, field: 'specialityId', editable: 'never' },
        {
            title: Strings.COLUMN_SPECIALIZATION, field: "title", render: rowData => (
                rowData.title ? <Chip
                    label={rowData.title}
                    color={"info"} /> :
                    <Chip
                        label={rowData}
                        color={"info"} />
            )
        },
        {
            title: Strings.COLUMN_FIELD_DESCRIPTION,
            field: "specialityDescription",
            width: "35%",
            cellStyle: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px"
            },
        },
        { title: Strings.COLUMN_CATREGORY_IS_ACTIVE, field: 'isActive', type: 'boolean' },


    ]
    return { columns }


}

export default specializationDataColumn