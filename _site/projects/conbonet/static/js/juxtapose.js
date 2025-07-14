/* Juxtapose JS Library for Image Comparison */
(function() {
  var juxtapose = {
    sliders: [],
    JXSlider: function(selector, images, options) {
      var self = this;
      this.selector = selector;
      this.images = images;
      this.options = options || {};
      
      // Default options
      this.options.startingPosition = this.options.startingPosition || "50";
      this.options.showLabels = this.options.showLabels !== false;
      this.options.showCredits = this.options.showCredits !== false;
      this.options.animate = this.options.animate !== false;
      this.options.makeResponsive = this.options.makeResponsive !== false;
      
      this.init = function() {
        self.build();
        self.bindEvents();
        if (self.options.callback && typeof self.options.callback === 'function') {
          self.options.callback(self);
        }
      };
      
      this.build = function() {
        var container = document.querySelector(self.selector);
        if (!container) return;
        
        container.innerHTML = '';
        container.className = 'juxtapose';
        
        var slider = document.createElement('div');
        slider.className = 'jx-slider';
        
        // Create bottom image (original)
        var leftImage = document.createElement('div');
        leftImage.className = 'jx-image jx-left';
        
        var leftImg = document.createElement('img');
        leftImg.src = self.images[0].src;
        leftImg.alt = self.images[0].label || '';
        leftImage.appendChild(leftImg);
        
        if (self.options.showLabels && self.images[0].label) {
          var leftLabel = document.createElement('div');
          leftLabel.className = 'jx-label';
          leftLabel.textContent = self.images[0].label;
          leftImage.appendChild(leftLabel);
        }
        
        // Create top image (processed) with initial clip-path
        var rightImage = document.createElement('div');
        rightImage.className = 'jx-image jx-right';
        rightImage.style.clipPath = 'polygon(0 0, ' + self.options.startingPosition + '% 0, ' + self.options.startingPosition + '% 100%, 0 100%)';
        
        var rightImg = document.createElement('img');
        rightImg.src = self.images[1].src;
        rightImg.alt = self.images[1].label || '';
        rightImage.appendChild(rightImg);
        
        if (self.options.showLabels && self.images[1].label) {
          var rightLabel = document.createElement('div');
          rightLabel.className = 'jx-label';
          rightLabel.textContent = self.images[1].label;
          rightImage.appendChild(rightLabel);
        }
        
        // Create handle
        var handle = document.createElement('div');
        handle.className = 'jx-handle';
        handle.style.left = self.options.startingPosition + '%';
        
        var control = document.createElement('div');
        control.className = 'jx-control';
        
        var controller = document.createElement('div');
        controller.className = 'jx-controller';
        controller.setAttribute('tabindex', '0');
        controller.setAttribute('role', 'slider');
        controller.setAttribute('aria-valuenow', self.options.startingPosition);
        controller.setAttribute('aria-valuemin', '0');
        controller.setAttribute('aria-valuemax', '100');
        
        var leftArrow = document.createElement('div');
        leftArrow.className = 'jx-arrow jx-left';
        
        var rightArrow = document.createElement('div');
        rightArrow.className = 'jx-arrow jx-right';
        
        control.appendChild(controller);
        handle.appendChild(leftArrow);
        handle.appendChild(control);
        handle.appendChild(rightArrow);
        
        // Assemble slider
        slider.appendChild(leftImage);
        slider.appendChild(rightImage);
        slider.appendChild(handle);
        
        container.appendChild(slider);
        
        self.slider = slider;
        self.handle = handle;
        self.leftImage = leftImage;
        self.rightImage = rightImage;
        self.controller = controller;
      };
      
      this.bindEvents = function() {
        var isDragging = false;
        var startX = 0;
        var currentX = 0;
        
        function updateSlider(percentage) {
          percentage = Math.max(0, Math.min(100, percentage));
          
          // Update clip-path for overlay effect
          self.rightImage.style.clipPath = 'polygon(0 0, ' + percentage + '% 0, ' + percentage + '% 100%, 0 100%)';
          self.handle.style.left = percentage + '%';
          self.controller.setAttribute('aria-valuenow', percentage);
        }
        
        function getPercentage(e) {
          var rect = self.slider.getBoundingClientRect();
          var x = (e.clientX || e.touches[0].clientX) - rect.left;
          return (x / rect.width) * 100;
        }
        
        // Mouse events
        self.handle.addEventListener('mousedown', function(e) {
          isDragging = true;
          startX = e.clientX;
          e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
          if (!isDragging) return;
          updateSlider(getPercentage(e));
        });
        
        document.addEventListener('mouseup', function() {
          isDragging = false;
        });
        
        // Touch events
        self.handle.addEventListener('touchstart', function(e) {
          isDragging = true;
          startX = e.touches[0].clientX;
          e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
          if (!isDragging) return;
          updateSlider(getPercentage(e));
          e.preventDefault();
        });
        
        document.addEventListener('touchend', function() {
          isDragging = false;
        });
        
        // Click to move
        self.slider.addEventListener('click', function(e) {
          if (e.target === self.handle || self.handle.contains(e.target)) return;
          updateSlider(getPercentage(e));
        });
        
        // Keyboard events
        self.controller.addEventListener('keydown', function(e) {
          var currentPos = parseFloat(self.controller.getAttribute('aria-valuenow'));
          var step = 5;
          
          if (e.key === 'ArrowLeft') {
            updateSlider(currentPos - step);
            e.preventDefault();
          } else if (e.key === 'ArrowRight') {
            updateSlider(currentPos + step);
            e.preventDefault();
          }
        });
        
        // Responsive handling
        if (self.options.makeResponsive) {
          window.addEventListener('resize', function() {
            // Redraw if needed
          });
        }
      };
      
      this.init();
      juxtapose.sliders.push(this);
      return this;
    }
  };
  
  // Make juxtapose globally available
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = juxtapose;
  } else {
    window.juxtapose = juxtapose;
  }
})(); 