// This script handles the dynamic behavior between the sidebar 
// and content area to ensure proper layout

// Run after the component mounts
document.addEventListener('DOMContentLoaded', function() {
  // Get references to key elements
  const sidebar = document.querySelector('.sidebar-container');
  const contentWrapper = document.getElementById('content-wrapper');
  const toggleButton = document.querySelector('.toggle-sidebar-button');
  const mainGrid = document.querySelector('.forum-category-grid');
  
  // Initial state
  let isSidebarCollapsed = false;
  
  // Function to update layout based on sidebar state and window size
  function updateLayout() {
    const windowWidth = window.innerWidth;
    
    // Adjust sidebar and content area
    if (isSidebarCollapsed) {
      // When sidebar is collapsed
      contentWrapper.style.marginLeft = '80px';
      contentWrapper.style.width = 'calc(100% - 80px)';
    } else {
      // When sidebar is expanded
      contentWrapper.style.marginLeft = '280px';
      contentWrapper.style.width = 'calc(100% - 280px)';
    }
    
    // Adjust grid columns based on available width
    if (mainGrid) {
      const availableWidth = windowWidth - (isSidebarCollapsed ? 80 : 280);
      
      if (availableWidth < 768) {
        mainGrid.classList.remove('md:grid-cols-2', 'xl:grid-cols-3');
        mainGrid.classList.add('grid-cols-1');
      } else if (availableWidth < 1280) {
        mainGrid.classList.remove('grid-cols-1', 'xl:grid-cols-3');
        mainGrid.classList.add('md:grid-cols-2');
      } else {
        mainGrid.classList.remove('grid-cols-1');
        mainGrid.classList.add('md:grid-cols-2', 'xl:grid-cols-3');
      }
    }
  }
  
  // Listen for toggle button clicks
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      isSidebarCollapsed = !isSidebarCollapsed;
      document.body.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
      updateLayout();
    });
  }
  
  // Apply initial layout
  updateLayout();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    updateLayout();
  });
});
