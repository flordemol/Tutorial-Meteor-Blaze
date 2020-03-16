import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
 
import './task.js';
import './body.html';
import './contact.js'; //sacar
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
	  const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
   incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },    
});

Template.body.events({
  'submit .new-task'(event) {
    // Evitar el envío predeterminado del formulario del navegador
    event.preventDefault();
       
    // Obtener valor del elemento de formulario - Creo objeto "usuario"
    // "event.target" para obtener el elemento que desencadenó un evento específico
    const target = event.target;
    const usuario = {
      nombre: target.nombre.value,
      apellido: target.apellido.value,
      dni: target.dni.value,
      fechaNac: target.fechaNac.value,
      telefono: target.telefono.value,
      sexo: target.sexo.value,
    };
   

    //imprime por consola el objeto "usuario"
    console.log(usuario)

    Meteor.call('tasks.insert', usuario);

    /*console.log(target.apellido.value)
    console.log(target.dni.value)
    console.log(target.fechaNac.value)
    console.log(target.telefono.value)*/
    
   
    /*let textArray = [];
    let i=0;
    while (target["text"+i] && target["text"+i].value !== ""){
      textArray.push(target["text"+i].value);
      target["text"+i].value = "";
      i += 1;
    }
    while (target["text"+i]){
      if(target["text"+i].value !== ""){
        textArray.push(target["text"+i].value);
        target["text"+i].value = "";
      }
      i += 1;
    }
    
    _.each(textArray, function(element){
      Meteor.call('tasks.insert', element);
    });*/

  },
  
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
