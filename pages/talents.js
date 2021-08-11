import Nav from '../components/nav/nav'
import {activities, specialties, locations} from '../files/expertTalents'
import SVGs from '../files/SVGs'
import withTalents from './withTalents'
import {connect} from 'react-redux'

const Talents = ({userClient, talents, talentsFiltered, filterTalents}) => {
  const handleFilter = (item) => {
    let dataActivity = []

    if(talentsFiltered.activity.length > 0){
      item.activity.forEach((slug) => {
        dataActivity.push(talentsFiltered.activity.some((el) => item.activity.includes(el)))
      })
    }

    let dataSpecialty = []

    if(talentsFiltered.specialty.length > 0){
      item.specialty.forEach((slug) => {
        dataSpecialty.push(talentsFiltered.specialty.some((el) => item.specialty.includes(el)))
      })
    }

    let dataLocation = []

    if(talentsFiltered.location.length > 0){
      item.location.forEach((slug) => {
        dataLocation.push(talentsFiltered.location.some((el) => item.location.includes(el)))
      })
    }


    if(!dataActivity.includes(false) && !dataSpecialty.includes(false) && !dataLocation.includes(false)) return item
  }
  
  return (
    <>
    <Nav changeStyle='primary-background' userExpert={userClient}></Nav>
    <div className="talents">
      <div className="talents-title">Discover Talents</div>
      <div className="talents-menu">
        <div className="talents-menu-container">
          <div className="talents-menu-title">Activity</div>
          <div className="talents-menu-list">
            {activities && activities.map((item, idx) => {
              return talentsFiltered.activity.includes(item.toLowerCase().trim()) ? 
              <div key={idx} className="talents-menu-list-item talents-selected"  onClick={(e) => filterTalents('TALENTS_REMOVE', 'activity', item.toLowerCase().trim())}><span>{item}</span> <SVGs svg={'checkmark'}></SVGs></div>
              :
              <div key={idx} className="talents-menu-list-item" onClick={(e) => filterTalents('TALENTS', 'activity', item.toLowerCase().trim())}><span>{item}</span></div>
            })}
          </div>
        </div>
        <div className="talents-menu-container">
          <div className="talents-menu-title">Specialty</div>
          <div className="talents-menu-list">
            {specialties && specialties.map((item, idx) => {
              return talentsFiltered.specialty.includes(item.toLowerCase().trim()) ? 
              <div key={idx} className="talents-menu-list-item talents-selected"  onClick={(e) => (filterTalents('TALENTS_REMOVE', 'specialty', item.toLowerCase().trim()))}><span>{item}</span> <SVGs svg={'checkmark'}></SVGs></div>
              :
              <div key={idx} className="talents-menu-list-item" onClick={(e) => (filterTalents('TALENTS', 'specialty', item.toLowerCase().trim()))}><span>{item}</span></div>
            })}
          </div>
        </div>
        <div className="talents-menu-container">
          <div className="talents-menu-title">Location</div>
          <div className="talents-menu-list">
            {locations && locations.map((item, idx) => {
              return talentsFiltered.location.includes(item.toLowerCase().trim()) ? 
              <div key={idx} className="talents-menu-list-item talents-selected"  onClick={(e) => filterTalents('TALENTS_REMOVE', 'location', item.toLowerCase().trim())}><span>{item}</span> <SVGs svg={'checkmark'}></SVGs></div>
              :
              <div key={idx} className="talents-menu-list-item" onClick={(e) => filterTalents('TALENTS', 'location', item.toLowerCase().trim())}><span>{item}</span></div>
            })}
          </div>
        </div>
      </div>
      <div className="talents-collection">
          {talents && talents.filter((item) => handleFilter(item)).map((item, idx) => (
            <div key={idx} className="talents-collection-box">
              <div className="talents-collection-box-left">
                <img src={item.photo_talent[0].location} alt="" />
              </div>
              <div className="talents-collection-box-right">
                <div className="talents-collection-box-right-section">
                  <div className="talents-collection-box-right-section-title">About Me</div>
                  <div className="talents-collection-box-right-section-info">{item.description}</div>
                </div>
                <div className="talents-collection-box-right-section">
                  <div className="talents-collection-box-right-section-title">Activity</div>
                  <div className="talents-collection-box-right-section-info">{item.activity.length > 0 && item.activity.slice(0, 4).map((item, idx) => 
                    <span key={idx} className="talents-collection-box-right-section-info-item">{item}</span>
                  )}</div>
                </div>
                <div className="talents-collection-box-right-section">
                  <div className="talents-collection-box-right-section-title">Specialty</div>
                  <div className="talents-collection-box-right-section-info">{item.specialty.length > 0 && item.specialty.slice(0, 4).map((item, idx) => 
                    <span key={idx} className="talents-collection-box-right-section-info-item">{item}</span>
                  )}</div>
                </div>
                <div className="talents-collection-box-right-section">
                  <div className="talents-collection-box-right-section-title">Location</div>
                  <div className="talents-collection-box-right-section-info">{item.location.length > 0 && item.location.slice(0, 4).map((item, idx) => 
                    <span key={idx} className="talents-collection-box-right-section-info-item">{item}</span>
                  )}</div>
                </div>
                <SVGs svg={'message'} classprop={'talents-collection-box-right-message'}></SVGs>
                <div className="talents-collection-box-right-expert">
                  <img src={item.photo[0].location} alt=""/>
                  <span>{item.username}</span>
                </div>
              </div>
            </div>
          ))
          }
      </div>
    </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    talentsFiltered: state.talents
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterTalents: (type, name, value) => dispatch({type: type, name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTalents(Talents))
