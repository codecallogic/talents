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

      let userClient = null
      let newToken = null
      let errorFailedToLoginUser  = null
      let errorFailedToGetData = null
      if(user){userClient = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      if(newToken !== null){
        try {
          const responseUser = await axios.get(`${API}/auth/user-expert`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          // console.log(responseUser.data)
          userClient = responseUser.data
        } catch (error) {
          userClient = null
          // console.log(error)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      let talents = null
      try {
        const responseTalents = await axios.get(`${API}/auth/all-experts`)
        console.log(responseTalents.data)
        talents = responseTalents.data
      } catch (error) {
        if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
      }

      if(!userClient){
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {
            talents
          })
        }
      }else{
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          userClient,
          talents
        }
      }
    }

    return WithAuthUser
}

export default withUser