"use strict";

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const card = document.querySelector("#card");
const span = document.querySelector("#total");
const carritoUl = document.querySelector("#carrito");
const modalbody = document.querySelector("#modalbody");
const form = document.querySelector("#form");
const btnEnviar = document.querySelector("#btnEnviar");
var carrito = [];

const coleccionInventario = "Inventario";
const coleccionOrden = "Ordenes";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */

const findAll = () => db.collection(coleccionInventario).get();

const findById = (paramId) =>
  db.collection(coleccionInventario).doc(paramId).get();

const onFindAll = (callback) =>
  db.collection(coleccionInventario).onSnapshot(callback);

const onInsert = (usuario, telefono, entrega, libro, total) => {
  db.collection(coleccionOrden).doc().set({
    usuario,
    telefono,
    entrega,
    libro,
    total,
  });
};

/* 4. USO METODOS */
window.addEventListener("load", async () => {
  //al cargar la pagina
  onFindAll((query) => {
    //carga todo lo que hay en la db
    card.innerHTML = "";
    //console.log(query)
    query.forEach((doc) => {
      //console.log(doc.data());
      let dato = doc.data();

      card.innerHTML += `
                                    <div id="cards" class="card m-3 col-12" style="width: 18rem;">
                                        <img src="${dato.url}" class="card-img-top mx-auto d-block p-1" style="width: 150px;">
                                        <div class="card-body">
                                            <h5 class="card-title">${dato.titulo}</h5>
                                            <p class="card-text">${dato.descripcion}</p>
                                            <p class="card-text">Precio: ₡${dato.precio}</p>
                                            <button class="btn btn-warning btn-Agregar" data-id="${doc.id}">Agregar</button>
                                        </div>
                                    </div>
                                    `;
    });
    const btnAgregar = document.querySelectorAll(".btn-Agregar");
    btnAgregar.forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        //console.log(ev);
        try {
          const docSeleccionado = await findById(ev.target.dataset.id);
          const InventarioSeleccionada = docSeleccionado.data();

          //console.log(InventarioSeleccionada);

          carrito.push(InventarioSeleccionada);
          idSeleccionado = docSeleccionado.id;

          console.log(InventarioSeleccionada.titulo);

          for (let InventarioSeleccionada of carrito) {
            carritoUl.innerHTML += `<li>${InventarioSeleccionada.titulo} - Precio: ${InventarioSeleccionada.precio}</li>`;
            span.innerHTML += `<p>${InventarioSeleccionada.precio}</p>`;
            console.log(carrito);
          }
          const btnPagar = document.querySelectorAll(".btnPagar");
          btnPagar.forEach((btn) => {
            btn.addEventListener("click", async (ev) => {
              try {
                var txtUsuario = document.querySelector("#txtUsuario");
                var txtTelefono = document.querySelector("#txtTelefono");
                var txtEntrega = document.querySelector("#txtEntrega");

                txtUsuario = form.txtUsuario.value;
                txtTelefono = form.txtTelefono.value;
                txtEntrega = form.txtEntrega.value;

                console.log("Usuario" + txtUsuario);
                modalbody.innerHTML += `
                        <p>Nombre del Cliente: ${txtUsuario}</p>
                        <p>Telefono: ${txtTelefono}</p>
                        <p>Tipo de Entrega: ${txtEntrega}</p>
                        <p>Titulo de la obra: ${InventarioSeleccionada.titulo}</p>
                        <p>Total: ${InventarioSeleccionada.precio}</p>
                        <br/>
                                          `;

                const btnEnviar = document.querySelectorAll(".btnEnviar");
                btnEnviar.forEach((btn) => {
                  btn.addEventListener("click", async (ev) => {
                    ev.preventDefault();
                    //CARGAR EN VARIABLES LO QUE DA EL FORM
                    var usuario = document.querySelector("#txtUsuario").value;
                    var telefono = document.querySelector("#txtTelefono").value;
                    var entrega = document.querySelector("#txtEntrega").value;
                    var libro = InventarioSeleccionada.titulo;
                    var precio = InventarioSeleccionada.precio;

                    console.log(txtUsuario, telefono, entrega, libro, precio);

                    try {
                      if (!editStatus) {
                        await onInsert(
                          usuario,
                          telefono,
                          entrega,
                          libro,
                          precio
                        );
                        Toastify({
                          text: "Orden almacenado correctamente",
                          className: "info",
                          style: {
                            background:
                              "linear-gradient(to right, #00b09b, #96c93d)",
                          },
                          duration: 3000,
                        }).showToast();
                        var number = +50689765917;
                        var message = 
                        `👋 Hola ${usuario}, bienvenidx a Librocon
                        
                        Tipo de servicio: ${entrega}
                        Pedido: ${precio}
                        Telefono: ${telefono}

                        👆 Envía este mensaje. Te atenderemos enseguida.`;
                        var url =
                          "whatsapp://send?text=" +
                          encodeURIComponent(message) +
                          "&phone=" +
                          encodeURIComponent(number);

                        window.open(url);
                      }
                    } catch (err) {
                      console.log("Error Guardar: ", err);
                    }
                  });
                });
              } catch (err) {
                console.log("Error: ", err);
              }
              //console.log(carrito);
            });
          });
        } catch (err) {
          console.log("Error: ", err);
        }
      });
    });
  });
});
