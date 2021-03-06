import Nav from '../../components/nav/nav'
import SVGs from '../../files/SVGs'
import { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import {nanoid} from 'nanoid'
import withExpert from '../withExpert'
import {activities, specialties, locations} from '../../files/expertTalents'
import {API, SOCKET} from '../../config'
import {useRouter} from 'next/router'
import axios from 'axios'
import Messages from '../../components/expert/expertMessages'
import PlacesAutocomplete from 'react-places-autocomplete'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import io from "socket.io-client";

const socket = io.connect(SOCKET, {transports: ['websocket', 'polling', 'flashsocket']});

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

// TODO: Modify invoice to include client user data model and CRUD, client sign up email verification

const ExpertAccount = ({params, dash, profile, changeView, userExpert, newToken, clients, preloadNotifications, createExpertProfile}) => {
  // console.log(userExpert)
  // console.log(clients)
  const router = useRouter()
  const [input_dropdown, setInputDropdown] = useState('')
  const [loading_profile_image, setLoadingProfileImage] = useState(false)
  const [loading_talent_image, setLoadingTalentImage] = useState(false)
  const [notifications, setNotifications] = useState(preloadNotifications ? preloadNotifications : null)
  const [allClients, setAllClients] = useState(clients)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if(params) params.change ? changeView(params.change) : null
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

      setAllClients(newArray)
      let totalNotifications = null
      newArray.map((item) => {
        item.filter((e) => { return e.readExpert === false; }).length > 0 
        ? 
        (totalNotifications += item.filter((e) => { return e.readExpert === false; }).length)
        : null
      })
      setNotifications(totalNotifications)
      return NotificationManager.info(`New message from ${messages.clientName}`)
      

      // if(messages) 
    })
  }, [router.query.change])

  useEffect(() => {
    if(router.query.view) router.query.view == 'profile' ? changeView('profile') : null

    for(let key in userExpert){
      if(key == 'description') createExpertProfile("UPDATE_EXPERT", 'description', userExpert.description)
      if(key == 'activity'){
        userExpert.activity.forEach((item) => {
          createExpertProfile('TALENTS', 'activity', item)
        })
      }
      if(key == 'specialty'){
        userExpert.specialty.forEach((item) => {
          createExpertProfile('TALENTS', 'specialty', item)
        })
      }
      if(key == 'location'){
        userExpert.location.forEach((item) => {
          createExpertProfile('TALENTS', 'location', item)
        })
      }
    }
  }, [])
  
  useEffect(() => {
    if(profile.photo) handleProfileUpdate()
    // handleProfileUpdate()
  }, [profile.photo])

  useEffect(() => {
    if(profile.photo_talent) handleProfileUpdate()
    // handleProfileUpdate()
  }, [profile.photo_talent])

  const handleProfileUpdate = async (e) => {
    if(e) e.preventDefault()

    let data = new FormData()
    let fileID = nanoid()

    if(profile.photo){data.append('file', profile.photo, `profiles/expert-${fileID}.${profile.photo.name.split('.')[1]}`), createExpertProfile("UPDATE_EXPERT", 'photo', ''), setLoadingProfileImage(true)}
    if(profile.photo_talent){data.append('file', profile.photo_talent, `talents/expert-${fileID}.${profile.photo_talent.name.split('.')[1]}`), createExpertProfile("UPDATE_EXPERT", 'photo_talent', ''), setLoadingTalentImage(true)}

    if(profile){
      for(const key in profile){
        if(key !== 'photo' || key !== 'photo_talent' || key !== 'activity' || key !== 'specialty' || key !== 'location') data.append(key, profile[key])
        if(key == 'activity') data.append(key, JSON.stringify(profile[key]))
        if(key == 'specialty') data.append(key, JSON.stringify(profile[key]))
        if(key == 'location') data.append(key, JSON.stringify(profile[key]))
      }
    }

    if(userExpert.id) data.append('id', userExpert.id)

    if(profile.photo && userExpert.photo.length > 0) data.append('delete_photo', userExpert.photo[0].key)
    if(profile.photo_talent && userExpert.photo_talent.length > 0) data.append('delete_photo_talent', userExpert.photo_talent[0].key)

    try {
      const responseProfile = await axios.post(`${API}/expert/profile-create`, data, {
        headers: {
          Authorization: `Bearer ${newToken}`,
          contentType: `application/json`
        }
      })
      // console.log(responseProfile.data)
      window.location.href = `/talents`
    } catch (error) {
      console.log('Error', error.response)
      // if(error) window.location.href = `/experts?view=profile`
    }
  }

  const updateNotifications = (total) => {
    setNotifications(total)
  }
  
  return (
    <>
    <Nav changeStyle='primary-background' userExpert={userExpert} notifications={notifications}></Nav>
    <div className="experts">
      <NotificationContainer/>
      {dash.view == 'main' &&
      <div className="experts-container">
        <div className="experts-title">Account</div>
        <div className="experts-cards">
          <div className="experts-cards-item" onClick={() => changeView('profile')}>
            <div className="experts-cards-item-el"><SVGs svg={'profile-card'}></SVGs></div>
            <div className="experts-cards-item-el-title">Profile info</div>
            <div className="experts-cards-item-el-info">Provide personal details and how client can discover you.</div>
          </div>
          <div className="experts-cards-item" onClick={() => changeView('messages')}>
            <div className="experts-cards-item-el"><SVGs svg={'message'}></SVGs></div>
            <div className="experts-cards-item-el-title">Messages</div>
            <div className="experts-cards-item-el-info">Read messages of people interested in your skills.</div>
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
              {!loading_profile_image && userExpert.photo.length > 0 ? <img src={userExpert.photo[0].location}></img> : null}
              {loading_profile_image ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-profile-image" allowFullScreen></iframe> : userExpert.photo.length < 1 ? <SVGs svg={'account-circle'}></SVGs> : null}
              <a>Update profile photo</a>
            </label>
            <input type="file" name="profile_image" id="profile_image" accept="image/*" onChange={(e) => (createExpertProfile('UPDATE_EXPERT', 'photo', e.target.files[0]))}/>
          </div>
          <div className="experts-profile-right">
            <div className="experts-profile-right-title">Hi, I'm {userExpert ? userExpert.username : 'Unknown'}</div>
            <form action="" className="form" onSubmit={handleProfileUpdate}>
              <div className="form-group-single">
                <label htmlFor="talent_image" className="experts-profile-right-image">
                {!loading_talent_image && userExpert.photo_talent.length > 0 ? <img src={userExpert.photo_talent[0].location}></img> : null}
                {loading_talent_image ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-talent-image" allowFullScreen></iframe> : userExpert.photo_talent.length < 1 ? <SVGs svg={'file-image'}></SVGs> : null}
                <a>Update talent photo</a>
                </label>
                <input type="file" name="talent_image" id="talent_image" className="experts-profile-right-image-input" accept="image/*" onChange={(e) => (createExpertProfile('UPDATE_EXPERT', 'photo_talent', e.target.files[0]))}/>
              </div>
              <div className="form-group-single">
                <label htmlFor="Username" >Description</label>
                <div className="form-group-single-input">
                  <textarea id="username" rows="5" name="username" placeholder="(Description)" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Description)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} value={profile.description} onChange={(e) => createExpertProfile('UPDATE_EXPERT', 'description', e.target.value)} required></textarea>
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
                  {/* <div className="form-group-single-dropdown-input">
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
                  </div> */}
                </div>
                <PlacesAutocomplete value={search} onChange={(e) => setSearch(e)} onSelect={(e) => (createExpertProfile('TALENTS', 'location', e))} searchOptions={searchOptionsCities}>
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="form-group-single-dropdown-autocomplete">
                          <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" {...getInputProps({placeholder: "(Select Location)"})}></textarea>
                          <div className="form-group-single-dropdown-autocomplete-container">
                          {loading ? <div>...loading</div> : null}
                          {suggestions.map((suggestion, idx) => {
                            const className = suggestion.active
                            ? 'form-group-single-dropdown-autocomplete-suggestion-active'
                            : 'form-group-single-dropdown-autocomplete-suggestion';
                            const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                            return <div  className="form-group-single-dropdown-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                          })}
                          </div>
                        </div>
                      )}
                </PlacesAutocomplete>
                <div className="form-group-single-dropdown-selected">
                  {profile.location.length > 0 && profile.location.map((item, idx) => (
                    <div key={idx} className="form-group-single-dropdown-selected-google-item">{item}<span onClick={(e) => (createExpertProfile('TALENTS_REMOVE', 'location', item))} className="form-group-single-dropdown-selected-google-item-close">X</span></div>
                  ))}
                </div>
                <div className="form-group-single">
                  {loading_talent_image || loading_profile_image ? null : <button type="submit">Update</button>}
                </div>
            </form>
          </div>
        </div>
      </div>
      }
      {dash.view == 'messages' &&
        <Messages userExpert={userExpert} clients={allClients} updateNotifications={updateNotifications}></Messages>
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

ExpertAccount.getInitialProps = ({query}) => {
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withExpert(ExpertAccount))
