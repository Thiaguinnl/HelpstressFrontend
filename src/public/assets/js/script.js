gsap.registerPlugin(DrawSVGPlugin);

// Dados dos cards
const cardsData = [
    {
        titulo: "Estudos",
        descricao: "Explore nossa seção de artigos para um estudo e compreensão aprofundada da sua ansiedade.",
        icone: "assets/img/artigo.png"
    },
    {
        titulo: "Dicas & Técnicas",
        descricao: "Nesta seção, você encontrará um conjunto de dicas práticas e técnicas eficazes para ajudar a manejar e reduzir os sintomas da ansiedade no dia a dia.",
        icone: "assets/img/dicas.png"
    },
    {
        titulo: "Comunidade",
        descricao: "Conecte-se e compartilhe experiências nossa comunidade é um espaço seguro e acolhedor onde você pode encontrar apoio, trocar ideias e aprender com os relatos de quem entende o que você está passando.",
        icone: "assets/img/comunidade.png"
    },
    {
        titulo: "Sua Opinião Importa",
        descricao: "Utilize a área de avaliação para nos dar seu feedback, avaliar a qualidade do conteúdo, e nos ajudar a evoluir para atender cada vez melhor às suas necessidades.",
        icone: "assets/img/estrela.png"
    }
];

// Dados dos depoimentos
const testimonialsData = [
    {
        quote: "Como designer gráfica, minha rotina é cheia de prazos e, muitas vezes, de muita pressão. Este site tem sido um verdadeiro refúgio. Os exercícios caseiros me ajudaram a relaxar e as dicas para lidar com a ansiedade foram um divisor de águas. Sinto-me mais focada e menos sobrecarregada. Recomendo muito!",
        author: "Ana Paula",
        title: "Designer Gráfica",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/ana.jpg"
    },
    {
        quote: "A vida acadêmica pode ser bastante estressante, e eu buscava uma forma de entender melhor e gerenciar minha ansiedade. A qualidade dos artigos aqui é impressionante, e a seção de estudos me permitiu aprofundar meu conhecimento sobre o tema. É um recurso valioso para quem busca bem-estar mental de forma séria e informada.",
        author: "Carlos Alberto",
        title: "Professor Universitário",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/carlos.jpg"
    },
    {
        quote: "Gerenciar meu próprio negócio é um desafio constante, e a ansiedade era uma barreira enorme. As técnicas funcionais que encontrei aqui me deram ferramentas práticas para o dia a dia. Além disso, os relatos de outras pessoas na comunidade me fizeram sentir que não estou sozinha. É um apoio incrível!",
        author: "Mariana Silva",
        title: "Empreendedora",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/mariana.jpg"
    }
];

function criarCards() {
    const cardsContainer = document.getElementById('oferecemos-cards');
    
    cardsData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        cardElement.innerHTML = `
            <div class="card-icon-wrapper">
                <img src="${card.icone}" alt="${card.titulo}" class="card-icon">
            </div>
            <h3>${card.titulo}</h3>
            <p>${card.descricao}</p>
        `;
        
        cardsContainer.appendChild(cardElement);
    });
}

function generateTestimonialsCarousel() {
    let carouselHTML = `
        <section class="testimonials-section">
            <div class="carousel-container">
                <div class="carousel-inner">
    `;

    testimonialsData.forEach(testimonial => {
        carouselHTML += `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <img src="${testimonial.companyLogo}" alt="Company Logo" class="company-logo">
                    <div class="testimonial-nav">
                        <button class="nav-arrow prev-arrow"><img src="/assets/img/arrow1.png" alt="Previous"></button>
                        <button class="nav-arrow next-arrow"><img src="/assets/img/arrow2.png" alt="Next"></button>
                    </div>
                </div>
                <hr class="testimonial-divider">
                <div class="testimonial-content">
                    <p class="quote"><img src="/assets/img/aspas.png" alt="Aspas">"${testimonial.quote}"</p>
                </div>
                <hr class="testimonial-divider">
                <div class="testimonial-footer">
                    <img src="${testimonial.authorPhoto}" alt="${testimonial.author}" class="author-photo">
                    <div class="author-info">
                        <p class="author-name">${testimonial.author}</p>
                        <p class="author-title">${testimonial.title}</p>
                    </div>
                </div>
            </div>
        `;
    });

    carouselHTML += `
                </div>
            </div>
        </section>
    `;

    return carouselHTML;
}

let currentIndex = 0;

function renderCard(index) {
  const card = document.getElementById("card-display");
  const testimonial = testimonialsData[index]; 
  card.innerHTML = `
    <div class="testimonial-header">
        <img src="${testimonial.companyLogo}" alt="Company Logo" class="company-logo">
        <div class="testimonial-nav-buttons">
            <button class="arrow left" onclick="prevCard()">&#10094;</button>
            <button class="arrow right" onclick="nextCard()">&#10095;</button>
        </div>
    </div>
    <hr class="testimonial-divider">
    <div class="testimonial-content">
        <p class="quote"><img src="/assets/img/aspas.png" alt="Aspas">${testimonial.quote}</p>
    </div>
    <hr class="testimonial-divider">
    <div class="testimonial-footer">
        <img src="${testimonial.authorPhoto}" alt="${testimonial.author}" class="author-photo">
        <div class="author-info">
            <p class="author-name">${testimonial.author}</p>
            <p class="author-title">${testimonial.title}</p>
        </div>
    </div>
  `;
}

function nextCard() {
  currentIndex = (currentIndex + 1) % testimonialsData.length;
  renderCard(currentIndex);
}

function prevCard() {
  currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
  renderCard(currentIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    criarCards();
    renderCard(currentIndex);

    // Menu Mobile
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const navLinks = document.querySelector('.nav-links');

    menuHamburguer.addEventListener('click', () => {
        menuHamburguer.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuHamburguer.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// Scroll
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            gsap.to(window, {
                scrollTo: {
                    y: targetId,
                    offsetY: 70 
                },
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    });
});

//  ScrollReveal
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1000,
    delay: 200,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    reset: false
});

gsap.registerPlugin(ScrollTrigger);

// Animação dos cards de "Entendendo a Ansiedade"
gsap.from('.entendendo-ansiedade-section .card', {
    scrollTrigger: {
        trigger: '.entendendo-ansiedade-section',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
});

// Animação da seção "Comunidade"
gsap.from('.comunidade-content', {
    scrollTrigger: {
        trigger: '.comunidade',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
});

// Animação dos elementos decorativos da comunidade
gsap.from('.linha-esquerda', {
    scrollTrigger: {
        trigger: '.comunidade',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    x: -200,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
});

gsap.from('.linha-direita', {
    scrollTrigger: {
        trigger: '.comunidade',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    x: 200,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
});

// Animação do footer
gsap.from('.footer-section', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
});
