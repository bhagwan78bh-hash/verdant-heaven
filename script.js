/**
 * Verdant Haven - Modern Gardening Care & Botanics
 * Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initMobileNav();
  initScrollHeader();
  initCareCalculator();
  initConsultationForm();
  initCurrentYear();
});

/* ==========================================================================
   1. Accessible HTML5 Dialog Modals (Terms & Privacy)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  let lastActiveElement = null;

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const targetDialog = document.getElementById(modalId);

      if (targetDialog && typeof targetDialog.showModal === 'function') {
        lastActiveElement = document.activeElement;
        targetDialog.showModal();
        document.body.style.overflow = 'hidden';

        // Scroll dialog content back to top
        const dialogBody = targetDialog.querySelector('.dialog-body');
        if (dialogBody) dialogBody.scrollTop = 0;
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dialog = btn.closest('dialog');
      if (dialog) {
        closeDialog(dialog);
      }
    });
  });

  // Handle clicking on ::backdrop to close
  const allDialogs = document.querySelectorAll('dialog.legal-dialog');
  allDialogs.forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );

      if (!isInDialog) {
        closeDialog(dialog);
      }
    });

    // Handle ESC key listener
    dialog.addEventListener('cancel', () => {
      document.body.style.overflow = '';
      if (lastActiveElement) lastActiveElement.focus();
    });
  });

  function closeDialog(dialog) {
    dialog.close();
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a, button');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', isExpanded);
  });

  // Close mobile drawer when clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ==========================================================================
   3. Header Sticky Shadow & Active Nav Links
   ========================================================================== */
function initScrollHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlighting
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Interactive Plant Care Planner & Schedule Engine
   ========================================================================== */
function initCareCalculator() {
  const form = document.getElementById('care-calculator-form');
  const plantTypeEl = document.getElementById('plant-type');
  const seasonSelectEl = document.getElementById('season-select');
  const exposureSelectEl = document.getElementById('exposure-select');

  const outputTitle = document.getElementById('output-title');
  const outWater = document.getElementById('out-water');
  const outSoil = document.getElementById('out-soil');
  const outPruning = document.getElementById('out-pruning');
  const outThreat = document.getElementById('out-threat');
  const careOutput = document.getElementById('care-output');

  // Botanical Knowledge Base Matrix
  const careDatabase = {
    indoor: {
      spring: {
        water: 'Water when top 1.5" is dry. Increase misting or run humidifier.',
        soil: 'Begin bi-weekly diluted 10-10-10 organic fish emulsion feeding.',
        pruning: 'Prune leggy winter growth; clean dust from broad leaves with a damp cloth.',
        threat: 'Fungus gnats from over-wet potting soil & spider mites in dry heat.'
      },
      summer: {
        water: 'Check every 3-5 days. High transpiration requires steady hydration.',
        soil: 'Feed monthly with seaweed liquid extract. Avoid direct baking sunlight.',
        pruning: 'Pinch back stem tips to encourage dense, bushy branching.',
        threat: 'Leaf scorch from intense window magnification and dry HVAC airflow.'
      },
      autumn: {
        water: 'Reduce watering frequency by 30%. Allow top 2" to dry thoroughly.',
        soil: 'Cease heavy nitrogen fertilizer as growth rate naturally slows.',
        pruning: 'Inspect under foliage for hitchhiking scales or mealybugs.',
        threat: 'Drafts from window sills and rapid drop in ambient indoor humidity.'
      },
      winter: {
        water: 'Water sparingly every 10-14 days. Ensure drainage hole never sits in water.',
        soil: 'Zero fertilizer needed during dormancy.',
        pruning: 'Remove yellowing lower foliage to conserve plant vascular energy.',
        threat: 'Root rot from cold wet soil and extreme furnace air dryness.'
      }
    },
    perennial: {
      spring: {
        water: 'Deep watering once weekly if rainfall is below 1 inch.',
        soil: 'Layer 2 inches of aged leaf mold compost around the root dripline.',
        pruning: 'Cut back last year’s dead herbaceous stems before new shoots emerge.',
        threat: 'Slugs targeting tender new shoots; late surprise night frosts.'
      },
      summer: {
        water: 'Deep soaking twice weekly at sunrise. Soak soil, not the foliage.',
        soil: 'Replenish organic wood bark mulch to preserve crucial moisture.',
        pruning: 'Deadhead spent blossoms weekly to provoke second flower flushes.',
        threat: 'Powdery mildew, heat exhaustion, and Japanese beetles.'
      },
      autumn: {
        water: 'Weekly deep watering until first hard frost to build winter hydration.',
        soil: 'Apply bone meal or rock phosphate for vigorous root establishment.',
        pruning: 'Trim disease-prone foliage; leave hardy ornamental seedheads for birds.',
        threat: 'Early frost damage on tender buds; fungal spore winterization.'
      },
      winter: {
        water: 'Minimal moisture. Natural rainfall is typically sufficient unless drought.',
        soil: 'Blanket root zones with straw or evergreen boughs against frost heave.',
        pruning: 'Leave plants dormant. Do not prune woody perennials in hard freeze.',
        threat: 'Crown rot from saturated heavy clay and deep freeze-thaw cycles.'
      }
    },
    lawn: {
      spring: {
        water: '1 inch of water per week including precipitation.',
        soil: 'Aerate compacted zones; overseed bare patches with drought-hardy seed.',
        pruning: 'Mow at 3 inches blade height. Keep mower blades razor sharp.',
        threat: 'Crabgrass germination and fungal snow mold residue.'
      },
      summer: {
        water: 'Water deeply 2-3 times weekly at 5:00 AM to eliminate evaporation loss.',
        soil: 'Avoid chemical fertilizers in peak heat to prevent lawn scorching.',
        pruning: 'Raise mower height to 3.5 inches to shade root systems from the sun.',
        threat: 'Chinch bugs, armyworms, brown patch fungus, and summer drought dormancy.'
      },
      autumn: {
        water: 'Maintain steady moisture to encourage dense autumn root development.',
        soil: 'Optimal time for core aeration and slow-release organic winterizer food.',
        pruning: 'Gradually lower mower height in late autumn to prevent matting under snow.',
        threat: 'Excessive fallen leaves blocking sunlight—rake and mulch regularly.'
      },
      winter: {
        water: 'Allow lawn to sleep. Irrigate only during unusually prolonged winter droughts.',
        soil: 'Avoid walking on frozen or frost-crusted turf to avoid crown damage.',
        pruning: 'Clean and sharpen mower blades; winterize automated sprinkler lines.',
        threat: 'Salt run-off burns from sidewalk de-icing agents and animal digging.'
      }
    },
    vegetable: {
      spring: {
        water: 'Keep seedbeds consistently damp with gentle misting until sprouted.',
        soil: 'Amend soil with worm castings, aged manure, and composted green waste.',
        pruning: 'Thin out crowded seedlings to ensure air flow and vigorous root growth.',
        threat: 'Cutworms, flea beetles, and unseasonal frost snaps.'
      },
      summer: {
        water: 'Daily morning drip irrigation. Vegetables are 90% water during fruiting.',
        soil: 'Side-dress heavy feeders (tomatoes, peppers) with organic potassium & calcium.',
        pruning: 'Sucker tomato side shoots and stake heavy fruit trusses securely.',
        threat: 'Blossom end rot (calcium/water fluctuation) and hornworms.'
      },
      autumn: {
        water: 'Moderate watering as daytime temperatures cool down.',
        soil: 'Sow nitrogen-fixing cover crops (crimson clover, winter rye) in empty beds.',
        pruning: 'Harvest remaining green fruits before first freeze; remove spent vines.',
        threat: 'First killing frost and damp grey mold on ripening fruits.'
      },
      winter: {
        water: 'Cover cold frames or cloches; water lightly only if completely dry.',
        soil: 'Top beds with shredded leaves or dark compost to prevent nutrient leaching.',
        pruning: 'Clean all plant trellises and sanitize stakes with vinegar solution.',
        threat: 'Freeze damage to winter greens (kale, leeks, garlic).'
      }
    },
    succulent: {
      spring: {
        water: 'Resume watering every 10-14 days as active growth begins.',
        soil: 'Fast-draining gritty cactus mix (50% perlite/pumice, 50% coarse soil).',
        pruning: 'Remove dry basal leaves and separate healthy pup offsets for propagation.',
        threat: 'Sunburn if moving plants outdoors without a 7-day shaded transition.'
      },
      summer: {
        water: 'Water every 7-10 days outdoors; allow soil to dry completely between cycles.',
        soil: 'Diluted low-nitrogen cactus fertilizer once in early summer.',
        pruning: 'Trim elongated flower stalks after blooming finishes.',
        threat: 'Rot caused by high ambient humidity combined with heavy overwatering.'
      },
      autumn: {
        water: 'Taper off watering to once every 2-3 weeks.',
        soil: 'Stop all fertilizing to encourage natural seasonal tissue hardening.',
        pruning: 'Repot root-bound specimens before winter rest arrives.',
        threat: 'Sudden cold rains causing stem rot and soft leaf dropping.'
      },
      winter: {
        water: 'Water once every 3-4 weeks maximum. When in doubt, do not water.',
        soil: 'Zero feeding required.',
        pruning: 'Keep plants completely dry. Remove any shriveled bottom leaves.',
        threat: 'Temperatures below 40°F (4°C) for non-hardy species; mealybugs.'
      }
    },
    fruittree: {
      spring: {
        water: 'Consistent deep soaking during bloom and initial fruit set.',
        soil: 'Apply balanced organic fruit tree fertilizer around the drip ring.',
        pruning: 'Thin out excess fruit clusters so remaining fruit develops full size.',
        threat: 'Apple scab, peach leaf curl, and pollinator disruption from cold rain.'
      },
      summer: {
        water: 'Crucial deep soakings every 7-10 days as fruit swells.',
        soil: 'Keep mulch 4 inches away from trunk bark to prevent rodent nesting.',
        pruning: 'Summer prune vigorous vertical water sprouts to direct energy into fruit.',
        threat: 'Codling moths, fruit flies, and bird feeding.'
      },
      autumn: {
        water: 'Gradually reduce watering after fruit harvest is complete.',
        soil: 'Clear all fallen fruit and leaves to eliminate overwintering insect larvae.',
        pruning: 'Mark dead or rubbing branches for winter structural removal.',
        threat: 'Bacterial canker entrance through unhealed storm wounds.'
      },
      winter: {
        water: 'Dormant period. Natural moisture is adequate.',
        soil: 'Spray dormant horticultural oil to suffocate overwintering scale & mite eggs.',
        pruning: 'Main structural dormant pruning: open center canopy to sunlight.',
        threat: 'Frost cracking of young trunks (protect with white tree wrap).'
      }
    }
  };

  const plantNames = {
    indoor: 'Indoor Houseplants',
    perennial: 'Outdoor Perennials & Shrubs',
    lawn: 'Lawn & Ornamental Turf',
    vegetable: 'Edible Kitchen Garden',
    succulent: 'Succulents & Cacti',
    fruittree: 'Fruit Trees & Berry Canes'
  };

  function updateRegimen(e) {
    if (e) e.preventDefault();

    const plant = plantTypeEl.value;
    const season = seasonSelectEl.value;
    const seasonCapital = season.charAt(0).toUpperCase() + season.slice(1);

    const data = careDatabase[plant] && careDatabase[plant][season]
      ? careDatabase[plant][season]
      : careDatabase.perennial.autumn;

    // Pulse animation
    careOutput.style.opacity = '0.4';

    setTimeout(() => {
      outputTitle.textContent = `${seasonCapital} Regimen: ${plantNames[plant]}`;
      outWater.textContent = data.water;
      outSoil.textContent = data.soil;
      outPruning.textContent = data.pruning;
      outThreat.textContent = data.threat;

      careOutput.style.opacity = '1';
      careOutput.style.transition = 'opacity 0.25s ease';
    }, 150);
  }

  form.addEventListener('submit', updateRegimen);
  plantTypeEl.addEventListener('change', updateRegimen);
  seasonSelectEl.addEventListener('change', updateRegimen);
  exposureSelectEl.addEventListener('change', updateRegimen);
}

/* ==========================================================================
   5. Consultation Form Validation & Feedback
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const termsCheckbox = document.getElementById('terms-agree');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const termsError = document.getElementById('terms-error');

  const successBox = document.getElementById('form-success-box');
  const resetBtn = document.getElementById('reset-form-btn');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\-+()]{7,20}$/.test(phone.trim());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset states
    [nameInput, emailInput, phoneInput].forEach(inp => inp.classList.remove('input-invalid'));
    [nameError, emailError, phoneError, termsError].forEach(err => err.classList.remove('visible'));

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('input-invalid');
      nameError.classList.add('visible');
      isValid = false;
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      emailInput.classList.add('input-invalid');
      emailError.classList.add('visible');
      isValid = false;
    }

    // Validate Phone
    if (!validatePhone(phoneInput.value)) {
      phoneInput.classList.add('input-invalid');
      phoneError.classList.add('visible');
      isValid = false;
    }

    // Validate Terms & Privacy agreement
    if (!termsCheckbox.checked) {
      termsError.classList.add('visible');
      isValid = false;
    }

    if (isValid) {
      // Simulate form submission success
      const submitBtn = form.querySelector('#submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting Request...</span>';

      setTimeout(() => {
        form.style.display = 'none';
        successBox.style.display = 'flex';
        showToast('🌱 Consultation request submitted! We will call you within 24 hours.');
      }, 750);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      const submitBtn = form.querySelector('#submit-btn');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Consultation Request</span>
        <svg class="btn-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;
      successBox.style.display = 'none';
      form.style.display = 'block';
    });
  }
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-notification');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4500);
}

/* ==========================================================================
   7. Dynamic Current Year
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

