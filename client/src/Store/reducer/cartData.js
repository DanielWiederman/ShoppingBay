import * as actionType from "../action/actionType"
import { updateObject } from './utilReducer'
//object in javacsript are always working as refenreces.
const initialState = {
    cartData: [],
    initData: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.ADD_TO_CART: {
            if(state.initData){
            return updateObject(state, { cartData: action.payload, initData: false })
            }
        }
        case actionType.DELETE_FROM_CART: {
            return updateObject(state, { cartData: action.payload })
        }
        case actionType.DELETE_ALL_CART: {
            return updateObject(state, { cartData: action.payload })
        }
        case actionType.GET_CART: {
            return updateObject(state, { cartData: action.payload })
        }
        default:
            return state;
    }

}

export default reducer