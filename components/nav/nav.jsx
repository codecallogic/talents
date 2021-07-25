import SVG from '../../files/SVGs'
import { useState, useEffect } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const Nav = ({}) => {
  const [navSticky, setNavSticky] = useState(false)
  
  useScrollPosition(({prevPos, currPos}) => {
    currPos.y < 0 ? setNavSticky(true) : setNavSticky(false)
  })
  
  return (
    <div className={`nav ` + (navSticky ? ` nav-sticky` : null)}>
      <div className="nav-logo">Talent</div>
      <div className="nav-menu">
        <a href="/hosting" className="nav-menu-item">Become a host</a>
        <div className="nav-menu-dropdown">
          <label className="nav-menu-dropdown-label" htmlFor="nav-dropdown"><span className="nav-menu-dropdown-label-icon">&nbsp;</span><SVG svg={'account-circle'}></SVG></label>
          <input className="nav-menu-dropdown-input" type="checkbox" name="nav-dropdown" id="nav-dropdown" />
          <div className="nav-menu-dropdown-container">
            <div className="nav-menu-dropdown-container-item">Log in</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav
