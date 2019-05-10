import React from 'react';
import DatePicker from 'react-datepicker';
import {apiCall} from '../../utilities/apiCall';

export default class View extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fromDate:new Date(),
            toDate:new Date(),
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
        apiCall(data)
        .then(res=>{
           console.log('Submitted',res);
        })
        .catch(err=>{console.log('err',err)});        
    }
    render(){
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
            </div>
        )
    }
}