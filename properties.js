


function getProperties(prop){
    if(process.env.NODE_ENV==='development')
        return dev[prop];
    else    
        return prod[prop];

}

const dev={
    port:1001,
    apiUrl:'http://localhost:1000',
    apiPort:1000,
    clientID:'94203692968-v8821qla15ijtmv0n2qq39al9vacrgng.apps.googleusercontent.com',
    clientSecret:'T8BYCxeJG7WzvvrwQxuPycPA'
};
const prod={
    port:process.env.PORT,
    apiUrl:process.env.API_URL,
    apiPort:process.env.API_PORT,
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET
}
module.exports={
    getProperties
};