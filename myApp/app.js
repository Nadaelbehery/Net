var express = require('express');
var path = require('path');
var fs = require('fs');
const e = require('express');
const { ConnectionClosedEvent } = require('mongodb');
const { Console } = require('console');
var app = express();
const PORT = process.env.PORT || 3000;
var session = require('express-session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('trust proxy', 1) 


const cities=["Annapurna","Bali","Paris","Rome","Santorini","Inca"];
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

 var MongoClient = require('mongodb').MongoClient;

 MongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){
   if(err) throw err;
   var db=client.db("myDB");
  //db.collection('myCollection').insertOne({username:"jana",password:"jana",list:["Bali","Inca"]});
   
   //WEBSITE FEATURES
app.get('/login',function(req,res){
  res.render('login',{message1:"",message2:""});
}); 
app.get('/',function(req,res){
  res.render('login',{message1:"",message2:""});
}); 



app.post('/',function(req,res){
 
  var x=req.body.username;
  var y=req.body.password;
  
  
  db.collection('myCollection').find({}).toArray(function(err,result){
    if(err) throw err;
    var flag=false;
    for(let i=0; i<result.length && flag==false;i++){
    if(x==result[i].username ){
      flag=true;
     if(y!==result[i].password ){
        res.render('login',{message1:"",message2:"INCORRECT PASSWORD"});
     }else{
      req.session.user=x;
      req.session.save();
      
      res.render('home');
     }
     break;
     }
    } 
    if(flag==false){
      if(x=="admin" && y=="admin"){
        req.session.user=x;
        req.session.save();
       
        res.render('home');
      }else{
        res.render('login',{message1:"INVALID USERNAME ",message2:""});
      }
     }


   });
});
app.post('/login',function(req,res){
 
  var x=req.body.username;
  var y=req.body.password;
  db.collection('myCollection').find({}).toArray(function(err,result){
    if(err) throw err;
    var flag=false;
    for(let i=0; i<result.length && flag==false;i++){
    if(x==result[i].username  ){
      flag=true;
     if(y!==result[i].password ){
        res.render('login',{message1:"",message2:"INCORRECT PASSWORD"});
     }else{
      req.session.user=x;
      req.session.save();
      
      res.render('home');
     }
     break;
     }
    } 
    if(flag==false){
      
      if(x=="admin" && y=="admin"){
        req.session.user=x;
        req.session.save();
        res.render('home');
      }else{
        res.render('login',{message1:"INVALID USERNAME ",message2:""});
      }
     }


   });
});

app.post('/register',function(req,res){
  var x=req.body.username;
  var y=req.body.password;
   db.collection('myCollection').find({}).toArray(function(err,result){
    if(err) throw err;
    var flag=false;
    for(let i=0; i<result.length && flag==false;i++){
    if(x==result[i].username ){
  
        res.render('registration',{message:"This user is already registered"});
      
        flag=true;
       
    }
    
    
  }
  if (flag==false){
    db.collection('myCollection').insertOne({username:x,password:y,list:[]});
    res.render('registration',{message:"Registration Successful"});
  }
  
   
  
   });
});



app.get('/registration',function(req,res){
  res.render('registration',{message:""});
});

app.get('/searchresults',function(req,res){
  if(req.session.user!=null){
  res.render('searchresults',{PARIS:'',ANNAPURNA:'',ROME:'',INCA:'',SANTORINI:'',
    BALI:'',Found:''});
  }else{
    res.status(400).json({
        message: "Please login",
        
        });
  }

});

app.get('/wanttogo',function(req,res){
  if(req.session.user!=null){
  db.collection('myCollection').find({}).toArray(function(err,result){
    if(err) throw err;
    //console.log(req.session.user);
    var x=req.session.user;
    
    for(let i=0; i<result.length ;i++){
      if(x==result[i].username ){
        const countries=result[i].list;
        var xPARIS='';
        var xBALI='';
        var xROME ='';
        var xSANTORINI='';
        var xINCA='';
        var xANNAPURNA='';
        var xFound="";
        for(let j=0;j<countries.length;j++){
          switch(countries[j]){
            case "Paris":xPARIS="Paris";break;
            case "Annapurna":xANNAPURNA="Annapurna";break;
            case "Rome":xROME="Rome";break;
            case "Inca":xINCA="Inca";break;
            case "Santorini":xSANTORINI="Santorini";break;
            case "Bali":xBALI="Bali";break;
            default:console.log("NOT FOUND");
      
          }
       }
       res.render('wanttogo',{PARIS:xPARIS,ANNAPURNA:xANNAPURNA,ROME:xROME,INCA:xINCA,SANTORINI:xSANTORINI,
        BALI:xBALI,Found:xFound});

break;



      }
    }
  
  });}
  else{
    res.status(400).json(
      "Please  login");
  }

 
});
app.post('/annapurna',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
    var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        var wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Annapurna"]}});
          res.render('annapurna',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Annapurna"==wantto[j]){
            flag=true;
            res.render('annapurna',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
          wantto.push("Annapurna");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          res.render('annapurna',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});
app.post('/bali',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
    var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        var wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Bali"]}});
          res.render('bali',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Bali"==wantto[j]){
            flag=true;
            res.render('bali',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
          wantto.push("Bali");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          res.render('bali',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});
app.post('/inca',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
     var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        var wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Inca"]}});
          res.render('inca',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Inca"==wantto[j]){
            flag=true;
            res.render('inca',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
          wantto.push("Inca");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          res.render('inca',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});
app.post('/rome',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
    var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        var wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Rome"]}});
          res.render('rome',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Rome"==wantto[j]){
            flag=true;
            
            res.render('rome',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
        
        wantto.push("Rome");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          
          res.render('rome',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});
app.post('/santorini',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
    var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        var wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Santorini"]}});
          res.render('santorini',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Santorini"==wantto[j]){
            flag=true;
            res.render('santorini',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
          wantto.push("Santorini");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          res.render('santorini',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});
app.post('/paris',function(req,res){
  db.collection("myCollection").find({}).toArray(function(err,result){
    if(err) throw err;
    var x=req.session.user;
    for(let i=0;i<result.length;i++){
      if(x==result[i].username){
        const wantto=result[i].list;
         if(wantto.length==0){
          db.collection("myCollection").updateOne({username:x},{$set:{list:["Paris"]}});
          res.render('paris',{message:"Added to list"});
         }else{
          var flag=false;
         for(let j=0;j<wantto.length && flag==false ;j++){
          if("Paris"==wantto[j]){
            flag=true;
            res.render('paris',{message:"Already added to list"});
            
            }
        }
        if(flag==false){
          wantto.push("Paris");
          
          db.collection("myCollection").updateOne({username:x},{$set:{list:wantto}});
          res.render('paris',{message:"Added to list"});
         
        }
         }  
    }
  } 
  });
});





//HOME PAGE
app.get('/home',function(req,res){
  if(req.session.user!=null){
  res.render('home');}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/hiking',function(req,res){
  if(req.session.user!=null){
  res.render('hiking');}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/cities',function(req,res){
  if(req.session.user!=null){
  res.render('cities');}
  else{
    res.status(400).json(
      "Please  login");
  }
}); 
app.get('/islands',function(req,res){
  if(req.session.user!=null){
  res.render('islands');}
  else{
    res.status(400).json(
      "Please  login");
  }
});

// CITIES
app.get('/annapurna',function(req,res){
  if(req.session.user!=null){
  res.render('annapurna',{message:""});}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/bali',function(req,res){
  if(req.session.user!=null){
  res.render('bali',{message:""});}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/inca',function(req,res){
  if(req.session.user!=null){
  res.render('inca',{message:""});}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/paris',function(req,res){
  if(req.session.user!=null){
  res.render('paris',{message:""});}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/rome',function(req,res){
  if(req.session.user!=null){
  res.render('rome',{message:""});}
  else{
    res.status(400).json(
      "Please  login");
  }
});
app.get('/santorini',function(req,res){
  if(req.session.user!=null){
  res.render('santorini',{message:""});}else{
    res.status(400).json(
      "Please  login");
  }
});
app.post('/search',function(req,res){
var x=req.body.Search;

  var NewResult=new Array();
  for(let i=0; i<cities.length;i++){
   const s=cities[i];
   if(x!==''){
   if(s.toLowerCase().includes(x.toLowerCase())){
   
    NewResult.push(s);
   }}
  }
 var xPARIS='';
 var xBALI='';
 var xROME ='';
 var xSANTORINI='';
 var xINCA='';
 var xANNAPURNA='';
 var xFound="";
 if(NewResult.length==0)
 xFound="NotFound"
 for(let i=0;i<NewResult.length;i++){
    switch(NewResult[i]){
      case "Paris":xPARIS="Paris";break;
      case "Annapurna":xANNAPURNA="Annapurna";break;
      case "Rome":xROME="Rome";break;
      case "Inca":xINCA="Inca";break;
      case "Santorini":xSANTORINI="Santorini";break;
      case "Bali":xBALI="Bali";break;
      default:console.log("NOT FOUND");

    }
 }

  res.render('searchresults',{PARIS:xPARIS,ANNAPURNA:xANNAPURNA,ROME:xROME,INCA:xINCA,SANTORINI:xSANTORINI,
    BALI:xBALI,Found:xFound});
});



});
