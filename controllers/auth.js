const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const {generarJWT} = require('../helpers/jwt');


// /new
const crearUsuario = async (req, res) =>{

   const {email,password} = req.body;   

   try {

      let usuario = await Usuario.findOne({email});
      if(usuario){
         return res.status(400).json({
            ok:false,
            msg: "This user already exist"
         })
      }

      usuario = new Usuario( req.body);

      //encriptar contraseña
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);
      
      const token = await generarJWT(usuario.id, usuario.name);

      await usuario.save();
      
      
      return res.status(201).json({
         ok:true,
         uid: usuario.id,
         name: usuario.name,
         token,
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         ok:false,
         msg: "Something went wrong"
      })
   }

}


// /
const loginUsuario = async (req, res) =>{

   const {email,password} = req.body;

   try {

      const usuario = await Usuario.findOne({email});

      if(!usuario){
         return res.status(400).json({
            ok:false,
            msg: "This user does not exist"
         })
      }
      
      //confirmar contraseñas

      const validPassword = bcrypt.compareSync(password, usuario.password);

      if(!validPassword){
         return res.status(400).json({
            ok:false,
            msg: 'Incorrect password',
         });
      }

      const token = await generarJWT(usuario.id, usuario.name);

      return res.status(200).json({
         ok:true,
         uid: usuario.id,
         name: usuario.name,
         token,

      })


   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok:false,
         msg: "Something went wrong"
      })
   }

}

// /renew

const revalidarToken = async (req, res) =>{

   const uid = req.uid;
   const name = req.name;

   const token = await generarJWT(uid, name);


   res.json({
      ok:true,
      uid,
      name,
      token,
   })
}




module.exports = {
   crearUsuario,
   loginUsuario,
   revalidarToken,
}