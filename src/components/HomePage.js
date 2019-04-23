import React from 'react';
import Header from './Header.js';
import Content from './Content.js';
import Footer from './Footer.js';

export default class HomePage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <Header />
                <Content />
                <Footer />
            </>
        )
    }
}
