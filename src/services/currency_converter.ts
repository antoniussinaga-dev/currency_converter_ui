import { API } from ".";

interface IPostConvert {
    currency_form: string;
    currency_to: string;
    value: number
}



const currencyConverter = API.injectEndpoints({
    endpoints: builder => ({
        getCurrency: builder.mutation({
            query: () => ({
                url: "/get_currency",
                method: "GET",
            }),
            // transformResponse: (response) => response
        }),
        convertCurrency: builder.mutation({
            query: (body: IPostConvert) => ({
                url: "/convert_currecy",
                method: "POST",
                body: body
            })
        }),
        getRate: builder.mutation({
            query: () => ({
                url: "/get_rate",
                method: "GET"
            })
        })
    })
});

export const {
    useGetCurrencyMutation,
    useConvertCurrencyMutation,
    useGetRateMutation
} = currencyConverter;