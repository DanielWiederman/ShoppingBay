import * as actionType from "../action/actionType"
import { updateObject } from './utilReducer'
//object in javacsript are always working as refenreces.
const initialState = {
    data: 1,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.SAVE_DATA: {
            //set object initalState of the reducer with the props that given from component.
            return updateObject(state, { data: action.payload })
        }
        default:
            return state;
    }

}

export default reducer