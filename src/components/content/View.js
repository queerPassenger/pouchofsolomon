import React from 'react';
import DatePicker from 'react-datepicker';
import {apiCall} from '../../utilities/apiCall';
import AdvancedFilter,{toggleOptions} from './AdvancedFilter';


export default class View extends React.Component{
    constructor(props){
        super(props);
        let date = new Date();
        this.state={
            fromDate:new Date(date.getFullYear(), date.getMonth(), 1),
            toDate:new Date(),
            result:[],
            transactionClassificationSet:['expense','saving'],
            transactionTypeSet:props.transactionTypeSet,
            amountTypeSet:props.amountTypeSet,
            checkAll:false,
            advancedFilterFlag:false,  
            filter:{},
            filter: {
                'transactionClassificationSet': [],
                'transactionTypeSet': [],
                // 'amountTypeSet': []
            }
               
        };
        this.handleFilter=this.handleFilter.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
        this.toggleAdvancedFilter=this.toggleAdvancedFilter.bind(this);
        this.handleAdvancedFilter=this.handleAdvancedFilter.bind(this);
        this.resetFilter=this.resetFilter.bind(this);
    }
    componentDidMount(){
        this.handleFilter();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if( JSON.stringify(prevState.transactionTypeSet)!==JSON.stringify(nextProps.transactionTypeSet) ||
            JSON.stringify(prevState.amountTypeSet)!==JSON.stringify(nextProps.amountTypeSet)
        ){
            return{
                transactionTypeSet:nextProps.transactionTypeSet,
                amountTypeSet:nextProps.amountTypeSet
            }
        }      
        // Return null to indicate no change to state.
        return null;      
    }
    handleDateChange(_type,val){
        let obj={};
        obj[_type]=val;
        this.setState(obj);
    }
    handleFilter(){
        if(!(this.state.fromDate && this.state.toDate)){
            return;
        }
        let payload={
            fromDate:this.state.fromDate,
            toDate:this.state.toDate
        }
        let data={
            apiPath:'/getTransaction',
            type:'POST',
            query:null,
            payload
        }
        this.props.handleLoading(true);
        apiCall(data)
        .then(res=>{
            this.props.handleLoading(false);
            let {result} =this.state;
            if(res.hasOwnProperty('data')){
                result=res.data.map((data)=>{data.flag=false;return data});                
            }
            else{                
                alert(res.message);
                result=[];
            }
            this.setState({
                result,
                checkAll:false
            },()=>{
                document.getElementsByClassName('result-container')[0].scrollTop=document.getElementsByClassName('result-container')[0].scrollHeight;
            });
        })
        .catch(err=>{
            this.props.handleLoading(false);
            console.log('err',err)}
        );        
    }
    handleCheck(flag){
        let {checkAll,result}=this.state;
        if(flag==='all'){            
            checkAll=!checkAll;
            result.map((data)=>{
                data.flag=checkAll;
            })
        }
        else{
            result[flag]['flag']=!result[flag]['flag'];
            let count=0;
            result.map((data)=>{
                if(!data.flag){
                    checkAll=false;
                }
                else{
                    count++;
                }
            });
            if(count===result.length){
                checkAll=true;
            }
        }
        this.setState({
            checkAll,
            result
        })
    }
    getTransactionObj(transactionTypeId){
        for(let i=0;i<this.state.transactionTypeSet.length;i++){
            if(this.state.transactionTypeSet[i].transactionTypeId===transactionTypeId){
                return this.state.transactionTypeSet[i];
                break;
            }
        }
        return {transactionClassification:'',transactionTypeName:''};
    }
    handleEdit(){
        let toEditSet=[];
        this.state.result.map(data=>{
            if(data.flag){
                toEditSet.push(data);
            }
        });
        if(toEditSet.length===0){
            alert('Please select the items to edit');
        }
        else{
            this.props.edit(toEditSet);
        }
    }
    toggleAdvancedFilter(){
        this.setState({
            advancedFilterFlag:!this.state.advancedFilterFlag
        })
    }
    handleDelete(){
        let toDeleteSet=[];
        this.state.result.map(data=>{
            if(data.flag){
                toDeleteSet.push(data);
            }
        });
        if(toDeleteSet.length===0){
            alert('Please select the items to delete');
        }
        else{
            let data={
                apiPath:'/deleteTransaction',
                type:'DELETE',
                query:null,
                payload:toDeleteSet,
            }
            this.props.handleLoading(true);
            apiCall(data)
            .then(res=>{
                this.props.handleLoading(false);
                if(res.status){
                    alert('Deleted Successfully');
                    this.handleFilter();
                }
            })
            .catch(err=>{
                this.props.handleLoading(false);
                console.log('err',err)}
            );        
        }
    }
    handleRefresh(){
        this.setState({
            fromDate:new Date(date.getFullYear(), date.getMonth(), 1),
            toDate:new Date(),
        });
    }   
    handleAdvancedFilter(filter){
        this.setState({
            filter
        })
    }
    getSummation(resultFiltered){
        let summation={
            expense:[],
            saving:[],
        }
        resultFiltered.map(res=>{    
            let typeClassification=this.getTransactionObj(res.transactionTypeId).transactionClassification;
            let amountType=this.state.amountTypeSet.filter((x)=>{if(x.amountTypeId===res.amountTypeId){return x}})[0];
            if(amountType){
                if(typeClassification==='expense'){                
                    let count=0;
                    for(let i=0;i<summation.expense.length;i++){
                        if(summation.expense[i][0]===amountType['amountSymbol']){
                            summation.expense[i][1]+=Number(res.amount);
                            count++;
                            break;
                        }
                    }
                    if(count===0){
                        summation.expense.push([amountType['amountSymbol'],Number(res.amount)])
                    }
                }                
                else if(typeClassification==='saving'){
                    let count=0;
                    for(let i=0;i<summation.saving.length;i++){
                        if(summation.saving[i][0]===amountType['amountSymbol']){
                            summation.saving[i][1]+=Number(res.amount);
                            count++;
                            break;
                        }
                    }
                    if(count===0){
                        summation.saving.push([amountType['amountSymbol'],Number(res.amount)])
                    }
                }
            }                
        });
        let expenseStatement='';
        let savingStatement='';
        summation.expense.map((obj,ind)=>{
            expenseStatement+=obj[1]+' '+obj[0];
            if(summation.expense.length-1!==ind){
                expenseStatement+=' , ';
            }
        });
        summation.saving.map((obj,ind)=>{
            savingStatement+=obj[1]+' '+obj[0];
            if(summation.saving.length-1!==ind){
                savingStatement+=' , ';
            }
        });
        return {
            expenseStatement:expenseStatement===''?'0':expenseStatement,
            savingStatement:savingStatement===''?'0':savingStatement,
        };
    }
    getTransactionCombo(transactionTypeId){
        let {transactionTypeSet}=this.state;
        for(let i=0;i<transactionTypeSet.length;i++){
            if(transactionTypeSet[i].transactionTypeId===transactionTypeId){
                return {
                    transactionClassification:transactionTypeSet[i].transactionClassification,
                    transactionTypeName:transactionTypeSet[i].transactionTypeName
                };
            }
        }

    }
    filterResult(){
        let {result,filter}=this.state;
        return result.filter(x=>{
            let transactionCombo=this.getTransactionCombo(x.transactionTypeId);

            if(filter.hasOwnProperty('transactionClassificationSet')){
                if(filter.transactionClassificationSet.length>0){
                    let count=0;
                    for(let i=0;i<filter.transactionClassificationSet.length;i++){                    
                        if(filter.transactionClassificationSet[i]===transactionCombo.transactionClassification){
                            count++;
                        }
                    }
                    if(count===0){
                        return null;
                    }
                }
            }            
            if(filter.hasOwnProperty('transactionTypeSet')){
                if(filter.transactionTypeSet.length>0){
                   let count=0;
                    for(let i=0;i<filter.transactionTypeSet.length;i++){
                        if(filter.transactionTypeSet[i]===transactionCombo.transactionTypeName){
                            count++;
                        }
                    }
                    if(count===0){
                        return null;
                    }
                }
            }
            return x;
        });
    }
    resetFilter(){
        this.setState({
            filter:{
                'transactionClassificationSet': [],
                'transactionTypeSet': [],
                // 'amountTypeSet': []
            }
        })
    }
    uiBuild(){
        let resultFiltered=this.filterResult();
        let summation=this.getSummation(resultFiltered);
        let {state}=this;
        return(
            <div className="view-container" onClick={(e)=>{toggleOptions(null,e)}}>
                <div className="filter-contianer">
                    <div className="filter-item">
                        <DatePicker
                            selected={state.fromDate}
                            onChange={this.handleDateChange.bind(this,'fromDate')}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                    </div>
                    <div className="filter-item">
                        <DatePicker
                            selected={state.toDate}
                            onChange={this.handleDateChange.bind(this,'toDate')}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                    </div>
                    <div className="filter-item">
                        <div className="action-items">
                            <div className="action-item">
                                <button type="button" onClick={this.handleFilter}>Search</button>
                            </div>
                            {/* <div className="action-item">
                                <button type="button" onClick={this.handleRefresh}>Clear</button>
                            </div>                             */}
                        </div>
                    </div>
                    <div className="filter-item">
                        <div className="advancedFilterEnabler">
                            <span onClick={this.toggleAdvancedFilter}>{state.advancedFilterFlag?'Hide Advanced Filter':'Show Advanced Filter'}</span>                            
                        </div>                        
                    </div>
                </div>
                {state.advancedFilterFlag?
                    <>
                        <span className="resetFilter" title="Reset advanced filter" onClick={this.resetFilter}>Reset</span>                            
                        <AdvancedFilter 
                            filter={state.filter}
                            transactionClassificationSet={state.transactionClassificationSet}
                            transactionTypeSet={state.transactionTypeSet}
                            amountTypeSet={state.amountTypeSet}
                            handleAdvancedFilter={this.handleAdvancedFilter}
                        />
                    </>
                :
                    null
                }
                <div className="result-container">
                    {resultFiltered.map((res,ind)=>{    
                            let transaction=this.getTransactionObj(res.transactionTypeId);                                            
                            let amountType=state.amountTypeSet.filter((x)=>{if(x.amountTypeId===res.amountTypeId){return x}})[0];
                            amountType=amountType?amountType:{'amountSymbol':'-'};
                            let date=new Date(res.timeStamp);
                            return( 
                                <div className="result" key={"result"+ind}>            
                                    <div className="item">                      
                                        <div className="check" onClick={this.handleCheck.bind(this,ind)}>
                                            {res.flag?
                                                <div className="checked">
                                                </div>
                                            :
                                                null
                                            }
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="sub-item">
                                            {res.comment}
                                        </div>
                                        <div className="sub-item">
                                            {transaction.transactionTypeName}
                                        </div>
                                        <div className="sub-item">
                                            {transaction.transactionClassification}
                                        </div>
                                        <div className="sub-item">
                                            {date.getDate()+'/'+ (date.getMonth()+1)+'/'+ date.getFullYear()}
                                        </div>
                                        <div className="sub-item">
                                            {(date.getHours()>=10?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes())+':'+ (date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds())}
                                        </div>
                                    </div>
                                    <div className="item">
                                        <span>{res.amount}</span>
                                        <span>{amountType['amountSymbol']}</span>                                    
                                    </div>
                                </div>
                            )
                        })}
                </div>
                {resultFiltered.length>0?
                    <div className="summation-container">
                        <div>
                            <span>Total Expense :</span>
                            <span title={summation.expenseStatement}>{summation.expenseStatement}</span>
                        </div>
                        <div>
                            <span>Total Savings :</span>
                            <span title={summation.savingStatement}>{summation.savingStatement}</span>
                        </div>
                    </div>
                :
                    null
                }
                {resultFiltered.length>0?
                    <div className="action-items">
                        <div className="action-item">
                            <button type="button" onClick={this.handleEdit}>Edit</button>
                        </div>
                        <div className="action-item">
                            <button type="button" onClick={this.handleDelete}>Delete</button>
                        </div>
                    </div>
                :
                    null
                }
            </div>
        )
    }
    render(){
       return this.uiBuild();        
    }
}