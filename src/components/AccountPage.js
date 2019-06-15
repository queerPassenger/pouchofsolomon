import React, {Component} from 'react';
import {accountInfo} from './constants';

export default class AccountPage extends Component{
    constructor(props){
        super(props);
        this.state={
            accountInfo
        }
    }
    componentDidMount(){
        this.props.onTabShow(false);
    }
    handleChange(ind,e){
        let {accountInfo}=this.state;
        accountInfo[ind].value=e.target.value;
        this.setState({
            accountInfo
        })
    }
    render(){
        return(
            <div className="accountPage-container">
                <div className="label">
                    My Account
                </div>
                <div className="profile-pic">
                    <img className="profile-pic" src={this.props.userProfile.photo} ></img>
                </div>
                <div className="field-container">
                    {this.state.accountInfo.map((field,fieldInd)=>{
                        return(
                            <div className="field-item" key={"fieldItem"+fieldInd}>
                                {field.type==='input'?
                                    <input type="text" placeholder={field.placeholder} value={field.value} onChange={this.handleChange.bind(this,fieldInd)}></input>
                                :
                                    <select onChange={this.handleChange.bind(this,fieldInd)}>
                                        {field.options.map((option,optionInd)=>{
                                            return(
                                                <option key={"fieldItem"+fieldInd+'option'+optionInd} value={option}>{option}</option>
                                            )
                                        })}
                                    </select>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}