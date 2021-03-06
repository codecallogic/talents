import Header from '../components/nav/header'
import {API} from '../config'
import axios from 'axios'
import {useState, useEffect} from 'react'
import withUsers from './withUsers'
import {connect} from 'react-redux'
import SVGs from '../files/SVGs'


const Home = ({userExpert, clients, notifications, signup, clientSignUp}) => {

  const [loginModal, setLoginModal] = useState(false)
  const [signupModal, setSignupModal] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(signupModal == true) signup.password !== signup.confirm_password ? setError(`passwords don't match`) : null
  }, [signup.confirm_password, signup.password])

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
      window.location.href = 'account'
    } catch (error) {
      setLoading(false)
      setError('')
      console.log(error)
      // console.log(error.response)
      if(error.response.data.error) return error.response.data.error.msg ? setError(error.response.data.error.msg) : setError('Error submitting form')
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }

  return (
    <div>
      <Header userExpert={userExpert} clients={clients} preloadNotifications={notifications} openLoginModal={() => setLoginModal(!loginModal)}></Header>
      <div className="home">
        <div className="home-card-container">
          <div className="home-card-item">
            <img src="https://patch.com/img/cdn20/users/22872998/20200205/113840/styles/patch_image/public/bartender___05233528487.png" alt="" />
            <div className="home-card-item-title">Hire the best talent for your events</div>
            <div className="home-card-item-description">Take your events to the next level! Birthdays, large receptions, team building, tastings, name it, a talent is here for you.</div>
          </div>
          <div className="home-card-item">
            <img src="https://www.insurancejournal.com/app/uploads/2021/03/waiter-scaled.jpg" alt="" />
            <div className="home-card-item-title">Increase you profits</div>
            <div className="home-card-item-description">Beverage is crucial for a successful business, get support from a professional for your beverage program, staff training and special events.</div>
          </div>
          <div className="home-card-item">
            <img src="https://beyondcurated.com/wp-content/uploads/2019/07/The-Art-Of-The-Sommelier.jpg" alt="" />
            <div className="home-card-item-title">Private wine cellar and Bar consulting</div>
            <div className="home-card-item-description">Get advice from the best sommelier and mixologist to build your high-end cellar and Bar for investments and pleasure.</div>
          </div>
        </div>
      </div>
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
    </div>
  )
}

const mapStateToProps = state => {
  return {
    signup: state.client
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clientSignUp: (type, name, value) => dispatch({type: type, name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUsers(Home))

