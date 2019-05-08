import React from 'react';
import {apiCall} from '../../utilities/apiCall';

export default class Record extends React.Component{
    constructor(props){
        super(props);
        this.state={
            transactionClassification:{selected:'',options:[]},
            transactionType:{selected:'',options:[]}
        };
        this.handleClassificationChange=this.handleClassificationChange.bind(this);
        this.handleTypeChange=this.handleTypeChange.bind(this)
    }
    componentDidMount(){
        let data={
            apiPath:'/getTransactionTypeList',
            type:'GET',
            query:null
        }
        apiCall(data)
        .then(res=>{
            let transactionClassification={selected:'',options:[]};
            let transactionType={selected:'',options:res.data};
            let flag=false;
            res.data.map(transaction=>{
                if(transactionClassification.options.indexOf(transaction.transactionClassification)===-1){
                    transactionClassification.options.push(transaction.transactionClassification);
                    if(!flag){
                        transactionClassification.selected=transaction.transactionClassification;
                    }
                }
            })
            this.setState({
                transactionClassification,
                transactionType,
            });
          
        })
        .catch(err=>{console.log('err',err)});
    }
    handleClassificationChange(val){
        let transactionClassification=this.state.transactionClassification;
        transactionClassification.selected=val;
        this.setState({
            transactionClassification
        })
    }
    handleTypeChange(val){
        let transactionType=this.state.transactionType;
        transactionType.selected=val;
        this.setState({
            transactionType
        })
    }
    render(){
        let filteredTransaction=this.state.transactionType.options.filter((x)=>{if(x.transactionClassification===this.state.transactionClassification.selected){return x}});
        return(
            <div className="record-container">
                <select onChange={this.handleClassificationChange}>
                    {this.state.transactionClassification.options.map((value,ind)=>{
                        return(
                            <option key={"transactionClassification"+ind} value={value}>{value}</option>
                        )
                    })}
                </select>
                <select onChange={this.handleTypeChange}>
                    {filteredTransaction.map((value,ind)=>{
                        return(
                            <option key={"transactionType"+ind} value={value.transactionTypeId}>{value.transactionType}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}