$(document).ready(function () {
  let datos = JSON.parse(localStorage.getItem("contactos")) || [];
  let modoEditar = false;
  let indiceEditar = null;

  // Cargar países desde API
  $.get("https://restcountries.com/v3.1/lang/spanish", function (data) {
    data.forEach(pais => {
      const nombre = pais.translations.spa.common;
      const nombreOficial = pais.translations.spa.official;
      $("#pais").append(`<option value="${nombre}" data-oficial="${nombreOficial}">${nombre}</option>`);
    });
  });

  // Mostrar nombre oficial
  $("#pais").on("change", function () {
    const oficial = $(this).find(":selected").data("oficial");
    $("#nombreOficial").val(oficial);
  });

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Función para validar que el teléfono contenga solo números
  function validarTelefono(telefono) {
    const regex = /^\d+$/; // Expresión regular para validar solo dígitos
    return regex.test(telefono);
  }

  function renderTabla() {
    $("#tablaDatos tbody").empty();
    datos.forEach((item, index) => {
      $("#tablaDatos tbody").append(`
        <tr>
          <td>${item.nombre}</td>
          <td>${item.telefono}</td>
          <td>${item.email}</td>
          <td>${item.pais}</td>
          <td>${item.nombreOficial}</td>
          <td>${item.comentarios || ''}</td>
          <td>
            <button class="btn btn-warning btn-sm editar" data-index="${index}">Editar</button>
            <button class="btn btn-danger btn-sm eliminar" data-index="${index}">Eliminar</button>
          </td>
        </tr>
      `);
    });
  }

  renderTabla();

  $("#formularioContacto").on("submit", function (e) {
    e.preventDefault();

    const nombre = $("#nombre").val();
    const telefono = $("#telefono").val();
    const email = $("#email").val();
    const pais = $("#pais").val();
    const nombreOficial = $("#nombreOficial").val();
    const comentarios = $("#comentarios").val();

    if (!nombre || !telefono || !email || !pais) {
      alert("Todos los campos obligatorios deben ser completados (Nombre, Teléfono, Correo electrónico, País).");
      return;
    }

    if (!validarEmail(email)) {
      alert("Correo electrónico inválido.");
      return;
    }

    // Validación simplificada para que el teléfono solo contenga números
    if (!validarTelefono(telefono)) {
      alert("El campo Teléfono debe contener solo números.");
      return;
    }

    const contacto = { nombre, telefono, email, pais, nombreOficial, comentarios };

    if (modoEditar) {
      datos[indiceEditar] = contacto;
      modoEditar = false;
      indiceEditar = null;
    } else {
      datos.push(contacto);
    }

    localStorage.setItem("contactos", JSON.stringify(datos));
    renderTabla();
    this.reset();
    $("#nombreOficial").val('');
  });

  // Eliminar
  $(document).on("click", ".eliminar", function () {
    const index = $(this).data("index");
    datos.splice(index, 1);
    localStorage.setItem("contactos", JSON.stringify(datos));
    renderTabla();
  });

  // Editar
  $(document).on("click", ".editar", function () {
    const index = $(this).data("index");
    const item = datos[index];
    $("#nombre").val(item.nombre);
    $("#telefono").val(item.telefono);
    $("#email").val(item.email);
    $("#pais").val(item.pais).change();
    $("#nombreOficial").val(item.nombreOficial);
    $("#comentarios").val(item.comentarios || '');
    modoEditar = true;
    indiceEditar = index;
  });
});