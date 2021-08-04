const initialState = {
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  photo: '',
  activity: [],
  specialty: [],
  location: []
}

export const expertAuthReducer = (state = initialState, action) => {
  switch(action.type){

    case "SIGNUP_EXPERT":
      return {
        ...state,
        [action.name]: action.value
      }
    
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