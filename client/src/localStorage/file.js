export const reqLocalStorage=(data) => {
    if (data.method === "set") {
        localStorage.setItem("token", data.data)
    }

    else if(data.method === "get"){
        return localStorage.getItem("token")
    }

    else if (data.method === "remove") {
        localStorage.removeItem("token")
    }
}