// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad del Carrusel de Imágenes ---
    let slideIndex = 0; // Índice de la diapositiva actual
    const slides = document.querySelectorAll('.carousel-slide'); // Selecciona todas las diapositivas
    const dotsContainer = document.querySelector('.dots-container'); // Contenedor de los puntos de navegación

    // Si no hay diapositivas, salimos de la función del carrusel
    if (slides.length === 0) {
        console.warn("No se encontraron diapositivas para el carrusel.");
        // No salimos del todo para que el resto del JS pueda funcionar
    } else {
        // Crea los puntos de navegación para el carrusel
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => currentSlide(index + 1));
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.dot'); // Selecciona todos los puntos creados

        // Muestra la diapositiva actual y actualiza los puntos
        const showSlides = (n) => {
            // Reinicia el índice si se excede el número de diapositivas o es menor a 1
            if (n > slides.length) {
                slideIndex = 1;
            }
            if (n < 1) {
                slideIndex = slides.length;
            }

            // Oculta todas las diapositivas
            slides.forEach(slide => slide.style.display = 'none');
            // Desactiva todos los puntos
            dots.forEach(dot => dot.classList.remove('active'));

            // Muestra la diapositiva actual y activa el punto correspondiente
            slides[slideIndex - 1].style.display = 'block';
            dots[slideIndex - 1].classList.add('active');
        };

        // Avanza o retrocede en las diapositivas
        window.plusSlides = (n) => {
            showSlides(slideIndex += n);
        };

        // Va a una diapositiva específica al hacer clic en un punto
        window.currentSlide = (n) => {
            showSlides(slideIndex = n);
        };

        // Inicia la presentación de diapositivas automática
        let slideshowInterval = setInterval(() => {
            showSlides(slideIndex += 1);
        }, 5000); // Cambia de imagen cada 5 segundos

        // Pausa el carrusel al pasar el ratón por encima y lo reanuda al quitarlo
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideshowInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                slideshowInterval = setInterval(() => {
                    showSlides(slideIndex += 1);
                }, 5000);
            });
        }

        // Muestra la primera diapositiva al cargar
        showSlides(slideIndex);
    }


    // --- Funcionalidad del Menú Hamburguesa (para móviles) ---
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burgerMenu.classList.toggle('open'); // Añade/quita clase para la animación del ícono
        });

        // Cierra el menú cuando se hace clic en un enlace (en móviles)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    burgerMenu.classList.remove('open');
                }
            });
        });
    }

    // --- Smooth Scroll para los enlaces de navegación ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace

            const targetId = this.getAttribute('href'); // Obtiene el ID del destino
            const targetElement = document.querySelector(targetId); // Selecciona el elemento de destino

            if (targetElement) {
                // Calcula la posición para el scroll, ajustando para el header fijo
                const headerOffset = document.querySelector('.main-header').offsetHeight; // Altura del header
                const elementPosition = targetElement.getBoundingClientRect().top; // Posición del elemento relativa al viewport
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset; // Posición absoluta ajustada

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Hace el scroll suave
                });

                // Añade/quita clase 'active' para indicar la sección actual (opcional)
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // --- Carga de Personajes desde la API y Funcionalidad de Búsqueda/Filtro ---
    const charactersGrid = document.getElementById('charactersGrid');
    const characterSearchInput = document.getElementById('characterSearch');
    const speciesFilterSelect = document.getElementById('speciesFilter');
    const resetFilterButton = document.getElementById('resetFilter');
    let allCharacters = []; // Almacenará todos los personajes para el filtrado

    // Función para obtener personajes de la API
    const fetchCharacters = async () => {
        try {
            // Muestra un mensaje de carga
            charactersGrid.innerHTML = '<p>Cargando personajes...</p>';
            const response = await fetch('https://www.demonslayer-api.com/api/v1/characters');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allCharacters = data.characters; // Guarda todos los personajes
            displayCharacters(allCharacters); // Muestra todos los personajes inicialmente
        } catch (error) {
            console.error('Error al obtener los personajes:', error);
            charactersGrid.innerHTML = '<p class="error-message">No se pudieron cargar los personajes. Inténtalo de nuevo más tarde.</p>';
        }
    };

    // Función para mostrar personajes en la cuadrícula
    const displayCharacters = (characters) => {
        charactersGrid.innerHTML = ''; // Limpia el contenido actual

        if (characters.length === 0) {
            charactersGrid.innerHTML = '<p>No se encontraron personajes que coincidan con tu búsqueda.</p>';
            return;
        }

        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.classList.add('character-card');

            // Usa una imagen de placeholder si image_url es nulo o vacío
            const imageUrl = character.image_url || 'https://placehold.co/300x250/334155/E2E8F0?text=No+Image';

            characterCard.innerHTML = `
                <img src="${imageUrl}" alt="${character.name}" onerror="this.onerror=null;this.src='https://placehold.co/300x250/334155/E2E8F0?text=No+Image';">
                <div class="character-info">
                    <h3>${character.name}</h3>
                    <p><strong>Especie:</strong> ${character.race || 'Desconocida'}</p>
                    <p><strong>Edad:</strong> ${character.age || 'Desconocida'}</p> <!-- ¡Campo de edad añadido aquí! -->
                    <p><strong>Afiliación:</strong> ${character.affiliation || 'Desconocida'}</p>
                </div>
            `;
            charactersGrid.appendChild(characterCard);
        });
    };

    // Función para filtrar y buscar personajes
    const filterAndSearchCharacters = () => {
        const searchTerm = characterSearchInput.value.toLowerCase();
        const selectedSpecies = speciesFilterSelect.value;

        const filteredCharacters = allCharacters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchTerm);
            // La API devuelve "Human" y "Demon" (con mayúscula inicial), por eso convertimos a minúscula para la comparación
            const matchesSpecies = selectedSpecies === 'all' || (character.race && character.race.toLowerCase() === selectedSpecies);
            return matchesSearch && matchesSpecies;
        });

        displayCharacters(filteredCharacters);
    };

    // Escucha eventos de entrada en la barra de búsqueda y el selector de especies
    if (characterSearchInput) {
        characterSearchInput.addEventListener('input', filterAndSearchCharacters);
    }
    if (speciesFilterSelect) {
        speciesFilterSelect.addEventListener('change', filterAndSearchCharacters);
    }

    // Escucha el botón de reset
    if (resetFilterButton) {
        resetFilterButton.addEventListener('click', () => {
            characterSearchInput.value = ''; // Limpia el campo de búsqueda
            speciesFilterSelect.value = 'all'; // Restablece el filtro de especies
            displayCharacters(allCharacters); // Muestra todos los personajes
        });
    }

    // Carga los personajes al iniciar la página
    fetchCharacters();

});
