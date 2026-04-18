/* La Mamma's Signature — Theme JS v2 */
(function () {
  'use strict';

  /* ---- Custom Cursor ---- */
  var cursorDot = document.querySelector('.lms-cursor__dot');
  var cursorRing = document.querySelector('.lms-cursor__ring');
  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;
  var cursorVisible = false;

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorVisible) {
        cursorVisible = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      cursorDot.style.transform = 'translate(' + (mouseX - 4) + 'px, ' + (mouseY - 4) + 'px)';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = 'translate(' + (ringX - 20) + 'px, ' + (ringY - 20) + 'px)';
      requestAnimationFrame(animateRing);
    })();

    document.addEventListener('mouseleave', function () {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      cursorVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      cursorVisible = true;
    });

    var interactiveEls = 'a, button, [role="button"], input, label, select, textarea, .product-card, .bundle-card, .collection-tile';
    document.querySelectorAll(interactiveEls).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('is-hovering');
        cursorDot.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('is-hovering');
        cursorDot.classList.remove('is-hovering');
      });
    });
  }

  /* ---- Header scroll behavior ---- */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var menuToggle = document.getElementById('menu-toggle');
  var siteNav = document.getElementById('site-nav');
  var navOverlay = document.getElementById('nav-overlay');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.contains('is-open');
      siteNav.classList.toggle('is-open', !isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      if (navOverlay) navOverlay.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
  }

  /* ---- Hero parallax on scroll ---- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var heroEl = heroBg.closest('.hero');
      if (!heroEl) return;
      var heroH = heroEl.offsetHeight;
      if (scrollY < heroH) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
      }
    }, { passive: true });
  }

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-item__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var answer = trigger.nextElementSibling;
      var expanded = trigger.getAttribute('aria-expanded') === 'true';

      var list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item__trigger').forEach(function (otherTrigger) {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            var otherAnswer = otherTrigger.nextElementSibling;
            if (otherAnswer) otherAnswer.hidden = true;
          }
        });
      }

      trigger.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
    });
  });

  /* ---- Product page thumbnail gallery ---- */
  document.querySelectorAll('.product-page__thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var mediaId = thumb.dataset.mediaId;
      var gallery = document.getElementById('product-gallery-main');
      if (!gallery) return;

      gallery.querySelectorAll('.product-page__media-item').forEach(function (item) {
        item.classList.remove('product-page__media-item--active');
      });

      var target = gallery.querySelector('[data-media-id="' + mediaId + '"]');
      if (target) target.classList.add('product-page__media-item--active');

      document.querySelectorAll('.product-page__thumb').forEach(function (t) {
        t.classList.toggle('active', t.dataset.mediaId === mediaId);
      });
    });
  });

  /* ---- Product variant selection ---- */
  var variantsJson = document.getElementById('product-variants-json');
  if (variantsJson) {
    var variants = [];
    try { variants = JSON.parse(variantsJson.textContent); } catch (e) {}

    var selectedOptions = {};

    document.querySelectorAll('.product-page__option').forEach(function (optionEl, idx) {
      var active = optionEl.querySelector('.product-page__option-btn.active');
      if (active) selectedOptions['option' + (idx + 1)] = active.dataset.value;
    });

    document.querySelectorAll('.product-page__option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var position = btn.dataset.optionPosition;
        var value = btn.dataset.value;
        selectedOptions['option' + position] = value;

        btn.closest('.product-page__option-values').querySelectorAll('.product-page__option-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.value === value);
        });

        updateVariant();
      });
    });

    function updateVariant() {
      var matched = variants.find(function (v) {
        return v.option1 === (selectedOptions['option1'] || v.option1) &&
               v.option2 === (selectedOptions['option2'] || v.option2) &&
               v.option3 === (selectedOptions['option3'] || v.option3);
      });

      if (!matched) return;

      var variantInput = document.getElementById('product-variant-id');
      if (variantInput) variantInput.value = matched.id;

      var addToCartBtn = document.getElementById('add-to-cart');
      var priceEl = document.querySelector('.product-page__sale-price');
      var compareEl = document.querySelector('.product-page__compare-price');
      var mobileStickyBtn = document.getElementById('mobile-sticky-add');

      if (addToCartBtn) {
        addToCartBtn.disabled = !matched.available;
        addToCartBtn.textContent = matched.available
          ? 'Add to Cart \u2014 ' + formatMoney(matched.price)
          : 'Sold Out';
      }

      if (mobileStickyBtn) {
        mobileStickyBtn.disabled = !matched.available;
        mobileStickyBtn.textContent = matched.available
          ? 'Add to Cart \u2014 ' + formatMoney(matched.price)
          : 'Sold Out';
      }

      if (priceEl) priceEl.textContent = formatMoney(matched.price);

      if (compareEl) {
        if (matched.compare_at_price && matched.compare_at_price > matched.price) {
          compareEl.textContent = formatMoney(matched.compare_at_price);
          compareEl.style.display = '';
        } else {
          compareEl.style.display = 'none';
        }
      }
    }

    function formatMoney(cents) {
      return (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' MAD';
    }
  }

  /* ---- Cart quantity controls ---- */
  document.querySelectorAll('.cart-item__qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('.cart-item__qty-input');
      if (!input) return;
      var val = parseInt(input.value, 10) || 0;
      if (btn.dataset.action === 'increase') {
        input.value = val + 1;
      } else if (btn.dataset.action === 'decrease' && val > 0) {
        input.value = Math.max(0, val - 1);
      }
    });
  });

  /* ---- Cart item remove ---- */
  document.querySelectorAll('.cart-item__remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var line = btn.dataset.line;
      var input = document.querySelector('.cart-item__qty-input[data-index="' + line + '"]');
      if (input) {
        input.value = 0;
        var form = document.getElementById('cart-form');
        if (form) form.submit();
      }
    });
  });

  /* ---- Intersection observer for reveal animations ---- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.dataset.revealDelay || 0;
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll([
      '.reveal',
      '.bundle-card',
      '.collection-tile',
      '.product-card',
      '.review-card',
      '.article-card',
      '.brand-pillar',
      '.packaging-spec',
      '.faq-item',
    ].join(', ')).forEach(function (el, index) {
      var groupEls = el.closest('.bundle-grid, .collection-grid__grid, .reviews-grid, .articles-grid');
      if (groupEls) {
        var siblings = groupEls.querySelectorAll('.bundle-card, .collection-tile, .review-card, .article-card');
        siblings.forEach(function (sib, i) {
          sib.dataset.revealDelay = i * 80;
        });
      }
      revealObserver.observe(el);
    });
  }

  /* ---- 3D product parallax on mousemove ---- */
  var fpObject = document.querySelector('.js-fp-object');
  if (fpObject && window.matchMedia('(pointer: fine)').matches) {
    var fpScene = fpObject.closest('.featured-product-3d__scene');
    if (fpScene) {
      fpScene.addEventListener('mousemove', function (e) {
        var rect = fpScene.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        fpObject.style.transform = 'rotateY(' + (dx * 14) + 'deg) rotateX(' + (-dy * 10) + 'deg) translateZ(20px)';
      });
      fpScene.addEventListener('mouseleave', function () {
        fpObject.style.transform = '';
      });
    }
  }

  /* ---- Cart count update helper ---- */
  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = data.item_count;
        });
      })
      .catch(function () {});
  }

  /* ---- Add to cart AJAX ---- */
  function handleAddToCart(form, btn, stickyBtn) {
    var formData = new FormData(form);
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Adding\u2026';
    }
    if (stickyBtn) {
      stickyBtn.disabled = true;
      stickyBtn.textContent = 'Adding\u2026';
    }

    fetch('/cart/add.js', {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.status) {
          if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
          if (stickyBtn) { stickyBtn.disabled = false; stickyBtn.textContent = 'Add to Cart'; }
          return;
        }
        updateCartCount();
        var successText = 'Added \u2713';
        if (btn) {
          btn.textContent = successText;
          btn.classList.add('btn--success');
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = 'Add to Cart';
            btn.classList.remove('btn--success');
          }, 2200);
        }
        if (stickyBtn) {
          stickyBtn.textContent = successText;
          stickyBtn.classList.add('btn--success');
          setTimeout(function () {
            stickyBtn.disabled = false;
            stickyBtn.textContent = 'Add to Cart';
            stickyBtn.classList.remove('btn--success');
          }, 2200);
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
        if (stickyBtn) { stickyBtn.disabled = false; stickyBtn.textContent = 'Add to Cart'; }
      });
  }

  var productForm = document.getElementById('product-form');
  var mainAddBtn = document.getElementById('add-to-cart');
  var mobileStickyAddBtn = document.getElementById('mobile-sticky-add');

  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleAddToCart(productForm, mainAddBtn, mobileStickyAddBtn);
    });
  }

  if (mobileStickyAddBtn && productForm) {
    mobileStickyAddBtn.addEventListener('click', function () {
      handleAddToCart(productForm, mainAddBtn, mobileStickyAddBtn);
    });
  }

  /* ---- Mobile sticky bar: show after scrolling past add-to-cart ---- */
  var mobileStickyBar = document.getElementById('mobile-sticky-bar');
  if (mobileStickyBar && mainAddBtn) {
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          mobileStickyBar.classList.add('is-visible');
        } else {
          mobileStickyBar.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });
    stickyObserver.observe(mainAddBtn);
  }

  /* ---- Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Init ---- */
  updateCartCount();

})();
