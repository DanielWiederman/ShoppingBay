import axios from "axios"

export const requestData=(data) => {
        if (data.method === "get") {

            return axios.request({
                url: data.url,
                method: 'get',
                data: data.data,
                headers: data.header,
                params: data.params
            })
        }
        else if (data.method === "post") {
            return axios.request({
                url: data.url,
                method: 'post',
                data: data.data,
                body: data.body,
                headers: data.header,
                params: data.params
            })
        }
        else if (data.method === "delete") {
            return axios.request({
                url: data.url,
                method: 'delete',
                data: data.data,
                headers: data.header,
                params: data.params
            })
        }

    }

