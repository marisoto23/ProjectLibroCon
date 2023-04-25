"use strict";

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const card = document.querySelector("#card");
const span = document.querySelector("#total");
const carritoUl = document.querySelector("#carrito");
const modalbody = document.querySelector("#modalbody");
var carrito = [];

const coleccionInventario = "Inventario";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */

const findAll = () => db.collection(coleccionInventario).get();

const findById = (paramId) =>
  db.collection(coleccionInventario).doc(paramId).get();

const onFindAll = (callback) =>
  db.collection(coleccionInventario).onSnapshot(callback);

/* CONFIG COLECCION ORDENES */
const coleccionOrden = "Ordenes";

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
            console.log(carrito)
          }
          //var precio = InventarioSeleccionada.precio;
        } catch (err) {
          console.log("Error: ", err);
        }
      });
    });

    const btnPagar = document.querySelectorAll(".btnPagar");
    btnPagar.forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        //console.log(ev);
        try {
          const docSeleccionado = await findById(ev.target.dataset.id);
          const InventarioSeleccionada = docSeleccionado.data();

          idSeleccionado = docSeleccionado.id;

          console.log(InventarioSeleccionada);

          /*for (let InventarioSeleccionada of carrito)
            modalbody.innerHTML += `<p>${InventarioSeleccionada.titulo}</p>`;
*/
          //var precio = InventarioSeleccionada.precio;
        } catch (err) {
          console.log("Error: ", err);
        }
      });
    });
  });
});
//renderizarCarrito();
function calcularTotal() {
  // Recorremos el array del carrito
  return carrito
    .reduce((total, item) => {
      // De cada elemento obtenemos su precio
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
      });
      // Los sumamos al total
      return total + miItem[0].precio;
    }, 0)
    .toFixed(2);
}
