import React,{Component} from 'react';
import {componentSchema} from '../../utilities/schema';
import ChartComponent from './chartComponent';
import UnderConstruction from '../../images/underConstruction.png';

var HighCharts=require('highcharts');

export default class Analyse extends Component{
    constructor(props){
        super(props);
        this.componentName = 'Analyse';        
        this.state={
            charts: componentSchema(this.componentName,'charts'),
            periodType:componentSchema(this.componentName,'periodType')
        };
    };
    componentDidMount(){
        this.calculatePeriod();
        this.buildChart();
    }
    buildChart(){
        HighCharts.chart('expense',{
            chart:{
                type:'line',
                width:400,
            },
            title:{
                text:'E'
            },
            credits:{
                enabled:false,
            },
            legend:{
                enabled:true,
            },
            xAxis:{
                categories:[],
                title:{
                    text:''
                }
            },
            series:[]
        });
    }
    handlePeriodSelection = (e)=> {        
        let charts = componentSchema(this.componentName,'charts');
        let periodType = this.state.periodType;
        periodType.selected = e.target.value;
        this.setState({charts,periodType},()=>{
            this.calculatePeriod();
        });        
    }
    calculatePeriod(){
        let periodObj = {status:true,msg:'',type:this.state.periodType.selected,period:[]};              
        for(let i=0;i<this.state.charts.length;i++){
            let status = this.state.charts[i].status;
            if(status>0){
                periodObj.status=false;
                periodObj.msg = 'Analyse cannot be done for future dates'
                break;
            }
            else{
                let fromDate,toDate;
                if(periodObj.type === 'daily'){
                    fromDate = new Date(new Date().setDate(new Date().getDate()+status));
                    toDate = fromDate;
                }
                else if(periodObj.type === 'weekly'){
                    let temp = new Date();
                    fromDate = new Date(temp.setDate(temp.getDate() - temp.getDay() + 7*(status)));
                    toDate = new Date(temp.setDate(temp.getDate() - temp.getDay()+6))
                }
                else if(periodObj.type === 'monthly'){
                    let temp = new Date();
                    fromDate =  new Date(temp.getFullYear(), temp.getMonth() + status, 1);
                    toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
                }
                else if(periodObj.type === 'yearly'){
                    let  temp = new Date();
                    fromDate = new Date(temp.getFullYear()+status,0,1);
                    toDate = new Date(fromDate.getFullYear(),12,0);
                }
                fromDate.setHours(0,0,0);
                toDate.setHours(23,59,59);
                periodObj.period.push({fromDate,toDate});
            }
        }
        console.log(periodObj);
        return periodObj;
    }
    handleStatus = (_type,_ind) => {
        let charts = this.state.charts;
        charts[_ind].status = _type==='left'? charts[_ind].status-1:charts[_ind].status+1;
        this.setState({
            charts
        },()=>{
            this.calculatePeriod();
        })
    }
    render(){
        if(false)
            return(
                <div className="analyse-container">
                    <img src={UnderConstruction}></img>
                </div>
            )
        else
            return(
                <div className="analyse-container">
                    <div className='drop-down'>
                        <select ref='periodSelection' value={this.state.periodType.selected} onChange={this.handlePeriodSelection}>
                            <option value='' disabled>Select period</option>
                            {this.state.periodType.options.map((period,ind)=>{
                                return(
                                    <option key={'periodOptions'+ind} value={period.value}>{period.label}</option>
                                )
                            })}                            
                        </select>
                    </div>
                    <div className="chart-super-wrapper">
                        {this.state.charts.map((chart,ind)=>{
                            return(
                                <ChartComponent ind={ind} {...chart} handleStatus={this.handleStatus}/>
                            )
                        })}
                    </div>
                </div>
            )
    }
}