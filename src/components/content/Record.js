import React from 'react';
import {apiCall} from '../../utilities/apiCall';
import {schemaGenerator} from '../../utilities/schema';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class Record extends React.Component{
    constructor(props){
        super(props);
        this.state={
            entryList:[schemaGenerator('uiSchema','transaction')] 

        };  
        this.transactionClassificationSet=[];
        this.transactionTypeSet=[];
        this.amountTypeSet=[];
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleRefresh=this.handleRefresh.bind(this);
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
                        //entryList[0]['transactionClassification']=transaction.transactionClassification;
                        //entryList[0]['transactionTypeId']=transaction.transactionTypeId;
                        entryList[0]['timeStamp']=new Date();
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
    handleDateChange(ind,date){
        let entryList=this.state.entryList;
        entryList[ind]['timeStamp']=date;
        this.setState({
            entryList
        })
    }
    handleSubmit(){
        let entryList=JSON.parse(JSON.stringify(this.state.entryList));
        let convertedSchema=[];
        let errFlag=false;
        for(let i=0;i<entryList.length;i++){            
            if(!(entryList[i]['transactionTypeId'] && entryList[i]['timeStamp'] && entryList[i]['comment'] && entryList[i]['amount'] && entryList[i]['amountTypeId'])){
                console.log('Fields cant be empty');
                errFlag=true;
                break;
            }
            let convertedSchemaObj=schemaGenerator('apiSchema','transaction');
            convertedSchemaObj['createdTimeStamp']=new Date();
            convertedSchemaObj['transactionTypeId']=Number(entryList[i]['transactionTypeId']);
            convertedSchemaObj['timeStamp']=entryList[i]['timeStamp'];
            convertedSchemaObj['comment']=entryList[i]['comment'];
            convertedSchemaObj['amount']=Number(entryList[i]['amount']);
            convertedSchemaObj['amountTypeId']=Number(entryList[i]['amountTypeId']);
            convertedSchema.push(convertedSchemaObj);
        }
        if(!errFlag){
            console.log('convertedSchema',JSON.stringify(convertedSchema));
            
            let data={
                apiPath:'/recordTransaction',
                type:'POST',
                query:null,
                payload:convertedSchema
            }
            apiCall(data)
            .then(res=>{
               console.log('Submitted',res);
            })
            .catch(err=>{console.log('err',err)});
        }

    }
    handleRefresh(){
        let entryList=[];
        entryList=[schemaGenerator('uiSchema','transaction')];
        entryList[0]['timeStamp']=new Date();
        this.setState({
            entryList,
        })

    }
    render(){
        console.log('State',this.state.entryList);
        try{
            return(
                <div className="record-container">
                    {this.state.entryList.map((entry,ind)=>{
                        let filteredTransactionTypeSet=this.transactionTypeSet.filter(x=>{if(x.transactionClassification===entry['transactionClassification']){return x}});
                        return(
                            <div className="record" key={"entry"+ind}>
                                <div className="record-item">
                                    <DatePicker
                                        selected={entry['timeStamp']}
                                        onChange={this.handleDateChange.bind(this,ind)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        timeCaption="time"
                                    />
                                </div>
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
                    <div className="action-items">
                        <button type="button" onClick={this.handleSubmit}>Submit</button>
                        <button type="button" onClick={this.handleRefresh}>Refresh</button>
                    </div>                      
                </div>
            )
        }
        catch(err){
            console.log('error');
            return null;
        }
    }
}