const { response } = require("express")
const Evento = require('../models/Evento');


const getEventos = async(req, res) => {
   const eventos = await Evento.find().populate('user', 'name');
   res.json({
      ok:true,
      eventos,
   })
}

const crearEvento = async(req, res) => {
   
   const evento = new Evento(req.body);

   try {
      evento.user = req.uid;
      const eventoGuardado = await evento.save();
      res.json({
         ok:true,
         evento: eventoGuardado
      })

   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok:false,
         msg: "Something went wrong"
      })
   }

}

//60109a796d8bce43983ae3d9
const actualizarEvento = async (req, res) => {

   const eventoId = req.params.id;

   try {

      const evento = await Evento.findById(eventoId);
      if(!evento){
         return res.status(404).json({
            ok:false,
            msg: 'This event does not exist'
         })
      }

      if(evento.user.toString() !== req.uid){
         return res.status(401).json({
            ok:false,
            msg: "User not authorized to change"
         })
      }

      const nuevoEvento = {
         ...req.body,
         user: req.uid,
      };

      const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new:true})
      
      return res.json({
         ok:true,
         evento:eventoActualizado,
      });

      
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok:false,
         msg: "Something went wrong"
      })
   }
}

//60109ab66d8bce43983ae3da
const eliminarEvento = async(req, res) => {
   const eventoId = req.params.id;

   try {

      const evento = await Evento.findById(eventoId);
      if(!evento){
         return res.status(404).json({
            ok:false,
            msg: 'This event does not exist'
         })
      }

      if(evento.user.toString() !== req.uid){
         return res.status(401).json({
            ok:false,
            msg: "User not authorized to change"
         })
      }

     await Evento.findByIdAndDelete(eventoId);
      
      return res.json({
         ok:true,
         msg: 'Event successfully deleted'
      });

      
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok:false,
         msg: "Something went wrong"
      })
   }
}

module.exports ={
   getEventos, crearEvento, actualizarEvento, eliminarEvento
}