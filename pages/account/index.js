import Nav from '../../components/nav/nav'
import {useState, useEffect} from 'react'
import SVGs from '../../files/SVGs'
import withClient from '../withClient'
import {connect} from 'react-redux'
import {API, SOCKET} from '../../config'
import {useRouter} from 'next/router'
import axios from 'axios'
import {nanoid} from 'nanoid'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import io from "socket.io-client";

const socket = io.connect(SOCKET, {transports: ['websocket', 'polling', 'flashsocket']});

const Dashboard = ({params, newToken, dash, changeView, userClient, preloadNotifications, userUpdate, updateClientProfile}) => {
  // console.log(userClient)
  const router = useRouter()
  const [loading_profile_image, setLoadingProfileImage] = useState(false)
  const [notifications, setNotifications] = useState(preloadNotifications ? preloadNotifications : null)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    if(params) params.view ? changeView(params.view) : null
    updateClientProfile('username', userClient.username)
    socket.on(userClient.id, (messages) => {
      // console.log(messages)
      let newMessages = null
      let newExperts= []

      newMessages = messages.messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

      newExperts = newMessages.reduce( (r, a) => {
        r[a.expertID] = r[a.expertID] || [];
        r[a.expertID].push(a);
        return r;
      }, Object.create(null));

      let newArray = []

      for(let key in newExperts){
        newArray.push(newExperts[key])
      }

      newArray.forEach((item) => {
        item.forEach((data) => {
          if(data.expertID === window.localStorage.getItem('currentChatIdExpert')){
            return getMessages(item[0].expertID)
            // setChatMessages(item)
          }
        })
      })

      // setAllExperts(newArray)
      let totalNotifications = null
      newArray.map((item) => {
        item.filter((e) => { return e.readClient === false; }).length > 0 
        ? 
        (totalNotifications += item.filter((e) => { return e.readClient === false; }).length)
        : null
      })
      setNotifications(totalNotifications)
      return NotificationManager.info(`New message from ${messages.expertName}`)
    })
  }, [router.query.change])

  const getMessages = async (id) => {
    try {
      const responseExpertMessages = await axios.post(`${API}/auth/get-client-messages`, {clientID: userClient.id, expertID: id})
      let newMessages = null
      newMessages = responseExpertMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
      let newExperts = []

      newExperts = newMessages.reduce( (r, a) => {
        r[a.expertID] = r[a.expertID] || [];
        r[a.expertID].push(a);
        return r;
      }, Object.create(null));

      let newArray = []

      for(let key in newExperts){
        newArray.push(newExperts[key])
      }

      // newArray.forEach((item) => {
      //   item.forEach((data) => {
      //     if(data.expertID === window.localStorage.getItem('currentChatIdExpert')){
      //       setChatMessages(item)
      //     }
      //   })
      // })

      let totalNotifications = null
      newArray.map((item) => {
        item.filter((e) => { return e.readClient === false; }).length > 0 
        ? 
        (totalNotifications += item.filter((e) => { return e.readClient === false; }).length)
        : null
      })
      setNotifications(totalNotifications)

      // setAllExperts(newArray)
    } catch (error) {
      if(error) error.response ? (setError(error.response.data)) : (setError('Failed to get data'))
    }
  }

  useEffect(() => {
    if(userUpdate.photo) handleProfileUpdate()
  }, [userUpdate.photo])

  const handleProfileUpdate = async (e) => {
    if(e) e.preventDefault()
    setMessage('')

    let data = new FormData()
    let fileID = nanoid()

    if(userUpdate.photo){
      data.append('file', userUpdate.photo, 
      `profiles/client-${fileID}.${userUpdate.photo.name.split('.')[1]}`), updateClientProfile('photo', ''), 
      setLoadingProfileImage(true)
    }

    if(userUpdate){
      for(const key in userUpdate){
        data.append(key, userUpdate[key])
      }
    }

    if(userClient.id) data.append('id', userClient.id)

    if(userUpdate.photo && userClient.photo) userClient.photo.length > 0 ?  data.append('delete_photo', userClient.photo[0].key) : null

    try {
      const responseProfile = await axios.post(`${API}/client/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${newToken}`,
          contentType: `application/json`
        }
      })
      // console.log(responseProfile.data)
      window.location.href = `/account?view=profile`
    } catch (error) {
      console.log('Error', error.response)
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error occurred updating profile')
    }
  }
  
  return (
    <>
      <Nav changeStyle='primary-background' userClient={userClient} notifications={notifications}></Nav>
      <NotificationContainer/>
      <div className="experts">
      {dash.view == 'main' &&
        <div className="experts-container">
          <div className="experts-title">Account</div>
          <div className="experts-cards">
            <div className="experts-cards-item" onClick={() => changeView('profile')}>
              <div className="experts-cards-item-el"><SVGs svg={'profile-card'}></SVGs></div>
              <div className="experts-cards-item-el-title">Profile info</div>
              <div className="experts-cards-item-el-info">Provide personal details for experts to get to know you.</div>
            </div>
            <div className="experts-cards-item" onClick={() => window.location.href = "/messages"}>
              <div className="experts-cards-item-el"><SVGs svg={'message'}></SVGs></div>
              <div className="experts-cards-item-el-title">Messages</div>
              <div className="experts-cards-item-el-info">Read messages of people you've contacted.</div>
            </div>
          </div>
        </div>
      }
      {dash.view == 'profile' &&
      <div className="experts-container">
        <div className="experts-breadcrumbs"><a onClick={() => changeView('main')}>Account</a> &#x3e; <span>Profile info</span> </div>
        <div className="experts-title">Profile Info</div>
        <div className="experts-profile">
          <div className="experts-profile-left">
            <label htmlFor="profile_image" className="experts-profile-left-image">
              {!loading_profile_image && userClient.photo ? userClient.photo.length > 0 ? <img src={userClient.photo[0].location}></img> : null : null}
              {loading_profile_image ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-profile-image" allowFullScreen></iframe> : userClient.photo ? userClient.photo.length < 1 ? <SVGs svg={'account-circle'}></SVGs> : null : <SVGs svg={'account-circle'}></SVGs>}
              <a>Update profile photo</a>
            </label>
            <input type="file" name="profile_image" id="profile_image" accept="image/*" onChange={(e) => (updateClientProfile('photo', e.target.files[0]))}/>
          </div>
          <div className="experts-profile-right">
            <div className="experts-profile-right-title">Hi, I'm {userClient ? userClient.username : 'Unknown'}</div>
            <form action="" className="form" onSubmit={(e) => handleProfileUpdate(e)}>
              <div className="form-group-single">
                <label htmlFor="Username" >Username</label>
                <div className="form-group-single-input">
                  <textarea id="username" rows="1" name="username" placeholder="(username)" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} value={userUpdate.username} onChange={(e) => updateClientProfile('username', e.target.value)} required></textarea>
                </div>
              </div>

              <div className="form-group-single">
                {loading_profile_image ? null : <button type="submit">Update</button>}
              </div>
            </form>
            {message ? <div className="form-error-message">{message}</div> : null}
          </div>
        </div>
      </div>
      }
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    dash: state.expertDash,
    userUpdate: state.client
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeView: (view) => dispatch({type: 'DASH', value: view}),
    updateClientProfile: (name, value) => dispatch({type: 'UPDATE_CLIENT', name: name, value: value})
  }
}

Dashboard.getInitialProps = ({query}) => {
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withClient(Dashboard))
