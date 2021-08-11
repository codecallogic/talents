const initialState = {
  activity: [],
  specialty: [],
  location: []
}

export const talentsReducer = (state = initialState, action) => {
  switch(action.type){

    case "TALENTS":
      return {
        ...state,
        [action.name]: [...state[action.name], action.value]
      }

    case "TALENTS_REMOVE":
      return {
        ...state,
        [action.name]: state[action.name].filter( item => item !== action.value)
      }
    
    default: 
      return state
  }
}