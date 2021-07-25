import Nav from './nav'

const Header = ({}) => {
  
  return (
    <div className="header">
      <Nav></Nav>
      <div className="header-container">
        <div className="header-container-title">Connect with talent from the beverage world</div>
        <div className="header-container-button">Discover talents</div>
      </div>
    </div>
  )
}

export default Header
