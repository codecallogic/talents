import { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../config'
import withoutExpert from './withoutExpert'
import axios from 'axios'
axios.defaults.withCredentials = true

const LoginExpert = ({signup, setSignup}) => {

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if(!re.test(signup.email)) return setError('email address is not valid')
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/login-expert`, signup)
      setLoading(false)
      window.location.href = '/experts'
    } catch (error) {
      setLoading(false)
      // console.log(error.response)
      if(error.response.data.error) return error.response.data.error.msg ? setError(error.response.data.error.msg) : setError('Error submitting form')
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }
  
  return (
    <div className="signupHost">
      <div className="signupHost-container">
        <div className="signupHost-leftColumn">
          <a href="/" className="signupHost-leftColumn-logo">Talent</a>
          <div className="signupHost-leftColumn-title">
          Experts have the talent that makes, Talent
          </div>
        </div>
        <div className="signupHost-rightColumn">
          <div className="signupHost-rightColumn-title">Become an expert</div>
          <form className="form" onSubmit={handleSignup}>
            <div className="form-group-single">
              <label htmlFor="Username" >Username or Email</label>
              <div className="form-group-single-input">
                <textarea id="username" rows="1" name="username" placeholder="(Username)" value={signup.username} onChange={(e) => (setSignup('username', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="Password">Password</label>
              <div className="form-group-single-input">
                <textarea id="password" rows="1" name="password" placeholder="(Password)" value={signup.password} onChange={(e) => (setSignup('password', e.target.value), setError(''))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <button type="submit">{!loading && <span>Login</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
            {message ? <div className="form-message">{message}</div> : error ? <div className="form-error-message">{error}</div> : <div className="form-error-message"></div>}
            <div className="form-redirect">Don't have an account <a href="/expert">Sign Up</a></div>
          </form>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    signup: state.expertAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSignup: (name, value) => dispatch({type: 'SIGNUP_EXPERT', name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withoutExpert(LoginExpert))
