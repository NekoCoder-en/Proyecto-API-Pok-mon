const API_URL = 'https://api.pokemontcg.io/v2/cards';
const cardsContainer = document.getElementById('cards-container');

// Contenedor de navegación
const paginationContainer = document.createElement('div');
paginationContainer.classList.add('pagination-container');
document.body.appendChild(paginationContainer);

const pageLabel = document.createElement('span'); // Etiqueta para la página actual
pageLabel.classList.add('page-label');
paginationContainer.appendChild(pageLabel);

const prevButton = document.createElement('button'); // Botón "Anterior"
prevButton.textContent = 'Anterior';
prevButton.classList.add('page-btn');
paginationContainer.appendChild(prevButton);

const nextButton = document.createElement('button'); // Botón "Siguiente"
nextButton.textContent = 'Siguiente';
nextButton.classList.add('page-btn');
paginationContainer.appendChild(nextButton);

let currentPage = 1; // Página inicial
const pageSize = 20; // Número de resultados por página

// Fetch Pokémon cards con paginación
async function fetchPokemonCards(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        renderCards(data.data);
        updatePagination(page, data.totalCount);
    } catch (error) {
        console.error('Error al obtener las cartas de Pokémon:', error);
    }
}

// Renderiza las tarjetas
function renderCards(cards) {
    cardsContainer.innerHTML = ''; 
    cards.forEach(card => { 
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        // Elemento de tipo (Tipo de Pokémon)
        const types = card.types ? card.types.join(', ') : 'Desconocido';

        // Elemento de rareza (Rareza)
        const rarity = card.rarity || 'Desconocida';

        cardElement.innerHTML = `
            <img src="${card.images.small}" alt="${card.name}">
            <h2>${card.name}</h2>
            <p><strong>Supertipo:</strong> ${card.supertype}</p>
            <p><strong>Rareza:</strong> ${rarity}</p>
            <p><strong>Elementos:</strong> ${types}</p>
        `;
        cardsContainer.appendChild(cardElement);
    });
}

// Actualiza los controles de paginación
function updatePagination(currentPage, totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    pageLabel.textContent = `Página ${currentPage} de ${totalPages}`;

    // Desactivar botones si no hay más páginas disponibles
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Configuración de eventos para los botones
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemonCards(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchPokemonCards(currentPage);
});

// Inicialización
fetchPokemonCards(currentPage);
