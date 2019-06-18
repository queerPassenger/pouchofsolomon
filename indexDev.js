const express = require('express'),
    app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');
    request = require('request');
    getProperties=require('./properties').getProperties;
    bodyParser = require('body-parser');

    /* Webpack Dev Config */
    webpack = require('webpack');
    webpackConfig = require('./webpack.config');
    compiler = webpack(webpackConfig);
    if(process.env.NODE_ENV==='development'){
        app.use(require('webpack-dev-middleware')(compiler, {
            hot: true,
            publicPath: webpackConfig.output.publicPath,
          }));
        app.use(require('webpack-hot-middleware')(compiler));
    }
    /* */
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
    res.send('Error Occured');
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        let profileObj=req.session.passport.user.profile;
        if(profileObj){            
            request.post({
                    url: getProperties('apiUrl')+'/getUserId',
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
        res.sendFile(__dirname+'/ui.html');
    } 
    else
    {   
        res.redirect('/login');
    }
});
app.get('/login',(req,res)=>{
    if ( req.cookies['userId']) {   
        res.sendFile(__dirname+'/ui.html');
    } 
    else{
        res.sendFile(__dirname+'/login.html');
    }
    
})

app.get('/logout', function(req, res){
    let cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/');
});


app.listen(getProperties('port'), () => {
    console.log('Server started at '+ getProperties('port'));
});
