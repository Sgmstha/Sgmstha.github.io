// DOM Elements
const header = document.querySelector("header")
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const navLinksItems = document.querySelectorAll(".nav-links a")
const backToTop = document.querySelector(".back-to-top")
const filterBtns = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const contactForm = document.getElementById("contactForm")

// Toggle mobile menu
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navLinks.classList.toggle("active")
})

// Close mobile menu when clicking on a nav link
navLinksItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navLinks.classList.remove("active")
  })
})

// Sticky header on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
    backToTop.classList.add("active")
  } else {
    header.classList.remove("scrolled")
    backToTop.classList.remove("active")
  }
})

// Active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section")
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinksItems.forEach((item) => {
    item.classList.remove("active")
    if (item.getAttribute("href").substring(1) === current) {
      item.classList.add("active")
    }
  })
})

// Project filtering
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    btn.classList.add("active")

    // Get filter value
    const filter = btn.getAttribute("data-filter")

    // Filter projects
    projectCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })
})

// Form validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  let isValid = true

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = ""
  })

  // Validate name
  const name = document.getElementById("name")
  if (name.value.trim() === "") {
    showError(name, "Name is required")
    isValid = false
  }

  // Validate email
  const email = document.getElementById("email")
  if (email.value.trim() === "") {
    showError(email, "Email is required")
    isValid = false
  } else if (!isValidEmail(email.value)) {
    showError(email, "Please enter a valid email")
    isValid = false
  }

  // Validate subject
  const subject = document.getElementById("subject")
  if (subject.value.trim() === "") {
    showError(subject, "Subject is required")
    isValid = false
  }

  // Validate message
  const message = document.getElementById("message")
  if (message.value.trim() === "") {
    showError(message, "Message is required")
    isValid = false
  }

  // If form is valid, submit it (in a real application, you would send the data to a server)
  if (isValid) {
    // Simulate form submission
    const submitBtn = document.querySelector(".submit-btn")
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    // Simulate server response
    setTimeout(() => {
      contactForm.reset()
      submitBtn.textContent = "Message Sent!"
      submitBtn.classList.add("success")

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = "Send Message"
        submitBtn.disabled = false
        submitBtn.classList.remove("success")
      }, 3000)
    }, 1500)
  }
})

// Helper function to show error messages
function showError(input, message) {
  const formGroup = input.parentElement
  const errorMessage = formGroup.querySelector(".error-message")
  errorMessage.textContent = message
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Animate skill bars on scroll
const skillSection = document.querySelector(".skills")
const progressBars = document.querySelectorAll(".progress")

const animateSkills = () => {
  const sectionPos = skillSection.getBoundingClientRect().top
  const screenPos = window.innerHeight / 1.3

  if (sectionPos < screenPos) {
    progressBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0"
      setTimeout(() => {
        bar.style.width = width
      }, 100)
    })

    // Remove event listener after animation
    window.removeEventListener("scroll", animateSkills)
  }
}

window.addEventListener("scroll", animateSkills)

// Add smooth reveal animations
const revealElements = document.querySelectorAll(".about-content, .projects-grid, .skills-content, .contact-content")

const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const elementPos = element.getBoundingClientRect().top
    const screenPos = window.innerHeight / 1.2

    if (elementPos < screenPos) {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }
  })
}

// Set initial styles for reveal elements
revealElements.forEach((element) => {
  element.style.opacity = "0"
  element.style.transform = "translateY(20px)"
  element.style.transition = "all 0.8s ease"
})

window.addEventListener("scroll", revealOnScroll)
// Trigger once on load
window.addEventListener("load", revealOnScroll)

