import SVG from '../../files/SVGs'
import { useState, useEffect } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const Nav = ({userExpert, changeStyle}) => {
  const [navSticky, setNavSticky] = useState(false)
  
  useScrollPosition(({prevPos, currPos}) => {
    currPos.y < 0 ? setNavSticky(true) : setNavSticky(false)
  })
  
  return (
    <div className={`nav ` + (navSticky ? ` nav-sticky` : null) + (changeStyle ? ` ${changeStyle}` : null)}>
      <div className="nav-logo" onClick={() => window.location.href = '/'}>Talent</div>
      <div className="nav-menu">
        <a href="/expert" className="nav-menu-item">{userExpert ? null : 'Become a host'}</a>
        <div className={`nav-menu-dropdown `}>
          <label className="nav-menu-dropdown-label" htmlFor="nav-dropdown"><span className="nav-menu-dropdown-label-icon">&nbsp;</span><SVG svg={'account-circle'}></SVG></label>
          <input className="nav-menu-dropdown-input" type="checkbox" name="nav-dropdown" id="nav-dropdown" />
          <div className={`nav-menu-dropdown-container ` + (changeStyle ? ` ${changeStyle}` : null)}>
            {userExpert ? null : <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = '/expert-login'}>Login</div>}
            {userExpert ? <div className="nav-menu-dropdown-container-item" onClick={() => window.location.href = '/experts'}>Account</div> : null }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav
