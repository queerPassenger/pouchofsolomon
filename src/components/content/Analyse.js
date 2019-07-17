import React,{Component} from 'react';
import UnderConstruction from '../../images/underConstruction.png';
var HighCharts=require('highcharts');

export default class Analyse extends Component{
    state={
        chartsStatus:[0,0,0],
        periodType:'Daily',
    }
    buildChart(){
        HighCharts.chart('earnings',{
            chart:{
                type:'line',
                width:600,
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
                categories:chartData.xAxis,
                title:{
                    text:'Pay Period'
                }
            },
            series:chartData.earnings.slice(0,chartData.earnings.length-1)
        });
    }
    handlePeriodSelection = (e)=> {        
        this.setState({chartsStatus:[0,0,0],periodType:e.target.value},()=>{
            console.log(this.calculatePeriod());
        });        
    }
    calculatePeriod(){
        let periodObj = {status:true,msg:'',type:this.state.periodType,period:[]}
        switch(this.state.periodType){
            case 'daily':                
                for(let i=0;i<this.state.chartsStatus.length;i++){
                    if(this.state.chartsStatus[i]>0){
                        periodObj.status=false;
                        periodObj.msg = 'Analyse cannot be done for future dates'
                        break;
                    }
                    else{
                        let fromDate = new Date(new Date().setDate(new Date().getDate()+this.state.chartsStatus[i]));
                        let toDate = new Date(new Date().setDate(fromDate.getDate()+(this.state.chartsStatus[i]+1)));
                        fromDate.setHours(0,0,0);
                        toDate.setHours(0,0,0);
                        periodObj.period.push({fromDate,toDate});
                    }
                }
        }
        return periodObj;
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
                        <select ref='periodSelection' onChange={this.handlePeriodSelection}>
                            <option value='' disabled>Select period</option>
                            <option value='daily'>Daily</option>
                            <option value='weekly'>Weekly</option>
                            <option  value='monthly'>Monthly</option>
                            <option  value='yearly'>Yearly</option>
                        </select>
                    </div>
                    <div className="chart-super-wrapper">
                        <div className="chart-wrapper" id="earnings"> 
                        </div>
                    </div>
                </div>
            )
    }
}