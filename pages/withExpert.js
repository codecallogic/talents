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
      let userExpert = null
      let newToken = null
      let errorFailedToGetData = null
      let errorFailedToLoginUser = null
      if(user){userExpert = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      // console.log(userExpert)
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
          userExpert = null
          // console.log(error)
          if(error) error.response ? (errorFailedToLoginUser = error.response.data) : (errorFailedToLoginUser = 'Failed to login user')
        }
      }

      let messages = null
      let clients = []
      
      if(userExpert){
        try {
          const responseExpertMessages = await axios.post(`${API}/auth/get-expert-messages-init`, userExpert)
          clients = responseExpertMessages.data.reduce( (r, a) => {
            r[a.clientID] = r[a.clientID] || [];
            r[a.clientID].push(a);
            return r;
          }, Object.create(null));
        } catch (error) {
          console.log(error)
          if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
        }
      }
      if(clients){
        clients = Object.keys(clients).map((key) => clients[key])
      }

      let preloadNotifications = null

      if(clients){
        preloadNotifications
        clients.map((item) => {
          item.filter((e) => { return e.readExpert === false; }).length > 0 
          ? 
          (preloadNotifications += item.filter((e) => { return e.readExpert === false; }).length)
          : null
      })}  
      
      if(!userExpert){
        context.res.writeHead(307, {
          Location: '/expert-login'
        });
        context.res.end();
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            userExpert,
            newToken,
            clients,
            preloadNotifications
        }
      }
    }

    return WithAuthUser
}

export default withUser