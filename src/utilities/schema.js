export function schemaGenerator(_schema,_type){
    return JSON.parse(JSON.stringify(schema[_schema][_type]));
}
const apiSchema={
    transaction:{
        createdTimeStamp: '',
        lastUpdatedTimeStamp: '',
        transactionTypeId:'',
        timeStamp:'',
        comment: '',
        amount: '',
        amountTypeId:'',
    }
}
const uiSchema={
    transaction:{
        transactionTypeId:'',
        transactionType:'',
        transactionClassification:'',
        timeStamp:'',
        amount:'',
        amountTypeId:'',
        comment:''
    }
}

const schema={
    uiSchema,apiSchema
}
export const componentSchema = (_component,_obj) => {
    switch(_component){
        case 'Analyse':{
            switch(_obj){
                case 'charts':{
                    return [
                        {
                            id : 'expense_vs_savings',
                            status : 0
                        },
                        {
                            id : 'expense',
                            status : 0
                        },
                        {
                            id : 'savings',
                            status : 0
                        }
                    ];
                }
                case 'periodType':{
                    return {
                        selected: 'daily',
                        options: [
                            {
                                value : 'daily',
                                label : 'Daily'
                            },
                            {
                                value : 'weekly',
                                label : 'Weekly'
                            },
                            {
                                value : 'monthly',
                                label : 'Monthly'
                            },
                            {
                                value : 'yearly',
                                label : 'Yearly'
                            }
                        ]
                    }
                }
                default :
                    return {}
            }
        }
        default :
            return {}
    }
}

