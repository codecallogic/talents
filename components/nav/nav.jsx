import SVG from '../../files/SVGs'
import { useState, useEffect } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import axios from 'axios'
import {API} from '../../config'

const Nav = ({userExpert, userClient, changeStyle, notifications, openLoginModal}) => {
  const [navSticky, setNavSticky] = useState(false)
  // console.log(userClient)
  useScrollPosition(({prevPos, currPos}) => {
    currPos.y < 0 ? setNavSticky(true) : setNavSticky(false)
  })

  const logoutExpert = async () => {
    try {
      const logoutResponse = await axios.post(`${API}/auth/logout-expert`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const logoutClient = async () => {
    try {
      const logoutResponse = await axios.post(`${API}/auth/logout-client`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className={`nav ` + (navSticky ? ` nav-sticky` : null) + (changeStyle ? ` ${changeStyle}` : null)}>
      <div className="nav-logo" onClick={() => window.location.href = '/'}>Talent</div>
      <div className="nav-menu">
        <a href="/expert" className="nav-menu-item nav-menu-item-host">{userExpert ? null : 'Become a host'}</a>
        {userClient && <a className="nav-menu-item" onClick={() => window.location.href = '/messages'}>
          <SVG svg={'inbox'}></SVG>
          {notifications ? <span className="nav-menu-item-notifcations">{notifications}</span> : null}
          </a>}
        {userExpert && <a className="nav-menu-item" onClick={() => window.location.href = '/experts?change=messages'}>
          <SVG svg={'inbox'}></SVG>
          {notifications ? <span className="nav-menu-item-notifcations">{notifications}</span> : null}
          </a>}
        <div className={`nav-menu-dropdown `}>
          <label className="nav-menu-dropdown-label" htmlFor="nav-dropdown"><span className="nav-menu-dropdown-label-icon">&nbsp;</span><SVG svg={'account-circle'}></SVG></label>
          <input className="nav-menu-dropdown-input" type="checkbox" name="nav-dropdown" id="nav-dropdown" />
          <div className={`nav-menu-dropdown-container ` + (changeStyle ? ` ${changeStyle}` : null)}>
            {userExpert ? null : userClient ? <div className="nav-menu-dropdown-container-item" onClick={() => logoutClient()}>Logout</div> : <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = '/expert-login'}>Expert Login</div>}
            {userExpert ? null : userClient ? <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = '/account'}>Account</div> : null}
            {!userExpert ? !userClient ? <div className="nav-menu-dropdown-container-item" onClick={() => (openLoginModal(), document.getElementById('nav-dropdown').checked = false)}>User Login</div> : null : null}
            {userExpert ? <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = '/experts'}>Account</div> : null }
            {userExpert ? <div className="nav-menu-dropdown-container-item" onClick={() => logoutExpert()}>Logout</div> : null }
            <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = "/talents"}>Talents</div>
            {userExpert ? null : <div className="nav-menu-dropdown-container-item nav-menu-dropdown-container-item-host" onClick={() => window.location.href = "/expert"}>Become a host</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav
