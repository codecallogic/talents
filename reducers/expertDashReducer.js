const initialState = {
  view: 'main',
}

export const expertDashReducer = (state = initialState, action) => {
  switch(action.type){

    case "DASH":
      return {
        ...state,
        view: action.value
      }
    
    default: 
      return state
  }
}