import { Avatar, Chip } from "@mui/material"
import { appSettings, Strings } from "@medicorp"
import { blue, grey } from "@mui/material/colors";

export default function productsDataColumns() {
    const { imageBaseURL } = appSettings
    const productsColumn = [
        { title: Strings.COLUMN_ID, field: 'productId' },
        {
            title: Strings.COLUMN_CATEGORY_NAME, field: 'categoryName',
            render: rowData => {
                if (rowData?.isActive !== undefined) {
                    if (rowData.isActive) {
                        return (
                            <Chip
                                label={rowData.categoryName}
                                sx={{ bgcolor: blue[500], color: 'white' }} />
                        )
                    } else {
                        return (
                            <Chip
                                label={rowData.categoryName}
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
        { title: Strings.COLUMN_NAME, field: 'productName' },
        {
            title: Strings.COLUMN_FIELD_DESCRIPTION, field: 'productDescription', width: "35%",
            cellStyle: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px"
            },
        },
        { title: Strings.COLUMN_MRP, field: 'mrp' },
        { title: Strings.COLUMN_PRODUCT_IS_ACTIVE, field: 'isActive', type: 'boolean' },
        {
            title: Strings.COLUMN_PRODUCT_IMAGES, field: 'uploadImage', render: rowData => {
                return (
                    <Avatar alt={rowData.name} src={rowData?.images[0]?.imageUrl} sx={{ width: 56, height: 56 }} />
                )
            }
        },

    ]
    return { productsColumn }
}