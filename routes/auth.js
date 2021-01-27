/*
   Rutas de usuarios / Auth
   host + /api/auth
*/

const { Router } = require('express');
const {check} = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const {validarJWT} = require('../middlewares/validar-jwt');


router.post(
   '/new',
   [
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('email', 'El email es obligatorio').isEmail(),
      check('password', 'El password debe ser de 6 caracteres').isLength({min:6}),
      validarCampos,      
   ],
   crearUsuario
   )

router.post(
   '/',
   [
      check('email', 'The email is obligatory.').isEmail(),
      check('password', 'The password must be 6 characters or more.').isLength({min:6}),
      validarCampos,
   ],
   loginUsuario
   )

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;