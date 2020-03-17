//No sé qué debo importar y si hay algo de más

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './contact.html';


Template.tarjetaContacto.events({
  
    'click .delete'() {
    Meteor.call('tasks.remove', this._id);

  },
});
  
Template.tarjetaContacto.helpers({
  txtAvatar(sexo) {
      
    if(sexo === "Mujer"){
      return txtAvatar ="img/img_avatarM.png";
    } else {
     return txtAvatar ="img/img_avatarH.png";
    } 
  },
  
});