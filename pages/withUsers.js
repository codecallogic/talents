import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/authExpert'
import absoluteURL from 'next-absolute-url'
import Cookies from 'cookies'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      const cookies = new Cookies(context.req, context.res)
      const { origin } = absoluteURL(context.req)

      // GET COOKIES
      const user = getUser(context.req)
      const token = getToken(context.req)

      let userExpert = null
      let newToken = null
      if(user){userExpert = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      // console.log(newUser)
      // console.log(newToken)

      if(newToken !== null){
        try {
          const responseUser = await axios.get(`${API}/auth/user-expert`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          // console.log(responseUser.data)
          userExpert = responseUser.data
        } catch (error) {
          newUser = null
          // console.log(error)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      if(!userExpert){

      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            userExpert,
        }
      }
    }

    return WithAuthUser
}

export default withUser