import React from 'react';

const tabs=['Daily Expense Recorder','Consolidated View']
export default class Header extends React.Component{
    render(){
        return(
            <div className="header-container">
                <div className="header-subcontainer">
                    <div className="title">
                        Pouch Of Solomon
                    </div>
                    <div className="header-tabs">
                        {tabs.map((tab,ind)=>{
                            return(
                                <div className="header-tab" key={'HeaderTab'+ind}>
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