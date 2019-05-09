import React from 'react';
import Record from './content/Record';
import View from './content/View';

export default class Content extends React.Component{
    render(){
        return(
            <div className="content-container">
                {this.props.tabSelected==='Entry'?
                    <Record />
                :
                    null
                }
                {this.props.tabSelected==='View'?
                    <View />
                :
                    null
                }
            </div>
        )
    }
}