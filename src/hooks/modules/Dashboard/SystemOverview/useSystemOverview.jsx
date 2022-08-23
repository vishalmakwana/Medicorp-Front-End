import { green, red, cyan, blue, orange, blueGrey } from "@mui/material/colors"
import { Alarm, Ballot, Folder, GppBad, PeopleAlt, SnippetFolder } from "@mui/icons-material"
import { appSettings, useAxios, Strings } from "@medicorp"

const useSystemOverview = () => {
    const { endpointConfig, routeConfig } = appSettings
    // const [{ data: systemOverview }] = useAxios(endpointConfig.dashboard.getAllSystemOverview)

    const items = [
        {
            title: Strings.SOURCES,
            subtitle: 0,
            icon: PeopleAlt,
            iconBg: blueGrey["A700"],
            background: blueGrey["600"],
            navigate: `/`
        },
        {
            title: Strings.SOURCE_CONNECTIONS,
            subtitle: 0,
            icon: Folder,
            iconBg: green["A700"],
            background: green["600"],
            navigate: `/`
        },
        {
            title: Strings.DESTINATION_CONNECTIONS,
            subtitle: 0,
            icon: SnippetFolder,
            iconBg: cyan["A700"],
            background: cyan["600"],
            navigate: `/`
        },
        {
            title: Strings.JOBS_TITLE,
            subtitle: 0,
            icon: Ballot,
            iconBg: orange["A700"],
            background: orange["600"],
            navigate: `/`
        },
        {
            title: Strings.SCHEDULED_JOBS,
            subtitle: 0,
            icon: Alarm,
            iconBg: blue["A700"],
            background: blue["600"],
            navigate: ""
        },
        {
            title: Strings.UN_SUCCESSFUL_JOBS,
            subtitle: 0,
            icon: GppBad,
            iconBg: red["A700"],
            background: red["600"],
            navigate: ""
        }
    ]

    return {
        items
    }
}
export default useSystemOverview