import React, { Component } from 'react';

export default class AdvancedFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionClassificationSet: props.transactionClassificationSet,
            transactionTypeSet: props.transactionTypeSet,
            amountTypeSet: props.amountTypeSet,
            filter: {
                'transactionClassificationSet': [],
                'transactionTypeSet': [],
                'amountTypeSet': []
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(prevState.transactionTypeSet) !== JSON.stringify(nextProps.transactionTypeSet) ||
            JSON.stringify(prevState.amountTypeSet) !== JSON.stringify(nextProps.amountTypeSet)
        ) {
            return {
                transactionTypeSet: nextProps.transactionTypeSet,
                amountTypeSet: nextProps.amountTypeSet
            }
        }
        // Return null to indicate no change to state.
        return null;
    }

    handleAdvancedFilterChange(ind, e) {
        let advancedFilterObj = this.state.advancedFilterObj;
        advancedFilterObj[ind]['type'] = e.target.value;
        this.setState({
            advancedFilterObj
        })
    }
    getOption(option){
        if(option.amountSymbol)
            return option.amountSymbol;
        else if(option.transactionTypeName)
            return option.transactionTypeName;
        else 
            return option;
    }
    render() {
        let {state}=this;
        return (
            <div className="multiFilter-container">
                {Object.keys(state.filter).map((filterKey, ind) => {
                    console.log(state[filterKey],filterKey);
                    return (
                        <div className="multiSelect">
                            <div className="multiSelect-label">{(filterKey.charAt(0).toUpperCase() + filterKey.slice(1)).replace('Set','')}</div>
                            <div className="multiSelect-selected" onClick={(e) => { toggleOptions(ind, e) }}>
                                <div>
                                    {state.filter[filterKey].length !== 0 ?
                                        state.filter[filterKey].join(',')
                                        :
                                        'Choose your options'
                                    }
                                </div>
                            </div>
                            <div className="multiSelect-options disp-none" id={"multiSelect-options" + ind}>
                                {state[filterKey].map((option, optionInd) => {
                                    return (
                                        <div key={"multiFilter" + ind + "multiSelect-options" + optionInd} >
                                            <div>
                                                <span className="check"></span>
                                            </div>
                                            <div>{this.getOption(option)}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}               
            </div>
    
        )
    }
}
    
export function toggleOptions(ind, e) {
                    e.stopPropagation();
                let elements = document.getElementsByClassName('multiSelect-options');
    for (let i = 0; i < elements.length; i++) {
        if (i === ind) {
                    elements[i].classList.toggle('disp-none');
                }
        else {
                    elements[i].className = 'multiSelect-options disp-none';
                }
        
            }
}