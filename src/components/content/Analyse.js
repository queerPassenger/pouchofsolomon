import React,{Component} from 'react';
import UnderConstruction from '../../images/underConstruction.png';

export default class Analyse extends Component{
    render(){
        if(true)
            return(
                <div className="analyse-container">
                    <img src={UnderConstruction}></img>
                </div>
            )
        else
            return(
                <div className="analyse-container">
                    NEW
                </div>
            )
    }
}