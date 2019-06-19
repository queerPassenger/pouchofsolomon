import {popUp} from '../reducers/initialState';

export const tabs=['Entry', 'View', 'Analyse'];
export const accountInfo=[
    {
        key:'firstName',
        label:'First Name',
        placeholder:'How does everyone call you?',
        value:'',
        type:'input'
    },
    {
        key:'lastName',
        label:'Last Name',
        placeholder:'"Last but not least" part of you name',
        value:'',
        type:'input'
    },
    {
        key:'gender',
        label:'Gender',
        placeholder:'Waiting to know',
        value:'',
        options:['Male','Female','Trans'],
        type:'select'
    },
    {
        key:'age',
        placeholder:'Secret is safe with us',
        label:'Age',
        value:'',
        type:'input'
    },
    {
        key:'emailId',
        label:'Email Id',
        placeholder:'Just incase you want a change',
        value:'',
        type:'input'
    },
    {
        key:'phoneNumber',
        label:'Ph no',
        placeholder:'Let see whether it is catchy',
        value:'',
        type:'input'
    },
    {
        key:'sendReport',
        label:'Mail me the Report',
        placeholder:'Lets have a proof',
        value:'',
        options:['Never','Daily','Weekly','Monthly','Annualy'],
        type:'select'
    },
];
export const settingOptions=[
    {label:'My Account',onClickHandler:'navigateToAccount'},
    {label:'Log out',onClickHandler:'logout'}
];
export const getPopUpObj=(type,params)=>{
    switch(type){
        case 'warning/error':
            return {
                show:true,
                header:{
                    text:['Attention!']
                },
                body:{
                    text:params.text
                },
                footer:{
                    text:[],
                    button:{
                        name:['Ok'],
                        onClickHandlers:[params.onClickHandler],
                    }
                }
            }
            break;
        case 'success':
                return {
                    show:true,
                    header:{
                        text:['Success!']
                    },
                    body:{
                        text:params.text
                    },
                    footer:{
                        text:[],
                        button:{
                            name:['Ok'],
                            onClickHandlers:[params.onClickHandler],
                        }
                    }
                }
                break;
        default :
            return popUp;
            break;
    }
}

