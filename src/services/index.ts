import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function isJSONValid(input: string): boolean {
    try {
      JSON.parse(input);
      return true;
    } catch (error) {
      return false;
    }
}

export const API = createApi({
    reducerPath: "API",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER,
        timeout: 10000,
        responseHandler: async (response): Promise<{ status: number, message: string, data: any }> => {
           if(response.status > 300) {
                return {
                    status: response.status,
                    message: response.statusText,
                    data: null, // Gunakan data yang telah diubah
                };
           } else {
                if(parseInt(response.headers.get("content-length")|| "0") < 10) {
                    const text = await response.text()
                    if(isJSONValid(text)) {
                        return {
                            status: response.status,
                            message: response.statusText,
                            data: JSON.parse(text), // Gunakan data yang telah diubah
                        };
                    } else {
                        return {
                            status: response.status,
                            message: response.statusText,
                            data: null, // Gunakan data yang telah diubah
                        };
                    }
                } else {
                    const data = await response.json(); // Konversi response body ke JSON
                    return {
                        status: response.status,
                        message: response.statusText,
                        data, // Gunakan data yang telah diubah
                    };
                }
           }  
        }
    }),
    
    endpoints: builder => ({}),
    tagTypes: [
        
    ],
})