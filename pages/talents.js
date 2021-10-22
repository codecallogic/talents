import Nav from '../components/nav/nav'
import {useState, useEffect} from 'react'
import {activities, specialties, locations} from '../files/expertTalents'
import SVGs from '../files/SVGs'
import withTalents from './withTalents'
import {connect} from 'react-redux'
import axios from 'axios'
import {API, SOCKET} from '../config'
import PlacesAutocomplete from 'react-places-autocomplete'
import io from "socket.io-client";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const socket = io.connect(SOCKET, {transports: ['websocket', 'polling', 'flashsocket']});

const Talents = ({userClient, talents, experts, preloadNotifications, talentsFiltered, filterTalents, signup, clientSignUp}) => {
  // console.log(talents)
  // console.log(userClient)
  // console.log(experts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loginModal, setLoginModal] = useState(false)
  const [signupModal, setSignupModal] = useState(false)
  const [messageModal, setMessageModal] = useState(false)
  const [messageID, setMessageID] = useState('')
  const [messageExpert, setMessageExpert] = useState('')
  const [expertName, setExpertName] = useState('')
  const [expertPhoto, setExpertPhoto] = useState('')
  const [expertEmail, setExpertEmail] = useState('')
  const [allExperts, setAllExperts] = useState(experts)
  const [notifications, setNotifications] = useState(preloadNotifications ? preloadNotifications : null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if(search.length == 0){
      filterTalents('RESET_TALENTS_LOCATION')
      setError('')
    }
  }, [search])

  useEffect(() => {
    if(signupModal == true) signup.password !== signup.confirm_password ? setError(`passwords don't match`) : null
    if(userClient){
      socket.on(userClient.id, (messages) => {
        // console.log(messages)
        let newMessages = null
        let newExperts= []

        newMessages = messages.messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)

        newExperts = newMessages.reduce( (r, a) => {
          r[a.expertID] = r[a.expertID] || [];
          r[a.expertID].push(a);
          return r;
        }, Object.create(null));

        let newArray = []

        for(let key in newExperts){
          newArray.push(newExperts[key])
        }
        // console.log(window.localStorage.getItem('currentChatIdExpert'))
        // console.log(newArray)

        setAllExperts(newArray)
        let totalNotifications = null
        newArray.map((item) => {
          item.filter((e) => { return e.readClient === false; }).length > 0 
          ? 
          (totalNotifications += item.filter((e) => { return e.readClient === false; }).length)
          : null
        })
        setNotifications(totalNotifications)
        return NotificationManager.info(`New message from ${messages.expertName}`)
      })
    }
  }, [signup.confirm_password, signup.password])
  
  const handleFilter = (item) => {
    console.log(item)
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

    if(talentsFiltered.activity.length > dataActivity.length) return
    if(talentsFiltered.specialty.length > dataSpecialty.length) return
    if(talentsFiltered.location.length > dataLocation.length) return
    
    if(!dataActivity.includes(false) && !dataSpecialty.includes(false) && !dataLocation.includes(false)) return item
  }

  const signupClient = async (e) => {
    e.preventDefault()
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(signup.email)) return setError('email address is not valid')
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/signup-client`, signup)
      setLoading(false)
      clientSignUp('RESET')
      setError('')
      setMessage(responseSignup.data)
    } catch (error) {
      setLoading(false)
      setError('')
      console.log(error)
      console.log(error.response)
      if(error.response.data.error) return error.response.data.error.msg ? setError(error.response.data.error.msg) : setError('Error submitting form')
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }

  const loginClient = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/login-client`, signup)
      setLoading(false)
      setSignupModal(false)
      setLoginModal(false)
      clientSignUp('RESET')
      setError('')
      setMessage(responseSignup.data)
      window.location.href = '/account'
    } catch (error) {
      setLoading(false)
      setError('')
      console.log(error)
      console.log(error.response)
      if(error.response.data.error) return error.response.data.error.msg ? setError(error.response.data.error.msg) : setError('Error submitting form')
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    setLoading(true)
    socket.emit('client-message-expert', {name: userClient.username, message: messageExpert, clientName: userClient.username,expertName: expertName, expertPhoto: expertPhoto, expertID: messageID, expertEmail: expertEmail, clientID: userClient.id, sender: 'client', readClient: true}, (messages) => {
      setMessageExpert('')
      setLoading(false)
      setMessage(`Message sent to ${expertName}`)
    })
    // setLoading(true)
    // try {
    //   const responseMessage = await axios.post(`${API}/message/expert`, {name: userClient.username, message: messageExpert, expertName: expertName, expertPhoto: expertPhoto, expertID: messageID, expertEmail: expertEmail, clientID: userClient.id})
    //   setMessageExpert('')
    //   setLoading(false)
    //   setMessage(responseMessage.data)
    // } catch (error) {
    //   console.log(error)
    //   setLoading(false)
    //   if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    // }
  }

  const openLoginModal = () => {
    setLoginModal(true)
  }
  
  return (
    <>
    <Nav changeStyle='primary-background' userClient={userClient} notifications={notifications} openLoginModal={openLoginModal}></Nav>
    <div className="talents">
      <NotificationContainer/>
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
        {/* <div className="talents-menu-container">
          <div className="talents-menu-title">Location</div>
          <div className="talents-menu-list">
            {locations && locations.map((item, idx) => {
              return talentsFiltered.location.includes(item.toLowerCase().trim()) ? 
              <div key={idx} className="talents-menu-list-item talents-selected"  onClick={(e) => filterTalents('TALENTS_REMOVE', 'location', item.toLowerCase().trim())}><span>{item}</span> <SVGs svg={'checkmark'}></SVGs></div>
              :
              <div key={idx} className="talents-menu-list-item" onClick={(e) => filterTalents('TALENTS', 'location', item.toLowerCase().trim())}><span>{item}</span></div>
            })}
          </div>
        </div> */}
        <div className="talents-menu-container">
          <div className="talents-menu-title">Location</div>
          <PlacesAutocomplete value={search} onChange={(e) => setSearch(e)} onSelect={(e) => (filterTalents('TALENTS', 'location', e), setSearch(e))} searchOptions={searchOptionsCities}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single-dropdown-autocomplete form-group-single-dropdown-autocomplete-talents">
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
        </div>
      </div>
      <div className="talents-collection">
          {talents && talents.filter((item) => handleFilter(item)).map((item, idx) => (
            item.description && item.activity.length > 0 
              ?
              <div key={idx} className="talents-collection-box">
                <div className="talents-collection-box-left">
                  {item.photo_talent.length > 0 ? <img src={item.photo_talent[0].location} alt="" /> : <img src="https://dummyimage.com/600x400/000/ffffff.png&text=No+image+added" alt="" />}
                </div>
                <div className="talents-collection-box-right">
                  <div className="talents-collection-box-right-section">
                    <div className="talents-collection-box-right-section-title">About Me</div>
                    <div className="talents-collection-box-right-section-info">{item.description}</div>
                  </div>
                  <div className="talents-collection-box-right-section">
                    <div className="talents-collection-box-right-section-title">Activity</div>
                    <div className="talents-collection-box-right-section-info">{item.activity.length > 0 && item.activity.slice(0, 4).map((item, idx, array) => 
                      <span key={idx} className="talents-collection-box-right-section-info-item">{item}{idx < array.length - 1 ? ', ' : ''}</span>
                    )}</div>
                  </div>
                  <div className="talents-collection-box-right-section">
                    <div className="talents-collection-box-right-section-title">Specialty</div>
                    <div className="talents-collection-box-right-section-info">{item.specialty.length > 0 && item.specialty.slice(0, 4).map((item, idx, array) => 
                      <span key={idx} className="talents-collection-box-right-section-info-item">{item}{idx < array.length - 1 ? ', ' : ''}</span>
                    )}</div>
                  </div>
                  <div className="talents-collection-box-right-section">
                    <div className="talents-collection-box-right-section-title">Location</div>
                    <div className="talents-collection-box-right-section-info">{item.location.length > 0 && item.location.slice(0, 4).map((el, idx, array) => 
                      <span key={idx} className="talents-collection-box-right-section-info-item">{el.split(',')[0]}{idx < array.length - 1 ? ', ' : ''}</span>
                    )}</div>
                  </div>
                  <div onClick={() => userClient ? (setMessageModal(true), setMessageID(item._id), setExpertName(item.username), setExpertPhoto(item.photo[0].location), setExpertEmail(item.email)) : setLoginModal(true)}><SVGs svg={'message'} classprop={'talents-collection-box-right-message'}></SVGs></div>
                  <div className="talents-collection-box-right-expert">
                    {item.photo[0] ? <img src={item.photo[0].location} alt=""/> : <SVGs svg={'account-circle'} ></SVGs>}
                    <span>{item.username}</span>
                  </div>
                </div>
              </div>
            :
            null 
          ))
          }
      </div>
      {signupModal && <div className="login-modal">
        <div className="login-modal-box">
          <div className="login-modal-box-header">
            <span>Sign up</span>
            <div onClick={() => (setSignupModal(false), clientSignUp('RESET'), setError(''), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="login-modal-form" onSubmit={(e) => signupClient(e)}>
            <div className="form-group-single">
              <label htmlFor="username" >Username</label>
              <div className="form-group-single-input">
                <textarea id="username" rows="1" name="username" placeholder="(Username)" value={signup.username} onChange={(e) => (clientSignUp('SIGNUP_CLIENT', 'username', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="email" >Email</label>
              <div className="form-group-single-input">
                <textarea id="email" rows="1" name="email" placeholder="(Email)" value={signup.email} onChange={(e) => clientSignUp('SIGNUP_CLIENT', 'email', e.target.value, setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="password" >Password</label>
              <div className="form-group-single-input">
                <textarea id="password" rows="1" name="password" placeholder="(Password)" value={signup.password} onChange={(e) => clientSignUp('SIGNUP_CLIENT', 'password', e.target.value, setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="confirm_password" >Confirm Password</label>
              <div className="form-group-single-input">
                <textarea id="confirm_password" rows="1" name="confirm_password" placeholder="(Confirm Password)" value={signup.confirm_password} onChange={(e) => (clientSignUp('SIGNUP_CLIENT', 'confirm_password', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Confirm Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single button">
              <button type="submit">{!loading && <span>Sign up</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
            {message ? <div className="form-message">{message}</div> : error ? <div className="form-error-message">{error}</div> : <div className="form-error-message"></div>}
            <div className="form-redirect">Already have an account <a onClick={() => (setSignupModal(false), setLoginModal(true))}>Login</a></div>
          </form>
        </div>
      </div>
      }
      {loginModal && <div className="login-modal">
        <div className="login-modal-box">
          <div className="login-modal-box-header">
            <span>Login</span>
            <div onClick={() => (setLoginModal(false), clientSignUp('RESET'), setError(''), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="login-modal-form" onSubmit={(e) => loginClient(e)}>
            <div className="form-group-single">
              <label htmlFor="username" >Username or Email</label>
              <div className="form-group-single-input">
                <textarea id="username" rows="1" name="username" placeholder="(Username)" value={signup.username} onChange={(e) => (clientSignUp('SIGNUP_CLIENT', 'username', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="password" >Password</label>
              <div className="form-group-single-input">
                <textarea id="password" rows="1" name="password" placeholder="(Password)" value={signup.password} onChange={(e) => clientSignUp('SIGNUP_CLIENT', 'password', e.target.value, setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single button">
              <button type="submit">{!loading && <span>Login</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
            {message ? <div className="form-message">{message}</div> : error ? <div className="form-error-message">{error}</div> : <div className="form-error-message"></div>}
            <div className="form-redirect">Don't have an account <a onClick={() => (setLoginModal(false), setSignupModal(true))}>Sign up</a></div>
          </form>
        </div>
      </div>
      }
      {messageModal && 
        <div className="message-modal">
          <div className="message-modal-box">
            <div className="message-modal-box-header">
              <span>Message {expertName} </span>
              <div onClick={() => (setMessageModal(false), setError(''), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
            </div>
            <form className="login-modal-form" onSubmit={(e) => sendMessage(e)}>
              <div className="form-group-single">
                <label htmlFor="message" >Have some questions? Message expert.</label>
                <div className="form-group-single-input">
                  <textarea id="message" rows="8" name="message" placeholder="(Message)" value={messageExpert} onChange={(e) => (setMessageExpert(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Message)'} wrap="hard" required></textarea>
                </div>
              </div>
              <div className="form-group-single button">
                <button type="submit">{!loading && <span>Send Message</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
              </div>
              {message ? <div className="form-message">{message}</div> : error ? <div className="form-error-message">{error}</div> : <div className="form-error-message"></div>}
            </form>
          </div>
        </div>
      }
    </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    talentsFiltered: state.talents,
    signup: state.client
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterTalents: (type, name, value) => dispatch({type: type, name: name, value: value}),
    clientSignUp: (type, name, value) => dispatch({type: type, name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTalents(Talents))
