import React from 'react';
import {apiCall} from '../../utilities/apiCall';
import {schemaGenerator} from '../../utilities/schema';


export default class Record extends React.Component{
    constructor(props){
        super(props);
        this.state={
            entryList:[schemaGenerator('uiSchema','transaction')] 

        };  
        this.transactionClassificationSet=[];
        this.transactionTypeSet=[];
        this.amountTypeSet=[];
    }
    componentDidMount(){
        this.getTransactionList();
        this.getamountTypeSet();
    }
    getTransactionList(){
        let data={
            apiPath:'/getTransactionTypeList',
            type:'GET',
            query:null
        }
        apiCall(data)
        .then(res=>{
            this.transactionClassificationSet=[];
            this.transactionTypeSet=[];
            let entryList=this.state.entryList;
            let flag=true;
            res.data.map(transaction=>{
                if(this.transactionClassificationSet.indexOf(transaction.transactionClassification)===-1){
                    this.transactionClassificationSet.push(transaction.transactionClassification);
                    if(flag){
                        entryList[0]['transactionClassification']=transaction.transactionClassification;
                        entryList[0]['transactionTypeId']=transaction.transactionTypeId;
                        flag=false;
                    }
                }
                this.transactionTypeSet.push(transaction);
            });          
            this.setState({
                entryList
            });
        })
        .catch(err=>{console.log('err',err)});
    }
    getamountTypeSet(){
        let data={
            apiPath:'/getAmountTypeList',
            type:'GET',
            query:null
        }
        apiCall(data)
        .then(res=>{
            this.amountTypeSet=[];
            let entryList=this.state.entryList;
            res.data.map((amount)=>{
                this.amountTypeSet.push(amount);
            })
            entryList[0]['amountTypeId']=49;
            this.setState({
                entryList
            });
        })
        .catch(err=>{console.log('err',err)});
    }
    handleChange(key,ind,e){
        if(key!=='amount' && key!=='comment'){
            if(e.target.value===''){
                return;
            }
        }
        
        let entryList=this.state.entryList;
        entryList[ind][key]=e.target.value;
        if(key==='transactionClassification'){
            entryList[ind]['transactionTypeId']='';
        }
        this.setState({
            entryList
        });
    }
    render(){
        try{
            return(
                <div className="record-container">
                    {this.state.entryList.map((entry,ind)=>{
                        let filteredTransactionTypeSet=this.transactionTypeSet.filter(x=>{if(x.transactionClassification===entry['transactionClassification']){return x}});
                        return(
                            <div className="record" key={"entry"+ind}>
                                <div className="record-item">
                                    <select value={entry['transactionClassification']} onChange={this.handleChange.bind(this,'transactionClassification',ind)}>
                                        <option value="">Transaction Classification</option>
                                        {this.transactionClassificationSet.map((value,ind)=>{
                                            
                                            return(
                                                <option key={"transactionClassification"+ind} value={value}>{value}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="record-item">
                                    <select value={entry['transactionTypeId']} onChange={this.handleChange.bind(this,'transactionTypeId',ind)}>
                                        <option value="">Transaction Type</option>
                                        {filteredTransactionTypeSet.map((value,ind)=>{                                            
                                            return(
                                                <option key={"transactionType"+ind} value={value.transactionTypeId}>{value.transactionTypeName}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="record-item-half">
                                        <input type="text" ref={"amount"+ind} value={entry['amount']} placeholder={"Amount"} onChange={this.handleChange.bind(this,'amount',ind)} ></input>
                                </div>
                                <div className="record-item-half">
                                <select value={entry['amountTypeId']} onChange={this.handleChange.bind(this,'amountTypeId',ind)}>
                                        <option value="">Currency Type</option>
                                        {this.amountTypeSet.map((value,ind)=>{                                            
                                            return(
                                                <option key={"amountType"+ind} value={value.amountTypeId}>{value.amountSymbol}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="record-item">
                                        <textarea type="text" className="comment" ref={"comment"+ind} value={entry['comment']} placeholder={"Description"} onChange={this.handleChange.bind(this,'comment',ind)} ></textarea>
                                </div>
                            </div> 
                        )
                    })}                        
                </div>
            )
        }
        catch(err){
            console.log('error');
            return null;
        }
    }
}