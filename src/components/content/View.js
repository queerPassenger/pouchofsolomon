import React from 'react';
import DatePicker from 'react-datepicker';
import {apiCall} from '../../utilities/apiCall';
let date = new Date();

export default class View extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fromDate:new Date(date.getFullYear(), date.getMonth(), 1),
            toDate:new Date(),
            result:[],
        };
        this.handleFilter=this.handleFilter.bind(this);
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
            res.data.map((entry)=>{
                result.push(entry);
            })
            this.setState({
                result
            })
        })
        .catch(err=>{
            this.props.handleLoading(false);
            console.log('err',err)}
        );        
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
                    {this.state.result.map((res)=>{
                        
                        return(
                            <div className="result">
                                <div className="item">
                                    {res.timeStamp}
                                </div>
                                <div className="item">
                                    {res.transactionTypeId}
                                </div>
                                <div className="item">
                                    {res.amount}
                                </div>
                                <div className="item">
                                    {res.amountTypeId}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}