import Nav from './nav'

const Header = ({userExpert}) => {
  
  return (
    <div className="header">
      <Nav userExpert={userExpert}></Nav>
      <div className="header-container">
        <div className="header-container-title">Connect with talent from the beverage world</div>
        <div className="header-container-button" onClick={() => window.location.href = '/talents'}>Discover talents</div>
      </div>
    </div>
  )
}

export default Header
