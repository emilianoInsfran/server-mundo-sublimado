const express=require('express')
const bodyParser=require('body-parser')
const path=require('path')
const nodemailer=require('nodemailer')

const app=express()


app.post('/mailer',(req,res)=>{
    console.log("ENTRO EN EL EMAIL");
    let transporter = nodemailer.createTransport({
      service: 'outlook',
      //configurar el email de la entidad que manda el mail, user y pass
      auth: {
        user: 'sublimadodelmundo@gmail.com',
        pass: 'sublimados123'
      }, 
      tls: {
        rejectUnauthorized: false
      } 
    })
  //cambia los datos emi
    let mailoptions = {
        //aca el email de sublimados
      from: 'sublimadodelmundo@gmail.com',
      //el email a donde queres que llegue
      to: 'sublimadodelmundo@gmail.com',
      subject: 'sublimadodelmundo@gmail.com',
      html: `
      <strong>Nombre:</strong> ${req.body.name} <br/>
      <strong>Tell:</strong> ${req.body.tell} <br/>
      <strong>E-mail:</strong> ${req.body.email} <br/>
      <strong>Mensaje:</strong> ${req.body.text}
      `
    }
  
    transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
            console.log(`${error}`);
             res.json({
                ok:false,
                message:'No se pudo mandar el email',
                error
            })
        }
        else {
          console.log(info);
          res.json({
            ok:true,
            message:'Se mando el email correctamente',
            info
        })
          
        }
      })
    })


module.exports = app;
  