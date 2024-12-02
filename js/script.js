// URL de la API que proporciona las cartas de Pokémon
const API_URL = 'https://api.pokemontcg.io/v2/cards';

// Contenedor donde se mostrarán las cartas
const cardsContainer = document.getElementById('cards-container');

// Crear un contenedor para la navegación de páginas (paginación)
const paginationContainer = document.createElement('div');
paginationContainer.classList.add('pagination-container'); // Añadir clase CSS para estilizar la paginación
document.body.appendChild(paginationContainer); // Agregar el contenedor al cuerpo del documento

// Crear un elemento para mostrar la página actual
const pageLabel = document.createElement('span'); 
pageLabel.classList.add('page-label'); // Añadir clase CSS para la etiqueta
paginationContainer.appendChild(pageLabel); // Añadir la etiqueta al contenedor de paginación

// Crear el botón "Anterior"
const prevButton = document.createElement('button'); 
prevButton.textContent = 'Anterior'; // Texto del botón
prevButton.classList.add('page-btn'); // Añadir clase CSS para estilizar el botón
paginationContainer.appendChild(prevButton); // Añadir el botón al contenedor de paginación

// Crear el botón "Siguiente"
const nextButton = document.createElement('button'); 
nextButton.textContent = 'Siguiente'; // Texto del botón
nextButton.classList.add('page-btn'); // Añadir clase CSS para estilizar el botón
paginationContainer.appendChild(nextButton); // Añadir el botón al contenedor de paginación

let currentPage = 1; // Página inicial
const pageSize = 20; // Número de resultados por página

// Función asincrónica para obtener las cartas de Pokémon con paginación
async function fetchPokemonCards(page = 1) {
    try {
        // Realizar la solicitud a la API con los parámetros de página y tamaño de página
        const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
        const data = await response.json(); // Convertir la respuesta a JSON
        renderCards(data.data); // Llamar a la función para renderizar las cartas
        updatePagination(page, data.totalCount); // Actualizar los controles de paginación
    } catch (error) {
        console.error('Error al obtener las cartas de Pokémon:', error); // Manejo de errores
    }
}

// Función para renderizar las cartas de Pokémon
function renderCards(cards) {
    cardsContainer.innerHTML = ''; // Limpiar el contenedor de cartas antes de mostrar nuevas cartas
    cards.forEach(card => { // Recorrer cada carta
        const cardElement = document.createElement('div'); // Crear un contenedor para cada carta
        cardElement.classList.add('card'); // Añadir clase CSS para estilizar la carta
        
        // Obtener los tipos de la carta (si existen), o mostrar "Desconocido" si no hay tipos
        const types = card.types ? card.types.join(', ') : 'Desconocido';

        // Obtener la rareza de la carta, o mostrar "Desconocida" si no hay rareza
        const rarity = card.rarity || 'Desconocida';

        // Construir el contenido HTML de la carta
        cardElement.innerHTML = `
            <img src="${card.images.small}" alt="${card.name}"> <!-- Imagen de la carta -->
            <h2>${card.name}</h2> <!-- Nombre de la carta -->
            <p><strong>Supertipo:</strong> ${card.supertype}</p> <!-- Supertipo de la carta -->
            <p><strong>Rareza:</strong> ${rarity}</p> <!-- Rareza de la carta -->
            <p><strong>Elementos:</strong> ${types}</p> <!-- Tipos de la carta -->
        `;
        
        // Añadir la carta al contenedor de cartas
        cardsContainer.appendChild(cardElement);
    });
}

// Función para actualizar los controles de paginación
function updatePagination(currentPage, totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize); // Calcular el número total de páginas
    pageLabel.textContent = `Página ${currentPage} de ${totalPages}`; // Mostrar la página actual y total

    // Desactivar los botones si no hay más páginas disponibles
    prevButton.disabled = currentPage === 1; // Desactivar el botón "Anterior" si estamos en la primera página
    nextButton.disabled = currentPage === totalPages; // Desactivar el botón "Siguiente" si estamos en la última página
}

// Configuración de eventos para los botones de paginación

// Evento para el botón "Anterior"
prevButton.addEventListener('click', () => {
    if (currentPage > 1) { // Comprobar si no estamos en la primera página
        currentPage--; // Reducir el número de página
        fetchPokemonCards(currentPage); // Obtener las cartas de la nueva página
    }
});

// Evento para el botón "Siguiente"
nextButton.addEventListener('click', () => {
    currentPage++; // Incrementar el número de página
    fetchPokemonCards(currentPage); // Obtener las cartas de la nueva página
});

// Inicialización: obtener las cartas de la primera página
fetchPokemonCards(currentPage);
//fin