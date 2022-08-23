import { green, amber, deepOrange, red } from "@mui/material/colors"

const config = () => {
    const defaultAuthConfig = {
        token: "",
        refreshToken: "",
        context: {
            email: "",
            full_name: "",
            id_group: "",
            id_merchant: "",
            id_profile: "",
            identity: ""
        },
        nbf: 0,
        exp: 0,
        iat: 0,
        iss: "",
        aud: ""
    }


    const modules = {
        users: { id: 1, name: 'Users' },
        profiles: { id: 2, name: 'Profiles' },
        groups: { id: 3, name: 'Groups' },
        locations: { id: 4, name: 'Locations' },
        programs: { id: 5, name: 'Programs' },
        cardholders: { id: 6, name: 'Cardholders' },
        promotions: { id: 7, name: 'Promotions' },
        reports: { id: 8, name: 'Reports' }
    }

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.replace(/^data:image\/[a-z]+;base64,/, ""))
        reader.onerror = error => reject(error)
    })
    const addDays = (date, days) => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    return {
        defaultAuthConfig, modules, parseJwt, toBase64, addDays
    }
}
export default config