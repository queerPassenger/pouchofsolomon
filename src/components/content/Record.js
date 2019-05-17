import React from 'react';
import {apiCall} from '../../utilities/apiCall';
import {schemaGenerator} from '../../utilities/schema';
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class Record extends React.Component{
    constructor(props){
        super(props);
        this.state={
            entryList:props.toEditSet.length===0?[schemaGenerator('uiSchema','transaction')]:props.toEditSet,
            transactionClassificationSet:props.transactionClassificationSet,
            transactionTypeSet:props.transactionTypeSet,
            amountTypeSet:props.amountTypeSet,
        };  
        this.handleRefresh=this.handleRefresh.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if( JSON.stringify(prevState.transactionClassificationSet)!==JSON.stringify(nextProps.transactionClassification) || 
            JSON.stringify(prevState.transactionTypeSet)!==JSON.stringify(nextProps.transactionTypeSet) ||
            JSON.stringify(prevState.amountTypeSet)!==JSON.stringify(nextProps.amountTypeSet)
        ){
            return{
                transactionClassificationSet:nextProps.transactionClassificationSet,
                transactionTypeSet:nextProps.transactionTypeSet,
                amountTypeSet:nextProps.amountTypeSet,
            }
        }      
        // Return null to indicate no change to state.
        return null;      
    }    
    componentDidMount(){
        let {entryList}=this.state;
        if(entryList[0].timeStamp==='')
            entryList[0].timeStamp=new Date();        
       this.setState({
            entryList
        });
    }
    componentDidUpdate(){
        let {entryList}=this.state;
        let flag=false;
        entryList.map((entry)=>{
            if(!(entry.hasOwnProperty('transactionClassification'))){
                if(entry.transactionTypeId!==''){
                    if(this.state.transactionTypeSet.length>0){
                        this.state.transactionTypeSet.map((transaction)=>{
                            if(entry.transactionTypeId===transaction.transactionTypeId){
                                entry.transactionClassification=transaction.transactionClassification;
                                flag=true;
                            }
                        })
                    }
                }
            }
        });
        if(flag){
            this.setState({
                entryList
            })
        }
        
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
        let entryList = this.state.entryList;        
        entryList[0]['timeStamp']=date;
        this.setState({
            entryList:entryList,
        });
    }
    handleSubmit(type){
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
            if(type==='submit')
                convertedSchemaObj['createdTimeStamp']=new Date();
            else    
                convertedSchemaObj['lastUpdatedTimeStamp']=new Date();
            convertedSchemaObj['transactionTypeId']=Number(entryList[i]['transactionTypeId']);
            convertedSchemaObj['timeStamp']=entryList[i]['timeStamp'];
            convertedSchemaObj['comment']=entryList[i]['comment'];
            convertedSchemaObj['amount']=Number(entryList[i]['amount']);
            convertedSchemaObj['amountTypeId']=Number(entryList[i]['amountTypeId']);
            convertedSchema.push(convertedSchemaObj);
        }
        if(!errFlag){
            console.log('convertedSchema',JSON.stringify(convertedSchema));
            this.props.handleLoading(true);
            let data={
                apiPath:type==='submit'?'/recordTransaction':'updateTransaction',
                type:'POST',
                query:null,
                payload:convertedSchema
            }
            apiCall(data)
            .then(res=>{
                this.props.handleLoading(false);
                this.handleRefresh();
                if(type==='submit'){
                    alert('successfully Recorded');                   
                }                    
                else{    
                    alert('successfully Updated');
                    this.props.onTabClick('Entry');
                }
                
            })
            .catch(err=>{
                this.props.handleLoading(false);
                console.log('err',err)
            });
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
        console.log('EntryList',this.state.entryList);
        try{
            return(
                <div className="record-container" >
                    {this.state.entryList.map((entry,ind)=>{
                        console.log('TimeStamp',entry['timeStamp']);
                        let filteredTransactionTypeSet=this.state.transactionTypeSet.filter(x=>{if(x.transactionClassification===entry['transactionClassification']){return x}});
                        return(
                            <div className="record" key={"entry"+ind}>
                                <div className="record-item">                                
                                    <DatePicker
                                        key={"entry"+ind}
                                        ref={"entry"+ind}
                                        selected={entry['timeStamp']===''?'':new Date(entry['timeStamp'])}
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
                                        {this.state.transactionClassificationSet.map((value,ind)=>{
                                            
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
                                        {this.state.amountTypeSet.map((value,ind)=>{                                            
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
                        <button type="button" onClick={this.props.toEditSet.length==0?this.handleSubmit.bind(this,'submit'):this.handleSubmit.bind(this,'update')}>{this.props.toEditSet.length===0?'Submit':'Update'}</button>
                        <button type="button" onClick={this.props.toEditSet.length==0?this.handleRefresh:()=>{this.handleRefresh();this.props.onTabClick('Entry')}}>Refresh</button>
                    </div>                      
                </div>
            )
        }
        catch(err){
            console.log('error',err);
            return null;
        }
    }
}