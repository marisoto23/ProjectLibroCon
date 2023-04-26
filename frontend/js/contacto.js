"use strict"

const db = firebase.firestore();
const formContacto = document.querySelector("#form");
const coleccionContacto = "Contacto";

const onInsertContacto = (nombre, email, telefono) => {
    db.collection(coleccionContacto).doc().set({
      nombre,
      email,
      telefono,
    });
};

formContacto.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    let nombre = formContacto.txtNombre.value;
    let email = formContacto.txtEmail.value;
    let telefono = formContacto.txtTelefono.value;
  
    try {
        await onInsertContacto(nombre, email, telefono);
        Toastify({
          text: "Datos de contacto enviados correctamente",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
        limpiar();
    } catch (err) {
      console.log("Error Guardar: ", err);
    }
});

function limpiar() {
    formContacto.reset();
}
