


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
    apiUrl:'https://pouchofsolomonapi.herokuapp.com',
    apiPort:null,
    clientID:'724697680271-hcsr4o7jv6s5vfko5toou1ld6tusnouv.apps.googleusercontent.com',
    clientSecret:'TCHe-hkidCkOs5gi9UL5_HIO'
}
module.exports={
    getProperties
};