"use strict"

/* 1. CREAR OBJ BASE DE DATOS => db */
const db = firebase.firestore(); //se crea el obj para entrar a la bd

/* 2. CREAR OBJECTOS HTML */
const card = document.querySelector("#card");

const coleccionInventario = "Inventario";
var editStatus = false;
var idSeleccionado = "";

/* 3. METODOS CRUD NECESARIO */

const findAll = () => db.collection(coleccionInventario).get();

const findById = (paramId) => db.collection(coleccionInventario).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionInventario).onSnapshot(callback);

/* 4. USO METODOS */
window.addEventListener("load", async ()=>{ //al cargar la pagina
    onFindAll((query)=>{ //carga todo lo que hay en la db
        card.innerHTML = ""
        //console.log(query)
        query.forEach((doc)=>{
            console.log(doc.data())
            let dato = doc.data();

            card.innerHTML += `
                                    <div class="card" style="width: 18rem;">
                                        <img src="${dato.url}" class="card-img-top mx-auto d-block p-1" style="width: 150px;">
                                        <div class="card-body">
                                            <h5 class="card-title">${dato.titulo}</h5>
                                            <p class="card-text">${dato.descripcion}</p>
                                            <p class="card-text">Precio: ₡${dato.precio}</p>
                                            <a href="#" class="btn btn-primary">Agregar</a>
                                        </div>
                                    </div>
                                    `
        });
    })
})