"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const formUsuario = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");

const coleccionUsuario = "Usuario";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */
const findAll = () => db.collection(coleccionUsuario).get();

const findById = (paramId) => db.collection(coleccionUsuario).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionUsuario).onSnapshot(callback);

const onDelete = (paramId) => db.collection(coleccionUsuario).doc(paramId).delete();

const onUpdate = (paramId, newUsuario) => db.collection(coleccionUsuario).doc(paramId).update(newUsuario);



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
                                        <td>${dato.username}</td>
                                        <td>${dato.telefono}</td>
                                        <td>${dato.email}</td>
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
                if(confirm("Desea borrar el registro?")){
                    await onDelete(ev.target.dataset.id)
                    alert("Registro borrado exitosamente")
                }
            })
        })

        const btnEditar = document.querySelectorAll(".btn-editar")
        btnEditar.forEach((btn)=>{
            btn.addEventListener("click", async (ev)=>{
                //console.log(ev)
                try{
                    const docSeleccionado = await findById(ev.target.dataset.id)
                    const usuarioSeleccionado = docSeleccionado.data();

                    form.txtNombre.value = usuarioSeleccionado.nombre;
                    form.txtUsuario.value = usuarioSeleccionado.username;
                    form.txtTelefono.value = usuarioSeleccionado.telefono;
                    form.txtEmail.value = usuarioSeleccionado.email;
                    form.txtPassword.value = usuarioSeleccionado.password;
                    form.btnModificar.innerText = "Modificar";

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
    let nombre = formUsuario.txtNombre.value;
    let username = formUsuario.txtUsuario.value;
    let telefono = formUsuario.txtTelefono.value;
    let email = formUsuario.txtEmail.value;
    let password = formUsuario.txtPassword.value;

    try{
        if(editStatus){
            await onUpdate(idSeleccionado, {nombre, username, telefono, email, password})
            alert ("Contacto modificado correctamente")
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