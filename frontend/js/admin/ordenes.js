"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const form = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");

const coleccionInventario = "Inventario";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */
const onInsert = (titulo, descripcion, precio) => {
    db.collection(coleccionInventario).doc().set(
        {
            titulo,
            descripcion,
            precio
        }
    );
}

const findAll = () => db.collection(coleccionInventario).get();

const findById = (paramId) => db.collection(coleccionInventario).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionInventario).onSnapshot(callback);

const onDelete = (paramId) => db.collection(coleccionInventario).doc(paramId).delete();

const onUpdate = (paramId, newInventario) => db.collection(coleccionInventario).doc(paramId).update(newInventario);

/* 4. USO METODOS */
window.addEventListener("load", async ()=>{ //al cargar la pagina
    onFindAll((query)=>{ //carga todo lo que hay en la db
        contenedor.innerHTML = ""
        //console.log(query)
        query.forEach((doc)=>{
            //console.log(doc.data())
            let dato = doc.data();

            contenedor.innerHTML += `
                                    <tr>
                                        <td>${dato.titulo}</td>
                                        <td>${dato.descripcion}</td>
                                        <td>${dato.precio}</td>
                                        <td>
                                            <button class="btn btn-warning btn-editar" data-id="${doc.id}">Editar</button>
                                        </td>
                                        <td>
                                        <button class="btn btn-danger btn-borrar" data-id="${doc.id}">Borrar</button>
                                        </td>
                                    </tr>
                                    `
        });
        const btnBorrar = document.querySelectorAll(".btn-borrar")
        btnBorrar.forEach((btn)=>{
            btn.addEventListener("click", async (ev)=>{
                
                //console.log(ev)
                if (confirm("Desea borrar el registro?")) {
                    await onDelete(ev.target.dataset.id);
                    Toastify({
                      text: "Libro borrada correctamente",
                      className: "info",
                      style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                      },
                      duration: 3000,
                    }).showToast();
                  }
            })
        })

        const btnEditar = document.querySelectorAll(".btn-editar")
        btnEditar.forEach((btn)=>{
            btn.addEventListener("click", async (ev)=>{
                //console.log(ev)
                try{
                    const docSeleccionado = await findById(ev.target.dataset.id)
                    const InventarioSeleccionada = docSeleccionado.data();

                    form.txtTitulo.value = InventarioSeleccionada.titulo;
                    form.txtDescripcion.value = InventarioSeleccionada.descripcion;
                    form.txtPrecio.value = InventarioSeleccionada.precio;
                    form.btnGuardar.innerText = "Modificar";

                    editStatus = true;
                    idSeleccionado = docSeleccionado.id
                }
                catch(err){
                    console.log("Error: ", err)
                }
            })
        })
    })
})

/* Editar */
form.addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    //CARGAR EN VARIABLES LO QUE DA EL FORM
    let titulo = form.txtTitulo.value;
    let descripcion = form.txtDescripcion.value;
    let precio = form.txtPrecio.value;

    try{
        if(!editStatus){
            await onInsert(titulo, descripcion, precio)
            Toastify({
                text: "Libro almacenado correctamente",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
              }).showToast();
            } else {
              await onUpdate(idSeleccionado, {
                titulo,
                descripcion,
                precio
              });
              Toastify({
                text: "Libro modificado correctamente",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
              }).showToast();
              limpiar();
        }
    }
    catch(err){
        console.log("Error Guardar: ", err)
    }
})

function limpiar (){
    form.reset();
}