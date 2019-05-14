

const request = require('request');
const getProperties=require('./properties').getProperties;
module.exports=(app)=>{
    app.post('/api',function(req,res){
       let reqBody=req.body;
       if(reqBody.type==='GET'){
            request(getProperties('apiUrl')+reqBody.apiPath+'?id='+req.cookies['userId'], 
                function (error, response, body) {
                    if(!error){         
                        try{               
                            let responseBody=JSON.parse(body);
                            if(responseBody.status){
                                res.send({status:true,data:responseBody.data});                        
                            }
                            else{                           
                                res.send({status:false,msg:'Something went wrong'});
                            }
                        }
                        catch(err){
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
                url: getProperties('apiUrl')+reqBody.apiPath+'?id='+req.cookies['userId'],
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
