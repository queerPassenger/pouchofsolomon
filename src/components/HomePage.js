import React from 'react';
import Content from './Content.js';

class HomePage extends React.Component {   
    componentDidMount(){
        this.props.onTabShow(true);
    } 
    uiBuild(){
        console.log(this.props);
        return(
            <>
               <Content 
                    tabSelected={this.props.tabSelected} 
                    toEditSet={this.props.toEditSet} 
                    edit={()=>{this.props.edit()}} 
                    onTabClick={()=>{this.props.onTabClick()}} 
                />
            </>
        )
    }
    render() {
       return this.uiBuild();
    }
}

export default HomePage;