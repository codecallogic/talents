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

      let talents = null
      try {
        const responseTalents = await axios.get(`${API}/auth/all-experts`)
        // console.log(responseTalents.data)
        talents = responseTalents.data
      } catch (error) {
        if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
      }

      let messages = null
      let experts = []
      
      if(userClient){
        try {
          const responseClientMessages = await axios.post(`${API}/auth/get-client-messages-init`, userClient)
          console.log(responseClientMessages.data)
          messages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
          experts = messages.reduce( (r, a) => {
            r[a.expertID] = r[a.expertID] || [];
            r[a.expertID].push(a);
            return r;
          }, Object.create(null));
        } catch (error) {
          if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
        }
      }

      if(experts){
        experts = Object.keys(experts).map((key) => experts[key])
      }

      let preloadNotifications = null

      if(experts){
        preloadNotifications
        experts.map((item) => {
          item.filter((e) => { return e.readClient === false; }).length > 0 
          ? 
          (preloadNotifications += item.filter((e) => { return e.readClient === false; }).length)
          : null
      })}

      if(!userClient){
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          talents
        }
      }else{
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          userClient,
          talents,
          experts,
          preloadNotifications
        }
      }
    }

    return WithAuthUser
}

export default withUser