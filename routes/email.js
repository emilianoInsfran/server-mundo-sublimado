const express=require('express')
const bodyParser=require('body-parser')
const path=require('path')
const nodemailer=require('nodemailer')

const app=express()

app.post('/mailer',(req,res)=>{
  console.log("ENTRO -> 11")
  let testAccount = nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    service: 'gmail',
    port: 993,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'sublimadodelmundo@gmail.com', // generated ethereal user
      pass: 'sublimados123', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from:"sublimadodelmundo@gmail.com", // sender address
    to: "sublimadodelmundo@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `
    <strong>Nombre:</strong> ${req.body.name} <br/>
    <strong>Tell:</strong> ${req.body.tell} <br/>
    <strong>E-mail:</strong> ${req.body.email} <br/>
    <strong>Mensaje:</strong> ${req.body.text}
    `, // html body
  },(error, info) => {
    if (error) {
      res.status(500).json({
        ok:false,
        error,
        message:'No se pudo mandar mensaje, intente mas tarde nuevamente'
      })
    console.log(`${error}`)}
  else {
    console.log(info) 
    res.json({
      ok:true,
      info,
      message:'Mensaje Enviado!'
    })
  }
  });


  /*transporter.sendMail(info, (error, info) => {
    if (error) {
        res.status(500).json({
          ok:false,
          error,
          message:'No se pudo mandar mensaje, intente mas tarde nuevamente'
        })
      console.log(`${error}`)}
    else {
      console.log(info) 
      res.status(500).json({
        ok:true,
        info,
        message:'Mensaje Enviado!'
      })
    }
  })*/
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})


module.exports = app;
  