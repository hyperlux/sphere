// Enhanced script for responsive forum layout
// Handles dynamic behavior between sidebar and content area

// Run after the component mounts
document.addEventListener('DOMContentLoaded', function() {
  // Get references to key elements
  const sidebar = document.querySelector('.sidebar-container');
  const contentWrapper = document.getElementById('content-wrapper');
  const toggleButton = document.querySelector('.toggle-sidebar-button');
  const mainGrid = document.querySelector('.forum-category-grid');
  const searchInput = document.querySelector('.search-input');
  
  // Initial state
  let isSidebarCollapsed = false;
  let isSidebarHidden = window.innerWidth < 640;
  
  // Create mobile menu button if it doesn't exist
  if (!document.querySelector('.mobile-menu-button')) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-button fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-md md:hidden';
    mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
    document.body.appendChild(mobileMenuBtn);
    
    // Add event listener for mobile menu
    mobileMenuBtn.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-force-show');
      updateLayout();
    });
  }
  
  // Function to update layout based on sidebar state and window size
  function updateLayout() {
    const windowWidth = window.innerWidth;
    
    // Handle mobile view
    if (windowWidth < 640) {
      isSidebarHidden = !document.body.classList.contains('sidebar-force-show');
      contentWrapper.style.marginLeft = '0';
      contentWrapper.style.width = '100%';
      
      if (sidebar) {
        if (isSidebarHidden) {
          sidebar.style.transform = 'translateX(-100%)';
        } else {
          sidebar.style.transform = 'translateX(0)';
        }
      }
    } 
    // Handle tablet and desktop views
    else {
      isSidebarHidden = false;
      document.body.classList.remove('sidebar-force-show');
      
      if (sidebar) {
        sidebar.style.transform = '';
      }
      
      // Let CSS handle the sidebar and content positioning via classes
      if (contentWrapper) {
        contentWrapper.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
        contentWrapper.classList.toggle('sidebar-expanded', !isSidebarCollapsed);
        // Remove inline styles that could interfere with CSS
        contentWrapper.style.marginLeft = '';
        contentWrapper.style.width = '';
      }
    }
    
    // Make search input responsive
    if (searchInput) {
      if (windowWidth < 640) {
        searchInput.style.maxWidth = '100%';
      } else {
        searchInput.style.maxWidth = '600px';
      }
    }
    
    // Adjust grid columns based on available width and content area
    if (mainGrid) {
      // Calculate usable width accounting for padding
      const sidebarWidth = isSidebarCollapsed ? 80 : (isSidebarHidden ? 0 : 280);
      const availableWidth = windowWidth - sidebarWidth - 40; // 40px for padding
      
      // Remove all grid classes first
      mainGrid.className = mainGrid.className.replace(/grid-cols-\d|md:grid-cols-\d|lg:grid-cols-\d|xl:grid-cols-\d/g, '');
      mainGrid.classList.add('forum-category-grid');
      
      // Add appropriate grid classes based on available width
      if (availableWidth < 640) {
        mainGrid.classList.add('grid-cols-1');
      } else if (availableWidth < 1024) {
        mainGrid.classList.add('grid-cols-2');
      } else {
        mainGrid.classList.add('grid-cols-3');
      }
    }
    
    // Adjust font sizes based on screen width
    document.documentElement.style.fontSize = windowWidth < 640 ? '14px' : '16px';
  }
  
  // Optimize resize event with debounce
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      updateLayout();
    }, 100);
  });
  
  // Listen for toggle button clicks
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      isSidebarCollapsed = !isSidebarCollapsed;
      document.body.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
      updateLayout();
    });
  }
  
  // Make forum cards same height in each row
  function equalizeCardHeights() {
    if (!mainGrid) return;
    
    const cards = mainGrid.querySelectorAll('.forum-category-card');
    if (cards.length < 2) return;
    
    // Reset heights
    cards.forEach(card => card.style.height = 'auto');
    
    // Group cards by row
    const rowMap = new Map();
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const row = Math.floor(rect.top);
      if (!rowMap.has(row)) rowMap.set(row, []);
      rowMap.get(row).push(card);
    });
    
    // Set equal heights per row
    rowMap.forEach(rowCards => {
      const maxHeight = Math.max(...rowCards.map(card => card.offsetHeight));
      rowCards.forEach(card => card.style.height = `${maxHeight}px`);
    });
  }
  
  // Apply initial layout
  updateLayout();
  
  // Equalize card heights after images load
  window.addEventListener('load', equalizeCardHeights);
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      equalizeCardHeights();
    }, 100);
  });
  
  // Add touch swipe detection for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
  
  function handleSwipe() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 640) return; // Only handle swipes on mobile
    
    const swipeDistance = touchEndX - touchStartX;
    
    // Right swipe (show sidebar)
    if (swipeDistance > 70) {
      document.body.classList.add('sidebar-force-show');
      updateLayout();
    } 
    // Left swipe (hide sidebar)
    else if (swipeDistance < -70 && document.body.classList.contains('sidebar-force-show')) {
      document.body.classList.remove('sidebar-force-show');
      updateLayout();
    }
  }
});
