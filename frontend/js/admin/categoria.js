"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const formCategoria = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");

const coleccionCategoria = "Categoria";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */
const onInsert = (nombre, descripcion) => {
    db.collection(coleccionCategoria).doc().set(
        {
            nombre,
            descripcion
        }
    );
}

const findAll = () => db.collection(coleccionCategoria).get();

const findById = (paramId) => db.collection(coleccionCategoria).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionCategoria).onSnapshot(callback);

const onDelete = (paramId) => db.collection(coleccionCategoria).doc(paramId).delete();

const onUpdate = (paramId, newCategoria) => db.collection(coleccionCategoria).doc(paramId).update(newCategoria);



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
                                        <td>${dato.nombre}</td>
                                        <td>${dato.descripcion}</td>
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
                      text: "Categoría borrada correctamente",
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
                    const categoriaSeleccionada = docSeleccionado.data();

                    form.txtNombre.value = categoriaSeleccionada.nombre;
                    form.txtDescripcion.value = categoriaSeleccionada.descripcion;
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
formCategoria.addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    //CARGAR EN VARIABLES LO QUE DA EL FORM
    let nombre = formCategoria.txtNombre.value;
    let descripcion = formCategoria.txtDescripcion.value;

    try{
        if(!editStatus){
            await onInsert(nombre, descripcion)
            Toastify({
                text: "Categoría almacenada correctamente",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
              }).showToast();
            } else {
              await onUpdate(idSeleccionado, {
                nombre,
                descripcion
              });
              Toastify({
                text: "Categoría modificada correctamente",
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