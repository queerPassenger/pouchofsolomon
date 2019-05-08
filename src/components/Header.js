import React from 'react';


export default class Header extends React.Component{
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
                </div>
            </div>
        )
    }
}