import React,{Component} from 'react';
import {connect} from 'react-redux';
import { createHashHistory } from 'history';
import Routes from './Routes';
import {tabs} from './constants';
import { apiCall } from '../utilities/apiCall';
import Header from './Header.js';
import Footer from './Footer.js';
import loadingImgPath from '../images/loading1.gif';

const hist = createHashHistory();
class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabsFlag:true,
            tabSelected: tabs[0],
            toEditSet:[],
        };
        this.onTabClick = this.onTabClick.bind(this);
        this.onTabShow = this.onTabShow.bind(this);
    }
    componentDidMount() {
        this.getUserInfo();
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
            toEditSet:[],
        })
    }    
    onTabShow(flag){
        this.setState({
            tabsFlag:flag,
            tabSelected: tabs[0],
            toEditSet:[],
        })
    }
    edit(toEditSet){
        this.setState({
            tabSelected: 'Entry',
            toEditSet
        })
    }    
    render(){
        return(
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
                        onTabClick={this.onTabClick}
                        onTabShow={this.onTabShow}
                        history={hist}
                    />
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

const mapStateToProps = function (store) {
    return {
        loading: store.loading,
        userProfile:store.userProfile
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateloading: (val, type) => dispatch({
            val,
            type
        }),
        updateUserProfile :(val, type) => dispatch({
            val,
            type
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);