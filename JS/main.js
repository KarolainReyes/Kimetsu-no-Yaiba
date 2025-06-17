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

