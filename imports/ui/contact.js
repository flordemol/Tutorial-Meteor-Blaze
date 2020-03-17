//No sé qué debo importar y si hay algo de más

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './contact.html';


Template.tarjetaContacto.events({
  
    'click .delete'() {
    Meteor.call('tasks.remove', this._id);

  },
});
  