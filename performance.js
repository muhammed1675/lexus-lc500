/**
 * Lexus LC 500 - Performance Page
 * Handles animations, counters, acceleration demo, and drive mode switching
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations()
  initStatCounters()
  initAccelerationDemo()
  initDriveModeSwitcher()
})

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll(
    '.engine-section, .transmission-section, .acceleration-section, .handling-section, .drive-modes-section, .performance-cta-section'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  sections.forEach((section) => {
    section.classList.add('fade-in-section')
    observer.observe(section)
  })
}

/**
 * Animate stat counters on hero section
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number')
  let hasAnimated = false

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          animateCounters()
        }
      })
    },
    { threshold: 0.5 }
  )

  if (statNumbers.length > 0) {
    observer.observe(statNumbers[0].parentElement.parentElement)
  }

  function animateCounters() {
    statNumbers.forEach((stat) => {
      const target = parseFloat(stat.dataset.target)
      const duration = 2000
      const isDecimal = target % 1 !== 0
      const increment = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        current += increment
        if (current < target) {
          stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          stat.textContent = isDecimal ? target.toFixed(1) : target
        }
      }

      updateCounter()
    })
  }
}

/**
 * Initialize acceleration demo
 */
function initAccelerationDemo() {
  const accelBtn = document.getElementById('accelBtn')
  const trackCar = document.getElementById('trackCar')
  const trackTimer = document.getElementById('trackTimer')
  const trackLine = document.querySelector('.track-line')

  if (!accelBtn || !trackCar || !trackTimer || !trackLine) return

  let isRunning = false

  accelBtn.addEventListener('click', () => {
    if (isRunning) return

    runAcceleration()
  })

  function runAcceleration() {
    isRunning = true
    accelBtn.disabled = true

    // Reset positions
    trackCar.classList.remove('active')
    trackLine.classList.remove('active')
    trackTimer.textContent = '0.0s'

    // Small delay before starting
    setTimeout(() => {
      trackCar.classList.add('active')
      trackLine.classList.add('active')

      // Animate timer
      const duration = 4400 // 4.4 seconds in ms
      const startTime = Date.now()

      const updateTimer = () => {
        const elapsed = Date.now() - startTime
        const seconds = (elapsed / 1000).toFixed(1)

        if (elapsed < duration) {
          trackTimer.textContent = `${seconds}s`
          requestAnimationFrame(updateTimer)
        } else {
          trackTimer.textContent = '4.4s'
          
          // Reset after showing final time
          setTimeout(() => {
            trackCar.classList.remove('active')
            trackLine.classList.remove('active')
            trackTimer.textContent = '0.0s'
            isRunning = false
            accelBtn.disabled = false
          }, 2000)
        }
      }

      updateTimer()
    }, 100)
  }
}

/**
 * Initialize drive mode switcher
 */
function initDriveModeSwitcher() {
  const modeButtons = document.querySelectorAll('.mode-btn')
  const modeContents = document.querySelectorAll('.mode-content')

  if (!modeButtons.length || !modeContents.length) return

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetMode = button.dataset.mode

      // Update active button
      modeButtons.forEach((btn) => btn.classList.remove('active'))
      button.classList.add('active')

      // Update active content with fade effect
      modeContents.forEach((content) => {
        if (content.dataset.mode === targetMode) {
          content.classList.add('active')
          
          // Animate the setting bars
          const fills = content.querySelectorAll('.fill')
          fills.forEach((fill, index) => {
            const width = fill.style.width
            fill.style.width = '0'
            setTimeout(() => {
              fill.style.width = width
            }, 100 + (index * 50))
          })
        } else {
          content.classList.remove('active')
        }
      })
    })
  })

  // Trigger initial animation for active mode
  const activeContent = document.querySelector('.mode-content.active')
  if (activeContent) {
    const fills = activeContent.querySelectorAll('.fill')
    setTimeout(() => {
      fills.forEach((fill, index) => {
        const width = fill.style.width
        fill.style.width = '0'
        setTimeout(() => {
          fill.style.width = width
        }, index * 100)
      })
    }, 500)
  }
}

/**
 * Add keyboard support for drive modes
 */
document.addEventListener('keydown', (e) => {
  const modeButtons = document.querySelectorAll('.mode-btn')
  const activeIndex = Array.from(modeButtons).findIndex((btn) =>
    btn.classList.contains('active')
  )

  if (e.key === 'ArrowLeft' && activeIndex > 0) {
    modeButtons[activeIndex - 1].click()
  } else if (e.key === 'ArrowRight' && activeIndex < modeButtons.length - 1) {
    modeButtons[activeIndex + 1].click()
  }
})

/**
 * Parallax effect for performance hero
 */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.performance-hero')
  if (!hero) return

  const scrolled = window.pageYOffset
  const heroHeight = hero.offsetHeight

  if (scrolled < heroHeight) {
    const bgGlow = hero.querySelector('.bg-glow')
    if (bgGlow) {
      bgGlow.style.transform = `translate(-50%, -50%) scale(${1 + scrolled / 1000})`
      bgGlow.style.opacity = Math.max(0.5 - scrolled / 1000, 0.2)
    }
  }
})

/**
 * Add hover effect to handling cards
 */
const handlingCards = document.querySelectorAll('.handling-card')
handlingCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.handling-icon')
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)'
    }
  })

  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.handling-icon')
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)'
    }
  })
})

/**
 * Animate RPM gauge on scroll
 */
const rpmGauge = document.querySelector('.gauge-fill')
if (rpmGauge) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          rpmGauge.style.strokeDashoffset = '0'
        }
      })
    },
    { threshold: 0.5 }
  )

  observer.observe(rpmGauge)
}

/**
 * Add interaction to transmission shift bars
 */
const shiftBars = document.querySelectorAll('.shift-bar')
shiftBars.forEach((bar, index) => {
  bar.style.animationDelay = `${index * 0.2}s`
})