import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/authClient'
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

      if(context.query.token){
        try {
          const responseUser = await axios.post(`${API}/auth/activate-client`, {token: context.query.token}, {
            headers: {
                Authorization: `Bearer ${context.query.token}`,
                contentType: `application/json`
            }
          })
          // console.log(responseUser.data)
          cookies.set('clientToken', responseUser.data.token)
          cookies.set('client', responseUser.data.client)
          userClient = responseUser.data.client
        } catch (error) {
          userClient = null
          console.log(error.data)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      if(newToken){
        try {
          const responseUser = await axios.get(`${API}/auth/user-client`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          userClient = responseUser.data
        } catch (error) {
          userClient = null
          console.log(error.data)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      let messages = null
      let allExperts = []
      
      if(userClient){
        try {
          const responseClientMessages = await axios.post(`${API}/auth/get-client-messages`, userClient)
          console.log(responseClientMessages.data)
          messages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
          allExperts = messages.reduce( (r, a) => {
            r[a.expertID] = r[a.expertID] || [];
            r[a.expertID].push(a);
            return r;
          }, Object.create(null));
        } catch (error) {
          if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
        }
      }

      if(allExperts){
        allExperts = Object.keys(allExperts).map((key) => allExperts[key])
      }

      if(!userClient){
        context.res.writeHead(307, {
          Location: '/talents'
        });
        context.res.end();
      }else{
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          userClient,
          messages,
          allExperts
        }
      }
    }

    return WithAuthUser
}

export default withUser