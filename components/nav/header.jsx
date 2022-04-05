import Nav from './nav'
import io from "socket.io-client";
import { useEffect, useState } from 'react'
import {SOCKET} from "../../config"
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const socket = io.connect(SOCKET, {transports: ['websocket', 'polling', 'flashsocket']});

const Header = ({userExpert, clients, preloadNotifications, openLoginModal}) => {

  const [notifications, setNotifications] = useState(preloadNotifications ? preloadNotifications : null)

  useEffect(() => {
    if(userExpert){
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

      newArray.map((item) => {
        item.filter((e) => { return e.readExpert === false; }).length > 0 
        ? 
        (setNotifications(item.filter((e) => { return e.readExpert === false; }).length))
        : null
      })
      return NotificationManager.info(`New message from ${messages.clientName}`)
    })
    }
  }, [])
  
  return (
    <div className="header">
      <Nav userExpert={userExpert} notifications={notifications} openLoginModal={openLoginModal}></Nav>
      <div className="header-container">
        <NotificationContainer/>
        <div className="header-container-title">Connect with talents from the beverage world</div>
        <div className="header-container-button" onClick={() => window.location.href = '/talents'}>Discover talents</div>
      </div>
    </div>
  )
}

export default Header
