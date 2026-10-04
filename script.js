document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bring content in gently as it enters the viewport.
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Give skill and project surfaces a small, pointer-led 3D response.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const bounds = surface.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        surface.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
        surface.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
        surface.style.setProperty('--spot-x', `${x * 100}%`);
        surface.style.setProperty('--spot-y', `${y * 100}%`);
      });
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--tilt-x', '0deg');
        surface.style.setProperty('--tilt-y', '0deg');
        surface.style.setProperty('--spot-x', '50%');
        surface.style.setProperty('--spot-y', '50%');
      });
    });

    const hero = document.querySelector('.hero-main');
    const scene = document.querySelector('.hero-scene');
    if (hero) {
      hero.addEventListener('pointermove', (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        hero.style.setProperty('--shift-x', `${x * -8}px`);
        hero.style.setProperty('--shift-y', `${y * -6}px`);
        hero.style.setProperty('--shift-small-x', `${x * -3}px`);
        hero.style.setProperty('--shift-small-y', `${y * -2}px`);
        hero.style.setProperty('--spot-x', `${(x + 0.5) * 100}%`);
        hero.style.setProperty('--spot-y', `${(y + 0.5) * 100}%`);
        if (scene) {
          scene.style.setProperty('--pointer-x', `${x * 18}deg`);
          scene.style.setProperty('--pointer-y', `${y * -14}deg`);
          scene.style.setProperty('--parallax-x', `${x * 20}px`);
        }
      });
      hero.addEventListener('pointerleave', () => {
        ['--shift-x', '--shift-y', '--shift-small-x', '--shift-small-y'].forEach((property) => hero.style.setProperty(property, '0px'));
        hero.style.setProperty('--spot-x', '78%');
        hero.style.setProperty('--spot-y', '50%');
        if (scene) {
          scene.style.setProperty('--pointer-x', '0deg');
          scene.style.setProperty('--pointer-y', '0deg');
          scene.style.setProperty('--parallax-x', '0px');
        }
      });
    }
  }

  const skillsOrbit = document.querySelector('#skillsOrbit');
  const skillsStage = document.querySelector('.skills-stage');
  if (skillsOrbit) {
    // Each skill is positioned from its place in the list, so adding a node
    // automatically adds it to the carousel and its wrap-around sequence.
    let position = 0;
    let targetPosition = 0;
    let animationFrame = 0;
    const renderCarousel = () => {
      const nodes = [...skillsOrbit.querySelectorAll('.skill-node')];
      const count = nodes.length;
      if (!count) return;

      const step = Math.min(38, 150 / count);
      let frontIndex = 0;
      let nearest = Infinity;
      nodes.forEach((node, index) => {
        let relative = index - position;
        relative = ((relative + count / 2) % count + count) % count - count / 2;
        const distance = Math.abs(relative);
        node.style.setProperty('--carousel-angle', `${relative * step}deg`);
        node.classList.toggle('is-front', distance < nearest);
        if (distance < nearest) {
          nearest = distance;
          frontIndex = index;
        }
      });
      // Make the front selection deterministic when two skills are midway.
      nodes.forEach((node, index) => node.classList.toggle('is-front', index === frontIndex));
    };

    const animateCarousel = () => {
      const difference = targetPosition - position;
      position += difference * 0.14;
      if (Math.abs(difference) < 0.001) position = targetPosition;
      renderCarousel();
      if (position !== targetPosition) {
        animationFrame = window.requestAnimationFrame(animateCarousel);
      } else {
        animationFrame = 0;
      }
    };

    const startCarouselMotion = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateCarousel);
    };
    const moveCarousel = (amount) => {
      targetPosition += amount;
      startCarouselMotion();
    };

    renderCarousel();
    if (skillsStage) {
      skillsStage.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        moveCarousel(delta / 260);
      }, { passive: false });

      skillsStage.addEventListener('keydown', (event) => {
        if (!event.target.closest('.skill-node')) return;
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          moveCarousel(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          moveCarousel(-1);
        }
      });

      let swipe = null;
      skillsStage.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch' || !event.isPrimary) return;
        swipe = { id: event.pointerId, lastX: event.clientX, startX: event.clientX, startY: event.clientY, moved: false };
        skillsStage.setPointerCapture(event.pointerId);
      });
      skillsStage.addEventListener('pointermove', (event) => {
        if (!swipe || event.pointerId !== swipe.id) return;
        const deltaX = event.clientX - swipe.lastX;
        swipe.lastX = event.clientX;
        const totalX = event.clientX - swipe.startX;
        const totalY = event.clientY - swipe.startY;
        if (Math.abs(totalX) > 12 && Math.abs(totalX) > Math.abs(totalY)) swipe.moved = true;
        if (swipe.moved) moveCarousel(-deltaX / 150);
      });
      const finishSwipe = (event) => {
        if (!swipe || event.pointerId !== swipe.id) return;
        if (swipe.moved) {
          targetPosition = Math.round(targetPosition);
          startCarouselMotion();
        }
        swipe = null;
      };
      skillsStage.addEventListener('pointerup', finishSwipe);
      skillsStage.addEventListener('pointercancel', finishSwipe);
    }
  }

  // Update the top progress line and add gentle depth while scrolling.
  const progress = document.querySelector('#scrollProgress');
  const heroScene = document.querySelector('.hero-scene');
  let scrollFrame = 0;
  const updateScrollEffects = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progress) progress.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, amount)));
    if (heroScene && !reducedMotion) heroScene.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * 0.12, 80)}px`);
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }, { passive: true });
  updateScrollEffects();

  // Keep the compact navigation usable without a component framework.
  const menu = document.querySelector('#navMenu');
  const toggler = document.querySelector('.navbar-toggler');
  if (menu && toggler) {
    toggler.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggler.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
