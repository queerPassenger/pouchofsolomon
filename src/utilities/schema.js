export function schemaGenerator(_schema,_type){
    return JSON.parse(JSON.stringify(schema[_schema][_type]));
}
const apiSchema={
    transaction:{
        createdTimeStamp: null,
        lastUpdatedTimeStamp: null,
        transactionTypeId:null,
        timeStamp:null,
        comment: '',
        amount: null,
        amountTypeId:null,
    }
}
const uiSchema={
    transaction:{
        transactionTypeId:'',
        transactionClassification:'',
        timeStamp:null,
        amount:null,
        amountTypeId:null,
        comment:''
    }
}

const schema={
    uiSchema,apiSchema
}