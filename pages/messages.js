import SVG from '../files/SVGs'
import Nav from '../components/nav/nav'
import withMessages from './withMessages'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {API, SOCKET} from '../config'
import io from "socket.io-client";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const socket = io.connect(`${window.origin}:3001`, {transports: ['websocket', 'polling', 'flashsocket'], rejectUnauthorized: false});


const Messages = ({userClient, messages, experts, preloadNotifications}) => {
  // console.log(messages)
  // console.log(allExperts)
  // console.log(userClient)

  const [chatMessages, setChatMessages] = useState([])
  const [message, setMessage] = useState('')
  const [expertName, setExpertName] = useState('')
  const [expertPhoto, setExpertPhoto] = useState('')
  const [expertID, setExpertID] = useState('')
  const [expertEmail, setExpertEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [allExperts, setAllExperts] = useState(experts)
  const [notifications, setNotifications] = useState(preloadNotifications ? preloadNotifications : null)

  useEffect(() => {
    // console.log(userClient)
    window.localStorage.removeItem('currentChatIdExpert')
    // if(allExperts[0]) setChatMessages(allExperts[0])
    // if(document.querySelectorAll('.messages-list-item')[0]) document.querySelectorAll('.messages-list-item')[0].classList.add('messages-list-item-selected')
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
      // console.log(window.localStorage.getItem('currentChatIdExpert'))
      // console.log(newArray)

      newArray.forEach((item) => {
        item.forEach((data) => {
          if(data.expertID === window.localStorage.getItem('currentChatIdExpert')){
            return getMessages(item[0].expertID)
            // setChatMessages(item)
          }
        })
      })

      setAllExperts(newArray)
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
  }, [])

  const formatDate = (string) => {
    let date = new Date(string)

    let hr = date.getHours()
    let min = date.getMinutes();

    if (min < 10) {
      min = "0" + min;
    }

    let ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[date.getUTCMonth()]
    var day = date.getUTCDate()
    var year = date.getUTCFullYear()

    return `${month} ${day}, ${year}, ${hr}:${min} ${ampm}`
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    setLoading(true)
    socket.emit('client-message-expert', {name: userClient.username, message: message, clientName: userClient.username, clientPhoto: userClient.photo ? userClient.photo[0].location : '', expertName: expertName, expertPhoto: expertPhoto, expertID: expertID, expertEmail: expertEmail, clientID: userClient.id, sender: 'client', readClient: true}, (messages) => {
      setMessage('')
      setLoading(false)
      if(messages){
        let allMessages
        allMessages = messages.reduce( (r, a) => {
          r[a.expertID] = r[a.expertID] || [];
          r[a.expertID].push(a);
          return r;
        }, Object.create(null));

        if(allMessages){
          allMessages = Object.keys(allMessages).map((key) => allMessages[key])

          allMessages.forEach((item) => {
            if(item[0].expertID == expertID) setChatMessages(item)
          })
        }

        let newArray = []

        for(let key in allMessages){
          newArray.push(allMessages[key])
        }

        return setAllExperts(newArray)
      }
    })
    // try {
    //   const responseMessage = await axios.post(`${API}/message/expert-chat`, {name: userClient.username, message: message, expertName: expertName, expertPhoto: expertPhoto, expertID: expertID, expertEmail: expertEmail, clientID: userClient.id, sender: 'client'})
    //   setMessage('')
    //   setLoading(false)
    //   let allExperts
    //   allExperts = responseMessage.data.reduce( (r, a) => {
    //     r[a.expertID] = r[a.expertID] || [];
    //     r[a.expertID].push(a);
    //     return r;
    //   }, Object.create(null));

    //   if(allExperts){
    //     allExperts = Object.keys(allExperts).map((key) => allExperts[key])

    //     allExperts.forEach((item) => {
    //       if(item[0].expertID == expertID) return setChatMessages(item)
    //     })
    //   }
    //   // window.location.reload()
    //   // setMessage(responseMessage.data)
    // } catch (error) {
    //   console.log(error)
    //   setLoading(false)
    //   if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    // }
  }

  const getMessages = async (id) => {
    // try {
    //   const responseClientMessages = await axios.post(`${API}/auth/get-client-messages`, {id: userClient.id})
    //   messages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

    //   let allExperts
    //   allExperts = messages.reduce( (r, a) => {
    //     r[a.expertID] = r[a.expertID] || [];
    //     r[a.expertID].push(a);
    //     return r;
    //   }, Object.create(null));

    //   if(allExperts){
    //     allExperts = Object.keys(allExperts).map((key) => allExperts[key])

    //     allExperts.forEach((item) => {
    //       setExpertEmail(item[item.length - 1].expertEmail)
    //       if(item[0].expertID == id) return setChatMessages(item)
    //     })
    //   }
      
    // } catch (error) {
    //   if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
    // }

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

      newArray.forEach((item) => {
        item.forEach((data) => {
          if(data.expertID === window.localStorage.getItem('currentChatIdExpert')){
            setChatMessages(item)
          }
        })
      })

      let totalNotifications = null
      newArray.map((item) => {
        item.filter((e) => { return e.readClient === false; }).length > 0 
        ? 
        (totalNotifications += item.filter((e) => { return e.readClient === false; }).length)
        : null
      })
      setNotifications(totalNotifications)
      setAllExperts(newArray)
    } catch (error) {
      if(error) error.response ? (setError(error.response.data)) : (setError('Failed to get data'))
    }
  }

  useEffect(() => {
    let messages = document.querySelectorAll('.messages-chatbox-container-box')
    if(messages){
      messages[0] ? messages[0].childNodes[messages[0].childNodes.length- 1].scrollIntoView() : null
    }
  }, [chatMessages])

  return (
    <>
    <Nav changeStyle='primary-background' userClient={userClient} notifications={notifications}></Nav>
    <div className="messages">
      <NotificationContainer/>
      <div className="messages-list">
        <div className="messages-list-title">Messages</div>
        {allExperts.length > 0 && allExperts.map((item, idx) => (
          // document.getElementById("chatbox").scrollIntoView()
           <div key={`chat-` + idx} className="messages-list-item" onClick={() => (getMessages(item[0].expertID), window.localStorage.setItem('currentChatIdExpert', (item[0].expertID)), typeof window !== 'undefined' ? window.innerWidth < 601 ? document.getElementById("chatbox").scrollIntoView() : null : null)}>
            <div className="messages-list-item-image">
               <img src={item[0].expertPhoto} alt=""/>{item.filter((e) => { return e.readClient === false; }).length > 0 ? <div className="messages-list-item-unread">{item.filter((e) => { return e.readClient === false; }).length}</div> : null}
            </div>
            <div className="messages-list-item-user">
              <div className="messages-list-item-user-name">{item[item.length - 1].expertName}</div>
              <div className="messages-list-item-user-message">{item[item.length - 1].message}</div>
              <div className="messages-list-item-user-message-date">{formatDate(item[item.length - 1].createdAt)}</div>
            </div>
           </div>
        ))
        }
      </div>
      <div id="chatbox" className="messages-chatbox">
        {chatMessages.length > 0 ? 
          <>
          <div className="messages-chatbox-container">
            <div className="messages-chatbox-container-box">
            {chatMessages.map((item, idx) => (
              <div id={`message-${idx}`} key={`message-${idx}`} className="messages-chatbox-container-item">
                {item.sender == 'expert' ? <img src={item.expertPhoto}></img> : userClient.photo ? <img src={userClient.photo[0].location}></img> : <SVG svg={'account-circle'}></SVG>}
                <div className="messages-chatbox-container-item-user">
                  <div className="messages-chatbox-container-item-user-name">{item.name}</div>
                  <div className="messages-chatbox-container-item-user-message">{item.message}</div>
                  <div className="messages-chatbox-container-item-user-message-date">{formatDate(item.createdAt)}</div>
                </div>
              </div>
            ))}
            </div>
            <div className="messages-chatbox-container-input-container">
              <div className="messages-chatbox-container-input-box">
              <textarea id="message" className="messages-chatbox-container-input" rows="auto" name="message" placeholder="Type a message" value={message} onChange={(e) => (setMessage(e.target.value), setError(''), setExpertName(chatMessages[0].expertName), setExpertPhoto(chatMessages[0].expertPhoto), setExpertID(chatMessages[0].expertID))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Type a message'} required></textarea>
              {message && <span className="messages-chatbox-container-input-container-svg" onClick={(e) => sendMessage(e)}>{loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-message" allowFullScreen></iframe> : <SVG svg={'send-message'}></SVG>}</span>}
              </div>
            </div>
          </div>
          </>
        :
          <div className="messages-chatbox-container-empty"> 
            Click on a message box to view
          </div>
        }
      </div>
    </div>
    </>
  )
}

export default withMessages(Messages)
