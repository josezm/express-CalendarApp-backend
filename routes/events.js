/*
   Rutas de usuarios / Auth
   host + /api/events
*/

const { Router } = require('express');
const {check} = require('express-validator');
const { getEventos, crearEvento,actualizarEvento,eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();
router.use(validarJWT);

router.get('/', getEventos);

router.post(
   '/',
   [
      check('title', 'The title is obligatory.').not().isEmpty(),
      check('start', 'The start date is obligatory.').custom(isDate),
      check('end', 'The end date is obligatory.').custom(isDate),
      validarCampos
   ],
   crearEvento);

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);


module.exports = router;