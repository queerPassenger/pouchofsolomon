import React from 'react';
import DatePicker from 'react-datepicker';
import {apiCall} from '../../utilities/apiCall';

const resultHeader=['Date','Time','Classification','Type','Amount','Comment']
export default class View extends React.Component{
    constructor(props){
        super(props);
        let date = new Date();
        this.state={
            fromDate:new Date(date.getFullYear(), date.getMonth(), 1),
            toDate:new Date(),
            result:[],
            transactionTypeSet:props.transactionTypeSet,
            amountTypeSet:props.amountTypeSet
        };
        this.handleFilter=this.handleFilter.bind(this);
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
                amountTypeSet:nextProps.amountTypeSet,
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
            result=res.data;
            //result=[{"_id":"5cd512888871f945c03fc1ff","createdTimeStamp":"2019-05-10T05:56:24.256Z","lastUpdatedTimeStamp":"","transactionTypeId":2,"timeStamp":"2019-05-10T05:56:17.743Z","comment":"fd","amount":50,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd512888871f945c03fc1fe"},{"_id":"5cd51ed6e28fa22e583b11cb","createdTimeStamp":"2019-05-10T06:48:53.741Z","lastUpdatedTimeStamp":"","transactionTypeId":1,"timeStamp":"2019-05-10T06:48:44.873Z","comment":"New","amount":50,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd51ed5e28fa22e583b11ca"},{"_id":"5cd51ef9e28fa22e583b11cd","createdTimeStamp":"2019-05-10T06:49:29.548Z","lastUpdatedTimeStamp":"","transactionTypeId":10,"timeStamp":"2019-05-10T06:49:15.878Z","comment":"Gowtham","amount":30,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd51ef9e28fa22e583b11cc"},{"_id":"5cd66a133f2b023d6cd45b4f","createdTimeStamp":"2019-05-11T06:22:11.234Z","lastUpdatedTimeStamp":"","transactionTypeId":1,"timeStamp":"2019-05-11T03:30:00.000Z","comment":"Mill Shop","amount":25,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd66a133f2b023d6cd45b4e"},{"_id":"5cd677ce3f2b023d6cd45b51","createdTimeStamp":"2019-05-11T07:20:45.840Z","lastUpdatedTimeStamp":"","transactionTypeId":13,"timeStamp":"2019-05-11T07:20:44.735Z","comment":"New","amount":100000,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd677ce3f2b023d6cd45b50"},{"_id":"5cd677d53f2b023d6cd45b53","createdTimeStamp":"2019-05-11T07:20:53.255Z","lastUpdatedTimeStamp":"","transactionTypeId":13,"timeStamp":"2019-05-11T07:20:44.735Z","comment":"New","amount":100000,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd677d53f2b023d6cd45b52"},{"_id":"5cd677dc3f2b023d6cd45b55","createdTimeStamp":"2019-05-11T07:21:00.079Z","lastUpdatedTimeStamp":"","transactionTypeId":13,"timeStamp":"2019-05-11T07:20:44.735Z","comment":"New","amount":100000,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd677dc3f2b023d6cd45b54"},{"_id":"5cd678953f2b023d6cd45b57","createdTimeStamp":"2019-05-11T07:24:04.840Z","lastUpdatedTimeStamp":"","transactionTypeId":1,"timeStamp":"2019-05-11T07:24:03.473Z","comment":"Po","amount":201,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd678953f2b023d6cd45b56"},{"_id":"5cd678ef3f2b023d6cd45b59","createdTimeStamp":"2019-05-11T07:25:34.935Z","lastUpdatedTimeStamp":"","transactionTypeId":6,"timeStamp":"2019-05-11T07:25:33.781Z","comment":"Avengers","amount":358,"amountTypeId":49,"userId":"5cb2d5bf295cb507c41e3074","transactionId":"5cd678ef3f2b023d6cd45b58"}];
            this.setState({
                result
            })
        })
        .catch(err=>{
            this.props.handleLoading(false);
            console.log('err',err)}
        );        
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
    render(){
        console.log('Result',this.state.result);
        return(
            <div className="view-container">
                <div className="filter-container">
                    <div className="filter-item">
                        <div className="filter-item-title">
                            From 
                        </div>
                        <DatePicker
                            selected={this.state.fromDate}
                            onChange={this.handleDateChange.bind(this,'fromDate')}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                    </div>
                    <div className="filter-item">
                        <div className="filter-item-title">
                            To 
                        </div>
                        <DatePicker
                            selected={this.state.toDate}
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
                            <button type="button" onClick={this.handleFilter}>Filter</button>
                            <button type="button" onClick={this.handleRefresh}>Clear</button>
                        </div>
                    </div>
                </div>
                <div className="result-container">
                    {this.state.result.length>0?
                        <div className="result-header">
                            {resultHeader.map((header)=>{
                                return(
                                    <div className="item">
                                    {header}
                                    </div>
                                )
                            })}
                        </div>
                    :
                        <div className="no-records">
                            No Records Found
                        </div>
                    }
                    <div className="result-wrapper">
                        {this.state.result.map((res,ind)=>{    
                            let transaction=this.getTransactionObj(res.transactionTypeId);                                            
                            let amountType=this.state.amountTypeSet.filter((x)=>{if(x.amountTypeId===res.amountTypeId){return x}})[0];
                            amountType=amountType?amountType:{amountSymbol:'-'};
                            let date=new Date(res.timeStamp);
                            return( 
                                <div className="result" key={"result"+ind}>
                                    <div className="item">
                                        {date.getDate()+'/'+ (date.getMonth()+1)+'/'+ date.getFullYear()}
                                    </div>
                                    <div className="item">
                                        {(date.getHours()>=10?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes())+':'+ (date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds())}
                                    </div>
                                    <div className="item">
                                        {transaction.transactionClassification}
                                    </div>
                                    <div className="item">
                                        {transaction.transactionTypeName}
                                    </div>
                                    <div className="item amount">
                                        <span>{res.amount}</span>
                                        <span>{amountType['amountSymbol']}</span>                                    
                                    </div>
                                    <div className="item">
                                        {res.comment}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}