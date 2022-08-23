import { Strings } from '@medicorp'
import { Autocomplete, TextField } from '@mui/material'

export default function presentationProductDataColumns(AllProducts, presentationProductOrder, presentationProductId) {
    console.count('presentationProductDataColumns')
    const order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // console.log(AllProducts)
    // console.log(presentationProductOrder)
    // console.log(presentationProductId)
    const columns = [
        {
            title: Strings.COLUMN_PRODUCT_ID,
            field: 'productID',
            editable: 'never',
        },
        {
            title: 'Product Name',
            field: 'productName',
            validate: rowData => Boolean(rowData.productName),
            editComponent: props => (
                <Autocomplete
                    disablePortal
                    id="presentation-products"
                    options={AllProducts ? AllProducts.map(g => {
                        return ({
                            label: g?.productName,
                            id: g?.productId,
                        })
                    }).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : []}
                    getOptionDisabled={(product) => {
                        return presentationProductId && !!presentationProductId.find(element => element === product.id)

                    }}
                    onChange={(e, value) => {
                        props.onChange(value)
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params} label="Presentation Products" />}
                />
            )
        },
        {
            title: 'Product Order',
            field: 'order',
            validate: rowData => Boolean(rowData.order),
            editComponent: props => {
                return (
                    <Autocomplete
                        id="order"
                        options={order}
                        getOptionDisabled={(order) => {
                            console.log(presentationProductOrder)
                            return presentationProductOrder && !!presentationProductOrder.find(element => element === order)

                        }}
                        onChange={(e, value) => {
                            props.onChange(value)
                        }}
                        // sx={{ width: 300 }}
                        renderInput={(params) => <TextField  {...params} label="Product Order" />}
                    />
                )
            }
        },
    ]
    return { columns }
}