process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV   || 'dev';

let urlDB ;

console.log("NODE_ENV",process.env.NODE_ENV);

if(process.env.NODE_ENV == 'dev'){
  urlDB = 'mongodb://localhost:27017/elmundodelsublimado';
  //urlDB = ' mongodb+srv://sublimado:lanus2020@cluster0.smckm.mongodb.net/elmundodelsublimado';
}else{
  urlDB = ' mongodb+srv://sublimado:lanus2020@cluster0.smckm.mongodb.net/elmundodelsublimado';
 // mongodb+srv://<username>:<password>@cluster0.smckm.mongodb.net/<dbname>?retryWrites=true&w=majority mongodb+srv://sublimado:<password>@cluster0.smckm.mongodb.net/test
}


process.env.URLDB = urlDB;