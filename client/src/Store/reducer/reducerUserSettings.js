import * as actionType from "../action/actionType"
import { updateObject } from './utilReducer'
//object in javacsript are always working as refenreces.
const initialState = {
    itemsPerPage: 25,
    paginationPosition: 'bottom',
    theme: 'black',
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GLOBAL_USER_SETTINGS_CHANGE_ITEM_PER_PAGE: {
            //set object initalState of the reducer with the props that given from component.
            return updateObject(state, { itemsPerPage: action.payload })
        }

        case actionType.GLOBAL_USER_SETTINGS_CHANGE_PAGE_POSITION: {
            //set object initalState of the reducer with the props that given from component.
            return updateObject(state, { paginationPosition: action.payload })
        }
        default:
            return state;
    }

}

export default reducer