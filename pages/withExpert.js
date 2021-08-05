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
      let errorFailedActivation = null

      if(context.query.token){
        try {
          const responseActivate = await axios.post(`${API}/auth/activate-expert`, {token: context.query.token})
          res.writeHead(307, {
            Location: '/expert-login'
          });
          return res.end();
        } catch (error) {
          // console.log(error)
          if(error) error.response ? (errorFailedActivation = error.response.data) : (errorFailedActivation = 'Failed to activate user')
        }
      }

      // GET COOKIES
      const user = getUser(context.req)
      const token = getToken(context.req)
      let errorFailedToLoginUser = null

      let newUser = null
      let newToken = null
      if(user){newUser = user.split('=')[1]}
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
          newUser = responseUser.data
        } catch (error) {
          newUser = null
          // console.log(error)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      if(!newUser){
        context.res.writeHead(307, {
          Location: '/expert-login'
        });
        context.res.end();
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            newUser,
            newToken
        }
      }
    }

    return WithAuthUser
}

export default withUser