import { useEffect, useState } from "react"
import {API} from '../../config'
import axios from 'axios'
import SVG from '../../files/SVGs'

const Messages = ({userExpert, allClients}) => {
  // console.log(userExpert)
  // console.log(allClients)

  const [chatMessages, setChatMessages] = useState([])
  const [message, setMessage] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientID, setClientID] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    try {
      const responseMessage = await axios.post(`${API}/message/client-chat`, {name: userExpert.username, message: message, expertName: userExpert.username, expertID: userExpert.id, clientID: clientID})
      setMessage('')
      setLoading(false)

      // console.log(responseMessage.data)
      
      let allClients
      allClients = responseMessage.data.reduce( (r, a) => {
        r[a.clientID] = r[a.clientID] || [];
        r[a.clientID].push(a);
        return r;
      }, Object.create(null));

      if(allClients){
        allClients = Object.keys(allClients).map((key) => allClients[key])

        allClients.forEach((item) => {
          if(item[0].clientID == clientID) return setChatMessages(item)
        })
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }

  const getMessages = async (id) => {
    try {
      const responseClientMessages = await axios.post(`${API}/auth/get-expert-messages`, {id: userExpert.id})
      let messages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

      // console.log(messages)

      let allClients
      allClients = messages.reduce( (r, a) => {
        r[a.clientID] = r[a.clientID] || [];
        r[a.clientID].push(a);
        return r;
      }, Object.create(null));

      if(allClients){
        allClients = Object.keys(allClients).map((key) => allClients[key])

        allClients.forEach((item) => {
          if(item[0].clientID == id) return setChatMessages(item)
        })
      }
      
    } catch (error) {
      if(error) error.response ? (setError(error.response.data)) : (setError('Failed to get data'))
    }
  }
  
  return (
    <div className="messages">
      <div className="messages-list">
        <div className="messages-list-title">Messages</div>
        {allClients.length > 0 && allClients.map((item, idx) => (
           <div key={`chat-` + idx} className="messages-list-item" onClick={() => getMessages(item[0].clientID)}>
             <SVG svg={'account-circle'}></SVG>
             <div className="messages-list-item-user">
              <div className="messages-list-item-user-name">{item[item.length - 1].name}</div>
              <div className="messages-list-item-user-message">{item[item.length - 1].message}</div>
              <div className="messages-list-item-user-message-date">{formatDate(item[item.length - 1].createdAt)}</div>
             </div>
           </div>
        ))
        }
      </div>
      <div className="messages-chatbox">
        {chatMessages.length > 0 ? 
          <div className="messages-chatbox-container">
            {chatMessages.map((item, idx) => (
              <div key={idx} className="messages-chatbox-container-item">
                <SVG svg={'account-circle'}></SVG>
                <div className="messages-chatbox-container-item-user">
                  <div className="messages-chatbox-container-item-user-name">{item.name}</div>
                  <div className="messages-chatbox-container-item-user-message">{item.message}</div>
                  <div className="messages-chatbox-container-item-user-message-date">{formatDate(item.createdAt)}</div>
                </div>
              </div>
            ))}
            <div className="messages-chatbox-container-input-container">
              <textarea id="message" className="messages-chatbox-container-input" rows="auto" name="message" placeholder="Type a message" value={message} onChange={(e) => (setMessage(e.target.value), setError(''), setClientName(chatMessages[0].name), setClientID(chatMessages[0].clientID))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Type a message'} required></textarea>
              <span className="messages-chatbox-container-input-container-svg" onClick={(e) => sendMessage(e)}>{loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-message" allowFullScreen></iframe> : <SVG svg={'send-message'}></SVG>}</span>
            </div>
          </div>
        :
          <div className="messages-chatbox-container"> 
            Click on a message to view
          </div>
        }
      </div>
    </div>
  )
}

export default Messages
