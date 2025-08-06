function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Load navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            // After navbar is loaded, highlight the active nav item
            var current = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.nav-list a, #myLinks a').forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === current) {
                    link.classList.add('active');
                }
            });
        });

    // Load footer (existing code)
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});

// Remove all previous hamburger/nav event listeners and keep only this block for mobile nav toggle

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            mobileNav.classList.toggle('open');
        });
        // Optional: close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
        });
    }
});
