// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle")
  const themeIcon = document.getElementById("theme-icon")
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")
  const navbar = document.querySelector(".navbar")
  const navLinksItems = document.querySelectorAll(".nav-link")
    const sections = document.querySelectorAll("section")
    const typingElement = document.querySelector('.typing-text');
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")
  const timelineItems = document.querySelectorAll(".timeline-item");
  const contactForm = document.getElementById("contactForm")
  const projectCards = document.querySelectorAll(".project-card")
  const skillTags = document.querySelectorAll(".skill-tag")

  // Check for saved theme preference or prefer-color-scheme
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-theme")
    themeIcon.classList.replace("fa-moon", "fa-sun")
  }

  // Theme Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")

    if (document.body.classList.contains("dark-theme")) {
      themeIcon.classList.replace("fa-moon", "fa-sun")
      localStorage.setItem("theme", "dark")
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon")
      localStorage.setItem("theme", "light")
    }
  })

  // Mobile Menu Toggle
  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    navLinks.classList.toggle("active")

    if (this.classList.contains("active")) {
      this.querySelectorAll(".bar")[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
      this.querySelectorAll(".bar")[1].style.opacity = "0"
      this.querySelectorAll(".bar")[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
    } else {
      this.querySelectorAll(".bar")[0].style.transform = "none"
      this.querySelectorAll(".bar")[1].style.opacity = "1"
      this.querySelectorAll(".bar")[2].style.transform = "none"
    }
  })

  // Close mobile menu when clicking a nav link
  navLinksItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active")
      menuToggle.classList.remove("active")
      menuToggle.querySelectorAll(".bar")[0].style.transform = "none"
      menuToggle.querySelectorAll(".bar")[1].style.opacity = "1"
      menuToggle.querySelectorAll(".bar")[2].style.transform = "none"
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
    
  // Custom cursor
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"

    cursorFollower.style.left = e.clientX + "px"
    cursorFollower.style.top = e.clientY + "px"
  })

  // Add hover effect to all clickable elements
  const clickables = document.querySelectorAll("a, button, .project-card, .skill-tag")
  clickables.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorFollower.style.borderColor = "var(--primary-color)"
      cursor.style.opacity = "0"
    })
    item.addEventListener("mouseleave", () => {
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
      cursorFollower.style.borderColor = "var(--primary-color)"
      cursor.style.opacity = "1"
    })
  })

  // Scroll animations using Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        if (item.classList.contains("timeline-item")) {
          if (item.classList.contains("nth-even")) {
            item.classList.add("animate-left");
          } else {
            item.classList.add("animate-right");
          }
          observer.unobserve(item);
        }
      }
    });
  }, {
    threshold: 0.1
  });

   timelineItems.forEach((item, index) => {
       if ((index + 1) % 2 === 0) {
	   item.classList.add("nth-even");
       }
       observer.observe(item);
   });

  sections.forEach((section) => {
    observer.observe(section)
  })

  // Form submission handler
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Add form validation and submission logic here

      // Simple form validation example
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value

      if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
        alert("Please fill in all required fields")
        return
      }

      // Mock form submission success
      alert("Thank you for your message! I will get back to you soon.")
      contactForm.reset()
    })
  }
})
