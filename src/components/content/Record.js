import React from 'react';
import {apiCall} from '../../utilities/apiCall';
import {schemaGenerator} from '../../utilities/schema';
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isMobile } from '../../utilities/responsive';

export default class Record extends React.Component{
    constructor(props){
        super(props);
        this.state={
            entryList:props.toEditSet.length===0?[schemaGenerator('uiSchema','transaction')]:props.toEditSet,
            transactionClassificationSet:props.transactionClassificationSet,
            transactionTypeSet:props.transactionTypeSet,
            amountTypeSet:props.amountTypeSet,
        };  
        this.addDelpadTop='0px';
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
        this.addDelpadTop=document.getElementsByClassName(isMobile()?'m-record':'record')[0].clientHeight/2+'px';
        this.setState({
            entryList:this.state.entryList
        })
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
            if(entry.timeStamp===''){
                entry.timeStamp=new Date();     
                flag=true;
            }
            if(entry.amountTypeId===''){
                entry.amountTypeId=49;     
                flag=true;
            }
        });
        if(flag){
            this.addDelpadTop=document.getElementsByClassName(isMobile()?'m-record':'record')[0].clientHeight/2+'px';
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
        entryList[ind]['timeStamp']=date;
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
                alert('Fields cant be empty');
                errFlag=true;
                break;
            }
            let convertedSchemaObj=schemaGenerator('apiSchema','transaction');
            if(type==='submit')
                convertedSchemaObj['createdTimeStamp']=new Date();
            else {   
                convertedSchemaObj['lastUpdatedTimeStamp']=new Date();
                convertedSchemaObj['transactionId']=entryList[i]['transactionId'];
            }
            convertedSchemaObj['transactionTypeId']=Number(entryList[i]['transactionTypeId']);
            convertedSchemaObj['timeStamp']=entryList[i]['timeStamp'];
            convertedSchemaObj['comment']=entryList[i]['comment'];
            convertedSchemaObj['amount']=Number(entryList[i]['amount']);
            convertedSchemaObj['amountTypeId']=Number(entryList[i]['amountTypeId']);
            convertedSchema.push(convertedSchemaObj);
        }
        if(!errFlag){
            this.props.handleLoading(true);
            let data={
                apiPath:type==='submit'?'/recordTransaction':'/updateTransaction',
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
        });

    }
    handleAddDel(type,ind){
        let {entryList}=this.state;
        if(type==='+')
            entryList.push(schemaGenerator('uiSchema','transaction'));
        else
            entryList.splice(ind,1);
        this.setState({
            entryList,
        });
    }
    webBuild(){
        try{
            return(
                <div className="record-container" >
                    {this.state.entryList.map((entry,ind)=>{
                        let filteredTransactionTypeSet=this.state.transactionTypeSet.filter(x=>{if(x.transactionClassification===entry['transactionClassification']){return x}});
                        return(
                            <div className="record-wrapper"  key={"entry"+ind}>
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
                                <div className={this.props.toEditSet.length!==0?"hide":""} style={{paddingTop:this.addDelpadTop,paddingLeft:'20px',float:'left',fontSize:'30px',fontFamily:'monospace',color:'#aca3a3'}}>
                                        {((ind===this.state.entryList.length-1) && ind===0)?
                                            <span onClick={this.handleAddDel.bind(this,'+')}>+</span>                                        
                                        :
                                            (ind===this.state.entryList.length-1)?
                                                <span onClick={this.handleAddDel.bind(this,'+')}>+</span>
                                            :
                                                <span onClick={this.handleAddDel.bind(this,'-',ind)}>-</span>
                                        }
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
    mBuild(){
        try{
            return(
                <div className="m-record-container" >
                    {this.state.entryList.map((entry,ind)=>{
                        let filteredTransactionTypeSet=this.state.transactionTypeSet.filter(x=>{if(x.transactionClassification===entry['transactionClassification']){return x}});
                        return(
                            <div className="m-record-wrapper"  key={"entry"+ind}>
                                <div className="m-record" key={"entry"+ind}>
                                    <div className="m-record-item">                                
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
                                    <div className="m-record-item">
                                        <select value={entry['transactionClassification']} onChange={this.handleChange.bind(this,'transactionClassification',ind)}>
                                            <option value="">Transaction Classification</option>
                                            {this.state.transactionClassificationSet.map((value,ind)=>{
                                                
                                                return(
                                                    <option key={"transactionClassification"+ind} value={value}>{value}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="m-record-item">
                                        <select value={entry['transactionTypeId']} onChange={this.handleChange.bind(this,'transactionTypeId',ind)}>
                                            <option value="">Transaction Type</option>
                                            {filteredTransactionTypeSet.map((value,ind)=>{                                            
                                                return(
                                                    <option key={"transactionType"+ind} value={value.transactionTypeId}>{value.transactionTypeName}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="m-record-item amount">
                                        <input type="text" ref={"amount"+ind} value={entry['amount']} placeholder={"Amount"} onChange={this.handleChange.bind(this,'amount',ind)} ></input>                                                                       
                                    </div>
                                    <div className="m-record-item amount">
                                        <select value={entry['amountTypeId']} onChange={this.handleChange.bind(this,'amountTypeId',ind)}>
                                            <option value="">Currency Type</option>
                                            {this.state.amountTypeSet.map((value,ind)=>{                                            
                                                return(
                                                    <option key={"amountType"+ind} value={value.amountTypeId}>{value.amountSymbol}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="m-record-item">
                                        <textarea type="text" className="comment" ref={"comment"+ind} value={entry['comment']} placeholder={"Description"} onChange={this.handleChange.bind(this,'comment',ind)} ></textarea>
                                    </div>                                                               
                                </div> 
                                <div className={this.props.toEditSet.length!==0?"hide":""} style={{paddingTop:this.addDelpadTop,paddingLeft:'10px',float:'left',fontSize:'30px',fontFamily:'monospace',color:'#aca3a3'}}>
                                        {((ind===this.state.entryList.length-1) && ind===0)?
                                            <span onClick={this.handleAddDel.bind(this,'+')}>+</span>                                        
                                        :
                                            (ind===this.state.entryList.length-1)?
                                                <span onClick={this.handleAddDel.bind(this,'+')}>+</span>
                                            :
                                                <span onClick={this.handleAddDel.bind(this,'-',ind)}>-</span>
                                        }
                                </div>    
                            </div> 
                        )
                    })}  
                    <div className="m-action-items">
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
    render(){
        if(isMobile())
            return this.mBuild();
        else    
            return this.webBuild();
        
    }
}