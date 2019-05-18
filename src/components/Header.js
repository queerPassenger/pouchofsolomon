import React from 'react';
import walking from '../images/walking.gif';
import logout from '../images/logout.png';

export default class Header extends React.Component{
    state={
        _:true
        
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                _:false
            })
        },5000)
    }
    logout(){
        window.location.href="/logout";
    }
    render(){
        return(
            <div className="header-container">
                <div className="header-subcontainer">
                    <div className="title">
                        Pouch Of Solomon
                    </div>
                    <div className="header-tabs">
                        {this.props.tabs.map((tab,ind)=>{
                            return(
                                <div className={("header-tab ")+(this.props.tabSelected===tab?"selected":"")} key={'HeaderTab'+ind} onClick={()=>{this.props.onTabClick(tab)}}>
                                    {tab}
                                </div>
                            )
                        })}
                    </div>
                    <div className="user-profile">
                        {this.state._?
                            <img src={walking} width="130"></img>
                        :
                            <div>
                                <img className="profile-pic" src={this.props.userProfile.photo} ></img>
                                {/*this.props.userProfile.name*/}
                            </div>
                        }
                    </div>
                    <div className="logout">
                        <div>
                            <img src={logout} onClick={this.logout}width="20" ></img>
                          
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}