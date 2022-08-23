import { Avatar, Box, Button, Chip } from "@mui/material"
import { Strings } from "@medicorp"
export default function presentationDataColumns() {
        const presentationColumns = [
                { title: Strings.COLUMN_ID, field: 'presentationID' },
                { title: Strings.COLUMNS_DOCTORNAME_TILTLE, field: 'doctorName' },
                { title: Strings.COLUMNS_USERNAME_TILTLE, field: 'userName' },
                // {
                //     title: Strings.COLUMN_UPLOAD_IMAGES, field: 'uploadImage', render: rowData => (
                //         <Avatar alt={rowData.name} src={rowData.uploadImage} sx={{ width: 56, height: 56 }} />
                //     )
                // },

        ]
        return { presentationColumns }
}