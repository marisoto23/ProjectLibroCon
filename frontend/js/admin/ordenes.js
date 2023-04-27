"use strict";

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const form = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");

const coleccionOrden = "Ordenes";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */

const findAll = () => db.collection(coleccionOrden).get();

const findById = (paramId) => db.collection(coleccionOrden).doc(paramId).get();

const onFindAll = (callback) =>
  db.collection(coleccionOrden).onSnapshot(callback);

const onDelete = (paramId) =>
  db.collection(coleccionOrden).doc(paramId).delete();

const onUpdate = (paramId, newOrdenes) =>
  db.collection(coleccionOrden).doc(paramId).update(newOrdenes);

/* 4. USO METODOS */
window.addEventListener("load", async () => {
  //al cargar la pagina
  onFindAll((query) => {
    //carga todo lo que hay en la db
    contenedor.innerHTML = "";
    //console.log(query)
    query.forEach((doc) => {
      //console.log(doc.data())
      let dato = doc.data();

      contenedor.innerHTML += `
                                    <tr>
                                        <td>${dato.usuario}</td>
                                        <td>${dato.telefono}</td>
                                        <td>${dato.entrega}</td>
                                        <td>${dato.libro}</td>
                                        <td>${dato.total}</td>
                                        <td>
                                            <button class="btn btn-warning btn-editar" data-id="${doc.id}">Editar</button>
                                        </td>
                                        <td>
                                        <button class="btn btn-danger btn-borrar" data-id="${doc.id}">Borrar</button>
                                        </td>
                                    </tr>
                                    `;
    });
    const btnBorrar = document.querySelectorAll(".btn-borrar");
    btnBorrar.forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        //console.log(ev)
        if (confirm("Desea borrar el registro?")) {
          await onDelete(ev.target.dataset.id);
          Toastify({
            text: "Orden borrada correctamente",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            duration: 3000,
          }).showToast();
        }
      });
    });

    const btnEditar = document.querySelectorAll(".btn-editar");
    btnEditar.forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        //console.log(ev)
        try {
          const docSeleccionado = await findById(ev.target.dataset.id);
          const OrdenesSeleccionada = docSeleccionado.data();

          form.txtUsuario.value = OrdenesSeleccionada.usuario;
          form.txtTelefono.value = OrdenesSeleccionada.telefono;
          form.txtEntrega.value = OrdenesSeleccionada.entrega;
          form.txtLibro.value = OrdenesSeleccionada.libro;
          form.txtTotal.value = OrdenesSeleccionada.total;
          form.btnGuardar.innerText = "Modificar";

          editStatus = true;
          idSeleccionado = docSeleccionado.id;
        } catch (err) {
          console.log("Error: ", err);
        }
      });
    });
  });
});

/* Editar */
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  //CARGAR EN VARIABLES LO QUE DA EL FORM
  let usuario = form.txtUsuario.value;
  let telefono = form.txtTelefono.value;
  let entrega = form.txtEntrega.value;
  let libro = form.txtLibro.value;
  let total = form.txtTotal.value;

  try {
    if (!editStatus) {
      await onInsert(usuario, telefono, entrega, libro, total);
      Toastify({
        text: "Orden almacenado correctamente",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        duration: 3000,
      }).showToast();
    } else {
      await onUpdate(idSeleccionado, {
        usuario,
        telefono,
        entrega,
        libro,
        total,
      });
      Toastify({
        text: "Orden modificado correctamente",
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
  form.reset();
}
