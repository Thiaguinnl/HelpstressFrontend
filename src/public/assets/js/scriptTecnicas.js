document.addEventListener("DOMContentLoaded", () => {
  


  // Animação dos pills (hero)
  gsap.set('.pill-1', { x: '-40%', opacity: 0 });
  gsap.set('.pill-2', { x: '40%', opacity: 0 });
  gsap.set('.pill-3', { x: '40%', opacity: 0 });
  gsap.set('.pill-text', { y: 40, opacity: 0 });
  gsap.set('.card-blog', { y: 40, opacity: 0 });
  gsap.set('.card-go', { y: 40, opacity: 0 });
  gsap.set('.hero-description', { y: 30, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.3 } });

  tl.to('.pill-1', { x: 0, opacity: 1, duration: 1.3 })
    .to('.pill-2', { x: 0, opacity: 1, duration: 1.3 }, '-=1.0')
    .to('.pill-3', { x: 0, opacity: 1, duration: 1.3 }, '-=1.0')
    .to('.pill-text', { y: 0, opacity: 1, duration: 1.1 }, '-=0.9')
    .to('.card-blog', { y: 0, opacity: 1, duration: 1.1 }, '-=0.8')
    .to('.card-go', { y: 0, opacity: 1, duration: 1.1 }, '-=0.9')
    .to('.hero-description', { y: 0, opacity: 1, duration: 1 }, '-=0.8');

  // Revelação ao scroll dos elementos abaixo da hero
  gsap.set('h1, .cards-container, .bottom-section, footer', { opacity: 0, y: 60 });

  gsap.utils.toArray(['h1', '.cards-container', '.bottom-section', 'footer']).forEach((selector, i) => {
    gsap.to(selector, {
      scrollTrigger: {
        trigger: selector,
        start: 'top 80%',
        once: true,
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      delay: i * 0.08
    });
  });

  // Efeito de spotlight nos cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

});
