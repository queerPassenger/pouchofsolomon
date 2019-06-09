import React from 'react';
import { connect } from 'react-redux';
import Header from './Header.js';
import Content from './Content.js';
import Footer from './Footer.js';
import loadingImgPath from '../images/loading1.gif';
import { apiCall } from '../utilities/apiCall';
const tabs = ['Entry', 'View'];

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelected: tabs[0],
            toEditSet:[],
        };
        this.onTabClick = this.onTabClick.bind(this);
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
    edit(toEditSet){
        this.setState({
            tabSelected: 'Entry',
            toEditSet
        })
    }    
    uiBuild(){
        return(
            <>
               <div className="wrapper">
                    <Header 
                        tabSelected={this.state.tabSelected} 
                        userProfile={this.props.userProfile} 
                        tabs={tabs} onTabClick={this.onTabClick}
                    />
                    <Content 
                        tabSelected={this.state.tabSelected} 
                        toEditSet={this.state.toEditSet} 
                        edit={this.edit.bind(this)} 
                        onTabClick={this.onTabClick} 
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
    render() {
       return this.uiBuild();
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
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);