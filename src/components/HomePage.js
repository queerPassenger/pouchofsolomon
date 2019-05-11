import React from 'react';
import {connect} from 'react-redux';
import Header from './Header.js';
import Content from './Content.js';
import Footer from './Footer.js';
import loadingImgPath from '../images/loading1.gif';
const tabs=['Entry','View'];

class HomePage extends React.Component{
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
                {this.props.loading?
                    <>
                        <div className="loader-wrapper">                    
                            <img src={loadingImgPath}></img>  
                        </div>
                        <div className="overlay"></div>
                    </>
                :
                    null
                }
            </>
        )
    }
}
const mapStateToProps = function(store) {
    return {
      loading:store.loading
  };
};
export default connect(mapStateToProps,null)(HomePage);