import { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../config'
import axios from 'axios'
import withoutExpert from './withoutExpert'

const SignupExpert = ({signup, setSignup}) => {

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    signup.password !== signup.confirm_password ? setError(`passwords don't match`) : null
  }, [signup.confirm_password, signup.password])

  const handleSignup = async (e) => {
    e.preventDefault()
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(signup.email)) return setError('email address is not valid')
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/signup-expert`, signup)
      setLoading(false)
      setError('')
      setMessage(responseSignup.data)
    } catch (error) {
      setLoading(false)
      setError('')
      // console.log(error.response)
      if(error.response.data.error) return error.response.data.error.msg ? setError(error.response.data.error.msg) : setError('Error submitting form')
      if(error) return error.response ? setError(error.response.data) : setError('Error submitting form')
    }
  }
  
  return (
    <div className="signupHost">
      <div className="signupHost-container">
        <div className="signupHost-leftColumn">
          <a href="/" className="signupHost-leftColumn-logo">FindBacchus</a>
          <div className="signupHost-leftColumn-title">
          Talents create and elevate any experiences.
          </div>  
        </div>
        <div className="signupHost-rightColumn">
          <div className="signupHost-rightColumn-title">Become an talent</div>
          <form className="form" onSubmit={handleSignup}>
            <div className="form-group-single">
              <label htmlFor="Username" >Username</label>
              <div className="form-group-single-input">
                <textarea id="username" rows="1" name="username" placeholder="(Username)" value={signup.username} onChange={(e) => (setSignup('username', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="Email">Email</label>
              <div className="form-group-single-input">
                <textarea id="email" rows="1" name="email" placeholder="(Email)" value={signup.email} onChange={(e) => (setSignup('email', e.target.value), setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="Password">Password</label>
              <div className="form-group-single-input">
                <textarea id="password" rows="1" name="password" placeholder="(Password)" value={signup.password} onChange={(e) => (setSignup('password', e.target.value), setError(''))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="Confirm Password">Confirm Password</label>
              <div className="form-group-single-input">
                <textarea id="confirm_password" rows="1" name="confirm_password" placeholder="(Confirm Password)" value={signup.confirm_password} onChange={(e) => (setSignup('confirm_password', e.target.value), setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Confirm Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single">
              <button type="submit">{!loading && <span>Submit</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
            {message ? <div className="form-message">{message}</div> : error ? <div className="form-error-message">{error}</div> : <div className="form-error-message"></div>}
            <div className="form-redirect">Already have an account <a href="/expert-login">Login</a></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withoutExpert(SignupExpert))
