/**
 * Lexus LC 500 - Gallery Page
 * Handles gallery filtering, lightbox, and image navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters()
  initLightbox()
  initScrollAnimations()
})

/**
 * Initialize gallery filter functionality
 */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn')
  const galleryCards = document.querySelectorAll('.gallery-card')

  if (!filterBtns.length || !galleryCards.length) return

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      // Filter gallery cards with smooth animation
      filterGalleryCards(galleryCards, filter)
    })
  })
}

/**
 * Filter gallery cards based on category
 * @param {NodeList} cards - All gallery cards
 * @param {string} filter - Filter category
 */
function filterGalleryCards(cards, filter) {
  cards.forEach((card, index) => {
    const category = card.dataset.category

    if (filter === 'all' || category === filter) {
      // Show card with staggered animation
      card.style.animation = 'none'
      card.classList.remove('hidden')
      
      // Trigger reflow
      void card.offsetWidth
      
      // Apply animation with delay
      setTimeout(() => {
        card.style.animation = ''
        card.style.animationDelay = `${index * 0.05}s`
      }, 10)
    } else {
      // Hide card
      card.classList.add('hidden')
    }
  })
}

/**
 * Initialize lightbox functionality
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox')
  const lightboxImage = document.getElementById('lightboxImage')
  const lightboxTitle = document.getElementById('lightboxTitle')
  const lightboxCategory = document.getElementById('lightboxCategory')
  const lightboxCounter = document.getElementById('lightboxCounter')
  const closeBtn = document.getElementById('lightboxClose')
  const prevBtn = document.getElementById('lightboxPrev')
  const nextBtn = document.getElementById('lightboxNext')
  const expandBtns = document.querySelectorAll('.gallery-expand-btn')

  if (!lightbox || !lightboxImage) return

  let currentIndex = 0
  let visibleCards = []

  // Open lightbox when expand button is clicked
  expandBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const card = btn.closest('.gallery-card')
      openLightbox(card)
    })
  })

  // Also open lightbox when clicking on the card itself
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card)
    })
  })

  /**
   * Open lightbox with the selected image
   * @param {Element} card - Gallery card element
   */
  function openLightbox(card) {
    // Get all currently visible cards (not hidden)
    visibleCards = Array.from(document.querySelectorAll('.gallery-card:not(.hidden)'))
    currentIndex = visibleCards.indexOf(card)

    if (currentIndex === -1) return

    // Get image data
    const img = card.querySelector('.gallery-card-image img')
    const title = card.querySelector('.gallery-card-title')
    const category = card.querySelector('.gallery-card-category')

    // Update lightbox content
    lightboxImage.src = img.src
    lightboxImage.alt = img.alt
    lightboxTitle.textContent = title.textContent
    lightboxCategory.textContent = category.textContent
    updateCounter()

    // Show lightbox
    lightbox.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  /**
   * Close lightbox
   */
  function closeLightbox() {
    lightbox.classList.remove('active')
    document.body.style.overflow = ''
  }

  /**
   * Show next image
   */
  function showNextImage() {
    currentIndex = (currentIndex + 1) % visibleCards.length
    updateLightboxImage()
  }

  /**
   * Show previous image
   */
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length
    updateLightboxImage()
  }

  /**
   * Update lightbox with current image
   */
  function updateLightboxImage() {
    const card = visibleCards[currentIndex]
    const img = card.querySelector('.gallery-card-image img')
    const title = card.querySelector('.gallery-card-title')
    const category = card.querySelector('.gallery-card-category')

    // Fade out
    lightboxImage.style.opacity = '0'

    // Update content after fade
    setTimeout(() => {
      lightboxImage.src = img.src
      lightboxImage.alt = img.alt
      lightboxTitle.textContent = title.textContent
      lightboxCategory.textContent = category.textContent
      updateCounter()

      // Fade in
      lightboxImage.style.opacity = '1'
    }, 200)
  }

  /**
   * Update image counter
   */
  function updateCounter() {
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleCards.length}`
  }

  // Event listeners
  closeBtn.addEventListener('click', closeLightbox)
  prevBtn.addEventListener('click', showPrevImage)
  nextBtn.addEventListener('click', showNextImage)

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return

    switch (e.key) {
      case 'Escape':
        closeLightbox()
        break
      case 'ArrowLeft':
        showPrevImage()
        break
      case 'ArrowRight':
        showNextImage()
        break
    }
  })

  // Prevent right-click on images (optional - for production use)
  lightboxImage.addEventListener('contextmenu', (e) => {
    // Commented out to allow right-click in development
    // e.preventDefault()
  })

  // Smooth transition for lightbox image
  lightboxImage.style.transition = 'opacity 0.3s ease'
}

/**
 * Initialize scroll animations for gallery cards
 */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.gallery-card')

  if (!cards.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  // Observe all cards
  cards.forEach(card => {
    observer.observe(card)
  })
}

/**
 * Preload images for better performance
 */
function preloadImages() {
  const images = document.querySelectorAll('.gallery-card-image img')
  
  images.forEach(img => {
    const src = img.getAttribute('src')
    if (src) {
      const preloadImg = new Image()
      preloadImg.src = src
    }
  })
}

// Optional: Preload images after page load
window.addEventListener('load', () => {
  setTimeout(preloadImages, 1000)
})