// Simple carousel functionality
(function() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const indicators = Array.from(carousel.querySelectorAll('.carousel-indicators button'));
  
  let currentIndex = 0;

  function updateCarousel(index) {
    // Update slide position
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    
    currentIndex = index;
  }

  function goToNext() {
    const nextIndex = (currentIndex + 1) % slides.length;
    updateCarousel(nextIndex);
  }

  function goToPrev() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(prevIndex);
  }

  // Event listeners
  if (prevButton) {
    prevButton.addEventListener('click', goToPrev);
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', goToNext);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      updateCarousel(index);
    });
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  });

  // Initialize first slide
  updateCarousel(0);
})();
