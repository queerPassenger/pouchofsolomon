import React from 'react';
import logout from '../images/logout.png';
export default class Header extends React.Component {
    state = {
        _: true

    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                _: false
            })
        }, 5000)
    }
    logout() {
        window.location.href = "/logout";
    }
    uiBuild() {
        return (
            <div className="header-container">
                <div className="header-top-container">
                    <div className="title">
                        Pouch Of Solomon
                    </div>
                    <div className="logout" title="Logout">
                        <img src={logout} onClick={this.logout}></img>
                    </div>
                    <div className="user-profile" title={this.props.userProfile.name}>
                        <img className="profile-pic" src={this.props.userProfile.photo} ></img>
                    </div>
                </div>
                <div className="header-bottom-container">
                    {this.props.tabs.map((tab, ind) => {
                        return (
                            <div className={("header-tab ") + (this.props.tabSelected === tab ? "selected" : "")} key={'HeaderTab' + ind} onClick={() => { this.props.onTabClick(tab) }}>
                                {tab}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    render() {
       return this.uiBuild();
    }
}