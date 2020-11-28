const express = require("express");
const app = express();
const bodyParser = require("body-parser");


const expressSession=require('express-session');
const SessionStore=require('connect-session-sequelize')(expressSession.Store);
const csrf=require('csurf');  
const flash=require('connect-flash');
const db=require('./models/index');




const store=new SessionStore({
  db:db.sequelize
});
const path = require("path");
const userRouter=require('./Routes/User')
const adminRouter=require('./Routes/Admin');
const authRouter=require('./Routes/Auth')
const errorRouter=require('./Routes/Errors');

const models=require('./models/index')



app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "Public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(expressSession({
store,
secret:'this is a secret',
resave:false,
saveUninitialized:false
})
)

app.use(csrf());
app.use(flash());

app.use((req,res,next)=>{
  res.locals.isAuth=req.session.userId;
  res.locals.csrfToken=req.csrfToken();
  next();
  })

app.use((req, res, next) => {
 
  if(!req.session.userId){
    return next()
  }
  models.User.findByPk(req.session.userId)
      .then((user) => {
        if(!user){
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        const error=new Error(err);
        next(error);
      });
});



app.use(userRouter);
app.use(authRouter);
app.use('/Admin',adminRouter);


app.use(errorRouter.get404);

app.use((error,req,res,next)=>{

console.log(error);
res.render('./ErrorsPages/500');

});






(async function(){
try{
  await db.sequelize.authenticate();
  console.log('conected');
  await db.sequelize.sync();
  app.listen(process.env.PORT || 5000);

}catch(err){
  console.log(err);
  
}

})();



