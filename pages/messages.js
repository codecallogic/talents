import SVG from '../files/SVGs'
import Nav from '../components/nav/nav'
import withMessages from './withMessages'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {API} from '../config'

const Messages = ({userClient, messages, allExperts}) => {
  // console.log(messages)
  // console.log(allExperts)
  // console.log(userClient)

  const [chatMessages, setChatMessages] = useState([])
  const [message, setMessage] = useState('')
  const [expertName, setExperName] = useState('')
  const [expertPhoto, setExpertPhoto] = useState('')
  const [expertID, setExpertID] = useState('')
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
      const responseMessage = await axios.post(`${API}/message/expert-chat`, {name: userClient.username, message: message, expertName: expertName, expertPhoto: expertPhoto, expertID: expertID, clientID: userClient.id})
      setMessage('')
      setLoading(false)
      let allExperts
      allExperts = responseMessage.data.reduce( (r, a) => {
        r[a.expertID] = r[a.expertID] || [];
        r[a.expertID].push(a);
        return r;
      }, Object.create(null));

      if(allExperts){
        allExperts = Object.keys(allExperts).map((key) => allExperts[key])

        allExperts.forEach((item) => {
          if(item[0].expertID == expertID) return setChatMessages(item)
        })
      }
      // window.location.reload()
      // setMessage(responseMessage.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }

  const getMessages = async (id) => {
    try {
      const responseClientMessages = await axios.post(`${API}/auth/get-client-messages`, {id: userClient.id})
      messages = responseClientMessages.data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

      let allExperts
      allExperts = messages.reduce( (r, a) => {
        r[a.expertID] = r[a.expertID] || [];
        r[a.expertID].push(a);
        return r;
      }, Object.create(null));

      if(allExperts){
        allExperts = Object.keys(allExperts).map((key) => allExperts[key])

        allExperts.forEach((item) => {
          if(item[0].expertID == id) return setChatMessages(item)
        })
      }
      
    } catch (error) {
      if(error) error.response ? (errorFailedToGetData = error.response.data) : (errorFailedToGetData = 'Failed to get data')
    }
  }

  return (
    <>
    <Nav changeStyle='primary-background' userClient={userClient}></Nav>
    <div className="messages">
      <div className="messages-list">
        <div className="messages-list-title">Messages</div>
        {allExperts.length > 0 && allExperts.map((item, idx) => (
           <div key={`chat-` + idx} className="messages-list-item" onClick={() => getMessages(item[0].expertID)}>
             <img src={item[0].expertPhoto} alt="" />
             <div className="messages-list-item-user">
              <div className="messages-list-item-user-name">{item[item.length - 1].expertName}</div>
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
              <textarea id="message" className="messages-chatbox-container-input" rows="auto" name="message" placeholder="Type a message" value={message} onChange={(e) => (setMessage(e.target.value), setError(''), setExperName(chatMessages[0].expertName), setExpertPhoto(chatMessages[0].expertPhoto), setExpertID(chatMessages[0].expertID))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Type a message'} required></textarea>
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
    </>
  )
}

export default withMessages(Messages)
