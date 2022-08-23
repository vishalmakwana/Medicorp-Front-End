import { Strings } from "@medicorp"
import { Avatar, Chip } from "@mui/material"
import { Man, Woman } from '@mui/icons-material';
import { blue, pink } from "@mui/material/colors";
export default function doctorsDataColumns() {
    const columns = [
        { title: Strings.COLUMN_ID, field: 'doctorId' },
        { title: Strings.COLUMN_NAME, field: 'fullName' },
        // { title: Strings.COLUMN_DOCTORS_FIRST_NAME, field: 'firstName' },
        // { title: Strings.COLUMN_DOCTORS_LAST_NAME, field: 'lastName' },
        {
            title: Strings.COLUMN_GENDER,
            field: 'gender',
            render: rowData => {
                if (rowData?.gender !== undefined) {
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
        { title: Strings.COLUMN_DOCTORS_EMAIL, field: 'email' },
        { title: Strings.COLUMN_MOBILE_NUMBER, field: 'mobileNumber' },
        { title: Strings.COLUMN_PHONE_NUMBER, field: 'phoneNumber' },
        { title: Strings.COLUMN_CLINIC_PHONE_NUMBER, field: 'clinicPhoneNumber' },
        { title: Strings.COLUMN_ANNIVERSARY_DATE, field: 'anniversaryDate' },
        { title: Strings.COLUMN_DATE_OF_BIRTH, field: 'dateOfBirth' },
        {
            title: Strings.COLUMN_SPECIALITY_TITLE,
            field: 'specialityTitle',
            render: rowData => (
                <Chip
                    label={rowData.specialityTitle}
                    color={"info"} />
            )
        },
        {
            title: Strings.COLUMN_DOCTORS_ADDRESS, field: 'addresses',
            width: "45%",
            cellStyle: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px"
            },
        },
        { title: Strings.COLUMN_COUNTRY, field: 'countryName' },
        { title: Strings.COLUMN_STATE, field: 'stateName' },
        { title: Strings.COLUMN_CITY, field: 'cityName' },
        { title: Strings.COLUMN_DOCTORS_IS_ACTIVE, field: 'isActive', type: 'boolean' },
    ]
    return { columns }


}
