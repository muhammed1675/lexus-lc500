/**
 * Lexus LC 500 - Car Landing Page
 * Handles color switching, mobile navigation, gallery filters, smooth scroll, and interactive elements
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initColorSelector()
  initMobileNav()
  initGalleryFilters()
  initSmoothScroll()
  initScrollAnimations()
  initOverviewAnimations()
  initOverviewAutoSlider() // ✅ auto hero image
})

/**
 * Initialize the color selector functionality
 * Handles color button clicks and updates the UI accordingly
 */
function initColorSelector() {
  // Get all necessary elements
  const colorButtons = document.querySelectorAll(".color-btn")
  const carImages = document.querySelectorAll(".car-image")
  const colorNameDisplay = document.querySelector(".color-name")
  const bgGlow = document.querySelector(".bg-glow")

  const colorNames = {
    red: "Infrared",
    blue: "Structural Blue",
    black: "Caviar",
    white: "Ultra White",
  }

  // Add click event to each color button
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Get the selected color from data attribute
      const selectedColor = button.dataset.color

      // Update active state on buttons
      updateActiveButton(colorButtons, button)

      // Switch the car image with smooth transition
      switchCarImage(carImages, selectedColor)

      // Update the color name display
      updateColorName(colorNameDisplay, colorNames[selectedColor])

      // Update background glow color
      updateBackgroundGlow(bgGlow, selectedColor)
    })

    // Add keyboard support for accessibility
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        button.click()
      }
    })
  })
}

/**
 * Update the active state on color buttons
 * @param {NodeList} buttons - All color buttons
 * @param {Element} activeButton - The button to set as active
 */
function updateActiveButton(buttons, activeButton) {
  // Remove active class from all buttons
  buttons.forEach((btn) => {
    btn.classList.remove("active")
  })

  // Add active class to clicked button
  activeButton.classList.add("active")
}

/**
 * Switch the visible car image with a smooth transition
 * @param {NodeList} images - All car images
 * @param {string} color - The color to display
 */
function switchCarImage(images, color) {
  images.forEach((img) => {
    // Check if this image matches the selected color
    if (img.dataset.color === color) {
      // Show this image
      img.classList.add("active")
    } else {
      // Hide other images
      img.classList.remove("active")
    }
  })
}

/**
 * Update the color name display with a fade effect
 * @param {Element} displayElement - The element showing the color name
 * @param {string} name - The new color name to display
 */
function updateColorName(displayElement, name) {
  // Fade out
  displayElement.style.opacity = "0"

  // Update text and fade in after a short delay
  setTimeout(() => {
    displayElement.textContent = name
    displayElement.style.opacity = "1"
  }, 150)
}

/**
 * Update the background glow to match the selected color
 * @param {Element} glowElement - The background glow element
 * @param {string} color - The selected color
 */
function updateBackgroundGlow(glowElement, color) {
  // Remove all color classes
  glowElement.classList.remove("red", "blue", "black", "white")

  // Add the new color class
  glowElement.classList.add(color)
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger")
  const mobileNav = document.querySelector(".mobile-nav")
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  if (!hamburger || !mobileNav || !mobileNavOverlay) return

  // Toggle mobile nav on hamburger click
  hamburger.addEventListener("click", () => {
    toggleMobileNav(hamburger, mobileNav, mobileNavOverlay)
  })

  // Close mobile nav when clicking overlay
  mobileNavOverlay.addEventListener("click", () => {
    closeMobileNav(hamburger, mobileNav, mobileNavOverlay)
  })

  // Close mobile nav when clicking a link
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav(hamburger, mobileNav, mobileNavOverlay)
    })
  })

  // Close mobile nav on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("active")) {
      closeMobileNav(hamburger, mobileNav, mobileNavOverlay)
    }
  })
}

/**
 * Toggle mobile navigation state
 */
function toggleMobileNav(hamburger, mobileNav, overlay) {
  const isOpen = mobileNav.classList.contains("active")

  if (isOpen) {
    closeMobileNav(hamburger, mobileNav, overlay)
  } else {
    openMobileNav(hamburger, mobileNav, overlay)
  }
}

/**
 * Open mobile navigation
 */
function openMobileNav(hamburger, mobileNav, overlay) {
  hamburger.classList.add("active")
  hamburger.setAttribute("aria-expanded", "true")
  mobileNav.classList.add("active")
  overlay.classList.add("active")
  document.body.style.overflow = "hidden" // Prevent background scroll
}

/**
 * Close mobile navigation
 */
function closeMobileNav(hamburger, mobileNav, overlay) {
  hamburger.classList.remove("active")
  hamburger.setAttribute("aria-expanded", "false")
  mobileNav.classList.remove("active")
  overlay.classList.remove("active")
  document.body.style.overflow = "" // Restore scroll
}

/**
 * Initialize gallery filter functionality
 */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  if (!filterButtons.length || !galleryItems.length) return

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter gallery items
      galleryItems.forEach((item) => {
        const category = item.dataset.category
        if (filter === "all" || category === filter) {
          item.classList.remove("hidden")
        } else {
          item.classList.add("hidden")
        }
      })
    })
  })
}

/**
 * Initialize smooth scroll for navigation links
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      if (href === "#") return

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  })
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll(".performance, .gallery, .features")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  sections.forEach((section) => {
    section.classList.add("fade-in-section")
    observer.observe(section)
  })
}

/**
 * Initialize overview page scroll animations
 */
function initOverviewAnimations() {
  const animatedSections = document.querySelectorAll(
    ".design-section, .interior-section, .heritage-section, .specifications-section, .overview-cta-section",
  )

  if (!animatedSections.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  animatedSections.forEach((section) => {
    section.classList.add("fade-in-section")
    observer.observe(section)
  })
}

/**
 * Auto-change overview hero car image (no buttons)
 */
function initOverviewAutoSlider() {
  const heroImg = document.getElementById("heroCar")
  if (!heroImg) return

  const images = [
    "Img/Lexus LC 500 in Infrared color.png",
    "Img/Lexus LC 500 in Structural Blue.png",
    "Img/Lexus LC 500 in Caviar Black.png",
    "Img/Lexus LC 500 in Ultra White.png",
  ]

  let index = 0
  const interval = 4500 // total time per color

  setInterval(() => {
    // Fade out current image
    heroImg.classList.add("fade-out")

    // After fade-out, change image and fade in
    setTimeout(() => {
      index = (index + 1) % images.length
      heroImg.src = images[index]

      heroImg.classList.remove("fade-out")
      heroImg.classList.add("fade-in")
    }, 800) // must match CSS transition duration
  }, interval)
}
// change every 4 seconds
