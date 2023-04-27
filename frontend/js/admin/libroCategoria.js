"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const form = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");
const selectLibro = document.querySelector("#selectLibro");
const selectCategoria = document.querySelector("#selectCategoria");

const coleccionInventario = "Inventario";
const coleccionCategoria = "Categoria";
const coleccionUnion = "LibroCategoria";
var editStatus = false;
var idSeleccionado = "";

/* Inventario */
const onFindAllInventario = callback => db.collection(coleccionInventario).onSnapshot(callback);

/*Categoria*/

const onFindAllCategoria = callback => db.collection(coleccionCategoria).onSnapshot(callback);

/* 3. METODOS CRUD NECESARIO */
const onInsert = (libro, categoria) => {
    db.collection(coleccionUnion).doc().set(
        {
            libro,
            categoria
        }
    );
}

const findAll = () => db.collection(coleccionUnion).get();

const findById = (paramId) => db.collection(coleccionUnion).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionUnion).onSnapshot(callback);

const onDelete = (paramId) => db.collection(coleccionUnion).doc(paramId).delete();

const onUpdate = (paramId, newInventario) => db.collection(coleccionUnion).doc(paramId).update(newInventario);

/* 4. USO METODOS */
window.addEventListener("load", async ()=>{ //al cargar la pagina
    //Select Libro
    onFindAllInventario((query)=>{ //carga todo lo que hay en la db
        selectLibro.innerHTML = ""
        //console.log(query)
        query.forEach((doc)=>{
            //console.log(doc.data())
            let dato = doc.data();
            //console.log(dato)

            selectLibro.innerHTML += `
                                    <option>${dato.titulo}</option>
                                    `
        });
    })
    //Select Categoría
    onFindAllCategoria((query)=>{ //carga todo lo que hay en la db
        selectCategoria.innerHTML = ""
        //console.log(query)
        query.forEach((doc)=>{
            //console.log(doc.data())
            let dato = doc.data();
            //console.log(dato)

            selectCategoria.innerHTML += `
                                    <option>${dato.nombre}</option>
                                    `
        });
    })
    //CRUD Nuevo
    onFindAll((query)=>{ //carga todo lo que hay en la db
        contenedor.innerHTML = ""
        //console.log(query)
        query.forEach((doc)=>{
            //console.log(doc.data())
            let dato = doc.data();

            contenedor.innerHTML += `
                                    <tr>
                                        <td>${dato.libro}</td>
                                        <td>${dato.categoria}</td>
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
                      text: "Libro-categoria borrada correctamente",
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

                    form.selectLibro.value = InventarioSeleccionada.libro;
                    form.selectCategoria.value = InventarioSeleccionada.categoria;
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
    let libro = form.selectLibro.value;
    let categoria = form.selectCategoria.value;

    try{
        if(!editStatus){
            await onInsert(libro, categoria)
            Toastify({
                text: "Libro-categoria almacenado correctamente",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
              }).showToast();
            } else {
              await onUpdate(idSeleccionado, {
                libro,
                categoria
              });
              Toastify({
                text: "Libro-categoria modificado correctamente",
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