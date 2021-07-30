import { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../config'
import axios from 'axios'

const SignupHost = ({signup, setSignup}) => {

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    signup.password !== signup.confirm_password ? setError(`passwords don't match`) : setError('')
  }, [signup.confirm_password, signup.password])

  const handleSignup = async (e) => {
    e.preventDefault()
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(signup.email)) return setError('email address is not valid')
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/signup-host`, signup)
      setLoading(false)
      console.log(responseSignup)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  
  return (
    <div className="signupHost">
      <a href="/" className="signupHost-logo">Talent</a>
      <div className="signupHost-container">
        <div className="signupHost-leftColumn">
          <div className="signupHost-leftColumn-title">
          Experts have the talent that makes, Talent
          </div>
        </div>
        <div className="signupHost-rightColumn">
          <div className="signupHost-rightColumn-title">Become an expert</div>
          <form className="form" onSubmit={handleSignup}>
            <div className="form-group-triple">
              <label htmlFor="Username" >Username</label>
              <div className="form-group-triple-input">
                <textarea id="username" rows="1" name="username" placeholder="(Username)" value={signup.username} onChange={(e) => (setSignup('username', e.target.value, setError('')))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-triple">
              <label htmlFor="Email">Email</label>
              <div className="form-group-triple-input">
                <textarea id="email" rows="1" name="emaim" placeholder="(Email)" value={signup.email} onChange={(e) => (setSignup('email', e.target.value), setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-triple">
              <label htmlFor="Password">Password</label>
              <div className="form-group-triple-input">
                <textarea id="password" rows="1" name="password" placeholder="(Password)" value={signup.password} onChange={(e) => (setSignup('password', e.target.value), setError(''))}  onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-triple">
              <label htmlFor="Confirm Password">Confirm Password</label>
              <div className="form-group-triple-input">
                <textarea id="confirm_password" rows="1" name="confirm_password" placeholder="(Confirm Password)" value={signup.confirm_password} onChange={(e) => (setSignup('confirm_password', e.target.value), setError(''))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Confirm Password)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-triple">
              <button type="submit">{!loading && <span>Submit</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
            {error && <div className="form-error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    signup: state.hostingAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSignup: (name, value) => dispatch({type: 'SIGNUP_HOST', name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupHost)
