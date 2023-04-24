document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const nombre = document.getElementById('txtNombre').value;
    const telefono = document.getElementById('txtTelefono').value;
    const email = document.getElementById('txtEmail').value;
    
    // Process form data (e.g., send it to your backend, log it, etc.)
    console.log(`Nombre: ${nombre}\nTelefono: ${telefono}\nEmail: ${email}`);
  });


document.getElementById("btnGuardar").addEventListener("click", function(event) {
    event.preventDefault();
    saveContactData();
  });
  
  function saveContactData() {
    const nombre = document.getElementById("txtNombre").value;
    const telefono = document.getElementById("txtTelefono").value;
    const email = document.getElementById("txtEmail").value;
  
    if (nombre !== "" && telefono !== "" && email !== "") {
      // Change button text and style
      const button = document.getElementById("btnGuardar");
      button.textContent = "Guardado";
      button.classList.add("btn-saved");
  
      // Reset the button after a delay
      setTimeout(() => {
        button.textContent = "Guardar";
        button.classList.remove("btn-saved");
      }, 2000);
  
      // Reset form
      document.getElementById("contactoForm").reset();
    }
  }
  
  