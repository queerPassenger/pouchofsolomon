import React from 'react';

const ChartComponent = (props) => {
    return(
        <div className='chart-wrapper'>
            <div className='chart-left-icon' onClick={()=>{props.handleStatus('left',props.ind)}}>
                <span>{String.fromCharCode(8666)}</span>
            </div>
            <div className='chart' id={props.id}></div>
            <div className='chart-right-icon'onClick={()=>{props.handleStatus('right',props.ind)}}>
                <span>{String.fromCharCode(8667)}</span>
            </div>
        </div>
    )
}
export default ChartComponent;