import { Strings } from "@medicorp"
import { Chip } from "@mui/material"
import { blue, grey } from "@mui/material/colors"

export default function categoriesDataColumns() {
        const columns = [
                { title: Strings.COLUMN_ID, field: 'categoryId', editable: 'never' },
                {
                        title: Strings.MENU_CATEGORIESS_TITLE,
                        field: 'categoryName',
                        render: rowData => {
                                if (rowData?.isActive) {
                                        if (rowData?.isActive) {
                                                return (
                                                        <Chip
                                                                label={rowData?.categoryName}
                                                                sx={{ bgcolor: blue[500], color: 'white' }} />
                                                )
                                        } else {
                                                return (
                                                        <Chip
                                                                label={rowData?.categoryName}
                                                                sx={{ bgcolor: grey[500], color: 'white' }} />
                                                )
                                        }
                                } else {
                                        return (
                                                <Chip
                                                        label={rowData}
                                                        sx={{ bgcolor: blue[500], color: 'white' }} />
                                        )
                                }
                        }
                },
                { title: Strings.COLUMN_CATREGORY_IS_ACTIVE, field: 'isActive', type: 'boolean' },

        ]
        return { columns }
}
