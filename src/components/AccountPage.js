import React, { Component } from 'react';
import {connect} from 'react-redux';
import { accountInfo } from './constants';
import {apiCall} from '../utilities/apiCall';
import {getPopUpObj} from './constants';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountInfo
        };
        this.updateAccountInfo = this.updateAccountInfo.bind(this);
    }
    componentDidMount() {
        this.props.onTabShow(false);
        this.getAccountInfo();
    }
    handleChange(ind, e) {
        let { accountInfo } = this.state;
        accountInfo[ind].value = e.target.value;
        this.setState({
            accountInfo
        })
    }
    getAccountInfo(){
        let data={
            apiPath:'/getAccountInfo',
            type:'GET',
            query:null,
        }
        this.props.updateLoading(null,'enableLoading');
        apiCall(data)
        .then(res=>{
            this.props.updateLoading(null,'disableLoading');
           if(res.status){
               let {accountInfo}=this.state;
               accountInfo.map(info=>{
                   res.data.map(infoData=>{
                       if(info.key===infoData.key){
                           info.value=infoData.value;
                       }
                   })
               });
               this.setState({
                   accountInfo
               })
           }
        })
        .catch(err=>{
            this.props.updateLoading(null,'disableLoading');
            console.log('err',err)}
        ); 
    }
    updateAccountInfo() {
        let { accountInfo } = this.state;
        let payload=[];
        let count=0;
        accountInfo.map(info=>{
            if(info.value==='')
                count++;
            payload.push({
                'key':info.key,
                'value':info.value
            });
        })
        if(count===accountInfo.length){            
            let popUpObj=getPopUpObj('warning/error',{text:['There is nothing to update','Please do some changes.'],onClickHandler:()=>this.props.updatePopUp(null,'disablePopUp')});
            this.props.updatePopUp(popUpObj,'enablePopUp');
            return;
        }
        else{
            this.props.updateLoading(null,'enableLoading');
            let data={
                apiPath:'/saveAccountInfo',
                type:'POST',
                query:null,
                payload
            }
            apiCall(data)
            .then(res=>{
                this.props.updateLoading(null,'disableLoading');
                let popUpObj
                if(res.status){                    
                    popUpObj=getPopUpObj('success',{text:['Sucessfully Saved'],onClickHandler:()=>this.props.updatePopUp(null,'disablePopUp')});
                }
                else{
                    popUpObj=getPopUpObj('warning/error',{text:['Something went wrong','Please try after some time'],onClickHandler:()=>this.props.updatePopUp(null,'disablePopUp')});
                }   
                this.props.updatePopUp(popUpObj,'enablePopUp');                              
            })
            .catch(err=>{
                let popUpObj=getPopUpObj('warning/error',{text:['Something went wrong','Please try after some time'],onClickHandler:()=>this.props.updatePopUp(null,'disablePopUp')});    
                this.props.updatePopUp(popUpObj,'enablePopUp'); 
                console.log('err',err)
            });
        }
            
    }
    render() {
        return (
            <div className="accountPage-container">
                <div className="label">
                    My Account
                </div>
                <div className="profile-pic">
                    <img className="profile-pic" src={this.props.userProfile.photo} ></img>
                </div>
                <div className="field-container">
                    {this.state.accountInfo.map((field, fieldInd) => {
                        return (
                            <div className="field-item" key={"fieldItem" + fieldInd}>
                                <div className="field-label">
                                    {field.label}
                                </div>
                                {field.type === 'input' ?
                                    <input type="text" placeholder={field.placeholder} value={field.value} onChange={this.handleChange.bind(this, fieldInd)}></input>
                                    :
                                    <select value={field.value} onChange={this.handleChange.bind(this, fieldInd)}>
                                        <option value='' disabled selected>{field.placeholder}</option>
                                        {field.options.map((option, optionInd) => {
                                            return (
                                                <option key={"fieldItem" + fieldInd + 'option' + optionInd} value={option}>{option}</option>
                                            )
                                        })}
                                    </select>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="action-container">
                    <div className="action-item">
                        <button onClick={this.updateAccountInfo}>Update</button>
                    </div>
                    <div className="action-item">
                        <button onClick={() => { this.props.history.push('/') }}>Go Back</button>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
      updateLoading : (val,type) => dispatch({
      val,
      type
    }),
     updatePopUp :(val,type) => dispatch({
         val,type
     })
    }
  }
  export default connect(null,mapDispatchToProps)(AccountPage);