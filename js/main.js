document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const nav = document.querySelector(".nav")
  const navLinks = document.querySelectorAll(".nav-link")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      nav.classList.toggle("active")
      document.body.classList.toggle("menu-open")

      // Toggle hamburger animation
      this.classList.toggle("active")
      const hamburger = this.querySelector(".hamburger")

      if (this.classList.contains("active")) {
        hamburger.style.transform = "rotate(45deg)"
        hamburger.style.backgroundColor = "transparent"
        hamburger.style.position = "relative"
        hamburger.style.before = "transform: rotate(90deg) translate(0, 0)"
        hamburger.style.after = "transform: rotate(90deg) translate(0, 0)"
      } else {
        hamburger.style.transform = "none"
        hamburger.style.backgroundColor = "var(--text)"
        hamburger.style.before = "transform: translateY(-8px)"
        hamburger.style.after = "transform: translateY(6px)"
      }
    })
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("active")
        document.body.classList.remove("menu-open")

        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove("active")
          const hamburger = mobileMenuBtn.querySelector(".hamburger")
          hamburger.style.transform = "none"
          hamburger.style.backgroundColor = "var(--text)"
        }
      }
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Active navigation link on scroll
  function setActiveNavLink() {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")

    let currentSection = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      const headerHeight = document.querySelector(".header").offsetHeight

      if (window.pageYOffset >= sectionTop - headerHeight - 100) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", setActiveNavLink)

  // Form submission handling
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const submitBtn = this.querySelector(".btn-submit")
      const btnText = submitBtn.querySelector(".btn-text")
      const btnLoading = submitBtn.querySelector(".btn-loading")

      // Disable button and show loading state
      submitBtn.disabled = true
      btnText.classList.add("hidden")
      btnLoading.classList.remove("hidden")

      // Simulate form submission (replace with actual form submission)
      setTimeout(() => {
        // Reset form
        contactForm.reset()

        // Reset button state
        submitBtn.disabled = false
        btnText.classList.remove("hidden")
        btnLoading.classList.add("hidden")

        // Show success message
        alert("Thank you for your message! I will get back to you soon.")
      }, 1500)
    })
  }

  // Add animation to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".project-card, .skill-card, .section-title")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 100) {
        element.classList.add("fade-in")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
  window.addEventListener("load", animateOnScroll)

  // Header scroll effect
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)"
    }

    if (scrollTop > 50) {
      header.style.boxShadow = "var(--shadow-md)"
    } else {
      header.style.boxShadow = "none"
    }

    lastScrollTop = scrollTop
  })
})

