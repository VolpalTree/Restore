import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uSlice";
import { toast } from "react-toastify";
import { router } from "../model/routes/Routes";

const customeBaseQuery = fetchBaseQuery({
    baseUrl:'https://localhost:5001/api'
});

type ErrorResponse = | string | {title:string} | {error: string[]};

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    api.dispatch(startLoading());
    await sleep();
    const result = await customeBaseQuery(args, api, extraOptions);
    api.dispatch(stopLoading());
    
    if(result.error) {

        console.log(result.error);

        const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus 
            ? result.error.originalStatus
            : result.error.status

        const responseData = result.error.data as ErrorResponse

        switch (originalStatus) {
            case 400:
                if (typeof responseData === 'string') toast.error(responseData);
                else if ('errors' in responseData) {
                    const errors = (responseData as { errors: Record<string, string[]> }).errors;
                    throw Object.values(errors).flat().join(', ')
                }
                else if ('title' in responseData) toast.error(responseData.title);
                break;
            
            case 401:
                if (typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title)
                else if (typeof responseData === 'string') {
                    toast.error(responseData);
                } else {
                    toast.error("Unauthorized");
                }
                break;
            
            case 404:
                if (typeof responseData === 'object' && 'title' in responseData)
                    router.navigate('/not-found')
                break;

            case 500:
                if (typeof responseData === 'object')
                    router.navigate('/server-error', {state: {error: responseData}})
                break;
            default:
                break;
        }
    }

    return result;
}