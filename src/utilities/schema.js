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