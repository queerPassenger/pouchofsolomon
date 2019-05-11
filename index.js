const express = require('express'),
    app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');
    request = require('request');
    properties=require('./properties');
    bodyParser = require('body-parser');
    
auth(passport);
app.use(passport.initialize());

app.use(cookieSession({
    name: 'session',
    keys: ['SECRECT KEY'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(__dirname+'/build')); 

require('./controller')(app);

app.get('/error',(req,res)=>{
    console.log('Route Hit /error');
    res.send('Error Occured');
})

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log('Route Hit /auth/google/callback');
        let profileObj=req.session.passport.user.profile;
        if(profileObj){            
            request.post({
                    url: properties.apiUrl+'/getUserId',
                    body: profileObj,
                    json: true
                }, 
                (error, response, body)=>{
                    if(!error){
                        if(body && body.status){
                            if(body.msg){
                                res.cookie('userId', body.msg, {httpOnly: true });
                                res.redirect('/');
                            }
                        }
                        else{   
                            res.redirect('/error');
                        }
                    }
                    else{
                        res.redirect('/error');
                    }
                            
                });
        }
        else{
            res.redirect('/error');
        }
    }
);

app.get('/', (req, res) => {  
    if ( req.cookies['userId']) {   
        console.log('req.cookies["userId"]',req.cookies["userId"]);      
        res.sendFile(__dirname+'/build/'+'ui.html');
    } 
    else
    {   
        res.redirect('/auth/google');
    }
});

app.get('/logout', function(req, res){
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/');
});





let port =process.env.PORT || 3000 ;
app.listen(port, () => {
    console.log('Server is running on port'+port);
});
