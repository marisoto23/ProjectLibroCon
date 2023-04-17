"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const formUsuario = document.querySelector("#form");
const coleccionUsuario = "Usuario";
var editStatus = false;

/* 3. METODOS CRUD NECESARIO */
const onInsertUsuario = (nombre, username, telefono, email, password) => {
    db.collection(coleccionUsuario).doc().set({
      nombre,
      username,
      telefono,
      email,
      password,
    });
  };
 const onFindAllUsuario = (callback) =>
  db.collection(coleccionUsuario).onSnapshot(callback);


/* 4. USO METODO INSERTAR */
formUsuario.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    //CARGAR EN VARIABLES LO QUE DA EL formEstudiante
    let nombre = formUsuario.txtNombre.value;
    let username = formUsuario.txtUsuario.value;
    let telefono = formUsuario.txtTelefono.value;
    let email = formUsuario.txtEmail.value;
    let password = formUsuario.txtPassword.value;
  
    try {
      if (!editStatus) {
        await onInsertUsuario(nombre, username, telefono, email, password);
        Toastify({
          text: "Usuario creado correctamente",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
        limpiar();
      } 
    } catch (err) {
      console.log("Error Guardar: ", err);
    }
  });
  
  function limpiar() {
    formUsuario.reset();
  }
  