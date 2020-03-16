import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // Este código solo se ejecuta en el servidor
   // Solo publique tareas que sean públicas o pertenezcan al usuario actual
  Meteor.publish('tasks', function tasksPublication() {
   return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}
 
Meteor.methods({
  'tasks.insert'(userData) {
    //check(text, String);
 
    // Asegura que hay un usuario logueado para poder insertar tarea
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    // Nuevo bjeto con valores por defecto al enviar formulario
    const defaultValue = {
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    }

    console.log(Object.assign(userData, defaultValue))
    Tasks.insert(Object.assign(userData, defaultValue));
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
   const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
	
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
   const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
	
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});