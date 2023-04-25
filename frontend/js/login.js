"use strict";

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const formUsuario = document.querySelector("#form");
const coleccionUsuario = "Usuario";

/* 3. METODOS CRUD NECESARIO */
const findAll = () => db.collection(coleccionUsuario).get();

const findById = (paramId) =>
  db.collection(coleccionUsuario).doc(paramId).get();

const onFindAll = (callback) =>
  db.collection(coleccionUsuario).onSnapshot(callback);

/* 4. FUNCION LOGIN */
function Login() {
  //Variables HTML
  var usuario = document.getElementById("txtUsuario").value;
  var contrasenia = document.getElementById("txtPassword").value;

  onFindAll((query) => {
    query.forEach((doc) => {
      //Variables DB
      console.log(doc.data().username)
      var usuarioDB = doc.data().username;
      var contraseniaDB = doc.data().password;
      //Validacion Login
      if ((usuario != "") & (contrasenia != "")) {
        if ((usuarioDB === usuario) & (contraseniaDB === contrasenia)) {
          console.log(doc.data().username);
          window.location.replace(
            "http://127.0.0.1:5500/frontend/html/chat.html"
          );
        }
        //Para hacer config de Admin
        else if ((usuario === "admin") & (contrasenia === "123")) {
          window.location.replace(
            "http://127.0.0.1:5500/frontend/html/admin.html"
          );
        }
        /*else{
            Toastify({
                text: "Datos incorrectos",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
              }).showToast();
        }*/
      }
      /*else{
        Toastify({
            text: "Falta de datos",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            duration: 3000,
          }).showToast();
      }*/
    });
  });
}
