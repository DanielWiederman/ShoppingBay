import * as actionType from "../action/actionType"
import { updateObject } from './utilReducer'
//object in javacsript are always working as refenreces.
const initialState = {
    isAuth: false,
    userData: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.AUTH_ON: {
            //set object initalState of the reducer with the props that given from component.
            return updateObject(state, { isAuth: !state.isAuth })
        }


        case actionType.USER_DATA: {
            return updateObject(state, { userData: action.payload })
        }

        default:
            return state;
    }

}

export default reducer