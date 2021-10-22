import { useEffect, useState } from "react"
import {API, SOCKET} from '../../config'
import axios from 'axios'
import SVG from '../../files/SVGs'
import io from "socket.io-client";

const socket = io.connect(SOCKET, {transports: ['websocket', 'polling', 'flashsocket']});

const Messages = ({userExpert, clients, updateNotifications}) => {
  // console.log(userExpert)
  // console.log(clients)

  const [chatMessages, setChatMessages] = useState([])
  const [message, setMessage] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientID, setClientID] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [allClients, setAllClients] = useState(clients)
  const [read, setRead] = useState(true)

  useEffect(() => {
    window.localStorage.removeItem('currentChatId')
    
    socket.on(userExpert.id, (messages) => {
      let newMessages = null
      let newClients = []

      newMessages = messages.messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

      newClients = newMessages.reduce( (r, a) => {
        r[a.clientID] = r[a.clientID] || [];
        r[a.clientID].push(a);
        return r;
      }, Object.create(null));

      let newArray = []

      for(let key in newClients){
        newArray.push(newClients[key])
      }

      newArray.forEach((item) => {
        item.forEach((data) => {
          if(data.clientID === window.localStorage.getItem('currentChatId')){
            return getMessages(item[0].clientID)
            // setChatMessages(item)
          }
        })
      })

      // console.log(newArray)
      
      return setAllClients(newArray)
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
    socket.emit('expert-message-client', {name: userExpert.username, message: message, clientName: clientName, expertName: userExpert.username, expertPhoto: userExpert.photo[0].location, expertID: userExpert.id, expertEmail: userExpert.email, clientID: clientID, sender: 'expert', readExpert: true}, (messages) => {
      setMessage('')
      setLoading(false)
      if(messages){
        let allMessages
        allMessages = messages.reduce( (r, a) => {
          r[a.clientID] = r[a.clientID] || [];
          r[a.clientID].push(a);
          return r;
        }, Object.create(null));

        if(allMessages){
          allMessages = Object.keys(allMessages).map((key) => allMessages[key])

          allMessages.forEach((item) => {
            if(item[0].clientID == clientID) setChatMessages(item)
          })
        }

        let newArray = []

        for(let key in allMessages){
          newArray.push(allMessages[key])
        }

        return setAllClients(newArray)
      }
    })
    // try {
    //   const responseMessage = await axios.post(`${API}/message/client-chat`, {name: userExpert.username, message: message, expertName: userExpert.username, expertID: userExpert.id, expertEmail: userExpert.email, expertPhoto: userExpert.photo[0].location, clientID: clientID, sender: 'expert'})
    //   setMessage('')
    //   setLoading(false)

    //   // console.log(responseMessage.data)
      
    //   let allClients
    //   allClients = responseMessage.data.reduce( (r, a) => {
    //     r[a.clientID] = r[a.clientID] || [];
    //     r[a.clientID].push(a);
    //     return r;
    //   }, Object.create(null));

    //   if(allClients){
    //     allClients = Object.keys(allClients).map((key) => allClients[key])

    //     allClients.forEach((item) => {
    //       if(item[0].clientID == clientID) return setChatMessages(item)
    //     })
    //   }
    // } catch (error) {
    //   console.log(error)
    //   setLoading(false)
    //   if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    // }
  }

  const getMessages = async (id) => {
    try {
      const responseClientMessages = await axios.post(`${API}/auth/get-expert-messages`, {expertID: userExpert.id, clientID: id})
      let newMessages = null
      newMessages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
      let newClients = []

      newClients = newMessages.reduce( (r, a) => {
        r[a.clientID] = r[a.clientID] || [];
        r[a.clientID].push(a);
        return r;
      }, Object.create(null));

      let newArray = []

      for(let key in newClients){
        newArray.push(newClients[key])
      }

      newArray.forEach((item) => {
        item.forEach((data) => {
          if(data.clientID === window.localStorage.getItem('currentChatId')){
            setChatMessages(item)
          }
        })
      })

      let totalNotifications = null
      newArray.map((item) => {
        item.filter((e) => { return e.readExpert === false; }).length > 0 
        ? 
        (totalNotifications += item.filter((e) => { return e.readExpert === false; }).length)
        : null
      })
      updateNotifications(totalNotifications)

      // console.log(newArray)
      setAllClients(newArray)

      // console.log(messages)

    //   let allClients
    //   allClients = messages.reduce( (r, a) => {
    //     r[a.clientID] = r[a.clientID] || [];
    //     r[a.clientID].push(a);
    //     return r;
    //   }, Object.create(null));

    //   if(allClients){
    //     allClients = Object.keys(allClients).map((key) => allClients[key])

    //     allClients.forEach((item) => {
    //       if(item[0].clientID == id) return setChatMessages(item)
    //     })
    //   }
      
    } catch (error) {
      if(error) error.response ? (setError(error.response.data)) : (setError('Failed to get data'))
    }
  }

  useEffect(() => {
    console.log(chatMessages)
    let messages = document.querySelectorAll('.messages-chatbox-container-box')
    if(messages){
      messages[0] ? messages[0].childNodes[messages[0].childNodes.length- 1].scrollIntoView() : null
    }
  }, [chatMessages])
  
  return (
    <div className="messages">
      <div className="messages-list">
        <div className="messages-list-title">Messages</div>
        {allClients.length > 0 && allClients.map((item, idx) => (
          // console.log(item)
          // document.getElementById("chatbox").scrollIntoView()
          <div key={`chat-` + idx} className="messages-list-item" onClick={() => (getMessages(item[0].clientID), window.localStorage.setItem('currentChatId', (item[0].clientID)))}>
            <div className="messages-list-item-image">
              <SVG svg={'account-circle'}></SVG>
              {item.filter((e) => { return e.readExpert === false; }).length > 0 ? <div className="messages-list-item-unread">{item.filter((e) => { return e.readExpert === false; }).length}</div> : null}
            </div>
            <div className="messages-list-item-user">
            <div className="messages-list-item-user-name">{item[item.length - 1].clientName}</div>
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
              <div id={`messages-${idx}`} key={idx} className="messages-chatbox-container-item">
                {item.sender == 'expert' ? <img src={userExpert.photo[0].location}></img> : chatMessages[chatMessages.length - 1].clientPhoto ? <img src={chatMessages[chatMessages.length - 1].clientPhoto}></img> : <SVG svg={'account-circle'}></SVG>}
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
                <textarea id="message" className="messages-chatbox-container-input" rows="auto" name="message" placeholder="Type a message" value={message} onChange={(e) => (setMessage(e.target.value), setError(''), setClientName(chatMessages[0].name), setClientID(chatMessages[0].clientID))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Type a message'} required></textarea>
                <span className="messages-chatbox-container-input-container-svg" onClick={(e) => sendMessage(e)}>{loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-message" allowFullScreen></iframe> : <SVG svg={'send-message'}></SVG>}</span>
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
  )
}

export default Messages
