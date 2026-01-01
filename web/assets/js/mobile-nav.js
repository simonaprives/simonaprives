// Mobile menu toggle
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileMenuClose = document.querySelector('.mobile-menu__close');
      
      if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
          mobileMenu.classList.add('is-open');
          mobileMenuToggle.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        });
        
        if (mobileMenuClose) {
          mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          });
        }
        
        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          });
        });
      }