import React from 'react';
import settings from '../images/settings.png';
import {settingOptions} from './constants';

export default class Header extends React.Component {
    constructor(props){
        super(props);
        this.state={
            _: true,  
            _setting:false,  
        }
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
    navigateToAccount(){
        this.props.history.push('account');
    }
    handleSettings(){
        this.setState({
            _setting:!this.state._setting,
        })
    }
    uiBuild() {
        return (
            <div className="header-container">
                <div className="header-top-container">
                    <div className="title">
                        Pouch Of Solomon
                    </div>
                    <div className="settings" title="Settings" onClick={this.handleSettings.bind(this)}>
                        <img src={settings}></img>
                    </div>
                    <div className="user-profile" title={this.props.userProfile.name} >
                        <img className="profile-pic" src={this.props.userProfile.photo} ></img>
                    </div>
                    {this.state._setting?
                        <div className="settings-container" onClick={this.handleSettings.bind(this)}>
                            {settingOptions.map((setting,ind)=>{
                                return(
                                    <div className="setting-item" key={"setting-item"+ind} onClick={this[setting.onClickHandler].bind(this)}>
                                        {setting.label}
                                    </div>
                                )
                            })}
                        </div>
                    :
                        null
                    }
                </div>
                {this.props.tabsFlag?
                    <div className="header-bottom-container">
                        {this.props.tabs.map((tab, ind) => {
                            return (
                                <div className={("header-tab ") + (this.props.tabSelected === tab ? "selected" : "")} key={'HeaderTab' + ind} onClick={() => { this.props.onTabClick(tab) }}>
                                    {tab}
                                </div>
                            )
                        })}
                    </div>
                :
                    null
                }
            </div>
        )
    }
    render() {
       return this.uiBuild();
    }
}