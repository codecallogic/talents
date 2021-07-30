import SVGs from '../../files/SVGs'
import {connect} from 'react-redux'
import Link from 'next/link'

const ExpertAccount = ({dash, changeView}) => {
  
  return (
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
            <div className="experts-profile-left-image">
              <SVGs svg={'account-circle'}></SVGs>
              <a>Update photo</a>
            </div>
          </div>
          <div className="experts-profile-right">
            <div className="experts-profile-right-title">Hi, I'm Fabricio</div>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  return {
    dash: state.hostingDash
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeView: (view) => dispatch({type: 'DASH', value: view})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpertAccount)
