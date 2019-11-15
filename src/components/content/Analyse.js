import React, { Component } from 'react';
import { apiCall } from '../../utilities/apiCall';
import { componentSchema } from '../../utilities/schema';
import ChartComponent from './chartComponent';
import UnderConstruction from '../../images/underConstruction.png';

var HighCharts = require('highcharts');

export default class Analyse extends Component {
    constructor(props) {
        super(props);
        this.componentName = 'Analyse';
        this.periodSet = componentSchema(this.componentName, 'periodSet');

        this.state = {
            charts: componentSchema(this.componentName, 'charts')
        };
    };
    componentDidMount() {
        this.handlePeriodSelection({ target: this.periodSet[0] });
        Date.prototype.addDays = function (days) {
            var dat = new Date(this.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        }
        Date.prototype.getDayString = function (){    
            return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(this.valueOf()).getDay()]
        }
    }
    handlePeriodSelection = (e) => {
        let charts = componentSchema(this.componentName, 'charts');
        for (let i = 0; i < charts.length; i++) {
            charts[i]['period'] = e.target.value
        }
        this.calculatePeriod(charts);
    }
    handleStatus = (_type, _ind) => {
        let charts = this.state.charts;
        charts[_ind]['periodStatus'] = _type === 'left' ? charts[_ind]['periodStatus'] - 1 : charts[_ind]['periodStatus'] + 1;
        this.calculatePeriod(charts);
    }
    calculatePeriod(_charts) {
        let charts = _charts;
        for (let i = 0; i < charts.length; i++) {
            let periodStatus = charts[i].periodStatus;
            if (periodStatus > 0) {
                charts[i].errorMsg = 'Analyse cannot be done for future dates',
                    charts[i].result = [];
                break;
            }
            else {
                let fromDate, toDate;
                if (charts[i].period === 'daily') {
                    let temp = new Date();
                    fromDate = new Date(temp.setDate(temp.getDate() + periodStatus));
                    toDate = new Date(new Date().setDate(new Date().getDate() + periodStatus));
                }
                else if (charts[i].period === 'weekly') {
                    let temp = new Date();
                    fromDate = new Date(temp.setDate(temp.getDate() - temp.getDay() + 7 * (periodStatus)));
                    toDate = new Date(temp.setDate(temp.getDate() - temp.getDay() + 6))
                }
                else if (charts[i].period === 'monthly') {
                    let temp = new Date();
                    fromDate = new Date(temp.getFullYear(), temp.getMonth() + periodStatus, 1);
                    toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
                }
                else if (charts[i].period === 'yearly') {
                    let temp = new Date();
                    fromDate = new Date(temp.getFullYear() + periodStatus, 0, 1);
                    toDate = new Date(fromDate.getFullYear(), 12, 0);
                }
                fromDate.setHours(0, 0, 0);
                toDate.setHours(23, 59, 59);
                charts[i].query = {
                    fromDate: fromDate.toISOString(),
                    toDate: toDate.toISOString()
                };
                charts[i].errorMsg = '';
            }
        }
        this.getPeriodicData(charts);
        this.setState({
            charts
        })
    }
    getPeriodicData(charts) {
        let count = 0;
        for (let i = 0; i < charts.length; i++) {
            let payload = {
                ...charts[i].query,
                period: charts[i].period,
                id: charts[i].id,
            };
            let data = {
                apiPath: '/getTransaction',
                type: 'POST',
                query: null,
                payload
            }
            this.props.handleLoading(true);
            apiCall(data)
                .then(res => {
                    count++;
                    this.props.handleLoading(false);
                    if (res.hasOwnProperty('data')) {
                        charts[i].result = res.data;
                        charts[i].cognitiveResult = this.cognitiveResult(res.data, charts[i]);
                    }
                    else {
                        let popUpObj = getPopUpObj('warning/error', { text: [res.message], onClickHandler: () => this.props.updatePopUp(null, 'disablePopUp') });
                        this.props.updatePopUp(popUpObj, 'enablePopUp');
                        charts[i].result = [];
                    }
                    this.setState({
                        charts
                    });
                    this.buildChart();

                })
                .catch(err => {
                    this.props.handleLoading(false);
                    console.log('err', err)
                }
                );
        }
    }
    buildChart() {
        HighCharts.chart(this.state.charts[0].id, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Expense vs Saving'
            },
            xAxis: {
                categories: this.state.charts[0].cognitiveResult.dates,
                crosshair: true
            },
            yAxis: {
                min: 0,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Expense',
                data: this.state.charts[0].cognitiveResult.expense

            }, {
                name: 'Saving',
                data: this.state.charts[0].cognitiveResult.saving

            }]
        });
    }
    getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(currentDate)
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }
    cognitiveResult(result, chart) {
        let cognitiveResult = {
            expense: [],
            saving: [],
            dates: [],
        };
        if (chart.period === 'daily') {
            let dateValue = new Date(chart.query.fromDate).getDate() + '-' + (new Date(chart.query.fromDate).getMonth() + 1) + '-' + new Date(chart.query.fromDate).getFullYear();
            cognitiveResult.dates.push(dateValue);
            cognitiveResult.expense.push(0);
            cognitiveResult.saving.push(0);
            result.map((obj) => {
                cognitiveResult[this.identifyExpenseOrSaving(obj)][0] += obj.amount;
            });
        }
        else if (chart.period === 'weekly') {
            let dateSet = this.getDates(new Date(chart.query.fromDate), new Date(chart.query.toDate));
            let dateHyphenSet = [];
            dateSet.map(date => {
                let dateHyphenString = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                dateHyphenSet.push(dateHyphenString)
                cognitiveResult.dates.push(dateHyphenString+'~'+date.getDayString());
                cognitiveResult.expense.push(0);
                cognitiveResult.saving.push(0);
            });
            result.map((obj) => {
                let dateValue = new Date(obj.timeStamp).getDate() + '-' + (new Date(obj.timeStamp).getMonth() + 1) + '-' + new Date(obj.timeStamp).getFullYear();
                let ind = dateHyphenSet.indexOf(dateValue);
                if (ind !== -1) {
                    cognitiveResult[this.identifyExpenseOrSaving(obj)][ind] += obj.amount;
                }
            });
        }
        return cognitiveResult;
    }
    identifyExpenseOrSaving(transaction) {
        let { transactionTypeId } = transaction;
        for (let i = 0; i < this.props.transactionTypeSet.length; i++) {
            if (transactionTypeId === this.props.transactionTypeSet[i].transactionTypeId) {
                return this.props.transactionTypeSet[i].transactionClassification;
            }
        }
        return '';
    }
    render() {
        let period = (this.state.charts[0] && this.state.charts[0].period) ? this.state.charts[0].period : '';
        if (false)
            return (
                <div className="analyse-container">
                    <img src={UnderConstruction}></img>
                </div>
            )
        else
            return (
                <div className="analyse-container">
                    <div className='drop-down'>
                        <select ref='periodSelection' value={period} onChange={this.handlePeriodSelection}>
                            <option value='' disabled>Select period</option>
                            {this.periodSet.map((period, ind) => {
                                return (
                                    <option key={'period' + ind} value={period.value}>{period.label}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="chart-super-wrapper">
                        {this.state.charts.map((chart, ind) => {
                            return (
                                <ChartComponent ind={ind} {...chart} handleStatus={this.handleStatus} />
                            )
                        })}
                    </div>
                </div>
            )
    }
}