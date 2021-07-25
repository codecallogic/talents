const initialState = {
  username: '',
  email: '',
  password: '',
  confirm_password: ''
}

export const hostingAuthReducer = (state = initialState, action) => {
  switch(action.type){

    case "SIGNUP_HOST":
      return {
        ...state,
        [action.name]: action.value
      }
    
    default: 
      return state
  }
}