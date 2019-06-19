import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createHashHistory } from 'history';
import Routes from './Routes';
import { tabs } from './constants';
import { apiCall } from '../utilities/apiCall';
import Header from './Header.js';
import Footer from './Footer.js';
import loadingImgPath from '../images/loading1.gif';

const hist = createHashHistory();

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsFlag: true,
            tabSelected: tabs[0],
            toEditSet: [],
        };
        this.screenParameters={
            width:0,
            height:0
        }
        this.onTabClick = this.onTabClick.bind(this);
        this.onTabShow = this.onTabShow.bind(this);
        this.edit = this.edit.bind(this);
    }
    componentDidMount() {
        this.getUserInfo();
        this.screenParameters={
            width:window.screen.width,
            height:window.screen.height
        };
    }
    getUserInfo() {
        let data = {
            apiPath: '/getUserInfo',
            type: 'GET',
            query: null
        }
        this.props.updateloading(null, 'enableLoading');
        apiCall(data)
            .then(res => {
                this.props.updateloading(null, 'disableLoading');
                if (res.status) {
                    this.props.updateUserProfile(res.data, 'updateUserProfile')
                }
            })
            .catch(err => {
                this.props.updateloading(null, 'disableLoading');
                console.log('err', err)
            });
    }
    onTabClick(tab) {
        this.setState({
            tabSelected: tab,
            toEditSet: []
        })
    }
    onTabShow(flag) {
        this.setState({
            tabsFlag: flag,
            tabSelected: tabs[0],
            toEditSet: [],
        })
    }
    edit(toEditSet) {
        this.setState({
            tabSelected: 'Entry',
            toEditSet
        })
    }
    render() {
        let popUpStyle={
            width:'300px',
            left:(this.screenParameters.width-300)/2,
            top:'300px'
        }
        return (
            <>
                <div className="wrapper">
                    <Header
                        tabSelected={this.state.tabSelected}
                        userProfile={this.props.userProfile}
                        tabs={tabs}
                        tabsFlag={this.state.tabsFlag}
                        onTabClick={this.onTabClick}
                        history={hist}
                    />
                    <Routes
                        tabSelected={this.state.tabSelected}
                        toEditSet={this.state.toEditSet}
                        userProfile={this.props.userProfile}
                        tabs={tabs}
                        edit={this.edit}
                        onTabClick={this.onTabClick}
                        onTabShow={this.onTabShow}
                        history={hist}
                    />
                    <Footer />
                </div>
                {this.props.loading ?
                    <>
                        <div className="loader-wrapper">
                            <img src={loadingImgPath}></img>
                        </div>
                        <div className="overlay"></div>
                    </>
                    :
                    null
                }
                {this.props.popUp.show ?
                    <>
                        <div className="popUp-wrapper" style={popUpStyle}>
                            <div className="popUp-header-wrapper">
                                <div className="popUp-header-text-wrapper">
                                    {this.props.popUp.header.text.map(text => {
                                        return (
                                            <div className="popUp-header-text">
                                                {text}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="popUp-close" onClick={()=>{this.props.updatePopUp(null,'disablePopUp')}}>
                                    <span>x</span>
                                </div>
                            </div>
                            <div className="popUp-body-wrapper">
                                <div className="popUp-body-text-wrapper">
                                    {this.props.popUp.body.text.map(text => {
                                        return (
                                            <div className="popUp-body-text">
                                                {text}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="popUp-footer-wrapper">
                                <div className="popUp-footer-text-wrapper">
                                    {this.props.popUp.footer.text.map(text => {
                                        return (
                                            <div className="popUp-footer-text">
                                                {text}
                                            </div>
                                        )
                                    })}
                                </div>  
                                <div className="popUp-footer-button-wrapper">
                                    {this.props.popUp.footer.button.name.map((obj,ind) => {
                                        return (
                                           <button onClick={this.props.popUp.footer.button.onClickHandlers[ind]}>{obj}</button>
                                        )
                                    })}
                                </div>    
                            </div>
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

const mapStateToProps = function (store) {
    return {
        loading: store.loading,
        userProfile: store.userProfile,
        popUp: store.popUp
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateloading: (val, type) => dispatch({
            val,
            type
        }),
        updateUserProfile: (val, type) => dispatch({
            val,
            type
        }),
        updatePopUp: (val, type) => dispatch({
            val,
            type
        }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);