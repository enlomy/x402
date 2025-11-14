document.addEventListener("DOMContentLoaded", function() {
  initializeCollapsibles();
  initializeCopyButtons();
  initializeCustomCursor();
});

// Custom Cursor
function initializeCustomCursor() {
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  let lastWaveTime = 0;
  const waveThrottle = 50; // milliseconds between waves

  // Create wave effect
  function createWave(x, y) {
    const now = Date.now();
    if (now - lastWaveTime < waveThrottle) return;
    lastWaveTime = now;

    // Create multiple wave rings (reduced to 2)
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const wave = document.createElement('div');
        wave.className = 'cursor-wave';
        if (i === 1) wave.classList.add('cursor-wave-2');
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        document.body.appendChild(wave);

        // Remove wave element after animation
        setTimeout(() => {
          if (wave.parentNode) {
            wave.parentNode.removeChild(wave);
          }
        }, 1000);
      }, i * 50);
    }
  }

  // Mouse move event
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createWave(mouseX, mouseY);
  });

  // Animate cursor with smooth following
  function animateCursor() {
    // Smooth following for outer cursor
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Faster following for dot
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .cta-button, .nav-link, .feature-card, .step, input, textarea, select');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorDot.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorDot.classList.remove('hover');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    cursorDot.classList.add('click');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
    cursorDot.classList.remove('click');
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });

  // Touch devices - hide custom cursor and disable waves
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';
    // Disable wave creation on touch devices
    createWave = function() { return; };
  }
}

function initializeCollapsibles() {
  const triggers = document.querySelectorAll(".collapsible-trigger");
  
  triggers.forEach(trigger => {
    trigger.addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      
      if (content && content.classList.contains("collapsible-content")) {
        content.classList.toggle("active");
      }
    });
  });
}

function initializeCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const targetId = btn.getAttribute("data-copy-target");
      const codeElem = document.getElementById(targetId);
      
      if (codeElem) {
        navigator.clipboard
          .writeText(codeElem.innerText)
          .then(() => {
            const originalText = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(() => {
              btn.textContent = originalText;
            }, 1200);
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  });
}