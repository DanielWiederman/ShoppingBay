import * as actionType from "./actionType"

export const turnAuth = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: actionType.AUTH_ON
            })
            resolve("200")
        }
        )
    }
}

export const saveUser = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: actionType.USER_DATA,
                payload: data
            })
            resolve("200")

        })
    }
}

