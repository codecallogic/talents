import Nav from '../../components/nav/nav'
import SVGs from '../../files/SVGs'
import { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import withExpert from '../withExpert'
import {activities, specialties, locations} from '../../files/expertTalents'

const ExpertAccount = ({dash, profile, changeView, newUser, createExpertProfile}) => {

  const [input_dropdown, setInputDropdown] = useState('')

  const imageHandler = (e, type) => {
    console.log('Hello')
    // let imageMax = imageCount + e.target.files.length
    // if(imageMax > 3){ setError('Max number of images is 3'); window.scrollTo(0,document.body.scrollHeight); return}

    // if(e.target.files.length > 0){
    //   let array = Array.from(e.target.files)
    //   array.forEach( (item) => {
    //     let url = URL.createObjectURL(item);
    //     item.location = url
    //   })
    // }
    // if(type == 'slab'){
    //   setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
    //   addSlabImages([...selectedFiles, ...e.target.files])
    //   setImageCount(imageMax)
    // }

    // if(type == 'product'){
    //   setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
    //   addProductImages([...selectedFiles, ...e.target.files])
    //   setImageCount(imageMax)
    // }
  }
  
  return (
    <>
    <Nav changeStyle='primary-background' userExpert={newUser}></Nav>
    <div className="experts">
      {dash.view == 'main' &&
      <div className="experts-container">
        <div className="experts-title">Account</div>
        <div className="experts-cards">
          <div className="experts-cards-item" onClick={() => changeView('profile')}>
            <div className="experts-cards-item-el"><SVGs svg={'profile-card'}></SVGs></div>
            <div className="experts-cards-item-el-title">Profile info</div>
            <div className="experts-cards-item-el-info">Provide personal details and how client can discover you.</div>
          </div>
        </div>
      </div>
      }
      {dash.view == 'profile' &&
      <div className="experts-container">
        <div className="experts-breadcrumbs"><a onClick={() => changeView('main')}>Account</a> &#x3e; <span>Profile info</span> </div>
        <div className="experts-title">Profile Info</div>
        <div className="experts-profile">
          <div className="experts-profile-left">
            <label htmlFor="profile_image" className="experts-profile-left-image">
              <SVGs svg={'account-circle'}></SVGs>
              <a>Update photo</a>
            </label>
            <input type="file" name="profile_image" id="profile_image" accept="image/*" onClick={(e) => imageHandler(e)}/>
          </div>
          <div className="experts-profile-right">
            <div className="experts-profile-right-title">Hi, I'm {newUser ? newUser.username : 'Unknown'}</div>
            <form action="" className="form">
              <div className="form-group-single">
                <label htmlFor="Username" >Description</label>
                <div className="form-group-single-input">
                  <textarea id="username" rows="5" name="username" placeholder="(Description)" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Description)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
                </div>
                
              </div>
              <div className="form-group-single-dropdown">
                  <label htmlFor="activity">Activity</label>
                  <div className="form-group-single-dropdown-input">
                    <textarea rows="1" wrap="off" readOnly onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="activity" placeholder="(Select Activity)" onClick={() => setInputDropdown('activity')} required></textarea>
                    <div onClick={() => (input_dropdown !== 'activity' ? setInputDropdown('activity') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'activity' &&
                    <div className="form-group-single-dropdown-input-list">
                      {activities && activities.map((item, idx) => {
                        return profile.activity.includes(item.toLowerCase()) ? 
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS_REMOVE', 'activity', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item} <SVGs svg={'checkmark'}></SVGs></div>
                        :
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS', 'activity', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item}</div>
                      })}
                    </div>
                    }
                  </div>
                  <div className="form-group-single-dropdown-selected">
                    {profile.activity.length > 0 && profile.activity.map((item, idx) => (
                      <div key={idx} className="form-group-single-dropdown-selected-item">{item}</div>
                    ))}
                  </div>
                </div>
                <div className="form-group-single-dropdown">
                  <label htmlFor="specialty">Specialty</label>
                  <div className="form-group-single-dropdown-input">
                    <textarea rows="1" wrap="off" readOnly onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="specialty" placeholder="(Select Specialty)" onClick={() => setInputDropdown('specialty')} required></textarea>
                    <div onClick={() => (input_dropdown !== 'specialty' ? setInputDropdown('specialty') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'specialty' &&
                    <div className="form-group-single-dropdown-input-list">
                      {specialties && specialties.map((item, idx) => {
                        return profile.specialty.includes(item.toLowerCase()) ? 
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS_REMOVE', 'specialty', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item} <SVGs svg={'checkmark'}></SVGs></div>
                        :
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS', 'specialty', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item}</div>
                      })}
                    </div>
                    }
                  </div>
                  <div className="form-group-single-dropdown-selected">
                    {profile.specialty.length > 0 && profile.specialty.map((item, idx) => (
                      <div key={idx} className="form-group-single-dropdown-selected-item">{item}</div>
                    ))}
                  </div>
                </div>
                <div className="form-group-single-dropdown">
                  <label htmlFor="location">Location</label>
                  <div className="form-group-single-dropdown-input">
                    <textarea rows="1" wrap="off" readOnly onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" placeholder="(Select Location)" onClick={() => setInputDropdown('location')} required></textarea>
                    <div onClick={() => (input_dropdown !== 'location' ? setInputDropdown('location') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'location' &&
                    <div className="form-group-single-dropdown-input-list">
                      {locations && locations.map((item, idx) => {
                        return profile.location.includes(item.toLowerCase()) ? 
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS_REMOVE', 'location', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item} <SVGs svg={'checkmark'}></SVGs></div>
                        :
                        <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={(e) => (createExpertProfile('TALENTS', 'location', e.target.innerText.toLowerCase()), setInputDropdown(''))}>{item}</div>
                      })}
                    </div>
                    }
                  </div>
                  <div className="form-group-single-dropdown-selected">
                    {profile.location.length > 0 && profile.location.map((item, idx) => (
                      <div key={idx} className="form-group-single-dropdown-selected-item">{item}</div>
                    ))}
                  </div>
                  <div className="form-group-single">
                    <button>Update</button>
                  </div>
                </div>
            </form>
          </div>
        </div>
      </div>
      }
    </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    dash: state.expertDash,
    profile: state.expertAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeView: (view) => dispatch({type: 'DASH', value: view}),
    createExpertProfile: (type, name, value) => dispatch({type: type, name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withExpert(ExpertAccount))
