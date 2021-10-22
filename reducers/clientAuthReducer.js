const initialState = {
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  photo: '',
}

export const clientAuthReducer = (state = initialState, action) => {
  switch(action.type){

    case "SIGNUP_CLIENT":
      return {
        ...state,
        [action.name]: action.value
      }

    case "UPDATE_CLIENT":
      return {
        ...state,
        [action.name]: action.value
      }

    case "RESET":
      return initialState

    default: 
      return state
  }
}