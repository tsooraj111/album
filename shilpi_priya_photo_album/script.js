const albumPhotos = [
    { src: 'images/image1.jpeg', caption: '' },
    { src: 'images/image2.jpeg', caption: '' },
    { src: 'images/image3.jpeg', caption: '' },
    { src: 'images/image4.jpeg', caption: '' },
    { src: 'images/image5.jpeg', caption: '' },
    { src: 'images/image6.jpeg', caption: '' },
    { src: 'images/image7.jpeg', caption: '' },
    { src: 'images/image8.jpeg', caption: '' },
    { src: 'images/image9.jpeg', caption: '' },
];

document.addEventListener('DOMContentLoaded', () => {
    renderAlbum();

    // Book Logic
    const pages = document.querySelectorAll('.page');

    // Age Calculation
    const dob = new Date('2000-10-17');
    const today = new Date();

    // Simplest reliable logic for "X yrs Y months":
    let ageYears = today.getFullYear() - dob.getFullYear();
    let ageMonths = today.getMonth() - dob.getMonth();
    let ageDays = today.getDate() - dob.getDate();

    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
        ageYears--;
        ageMonths += 12;
    }

    if (ageDays < 0) {
        ageMonths--;
        if (ageMonths < 0) {
            ageMonths += 12;
        }
    }

    const ageElement = document.getElementById('calculated-age');
    if (ageElement) {
        ageElement.innerText = `${ageYears} yrs ${ageMonths} months`;
    }
    pages.forEach((page, index) => {
        if (index === pages.length - 1) return; // Disable flip for final page
        page.onclick = function () {
            if (this.classList.contains('flipped')) {
                this.classList.remove('flipped');
                // Spiral Unflip: Bring to front
                this.style.zIndex = 10 + index; // Temporarily high to clear stack
                setTimeout(() => {
                    this.style.zIndex = 3 - index; // Restore original stack order
                }, 1250); // Halfway through 2.5s transition
            } else {
                this.classList.add('flipped');
                // Spiral Flip: Send to back
                this.style.zIndex = 10 + index; // Temporarily high to clear stack
                setTimeout(() => {
                    this.style.zIndex = 0; // Send to back of stack
                }, 1250); // Halfway through 2.5s transition
            }
        };
    });
});



function renderAlbum() {
    const albumGrid = document.getElementById('album-grid');
    // Removed slideshow container references as they are deleted from HTML

    albumPhotos.forEach((photo, index) => {
        // Album Card
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.onclick = () => openModal(photo.src);
        // Staggered animation delay
        card.style.animationDelay = `${(index * 0.2) + 0.1}s`;
        card.style.setProperty('--rot', `${Math.random() * 10 - 5}deg`); // Random rotation

        card.innerHTML = `<img src="${photo.src}"><div class="caption">${photo.caption}</div>`;
        albumGrid.appendChild(card);
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    modal.style.display = "flex"; // Changed to flex to center
    modalImg.src = imageSrc;

    // Add swipe listeners
    addSwipeListeners();
}

function closeModal() {
    const modal = document.getElementById("photoModal");
    const img = document.getElementById("modalImg");
    // Reset transform before closing to prevent jump next time
    img.style.transform = "";
    modal.style.display = "none";
}

// Swipe to Dismiss Logic
function addSwipeListeners() {
    const modalImg = document.getElementById("modalImg");
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Touch events
    modalImg.ontouchstart = (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        modalImg.style.transition = 'none'; // Disable transition for direct follow
    };

    modalImg.ontouchmove = (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        modalImg.style.transform = `translateX(${diffX}px)`;
        e.preventDefault(); // Prevent scrolling while swiping
    };

    modalImg.ontouchend = (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = currentX - startX;
        handleSwipeEnd(diffX, modalImg);
    };

    // Mouse events
    modalImg.onmousedown = (e) => {
        startX = e.clientX;
        isDragging = true;
        modalImg.style.cursor = 'grabbing';
        modalImg.style.transition = 'none';
        e.preventDefault(); // Prevent default drag behavior
    };

    window.onmousemove = (e) => {
        if (!isDragging || document.getElementById("photoModal").style.display === 'none') return;
        currentX = e.clientX;
        const diffX = currentX - startX;
        modalImg.style.transform = `translateX(${diffX}px)`;
    };

    window.onmouseup = (e) => {
        if (!isDragging) return;
        isDragging = false;
        modalImg.style.cursor = 'grab';
        const diffX = currentX - startX;
        handleSwipeEnd(diffX, modalImg);
    };
}

function handleSwipeEnd(diffX, element) {
    element.style.transition = 'transform 0.3s ease';
    if (Math.abs(diffX) > 100) {
        // Swipe threshold met
        const direction = diffX > 0 ? 1 : -1;
        // Animate off screen
        element.style.transform = `translateX(${direction * window.innerWidth}px)`;
        setTimeout(() => closeModal(), 300);
    } else {
        // Snap back
        element.style.transform = 'translateX(0)';
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById("welcomeModal");
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.backgroundImage = "url('images/brick_wallpaper.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";

        // Apply same background to header to block scrolling items but look transparent
        const header = document.getElementById('fixed-header');
        header.style.backgroundImage = "url('images/brick_wallpaper.jpg')";
        header.style.backgroundSize = "cover";
        header.style.backgroundPosition = "center top"; // Ensure alignment matches body usually, or fixed
        header.style.backgroundAttachment = "fixed"; // Critical for seamless blend

        document.querySelector('.album').classList.add('visible');
    }, 500);
}

/* Slideshow Logic */
let slideIndex = 0;
let slideInterval;

function showSlidesHelper() {
    let container = document.querySelector('.slideshow-container');
    let dots = document.querySelectorAll('.dot');

    if (container) {
        container.style.display = 'block';
        setTimeout(() => {
            container.style.opacity = '1';
            dots.forEach(d => d.style.display = 'inline-block');
        }, 50);
        showSlides(); // Start auto rotation
    }
}

function plusSlides(n) {
    clearTimeout(slideInterval);
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    clearTimeout(slideInterval);
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n === undefined) {
        slideIndex++;
    } else {
        slideIndex = n;
    }

    if (slideIndex > slides.length) { slideIndex = 1 }
    if (slideIndex < 1) { slideIndex = slides.length }
    if ((n === undefined) && (slideIndex > slides.length)) { slideIndex = 1 } // Fail safe for auto

    // Reset all slides only if not animating? 
    // Actually, simply hiding all might break the exit animation.
    // Enhanced approach: 

    // 1. Identify current visible slide (if any)
    let currentVisible = -1;
    for (i = 0; i < slides.length; i++) {
        if (slides[i].style.display === "block") {
            currentVisible = i;
        }
        // Remove animation classes to reset
        slides[i].classList.remove('slide-in', 'slide-out');
    }

    // 2. Setup Next Slide
    let nextSlideIndex = slideIndex - 1;

    // 3. Animate
    if (currentVisible !== -1 && currentVisible !== nextSlideIndex) {
        // Slide Out current
        slides[currentVisible].style.display = "block"; // Keep it visible for animation
        slides[currentVisible].classList.add('slide-out');

        // Slide In next
        slides[nextSlideIndex].style.display = "block";
        slides[nextSlideIndex].classList.add('slide-in');

        // After animation, hide the old one
        setTimeout(() => {
            if (slides[currentVisible]) slides[currentVisible].style.display = "none";
        }, 800); // 0.8s matches CSS animation

    } else {
        // Initial load or immediate switch
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[nextSlideIndex].style.display = "block";
    }

    // Update dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[nextSlideIndex].className += " active";

    // Auto advance
    slideInterval = setTimeout(() => showSlides(), 3000); // Change image every 3 seconds
}



