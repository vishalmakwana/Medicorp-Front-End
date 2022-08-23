import { Strings } from "@medicorp"
import { Avatar, Chip } from "@mui/material"
import { Man, Woman } from '@mui/icons-material';
import { blue, pink } from "@mui/material/colors";
function usersDataColumn() {
    const columns = [
        // { title: Strings.COLUMN_ID, field: 'id', editable: 'never' },
        // { title: Strings.COLUMN_USERS_FIRST_NAME, field: 'firstName' },
        { title: Strings.COLUMN_NAME, field: 'fullName' },
        // { title: Strings.COLUMN_USERS_LAST_NAME, field: 'lastName' },
        {
            title: Strings.COLUMN_GENDER,
            field: 'gender',
            render: rowData => {
                if (rowData.gender !== undefined) {
                    if (rowData.gender === "Male") {
                        return (
                            <Avatar sx={{ bgcolor: blue[500] }}>
                                <Man />
                            </Avatar>
                        )
                    } else {
                        return (
                            <Avatar sx={{ bgcolor: pink[400] }}>
                                <Woman />
                            </Avatar>
                        )
                    }
                } else {
                    if (rowData === "Male") {
                        return (
                            <Avatar sx={{ bgcolor: blue[500] }}>
                                <Man />
                            </Avatar>
                        )
                    } else {
                        return (
                            <Avatar sx={{ bgcolor: pink[400] }}>
                                <Woman />
                            </Avatar>
                        )
                    }
                }
            }
        },
        { title: Strings.COLUMN_USERS_EMAIL, field: 'email' },
        { title: Strings.COLUMN_USERS_PHONE, field: 'mobileNo' },
        { title: Strings.COLUMN_USERS_IS_ACTIVE, field: 'isActive', type: 'boolean' },
    ]
    return { columns }


}

export default usersDataColumn

