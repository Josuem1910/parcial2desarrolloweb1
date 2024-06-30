document.addEventListener("DOMContentLoaded", function () {
    const calendario = document.getElementById("calendario");
    const modal = document.getElementById("modal");
    const cerrarBoton = document.querySelector(".boton-cerrar");
    const guardarBoton = document.getElementById("boton-guardar");
    const eliminarBoton = document.getElementById("boton-eliminar");
    const comentarioInput = document.getElementById("comentario");
    let diaSeleccionado;

    // CARGAR COMENTARIOS GUARDADOS DESDE LOCALSTORAGE
    function cargarComentarios() {
        for (let i = 1; i <= diasDelMes; i++) {
            const comentarioGuardado = localStorage.getItem(`comentario-dia-${i}`);
            if (comentarioGuardado) {
                const dia = calendario.querySelector(`div[data-dia="${i}"]`);
                dia.setAttribute("data-comentario", comentarioGuardado);
                dia.classList.add("tiene-comentario");
            }
        }
    }

    const diasDelMes = new Date(2024, 6, 0).getDate(); // NÚMERO DE DÍAS / MES JUNIO / 2024
    for (let i = 1; i <= diasDelMes; i++) {
        const dia = document.createElement("div");
        dia.className = "dia";
        dia.textContent = i;
        dia.setAttribute("data-dia", i); // ATRIBUTO PARA IDENTIFICAR AL DÍA
        dia.addEventListener("click", function () {
            diaSeleccionado = dia;
            comentarioInput.value = diaSeleccionado.getAttribute("data-comentario") || "";
            modal.style.display = "block";
        });
        calendario.appendChild(dia);
    }

    // CARGAR COMENTARIOS GUARDADOS AL INICIO
    cargarComentarios();

    cerrarBoton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    guardarBoton.addEventListener("click", function () {
        const comentario = comentarioInput.value;
        diaSeleccionado.setAttribute("data-comentario", comentario);
        diaSeleccionado.classList.add("tiene-comentario");
        localStorage.setItem(`comentario-dia-${diaSeleccionado.getAttribute("data-dia")}`, comentario); // Guardar comentario en localStorage
        modal.style.display = "none";
    });

    eliminarBoton.addEventListener("click", function () {
        diaSeleccionado.removeAttribute("data-comentario");
        diaSeleccionado.classList.remove("tiene-comentario");
        localStorage.removeItem(`comentario-dia-${diaSeleccionado.getAttribute("data-dia")}`); // ELIMINAR COMENTARIO DE LA LOCALSTORAGE
        modal.style.display = "none";
        comentarioInput.value = "";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
//BOTON INFO ABRE LO DEL FOOTER

document.getElementById("b-inf");

//agregar recetas
document.addEventListener('DOMContentLoaded', function () {
  const botonAñadirReceta = document.getElementById('botonAñadirReceta');
  const listaRecetas = document.getElementById('listaRecetas');
  const botonGuardarReceta = document.getElementById('botonGuardarReceta');
  const modalReceta = new bootstrap.Modal(document.getElementById('modalReceta'));
  const formularioReceta = document.getElementById('formularioReceta');
  const inputNombreReceta = document.getElementById('nombreReceta');
  const inputDescripcionReceta = document.getElementById('descripcionReceta');

  // Recetas predefinidas
  const recetasPredefinidas = [
    {
      nombre: "Barquitos de calabacita",
      descripcion: "Ingredientes:<br>- 2 calabacitas medianas o 3 calabacitas pequeñas.<br>- 1/2 taza de salsa de tomate para pasta.<br>- 1/2 taza de queso mozzarella rallado.<br>- 2 cucharadas de queso parmesano.<br><br>Preparación:<br>- Lávese las manos con agua y con jabón.<br>- Precaliente el horno a 350 °F.<br>- Corte cada calabacita por la mitad a lo largo. Utilice una cuchara para raspar y sacar cuidadosamente el centro con semillas de la calabacita.<br>- Coloque las mitades de la calabacita en un recipiente para hornear pequeño. Con una cuchara, vierta la salsa para pasta dentro de cada mitad. Cubra con queso mozzarella y queso parmesano.<br>- Hornee de 25 a 30 minutos o hasta que la calabacita puede perforarse con un tenedor y el queso esté burbujeante y dorado. Sirva caliente.<br>- Refrigere las sobras en las siguientes 2 horas."
    },
    {
      nombre: "Burritos de pollo y salsa de frijoles negros",
      descripcion: "Ingredientes:<br>- 1 lata (15 onzas) de frijoles negros, escurridos y enjuagados.<br>- 2 cebollines picados.<br>- 1 cucharada de jugo de limón.<br>- 1/4 cucharadita de comino molido.<br>- 1/2 cucharadita de sal.<br>- 4 pechugas de pollo, sin hueso y sin piel.<br>- 1/4 cucharadita de ají en polvo.<br>- 1/4 cucharadita de pimienta negra molida.<br>- 1 taza de queso rallado (pruebe cheddar, Pepper Jack o mezcla de quesos mexicanos).<br>- 4 tortillas de harina de 9 pulgadas.<br><br>Preparación:<br>- Caliente el horno a 350 °F.<br>- Mezcle los frijoles, los cebollines, el jugo de limón, el comino, y 1/4 de cucharadita de sal en un recipiente pequeño y hondo.<br>- Frote las pechugas de pollo con el chile en polvo, la pimienta y el resto del 1/4 cucharadita de sal.<br>- Cocine el pollo en una sartén a fuego medio alto (350 °F en una sartén eléctrica) por 5 minutos. Dele vuelta y cocine hasta que esté listo, entre 4 y 5 minutos más.<br>- Deje que el pollo se enfríe. Corte en tiras o trozos.<br> - Divida el queso en partes iguales entre las tortillas. Encima del queso ponga cantidades iguales de pollo y de la mezcla de salsa de frijoles negros.<br>- Enrolle los burritos y envuelva cada uno en papel de aluminio.<br>- Hornee los burritos hasta que el queso se derrita, cerca de 15 minutos.<br>- Refrigere las sobras dentro de las siguientes 2 horas.<br>"
    }
  ];

  // Obtener recetas guardadas del local storage
  let recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || [];

  // Comprobar y añadir recetas predefinidas si no están presentes
  recetasPredefinidas.forEach(predefinida => {
    const existe = recetasGuardadas.some(receta => receta.nombre === predefinida.nombre);
    if (!existe) {
      recetasGuardadas.push(predefinida);
    }
  });

  let recetas = recetasGuardadas;
  let indiceRecetaActual = null;

  function renderizarRecetas() {
    listaRecetas.innerHTML = '';
    recetas.forEach((receta, indice) => {
      const itemReceta = document.createElement('div');
      itemReceta.className = 'col-md-6';
      itemReceta.innerHTML = `
        <div class="card tarjeta-receta">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title titulo-receta">${receta.nombre}</h5>
              <div class="grupo-botones">
                <button class="btn btn-sm botonEditarReceta guardar-recetas" data-index="${indice}">Editar</button>
                <button class="btn btn-sm botonBorrarReceta guardar-recetas" data-index="${indice}">Borrar</button>
              </div>
            </div>
            <p class="card-text texto-receta">${receta.descripcion}</p>
          </div>
        </div>
      `;
      listaRecetas.appendChild(itemReceta);
    });
    agregarEventosBotones();
  }

  function agregarEventosBotones() {
    document.querySelectorAll('.botonEditarReceta').forEach(boton => {
      boton.addEventListener('click', function () {
        const indice = this.getAttribute('data-index');
        indiceRecetaActual = indice;
        inputNombreReceta.value = recetas[indice].nombre;
        inputDescripcionReceta.value = recetas[indice].descripcion.replace(/<br>/g, '\n');
        modalReceta.show();
      });
    });

    document.querySelectorAll('.botonBorrarReceta').forEach(boton => {
      boton.addEventListener('click', function () {
        const indice = this.getAttribute('data-index');
        recetas.splice(indice, 1);
        guardarRecetasEnLocalStorage();
        renderizarRecetas();
      });
    });
  }

  function guardarRecetasEnLocalStorage() {
    localStorage.setItem('recetas', JSON.stringify(recetas));
  }

  botonAñadirReceta.addEventListener('click', function () {
    indiceRecetaActual = null;
    formularioReceta.reset();
    modalReceta.show();
  });

  botonGuardarReceta.addEventListener('click', function () {
    const nombre = inputNombreReceta.value.trim();
    const descripcion = inputDescripcionReceta.value.trim().replace(/\n/g, '<br>');

    if (nombre && descripcion) {
      const nuevaReceta = { nombre, descripcion };
      if (indiceRecetaActual === null) {
        recetas.push(nuevaReceta);
      } else {
        recetas[indiceRecetaActual] = nuevaReceta;
      }
      guardarRecetasEnLocalStorage();
      renderizarRecetas();
      modalReceta.hide();
    }
  });

  renderizarRecetas();
});



document.addEventListener('DOMContentLoaded', function () {
  const botonAñadirReceta = document.getElementById('botonAñadirReceta');
  const listaRecetas = document.getElementById('listaRecetas');
  const botonGuardarReceta = document.getElementById('botonGuardarReceta');
  const modalRecetaElement = document.getElementById('modalReceta');
  const modalReceta = new bootstrap.Modal(modalRecetaElement);
  const formularioReceta = document.getElementById('formularioReceta');
  const inputNombreReceta = document.getElementById('nombreReceta');
  const inputDescripcionReceta = document.getElementById('descripcionReceta');

  // Recetas predefinidas
  const recetasPredefinidas = [
    {
      nombre: "Barquitos de calabacita",
      descripcion: "Ingredientes:<br>- 2 calabacitas medianas o 3 calabacitas pequeñas.<br>- 1/2 taza de salsa de tomate para pasta.<br>- 1/2 taza de queso mozzarella rallado.<br>- 2 cucharadas de queso parmesano.<br><br>Preparación:<br>- Lávese las manos con agua y con jabón.<br>- Precaliente el horno a 350 °F.<br>- Corte cada calabacita por la mitad a lo largo. Utilice una cuchara para raspar y sacar cuidadosamente el centro con semillas de la calabacita.<br>- Coloque las mitades de la calabacita en un recipiente para hornear pequeño. Con una cuchara, vierta la salsa para pasta dentro de cada mitad. Cubra con queso mozzarella y queso parmesano.<br>- Hornee de 25 a 30 minutos o hasta que la calabacita puede perforarse con un tenedor y el queso esté burbujeante y dorado. Sirva caliente.<br>- Refrigere las sobras en las siguientes 2 horas."
    },
    {
      nombre: "Burritos de pollo y salsa de frijoles negros",
      descripcion: "Ingredientes:<br>- 1 lata (15 onzas) de frijoles negros, escurridos y enjuagados.<br>- 2 cebollines picados.<br>- 1 cucharada de jugo de limón.<br>- 1/4 cucharadita de comino molido.<br>- 1/2 cucharadita de sal.<br>- 4 pechugas de pollo, sin hueso y sin piel.<br>- 1/4 cucharadita de ají en polvo.<br>- 1/4 cucharadita de pimienta negra molida.<br>- 1 taza de queso rallado (pruebe cheddar, Pepper Jack o mezcla de quesos mexicanos).<br>- 4 tortillas de harina de 9 pulgadas.<br><br>Preparación:<br>- Caliente el horno a 350 °F.<br>- Mezcle los frijoles, los cebollines, el jugo de limón, el comino, y 1/4 de cucharadita de sal en un recipiente pequeño y hondo.<br>- Frote las pechugas de pollo con el chile en polvo, la pimienta y el resto del 1/4 cucharadita de sal.<br>- Cocine el pollo en una sartén a fuego medio alto (350 °F en una sartén eléctrica) por 5 minutos. Dele vuelta y cocine hasta que esté listo, entre 4 y 5 minutos más.<br>- Deje que el pollo se enfríe. Corte en tiras o trozos.<br> - Divida el queso en partes iguales entre las tortillas. Encima del queso ponga cantidades iguales de pollo y de la mezcla de salsa de frijoles negros.<br>- Enrolle los burritos y envuelva cada uno en papel de aluminio.<br>- Hornee los burritos hasta que el queso se derrita, cerca de 15 minutos.<br>- Refrigere las sobras dentro de las siguientes 2 horas.<br>"
    }
  ];

  // Obtener recetas guardadas del local storage
  let recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || [];

  // Comprobar y añadir recetas predefinidas si no están presentes
  recetasPredefinidas.forEach(predefinida => {
    const existe = recetasGuardadas.some(receta => receta.nombre === predefinida.nombre);
    if (!existe) {
      recetasGuardadas.push(predefinida);
    }
  });

  let recetas = recetasGuardadas;
  let indiceRecetaActual = null;

  function renderizarRecetas() {
    listaRecetas.innerHTML = '';
    recetas.forEach((receta, indice) => {
      const itemReceta = document.createElement('div');
      itemReceta.className = 'col-md-6';
      itemReceta.innerHTML = `
        <div class="card tarjeta-receta">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title titulo-receta">${receta.nombre}</h5>
              <div class="grupo-botones">
                <button class="btn btn-sm botonEditarReceta guardar-recetas" data-index="${indice}">Editar</button>
                <button class="btn btn-sm botonBorrarReceta guardar-recetas" data-index="${indice}">Borrar</button>
              </div>
            </div>
            <p class="card-text texto-receta">${receta.descripcion}</p>
          </div>
        </div>
      `;
      listaRecetas.appendChild(itemReceta);
    });
    agregarEventosBotones();
  }

  function agregarEventosBotones() {
    document.querySelectorAll('.botonEditarReceta').forEach(boton => {
      boton.addEventListener('click', function () {
        const indice = this.getAttribute('data-index');
        indiceRecetaActual = indice;
        inputNombreReceta.value = recetas[indice].nombre;
        inputDescripcionReceta.value = recetas[indice].descripcion.replace(/<br>/g, '\n');
        modalReceta.show();
      });
    });

    document.querySelectorAll('.botonBorrarReceta').forEach(boton => {
      boton.addEventListener('click', function () {
        const indice = this.getAttribute('data-index');
        recetas.splice(indice, 1);
        guardarRecetasEnLocalStorage();
        renderizarRecetas();
      });
    });
  }

  function guardarRecetasEnLocalStorage() {
    localStorage.setItem('recetas', JSON.stringify(recetas));
  }

  botonAñadirReceta.addEventListener('click', function () {
    indiceRecetaActual = null;
    formularioReceta.reset();
    modalReceta.show();
  });

  botonGuardarReceta.addEventListener('click', function () {
    const nombre = inputNombreReceta.value.trim();
    const descripcion = inputDescripcionReceta.value.trim().replace(/\n/g, '<br>');

    if (nombre && descripcion) {
      const nuevaReceta = { nombre, descripcion };
      if (indiceRecetaActual === null) {
        recetas.push(nuevaReceta);
      } else {
        recetas[indiceRecetaActual] = nuevaReceta;
      }
      guardarRecetasEnLocalStorage();
      renderizarRecetas();
      modalReceta.hide();
    }
  });

  // Asegurarse de que el modal y su backdrop se cierren correctamente
  modalRecetaElement.addEventListener('hidden.bs.modal', function () {
    formularioReceta.reset(); // Resetea el formulario cuando el modal se cierra
    document.body.classList.remove('modal-open'); // Remueve la clase modal-open del body
    document.body.style.overflow = ''; // Restablece el comportamiento del overflow del body
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Remueve el backdrop del modal
    }
  });

  renderizarRecetas();
});
