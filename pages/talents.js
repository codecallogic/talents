import Nav from '../components/nav/nav'
import {activities, specialties, locations} from '../files/expertTalents'

const Talents = ({}) => {
  
  return (
    <>
    <Nav changeStyle='primary-background'></Nav>
    <div className="talents">
      <div className="talents-title">Discover Talents</div>
      <div className="talents-menu">
        <div className="talents-menu-container">
          <div className="talents-menu-title">Activity</div>
          <div className="talents-menu-list">
            {activities && activities.map((item, idx) => (
              <div className="talents-menu-list-item">{item}</div>
            ))}
          </div>
        </div>
        <div className="talents-menu-container">
          <div className="talents-menu-title">Specialty</div>
          <div className="talents-menu-list">
            {specialties && specialties.map((item, idx) => (
              <div className="talents-menu-list-item">{item}</div>
            ))}
          </div>
        </div>
        <div className="talents-menu-container">
          <div className="talents-menu-title">Location</div>
          <div className="talents-menu-list">
            {locations && locations.map((item, idx) => (
              <div className="talents-menu-list-item">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Talents
