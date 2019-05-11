

const request = require('request');
const properties=require('./properties');
module.exports=(app)=>{
    app.post('/api',function(req,res){
       let reqBody=req.body;
       if(reqBody.type==='GET'){
            request(properties.apiUrl+reqBody.apiPath+'?id='+req.cookies['userId'], 
                function (error, response, body) {
                    if(!error){
                        let responseBody=JSON.parse(body);
                        if(responseBody.status){
                            res.send({status:true,data:responseBody.data});                        
                        }
                        else{   
                            res.send({status:false,msg:'Something went wrong'});
                        }
                    }
                    else{
                        res.send({status:false,msg:'Something went wrong'});
                    }
                }
            );
       }
       else if(reqBody.type==='POST'){
            request.post({
                url: properties.apiUrl+reqBody.apiPath+'?id='+req.cookies['userId'],
                body: reqBody.payload,
                json: true
            }, 
            (error, response, body)=>{
                if(!error){
                    let responseBody=body;                    
                    if(responseBody.status){
                        res.send(body);                        
                    }
                    else{   
                        res.send({status:false,msg:'Something went wrong'});
                    }
                }
                else{
                    res.send({status:false,msg:'Something went wrong'});
                }       
            });
       }
    })
};
