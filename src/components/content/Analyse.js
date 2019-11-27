import React, { Component } from 'react';
import ChartComponent from './chartComponent';
import { apiCall } from '../../utilities/apiCall';
import { componentSchema } from '../../utilities/schema';
import { addPrototype, removePrototype } from '../../utilities/date';

var HighCharts = require('highcharts');

export default class Analyse extends Component {
    constructor(props) {
        super(props);
        this.componentName = 'Analyse';
        // Period Drop Down
        this.periodSet = componentSchema(this.componentName, 'periodSet');
        // Used for storing the value when refreshed
        this.expenseOnly = {
            id: [],
            chartSeries: []
        };
        this.savingOnly = {
            id: [],
            chartSeries: [],
        };
        // Vital App State
        this.state = {
            charts: componentSchema(this.componentName, 'charts')
        };
    };
    componentDidMount() {
        // Setting the first Option as selected and doing the calculation with that
        this.handlePeriodSelection({ target: this.periodSet[0] });
        // Setting the Expense and Saving Unique Id and Chart Series
        this.setExpenseSaving();
        addPrototype(['addDays', 'getDayString', 'getYears']);
    }
    componentWillUnmount() {
        removePrototype(['addDays', 'getDayString', 'getYears']);
    }
    handlePeriodSelection = (e) => {
        let charts = componentSchema(this.componentName, 'charts');
        for (let i = 0; i < charts.length; i++) {
            charts[i]['period'] = e.target.value
        }
        this.calculatePeriod(charts);
    }
    setExpenseSaving() {
        let { transactionTypeSet } = this.props;
        transactionTypeSet.map(type => {
            // Updates this.expenseOnly and this.savingOnly
            this[type.transactionClassification + 'Only'].id.push(type.transactionTypeId);
            this[type.transactionClassification + 'Only'].chartSeries.push({
                name: type.transactionTypeName,
                data: []
            });
        });
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
                charts[i].errorMsg = 'Analyse cannot be done for future dates';
                charts[i].result = [];
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
                    fromDate = new Date(temp.getFullYear() + periodStatus, 0, 1);
                    toDate = new Date(fromDate.getFullYear(), 12, 0);
                }
                else if (charts[i].period === 'yearly') {
                    let temp = new Date();
                    fromDate = new Date(temp.getFullYear() + (periodStatus * 5) - 5, 0, 1);
                    toDate = new Date(temp.getFullYear() + (periodStatus * 5), 11, 1);
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
                        charts[i].cognitiveResult = this.cognitiveResult(res.data, charts[i], i);
                    }
                    else {
                        let popUpObj = getPopUpObj('warning/error', { text: [res.message], onClickHandler: () => this.props.updatePopUp(null, 'disablePopUp') });
                        this.props.updatePopUp(popUpObj, 'enablePopUp');
                        charts[i].result = [];
                    }
                    if (count === charts.length) {
                        this.setState({
                            charts
                        }, () => {
                            this.buildChart();
                        });
                    }

                })
                .catch(err => {
                    this.props.handleLoading(false);
                    console.log('err', err)
                }
                );
        }
    }
    buildChart() {
        let { charts } = this.state;
        HighCharts.chart(charts[0].id, {
            chart: {
                type: 'column'
            },
            title: {
                text: charts[0].text,
                style: {
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: charts[0].cognitiveResult.dates,
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
                data: charts[0].cognitiveResult.expense

            }, {
                name: 'Saving',
                data: charts[0].cognitiveResult.saving

            }]
        });
        HighCharts.chart(charts[1].id, {
            chart: {
                type: 'column'
            },
            title: {
                text: charts[1].text,
                style: {
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: charts[1].cognitiveResult.dates,
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
            series: charts[1].cognitiveResult.expenseOnly
        });
        HighCharts.chart(charts[2].id, {
            chart: {
                type: 'column'
            },
            title: {
                text: charts[2].text,
                style: {
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: charts[2].cognitiveResult.dates,
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
            series: charts[2].cognitiveResult.savingOnly
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
            dates: [],
            expense: [],
            saving: [],
            expenseOnly: JSON.parse(JSON.stringify(this.expenseOnly.chartSeries)),
            savingOnly: JSON.parse(JSON.stringify(this.savingOnly.chartSeries))
        };
        if (chart.period === 'daily') {
            let dateValue = new Date(chart.query.fromDate).getDate() + '-' + (new Date(chart.query.fromDate).getMonth() + 1) + '-' + new Date(chart.query.fromDate).getFullYear();
            cognitiveResult.dates.push(dateValue);
            cognitiveResult.expense.push(0);
            cognitiveResult.saving.push(0);
            for (let i = 0; i < cognitiveResult.expenseOnly.length; i++) {
                cognitiveResult.expenseOnly[i].data.push(0);
            }
            for (let i = 0; i < cognitiveResult.savingOnly.length; i++) {
                cognitiveResult.savingOnly[i].data.push(0);
            }
            result.map((obj) => {
                let transactionClassification = this.identifyExpenseOrSaving(obj);
                cognitiveResult[transactionClassification][0] += obj.amount;
                let matchInd = this[transactionClassification + 'Only'].id.indexOf(obj.transactionTypeId);
                if (matchInd !== -1) {
                    cognitiveResult[transactionClassification + 'Only'][matchInd].data[0] += obj.amount;
                }

            });
        }
        else if (chart.period === 'weekly') {
            let dateSet = this.getDates(new Date(chart.query.fromDate), new Date(chart.query.toDate));
            let dateHyphenSet = [];
            dateSet.map(date => {
                let dateHyphenString = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                dateHyphenSet.push(dateHyphenString)
                cognitiveResult.dates.push(dateHyphenString + '~' + date.getDayString());
                cognitiveResult.expense.push(0);
                cognitiveResult.saving.push(0);
                for (let i = 0; i < cognitiveResult.expenseOnly.length; i++) {
                    cognitiveResult.expenseOnly[i].data.push(0);
                }
                for (let i = 0; i < cognitiveResult.savingOnly.length; i++) {
                    cognitiveResult.savingOnly[i].data.push(0);
                }
            });
            result.map((obj) => {
                let transactionClassification = this.identifyExpenseOrSaving(obj);
                let dateValue = new Date(obj.timeStamp).getDate() + '-' + (new Date(obj.timeStamp).getMonth() + 1) + '-' + new Date(obj.timeStamp).getFullYear();
                let ind = dateHyphenSet.indexOf(dateValue);
                if (ind !== -1) {
                    cognitiveResult[transactionClassification][ind] += obj.amount;
                    let matchInd = this[transactionClassification + 'Only'].id.indexOf(obj.transactionTypeId);
                    if (matchInd !== -1) {
                        cognitiveResult[transactionClassification + 'Only'][matchInd].data[ind] += obj.amount;
                    }
                }
            });
        }
        else if (chart.period === 'monthly') {
            let dateSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let dateHyphenSet = [];
            dateSet.map(date => {
                dateHyphenSet.push(date);
                cognitiveResult.dates.push(date + '/' + new Date(chart.query.fromDate).getFullYear());
                cognitiveResult.expense.push(0);
                cognitiveResult.saving.push(0);
                for (let i = 0; i < cognitiveResult.expenseOnly.length; i++) {
                    cognitiveResult.expenseOnly[i].data.push(0);
                }
                for (let i = 0; i < cognitiveResult.savingOnly.length; i++) {
                    cognitiveResult.savingOnly[i].data.push(0);
                }
            });
            result.map((obj) => {
                let transactionClassification = this.identifyExpenseOrSaving(obj);
                let dateValue = new Date(obj.timeStamp).getMonth() + 1;
                let ind = dateHyphenSet.indexOf(dateValue);
                if (ind !== -1) {
                    cognitiveResult[transactionClassification][ind] += obj.amount;
                    let matchInd = this[transactionClassification + 'Only'].id.indexOf(obj.transactionTypeId);
                    if (matchInd !== -1) {
                        cognitiveResult[transactionClassification + 'Only'][matchInd].data[ind] += obj.amount;
                    }
                }

            });
        }
        else if (chart.period === 'yearly') {
            let dateSet = new Date().getYears(new Date(chart.query.fromDate), new Date(chart.query.toDate));;
            let dateHyphenSet = [];
            dateSet.map(date => {
                dateHyphenSet.push(date);
                cognitiveResult.dates.push(date);
                cognitiveResult.expense.push(0);
                cognitiveResult.saving.push(0);
                for (let i = 0; i < cognitiveResult.expenseOnly.length; i++) {
                    cognitiveResult.expenseOnly[i].data.push(0);
                }
                for (let i = 0; i < cognitiveResult.savingOnly.length; i++) {
                    cognitiveResult.savingOnly[i].data.push(0);
                }
            });
            result.map((obj) => {
                let transactionClassification = this.identifyExpenseOrSaving(obj);
                let dateValue = new Date(obj.timeStamp).getFullYear();
                let ind = dateHyphenSet.indexOf(dateValue);
                if (ind !== -1) {
                    cognitiveResult[transactionClassification][ind] += obj.amount;
                    let matchInd = this[transactionClassification + 'Only'].id.indexOf(obj.transactionTypeId);
                    if (matchInd !== -1) {
                        cognitiveResult[transactionClassification + 'Only'][matchInd].data[ind] += obj.amount;
                    }
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
                            <ChartComponent key={'Chart' + ind} ind={ind} {...chart} handleStatus={this.handleStatus} />
                        )
                    })}
                </div>
            </div>
        )
    }
}