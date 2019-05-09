import React from 'react';
import Header from './Header.js';
import Content from './Content.js';
import Footer from './Footer.js';

const tabs=['Entry','View'];

export default class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tabSelected:tabs[0]
        };
        this.onTabClick=this.onTabClick.bind(this);
    }
    onTabClick(tab){
        this.setState({
            tabSelected:tab
        })
    }
    render(){
        return(
            <>
                <div className="wrapper">
                    <Header tabSelected={this.state.tabSelected} tabs={tabs} onTabClick={this.onTabClick}/>
                    <Content tabSelected={this.state.tabSelected} />
                    <Footer />
                </div>
            </>
        )
    }
}
