import React from 'react';
import {connect} from 'react-redux';
import Record from './content/Record';
import View from './content/View';
import Analyse from './content/Analyse';
import {apiCall} from '../utilities/apiCall';   

class Content extends React.Component{
    state={
        transactionClassificationSet:['expense','saving'],
        transactionTypeSet:[],
        amountTypeSet:[],
    }
    componentDidMount(){
        this.getTransactionTypeList();
        this.getamountTypeSet();
    }
    getTransactionTypeList(){
        let data={
            apiPath:'/getTransactionTypeList',
            type:'GET',
            query:null
        }
        this.props.updateLoading(null,'enableLoading');
        apiCall(data)
        .then(res=>{
            if(res.status){
                this.props.updateLoading(null,'disableLoading');
                let transactionTypeSet =[];
                res.data.map(transaction=>{
                   transactionTypeSet.push(transaction);
                });          
                this.setState({
                    transactionTypeSet
                });
            }
        })
        .catch(err=>{
            this.props.updateLoading(null,'disableLoading');
            console.log('err',err)
        });
    }
    getamountTypeSet(){
        let data={
            apiPath:'/getAmountTypeList',
            type:'GET',
            query:null
        }
        this.props.updateLoading(null,'enableLoading');
        apiCall(data)
        .then(res=>{
            if(res.status){
                this.props.updateLoading(null,'disableLoading');
                let {amountTypeSet} =this.state;
                res.data.map((amount)=>{
                    amountTypeSet.push(amount);
                })
                this.setState({
                    amountTypeSet
                });
            }
        })
        .catch(err=>{
            this.props.updateLoading(null,'disableLoading');
            console.log('err',err)
        });
    }
    handleLoading(flag){
        if(flag)
            this.props.updateLoading(null,'enableLoading');
        else    
            this.props.updateLoading(null,'disableLoading');
    }
    
    render(){
        return(
            <div className="content-container">
                {this.props.tabSelected==='Entry'?
                    <Record 
                        transactionClassificationSet={this.state.transactionClassificationSet}
                        transactionTypeSet={this.state.transactionTypeSet}
                        getTransactionTypeList={this.getTransactionTypeList.bind(this)}                        
                        amountTypeSet={this.state.amountTypeSet}
                        handleLoading={this.handleLoading.bind(this)}
                        toEditSet={this.props.toEditSet}
                        onTabClick={this.props.onTabClick} 
                    />
                :
                    null
                }
                {this.props.tabSelected==='View'?
                    <View 
                        transactionClassificationSet={this.state.transactionClassificationSet}
                        transactionTypeSet={this.state.transactionTypeSet}
                        amountTypeSet={this.state.amountTypeSet}
                        handleLoading={this.handleLoading.bind(this)}
                        edit={this.props.edit}
                    />
                :
                    null
                }
                {this.props.tabSelected==='Analyse'?
                    <Analyse 
                        transactionClassificationSet={this.state.transactionClassificationSet}
                        transactionTypeSet={this.state.transactionTypeSet}
                        amountTypeSet={this.state.amountTypeSet}
                        handleLoading={this.handleLoading.bind(this)}
                        edit={this.props.edit}
                    />
                :
                    null
                }
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
      updateLoading : (val,type) => dispatch({
      val,
      type
    }),
    }
  }
  export default connect(null,mapDispatchToProps)(Content);