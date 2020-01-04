import * as actionType from "./actionType";
// Example

export const saveData = data => {
  return {
    type: actionType.SAVE_DATA,
    payload: data
  };
};

export const userSettings = data => {
  return dispatch => {
    return new Promise(resolve => {
      switch (data.action) {
        case "changeItem":
          dispatch({
            type: actionType.GLOBAL_USER_SETTINGS_CHANGE_ITEM_PER_PAGE,
            payload: data.value
          });
          break;

        case "changePagePos":
          dispatch({
            type: actionType.GLOBAL_USER_SETTINGS_CHANGE_PAGE_POSITION,
            payload: data.value
          });
          break;
      }

      resolve("succes");
    });
  };
};
