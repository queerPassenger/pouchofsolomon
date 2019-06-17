import React, { Component } from 'react';
import { stringLimiter } from '../../utilities/uiUtilities';

export default class AdvancedFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionClassificationSet: props.transactionClassificationSet,
            transactionTypeSet: props.transactionTypeSet,
            amountTypeSet: props.amountTypeSet,
            filter:props.filter
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(prevState.transactionTypeSet) !== JSON.stringify(nextProps.transactionTypeSet) ||
            JSON.stringify(prevState.amountTypeSet) !== JSON.stringify(nextProps.amountTypeSet) || 
            JSON.stringify(prevState.filter) !== JSON.stringify(nextProps.filter)
        ) {
            return {
                transactionTypeSet: nextProps.transactionTypeSet,
                amountTypeSet: nextProps.amountTypeSet,
                filter:nextProps.filter
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
    getOption(option) {
        if (option.amountSymbol)
            return option.amountSymbol;
        else if (option.transactionTypeName)
            return option.transactionTypeName;
        else
            return option;
    }
    selectedValues(ind, selectedVal, e) {
        e.stopPropagation();
        let { filter } = this.state;
        let locInd = filter[Object.keys(filter)[ind]].indexOf(selectedVal);
        if (locInd === -1) {
            filter[Object.keys(filter)[ind]].push(selectedVal);
        }
        else {
            filter[Object.keys(filter)[ind]].splice(locInd, 1)
        }
        this.props.handleAdvancedFilter(filter);
        
    }
    render() {
        let { state } = this;
        return (
            <div className="multiFilter-container">
                {Object.keys(state.filter).map((filterKey, ind) => {
                    return (
                        <div className="multiSelect" key={"multiSelect"+ind}>
                            <div className="multiSelect-label">{(filterKey.charAt(0).toUpperCase() + filterKey.slice(1)).replace('Set', '').split('action').join('action ')}</div>
                            <div className="multiSelect-selected" onClick={(e) => { toggleOptions(ind, e) }}>
                                <div>
                                    {state.filter[filterKey].length !== 0 ?
                                        <span title={state.filter[filterKey].join(' ,')}>{stringLimiter(state.filter[filterKey].join(','), 15, '...')}</span>
                                        :
                                        'Choose your options'
                                    }
                                </div>
                            </div>
                            <div className="multiSelect-options disp-none" id={"multiSelect-options" + ind}>
                                {state[filterKey].map((option, optionInd) => {
                                    let optionVal = this.getOption(option);
                                    return (
                                        <div key={"multiFilter" + ind + "multiSelect-options" + optionInd} onClick={this.selectedValues.bind(this, ind, optionVal)}>
                                            <div>
                                                <span className={("check " + (state.filter[filterKey].indexOf(optionVal) === -1 ? "" : "selected"))}></span>
                                            </div>
                                            <div>{optionVal}</div>
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