console.log('scriptComunidade.js carregado');

// elementos
const tabs = document.querySelectorAll('.tab');
const prevButton = document.querySelector('.carrossel-button.prev');
const nextButton = document.querySelector('.carrossel-button.next');

// carrossel dados
const blogData = {
    'todos': [
        {
            image: 'assets/img/Yoga.jpg',
            title: 'Minha Jornada com a Ansiedade',
            description: 'Como encontrei paz através da meditação e mindfulness',
            author: 'Ana Silva',
            date: '12 Fev 2025',
            avatar: 'assets/img/anasilva.jpg'
        },
        {
            image: 'assets/img/Respiração.jpg',
            title: '5 Técnicas de Respiração',
            description: 'Exercícios práticos para momentos de ansiedade',
            author: 'Pedro Santos',
            date: '8 Mai 2023',
            avatar: 'assets/img/pedro.jpg'
        },
        {
            image: 'assets/img/Yoga2.png',
            title: 'Yoga para Iniciantes',
            description: 'Como começar sua prática de yoga em casa',
            author: 'Maria Costa',
            date: '27 Dez 2024',
            avatar: 'assets/img/maria.jpg'
        }
    ],
    'historias': [
        {
            image: 'assets/img/Hist1.jpg',
            title: 'Superando Crises de Pânico',
            description: 'Meu relato sobre como enfrentei e superei as crises de pânico.',
            author: 'Lucas Pereira',
            date: '7 Mai 2023',
            avatar: 'assets/img/lucas.jpg'
        },
        {
            image: 'assets/img/Hist2.jpg',
            title: 'Apoio da Família',
            description: 'Como o apoio familiar foi fundamental na minha recuperação.',
            author: 'Juliana Alves',
            date: '14 Out 2024',
            avatar: 'assets/img/juliana.jpg'
        },
        {
            image: 'assets/img/Hist3.jpg',
            title: 'Descobrindo a Terapia',
            description: 'Minha experiência ao iniciar a terapia e os benefícios que senti.',
            author: 'Rafael Souza',
            date: '9 Jan 2024',
            avatar: 'assets/img/rafael.jpg'
        }
    ],
    'tecnicas': [
        {
            image: 'assets/img/Meditacao2.jpg',
            title: 'Meditação Avançada',
            description: 'Técnicas avançadas de meditação para controle da ansiedade',
            author: 'Roberto Almeida',
            date: '28 Abr 2023',
            avatar: 'assets/img/roberto.jpg'
        },
        {
            image: 'assets/img/Exercicios.jpg',
            title: 'Exercícios Físicos em casa',
            description: 'Como a atividade física pode ajudar no controle da ansiedade',
            author: 'Fernanda Lima',
            date: '23 Jul 2024',
            avatar: 'assets/img/fernanda.jpg'
        },
        {
            image: 'assets/img/Alimentacao.jpg',
            title: 'Alimentação e Saúde Mental',
            description: 'Como uma dieta balanceada pode influenciar na ansiedade',
            author: 'Carlos Silva',
            date: '14 Ago 2023',
            avatar: 'assets/img/carlos.jpg'
        }
    ],
    'estudos': [
        {
            image: 'assets/img/Estudos1.jpg',
            title: 'Pesquisas Recentes sobre Ansiedade',
            description: 'Descobertas científicas sobre o tratamento da ansiedade em 2025',
            author: 'Dr. Lucas Mendes',
            date: '20 Jan 2025',
            avatar: 'assets/img/dr-lucas.jpg'
        },
        {
            image: 'assets/img/Estudo2.jpg',
            title: 'Eficácia das Terapias Alternativas',
            description: 'Análise científica sobre diferentes abordagens terapêuticas',
            author: 'Dra. Silvia Costa',
            date: '18 Abr 2024',
            avatar: 'assets/img/dra-silvia.jpg'
        },
        {
            image: 'assets/img/Estudos3.jpg',
            title: 'Ansiedade na Adolescência',
            description: 'Pesquisa mostra aumento de casos em jovens durante o período escolar.',
            author:'Prof. Ricardo Lima',
            date: '27 Dez 2024',
            avatar: 'assets/img/maria.jpg'
        }
    ]
};

// card de blog
function createBlogCard(item) {
    return `
        <article class="blog-card">
            <img src="${item.image}" alt="${item.title}" class="blog-image" loading="lazy">
            <div class="blog-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="author-info">
                    <img src="${item.avatar}" alt="${item.author}" class="author-avatar" loading="lazy">
                    <div class="author-details">
                        <h4>${item.author}</h4>
                        <span>${item.date}</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

const tabOrder = ['todos', 'historias', 'tecnicas', 'estudos'];
let currentTabIndex = 0;

let scrollPosition = 0;
const cardWidth = 300; 
const scrollStep = cardWidth / 1.5;

function updateNavigationButtons() {
    const blogGrid = document.querySelector('.blog-grid');
    const maxScroll = blogGrid.scrollWidth - blogGrid.clientWidth;
    
    prevButton.style.opacity = scrollPosition <= 0 ? '0.5' : '1';
    nextButton.style.opacity = scrollPosition >= maxScroll ? '0.5' : '1';
}

function waitForImagesToLoad(container, callback) {
    const images = container.querySelectorAll('img');
    let loaded = 0;
    if (images.length === 0) {
        callback();
        return;
    }
    images.forEach(img => {
        if (img.complete) {
            loaded++;
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === images.length) callback();
            });
            img.addEventListener('error', () => {
                loaded++;
                if (loaded === images.length) callback();
            });
        }
    });
    if (loaded === images.length) callback();
}

function updateCarousel(category) {
    const blogGrid = document.querySelector('.blog-grid');
    const items = blogData[category] || blogData['todos'];
    scrollPosition = 0;
    blogGrid.classList.remove('show-category');
    blogGrid.classList.add('fade-category');
    blogGrid.classList.add('loading');
    prevButton.disabled = true;
    nextButton.disabled = true;
    setTimeout(() => {
        blogGrid.innerHTML = items.map(createBlogCard).join('');
        waitForImagesToLoad(blogGrid, () => {
            setTimeout(() => {
                const containerWidth = blogGrid.clientWidth;
                const contentWidth = blogGrid.scrollWidth;
                const scrollLeft = (contentWidth - containerWidth) / 2;
                blogGrid.scrollLeft = scrollLeft;
                scrollPosition = scrollLeft;
                blogGrid.classList.remove('loading');
                blogGrid.classList.remove('fade-category');
                blogGrid.classList.add('show-category');
                prevButton.disabled = false;
                nextButton.disabled = false;
            }, 100);
            updateNavigationButtons();
        });
    }, 250);
    currentTabIndex = tabOrder.indexOf(category);
}

function scrollCarousel(direction) {
    const blogGrid = document.querySelector('.blog-grid');
    const maxScroll = blogGrid.scrollWidth - blogGrid.clientWidth;
    if (direction === 'next') {
        if (scrollPosition < maxScroll) {
            scrollPosition = Math.min(maxScroll, scrollPosition + scrollStep);
            blogGrid.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        } else {
            const tabs = document.querySelectorAll('.tab');
            currentTabIndex = (currentTabIndex + 1) % tabOrder.length;
            tabs[currentTabIndex].click();
        }
    } else {
        if (scrollPosition > 0) {
            scrollPosition = Math.max(0, scrollPosition - scrollStep);
            blogGrid.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        } else {
            const tabs = document.querySelectorAll('.tab');
            currentTabIndex = (currentTabIndex - 1 + tabOrder.length) % tabOrder.length;
            tabs[currentTabIndex].click();
        }
    }
    updateNavigationButtons();
}

document.querySelectorAll('.tab').forEach((tab, idx) => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        let key = tab.textContent.trim().toLowerCase();
        if (key === 'todos') key = 'todos';
        else if (key === 'histórias' || key === 'historia' || key === 'histórias') key = 'historias';
        else if (key === 'técnicas' || key === 'tecnicas') key = 'tecnicas';
        else if (key === 'estudos') key = 'estudos';
        updateCarousel(key);
    });
});

prevButton.addEventListener('click', () => {
    scrollCarousel('prev');
});

nextButton.addEventListener('click', () => {
    scrollCarousel('next');
});

document.querySelector('.blog-grid').addEventListener('scroll', () => {
    scrollPosition = document.querySelector('.blog-grid').scrollLeft;
    updateNavigationButtons();
});

updateCarousel('todos');
document.querySelector('.tab').classList.add('active');

// animação no scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// DOM(teste)
if (window.innerWidth <= 768) {
    const textDiv = document.querySelector('.conteudo-inicial');
    const banner = document.querySelector('.banner');
    if (textDiv && banner && textDiv.children.length > 0) {
        textDiv.insertBefore(banner, textDiv.children[1]);
    }
}

function mostrarNomeUsuario() {
    const userNameSpan = document.getElementById('userName');
    const communityProfileAvatar = document.getElementById('communityProfileAvatar');
    const userData = localStorage.getItem('userData');

    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (userNameSpan) {
                userNameSpan.textContent = user.nome || 'Visitante';
            }
            
            if (communityProfileAvatar) {
                communityProfileAvatar.src = user.avatar || '/assets/img/user.png';
            }
        } catch (e) {
            console.error('Erro ao parsear dados do usuário do localStorage:', e);
            if (userNameSpan) {
                userNameSpan.textContent = 'Visitante';
            }
            if (communityProfileAvatar) {
                communityProfileAvatar.src = '/assets/img/user.png';
            }
        }
    } else {
        if (userNameSpan) {
            userNameSpan.textContent = 'Visitante';
        }
        if (communityProfileAvatar) {
            communityProfileAvatar.src = '/assets/img/user.png';
        }
    }
}

mostrarNomeUsuario(); 

// seção de postar
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksDOM = document.querySelectorAll('.nav-links a');
    navLinksDOM.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });

    const postarSection = document.querySelector('.postar-section');
    if (postarSection) {
        postarSection.addEventListener('mousemove', (e) => {
            const rect = postarSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            postarSection.style.setProperty('--x', `${x}px`);
            postarSection.style.setProperty('--y', `${y}px`);
        });

        window.addEventListener('scroll', () => {
            const sectionRect = postarSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
 
            let scrollPercent = 0;
            if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
                scrollPercent = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
            }

            scrollPercent = Math.max(0, Math.min(1, scrollPercent));

            const yPos = Math.round(scrollPercent * 60); 
            postarSection.style.setProperty('--parallax-y', `${yPos}px`);
        });

        postarSection.style.setProperty('--parallax-y', `0px`);
    }

    const postarTextarea = document.querySelector('.postar-textarea');
    if (!postarTextarea) return;

    const postarBtn = document.querySelector('.postar-btn');
    const imageBtn = document.querySelector('.image-btn');
    const emojiBtn = document.querySelector('.emoji-btn');
    const tagBtn = document.querySelector('.tag-btn');
    const postarPreview = document.querySelector('.postar-preview');
    const previewImage = document.querySelector('.preview-image');
    const removePreview = document.querySelector('.remove-preview');
    const postarUserAvatar = document.getElementById('postarUserAvatar');
    const postarUserName = document.getElementById('postarUserName');
    let selectedTags = [];

    function atualizarInfoUsuario() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (postarUserName) {
                    postarUserName.textContent = user.nome || 'Seu nome';
                }
                if (postarUserAvatar) {
                    postarUserAvatar.src = user.avatar || '/assets/img/user.png';
                }
            } catch (e) {
                console.error('Erro ao parsear dados do usuário:', e);
            }
        }
    }
    function verificarTexto() {
        const texto = postarTextarea.value.trim();
        const temImagem = postarPreview.style.display !== 'none';
        
        if (texto.length > 0 || temImagem) {
            postarBtn.disabled = false;
            postarBtn.style.opacity = '1';
        } else {
            postarBtn.disabled = true;
            postarBtn.style.opacity = '0.6';
        }
    }

    // Contador de caracteres
    function atualizarContador() {
        const texto = postarTextarea.value;
        const maxLength = 500;
        const restante = maxLength - texto.length;

        let contador = document.querySelector('.char-counter');
        if (!contador) {
            contador = document.createElement('div');
            contador.className = 'char-counter';
            
            postarTextarea.parentElement.insertBefore(contador, postarTextarea);

            contador.style.cssText = `
                text-align: right;
                font-size: 0.85rem;
                color: #6c757d;
                padding-right: 8px;
                margin-bottom: -1rem; /* Compensa o 'gap' do flex container pai */
                position: relative; /* Garante que o z-index funcione se necessário */
                z-index: 1;
            `;
        }
        
        contador.textContent = `${restante}`;
        
        if (restante < 50) {
            contador.style.color = '#dc3545';
        } else if (restante < 100) {
            contador.style.color = '#ffc107';
        } else {
            contador.style.color = '#6c757d';
        }
    }

    // Adicionar barra de progresso de upload
    function showUploadProgressBar() {
        let bar = document.getElementById('cloudinary-upload-progress');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'cloudinary-upload-progress';
            bar.style.position = 'relative';
            bar.style.width = '100%';
            bar.style.height = '6px';
            bar.style.background = '#e9ecef';
            bar.style.borderRadius = '4px';
            bar.style.overflow = 'hidden';
            bar.style.margin = '10px 0 0 0';
            const inner = document.createElement('div');
            inner.style.height = '100%';
            inner.style.width = '0%';
            inner.style.background = 'linear-gradient(90deg, #007bff, #60a5fa)';
            inner.style.transition = 'width 0.3s';
            inner.id = 'cloudinary-upload-bar-inner';
            bar.appendChild(inner);
            const postarCard = document.querySelector('.postar-card');
            postarCard.appendChild(bar);
        }
        bar.style.display = 'block';
        return bar;
    }
    function updateUploadProgressBar(percent) {
        const inner = document.getElementById('cloudinary-upload-bar-inner');
        if (inner) {
            inner.style.width = percent + '%';
        }
    }
    function hideUploadProgressBar() {
        const bar = document.getElementById('cloudinary-upload-progress');
        if (bar) {
            bar.style.display = 'none';
            const inner = document.getElementById('cloudinary-upload-bar-inner');
            if (inner) inner.style.width = '0%';
        }
    }

    // Substituir a função setupImageUpload para usar barra de progresso
    function setupImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        imageBtn.addEventListener('click', () => {
            input.click();
        });

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (window.validateImageFile && !window.validateImageFile(file)) {
                    return;
                }
                // Mostra preview local enquanto faz upload
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    postarPreview.style.display = 'block';
                    verificarTexto();
                    postarPreview.style.opacity = '0';
                    postarPreview.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        postarPreview.style.transition = 'all 0.3s ease';
                        postarPreview.style.opacity = '1';
                        postarPreview.style.transform = 'scale(1)';
                    }, 10);
                };
                reader.readAsDataURL(file);

                // Upload para Cloudinary com barra de progresso
                postarBtn.disabled = true;
                showUploadProgressBar();
                try {
                    // Usar XMLHttpRequest para progresso
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', window.CLOUDINARY_CONFIG.UPLOAD_PRESET);
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`);
                    xhr.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            const percent = Math.round((e.loaded / e.total) * 100);
                            updateUploadProgressBar(percent);
                        }
                    };
                    xhr.onload = function() {
                        hideUploadProgressBar();
                        postarBtn.disabled = false;
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                previewImage.dataset.cloudinaryUrl = data.secure_url;
                            } catch (err) {
                                alert('Erro ao processar resposta do Cloudinary.');
                                previewImage.src = '';
                                postarPreview.style.display = 'none';
                            }
                        } else {
                            alert('Erro ao enviar imagem para o Cloudinary: ' + xhr.responseText);
                            previewImage.src = '';
                            postarPreview.style.display = 'none';
                        }
                    };
                    xhr.onerror = function() {
                        hideUploadProgressBar();
                        postarBtn.disabled = false;
                        alert('Erro ao enviar imagem para o Cloudinary.');
                        previewImage.src = '';
                        postarPreview.style.display = 'none';
                    };
                    xhr.send(formData);
                } catch (err) {
                    hideUploadProgressBar();
                    postarBtn.disabled = false;
                    alert('Erro ao enviar imagem para o Cloudinary.');
                    previewImage.src = '';
                    postarPreview.style.display = 'none';
                }
            }
        });
    }

    function setupRemovePreview() {
        removePreview.addEventListener('click', () => {
            postarPreview.style.transition = 'all 0.3s ease';
            postarPreview.style.opacity = '0';
            postarPreview.style.transform = 'scale(0.8)';
            setTimeout(() => {
                postarPreview.style.display = 'none';
                previewImage.src = '';
                previewImage.dataset.cloudinaryUrl = '';
                verificarTexto();
            }, 300);
        });
    }

    // emojis
    function setupEmojiPicker() {
        const emojis = ['😊', '😢', '😡', '😴', '😌', '😰', '😤', '😍', '🤗', '🙏', '💪', '🧘', '🌱', '☀️', '🌙', '💙'];
        
        emojiBtn.addEventListener('click', () => {
            // popup de emojis
            let emojiPopup = document.querySelector('.emoji-popup');
            if (emojiPopup) {
                emojiPopup.remove();
                return;
            }

            emojiPopup = document.createElement('div');
            emojiPopup.className = 'emoji-popup';
            emojiPopup.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 10px;
                padding: 10px;
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 5px;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                margin-top: 5px;
            `;

            emojis.forEach(emoji => {
                const emojiBtn = document.createElement('button');
                emojiBtn.textContent = emoji;
                emojiBtn.style.cssText = `
                    border: none;
                    background: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 5px;
                    transition: background 0.2s;
                `;
                emojiBtn.addEventListener('mouseenter', () => {
                    emojiBtn.style.background = '#f8f9fa';
                });
                emojiBtn.addEventListener('mouseleave', () => {
                    emojiBtn.style.background = 'none';
                });
                emojiBtn.addEventListener('click', () => {
                    const cursorPos = postarTextarea.selectionStart;
                    const textBefore = postarTextarea.value.substring(0, cursorPos);
                    const textAfter = postarTextarea.value.substring(cursorPos);
                    postarTextarea.value = textBefore + emoji + textAfter;
                    postarTextarea.focus();
                    postarTextarea.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
                    emojiPopup.remove();
                    verificarTexto();
                    atualizarContador();
                });
                emojiPopup.appendChild(emojiBtn);
            });

            emojiBtn.parentElement.style.position = 'relative';
            emojiBtn.parentElement.appendChild(emojiPopup);

            document.addEventListener('click', function closeEmojiPopup(e) {
                if (!emojiPopup.contains(e.target) && !emojiBtn.contains(e.target)) {
                    emojiPopup.remove();
                    document.removeEventListener('click', closeEmojiPopup);
                }
            });
        });
    }

    function setupTagPicker() {
        const tags = ['#ansiedade', '#meditação', '#terapia', '#autoajuda', '#bem-estar', '#saudemental', '#comunidade', '#dicas'];
        const tagsContainer = document.querySelector('.selected-tags-container');
        
        tagBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 

            let existingPopup = document.querySelector('.tag-popup');
            if (existingPopup) {
                existingPopup.remove();
                return;
            }

            const tagPopup = document.createElement('div');
            tagPopup.className = 'tag-popup';
            // popup tag
            tagPopup.style.cssText = `
                position: absolute;
                bottom: 110%; /* Posiciona acima do botão pai */
                left: 0;
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                z-index: 1000;
                box-shadow: 0 -5px 15px rgba(0,0,0,0.1); /* Sombra para cima */
                min-width: 150px;
            `;

            tags.forEach(tagText => {
                const tagElementBtn = document.createElement('button');
                tagElementBtn.textContent = tagText;
                tagElementBtn.style.cssText = `
                    border: none;
                    background: #f8f9fa;
                    color: #007bff;
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 15px;
                    transition: all 0.2s;
                    text-align: left;
                `;
                tagElementBtn.addEventListener('mouseenter', () => {
                    tagElementBtn.style.background = '#007bff';
                    tagElementBtn.style.color = 'white';
                });
                tagElementBtn.addEventListener('mouseleave', () => {
                    tagElementBtn.style.background = '#f8f9fa';
                    tagElementBtn.style.color = '#007bff';
                });
                
                tagElementBtn.addEventListener('click', () => {
                    if (!selectedTags.includes(tagText) && selectedTags.length < 5) {
                        selectedTags.push(tagText);
                        
                        const pillElement = document.createElement('div');
                        pillElement.className = 'selected-tag';
                        pillElement.textContent = tagText;

                        const removeBtn = document.createElement('button');
                        removeBtn.className = 'remove-tag-btn';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.onclick = () => {
                            selectedTags = selectedTags.filter(t => t !== tagText);
                            pillElement.remove();
                        };

                        pillElement.appendChild(removeBtn);
                        tagsContainer.appendChild(pillElement);
                    }
                    tagPopup.remove(); 
                });
                tagPopup.appendChild(tagElementBtn);
            });

            tagBtn.parentElement.style.position = 'relative';
            tagBtn.parentElement.appendChild(tagPopup);
        });
        
        document.addEventListener('click', (e) => {
            const tagPopup = document.querySelector('.tag-popup');
            if (tagPopup && !tagBtn.contains(e.target) && !tagPopup.contains(e.target)) {
                tagPopup.remove();
            }
        });
    }

    function setupPublishPost() {
        postarBtn.addEventListener('click', async () => {
            const texto = postarTextarea.value.trim();
            // Pega a URL do Cloudinary se houver
            const imagem = previewImage.dataset.cloudinaryUrl || '';
            if (texto.length === 0 && !imagem) return;
            const user = getUserData();
            if (!user) {
                alert('Você precisa estar logado para postar.');
                return;
            }
            const post = {
                userId: user.id,
                autor: user.nome,
                avatar: user.avatar || '/assets/img/user.png',
                data: new Date().toLocaleString('pt-BR'),
                tags: selectedTags,
                img: imagem,
                content: texto,
                title: texto.substring(0, 40) + (texto.length > 40 ? '...' : ''),
                likes: 0,
                salvos: 0,
                comentarios: [],
                likedBy: [],
                savedBy: []
            };
            try {
                await publicarPostBackend(post);
                postarTextarea.value = '';
                previewImage.src = '';
                previewImage.dataset.cloudinaryUrl = '';
                postarPreview.style.display = 'none';
                selectedTags = [];
                document.querySelector('.selected-tags-container').innerHTML = '';
                verificarTexto();
                atualizarContador();
                mostrarMensagemSucesso('Post publicado com sucesso!');
                atualizarFeed();
            } catch (e) {
                alert('Erro ao publicar post.');
            }
        });
    }

    // mensagem de sucesso
    function mostrarMensagemSucesso(mensagem) {
        const toast = document.createElement('div');
        toast.className = 'toast-success';
        toast.textContent = mensagem;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    if (postarTextarea) {
        postarTextarea.addEventListener('input', () => {
            verificarTexto();
            atualizarContador();
        });

        postarTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                postarBtn.click();
            }
        });
    }

    // Inicializar funcionalidades
    atualizarInfoUsuario();
    setupImageUpload();
    setupRemovePreview();
    setupEmojiPicker();
    setupTagPicker();
    setupPublishPost();
    verificarTexto();
    atualizarContador();
    renderTodosPostsSection(true);
}); 

// === INÍCIO DA NOVA LÓGICA DE POSTAGENS COM BACKEND ===

// Função para obter token do usuário logado
function getAuthToken() {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
        const user = JSON.parse(userData);
        return user.token || null;
    } catch {
        return null;
    }
}

// Função para obter dados do usuário logado
function getUserData() {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

// Função para criar um post no backend
async function publicarPostBackend(post) {
    const token = getAuthToken();
    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': 'Bearer ' + token } : {})
            },
            body: JSON.stringify(post)
        });
        if (!response.ok) throw new Error('Erro ao publicar post');
        return await response.json();
    } catch (e) {
        throw e;
    }
}

// Função para buscar posts do backend
async function buscarPostsBackend() {
    try {
        const response = await fetch('/posts?_sort=id&_order=desc');
        if (!response.ok) throw new Error('Erro ao buscar posts');
        return await response.json();
    } catch (e) {
        return [];
    }
}

// Função para deletar post
async function deletarPostBackend(postId) {
    const token = getAuthToken();
    try {
        const response = await fetch(`/posts/${postId}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (!response.ok) throw new Error('Erro ao deletar post');
        return true;
    } catch (e) {
        return false;
    }
}

async function atualizarPostBackend(postId, data) {
    const token = getAuthToken();
    try {
        const response = await fetch(`/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': 'Bearer ' + token } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar post');
        return await response.json();
    } catch (e) {
        console.error("Erro ao atualizar post:", e);
        throw e;
    }
}

// Função para renderizar o feed de posts
async function atualizarFeed() {
    const feedContainerId = 'comunidade-feed-container';
    let feedContainer = document.getElementById(feedContainerId);
    if (!feedContainer) {
        feedContainer = document.createElement('div');
        feedContainer.id = feedContainerId;
        feedContainer.className = 'comunidade-feed-container';
        const postarSection = document.querySelector('.postar-section');
        postarSection.parentNode.insertBefore(feedContainer, postarSection.nextSibling);
    }
    feedContainer.innerHTML = '<div class="loading-posts">Carregando posts...</div>';
    const posts = await buscarPostsBackend();
    const user = getUserData();
    feedContainer.innerHTML = '';
    if (!posts.length) {
        feedContainer.innerHTML = '<div class="no-posts">Nenhum post encontrado.</div>';
        return;
    }
    posts.forEach(post => {
        const isAuthor = user && post.userId === user.id;
        const postEl = document.createElement('div');
        postEl.className = 'twitter-post-card';
        postEl.innerHTML = `
            <div class="post-header">
                <a href="perfil.html?userId=${post.userId}" title="Ver perfil de ${post.autor || 'Usuário'}">
                    <img src="${post.avatar || '/assets/img/user.png'}" alt="avatar" class="post-avatar">
                </a>
                <div class="post-user-info">
                    <a href="perfil.html?userId=${post.userId}" title="Ver perfil de ${post.autor || 'Usuário'}" style="text-decoration: none; color: inherit;">
                        <span class="post-author">${post.autor || 'Usuário'}</span>
                    </a>
                    <span class="post-time">• ${post.data || ''}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content || ''}</p>
                ${post.img ? `<img src="${post.img}" alt="imagem do post" class="post-img" style="cursor:zoom-in;">` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(post.comentarios ? post.comentarios.length : 0)}</span></button>
                <button class="action-btn like-btn"><i class="far fa-heart"></i> <span>${post.likes || 0}</span></button>
                <button class="action-btn save-btn"><i class="far fa-bookmark"></i> <span>${post.salvos || 0}</span></button>
                ${isAuthor ? `<button class="action-btn delete-post-btn" title="Excluir" data-id="${post.id}"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        `;
        feedContainer.appendChild(postEl);
    });
    // Event listener para exclusão
    feedContainer.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            if (confirm('Deseja realmente excluir este post?')) {
                const postId = this.getAttribute('data-id');
                const ok = await deletarPostBackend(postId);
                if (ok) {
                    mostrarMensagemSucesso('Post excluído com sucesso!');
                    atualizarFeed();
                } else {
                    alert('Erro ao excluir post.');
                }
            }
        });
    });
}

// Paginação para todos os posts
let todosPostsPagina = 1;
const TODOS_POSTS_POR_PAGINA = 10;
let todosPostsUltimaBusca = [];
let todosPostsAcabou = false;
let ordenacaoAtual = 'recentes'; // Padrão

async function renderTodosPostsSection(reset = false) {
    const todosPostsSection = document.getElementById('todos-posts');
    if (!todosPostsSection) return;
    const user = getUserData();

    if (reset) {
        todosPostsSection.innerHTML = '';
        todosPostsPagina = 1;
        todosPostsUltimaBusca = [];
        todosPostsAcabou = false;
    }
    if (todosPostsPagina === 1) {
        todosPostsSection.innerHTML = '<div style="margin: 2rem; color: #888;">Carregando posts...</div>';
    }

    // Define o endpoint com base na ordenação
    let endpoint = `/posts?_page=${todosPostsPagina}&_limit=${TODOS_POSTS_POR_PAGINA}`;
    if (ordenacaoAtual === 'recentes') {
        endpoint += '&_sort=id&_order=desc';
    } else if (ordenacaoAtual === 'curtidos') {
        endpoint += '&_sort=likes&_order=desc';
    }

    // Buscar posts paginados
    const response = await fetch(endpoint);
    const posts = await response.json();
    if (todosPostsPagina === 1) {
        todosPostsSection.innerHTML = '';
    }
    if (!posts.length) {
        if (todosPostsPagina === 1) {
            todosPostsSection.innerHTML = '<div style="margin: 2rem; color: #888;">Nenhum post encontrado.</div>';
        }
        todosPostsAcabou = true;
        const btn = document.getElementById('btn-carregar-mais-posts');
        if (btn) btn.style.display = 'none';
        return;
    }
    todosPostsUltimaBusca = todosPostsUltimaBusca.concat(posts);
    posts.forEach((post, idx) => {
        const postEl = document.createElement('div');
        postEl.className = 'twitter-post-card';
        postEl.dataset.postId = post.id;
        
        const isAuthor = user && post.userId === user.id;
        const isLiked = user && post.likedBy && post.likedBy.includes(user.id);
        const isSaved = user && post.savedBy && post.savedBy.includes(user.id);

        postEl.innerHTML = `
            <div class="post-header">
                <a href="perfil.html?userId=${post.userId}" title="Ver perfil de ${post.autor || 'Usuário'}">
                    <img src="${post.avatar || '/assets/img/user.png'}" alt="avatar" class="post-avatar">
                </a>
                <div class="post-user-info">
                    <a href="perfil.html?userId=${post.userId}" title="Ver perfil de ${post.autor || 'Usuário'}" style="text-decoration: none; color: inherit;">
                        <span class="post-author">${post.autor || 'Usuário'}</span>
                    </a>
                    <span class="post-time">• ${post.data || ''}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content || ''}</p>
                ${post.img ? `<img src="${post.img}" alt="imagem do post" class="post-img" style="cursor:zoom-in;">` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(post.comentarios ? post.comentarios.length : 0)}</span></button>
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}"><i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> <span>${post.likes || 0}</span></button>
                <button class="action-btn save-btn ${isSaved ? 'saved' : ''}"><i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> <span>${post.salvos || 0}</span></button>
                ${isAuthor ? `<button class="action-btn delete-post-btn" title="Excluir" data-id="${post.id}"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        `;
        todosPostsSection.appendChild(postEl);
    });
    // Modal expandido
    const modal = document.getElementById('modal-imagem-post');
    const modalImg = document.getElementById('imagem-modal-ampliada');
    const modalAvatar = modal.querySelector('.modal-avatar');
    const modalAutor = modal.querySelector('.modal-autor');
    const modalData = modal.querySelector('.modal-data');
    const modalConteudo = modal.querySelector('.modal-conteudo-post');
    const modalAcoes = modal.querySelector('.modal-acoes');
    const modalInfo = modal.querySelector('.modal-info-direita');
    const modalComentariosContainer = modal.querySelector('.modal-comentarios');
    const modalImagemEsquerda = modal.querySelector('.modal-imagem-esquerda');
    const commentUserAvatar = document.getElementById('comment-user-avatar');
    const modalAvatarLink = modal.querySelector('.modal-avatar-link');
    const modalAutorLink = modal.querySelector('.modal-autor-link');

    if (!modal || !modalInfo || !modalComentariosContainer) return;
    
    modalInfo.dataset.postId = post.id;
    if(modalAvatar) modalAvatar.src = post.avatar || '/assets/img/user.png';
    if(modalAutor) modalAutor.textContent = post.autor || 'Usuário';
    if(modalData) modalData.textContent = post.data || '';
    if(modalConteudo) modalConteudo.textContent = post.content || '';

    // Adiciona os links para o perfil no modal
    if (modalAvatarLink) modalAvatarLink.href = `perfil.html?userId=${post.userId}`;
    if (modalAutorLink) modalAutorLink.href = `perfil.html?userId=${post.userId}`;

    // Ajusta o avatar no formulário de comentário
    if (user && commentUserAvatar) {
        commentUserAvatar.src = user.avatar || '/assets/img/user.png';
    } else if (commentUserAvatar) {
        commentUserAvatar.src = '/assets/img/user.png';
    }

    // Adapta o layout do modal com ou sem imagem
    if (post.img) {
        modalImagemEsquerda.style.display = 'flex';
        modalInfo.style.margin = '32px 32px 32px 0';
        if(modalImg) modalImg.src = post.img;
    } else {
        modalImagemEsquerda.style.display = 'none';
        modalInfo.style.margin = 'auto';
        if(modalImg) modalImg.src = '';
    }

    const modalIsLiked = user && post.likedBy && post.likedBy.includes(user.id);
    const modalIsSaved = user && post.savedBy && post.savedBy.includes(user.id);
    
    if(modalAcoes) modalAcoes.innerHTML = `
        <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(post.comentarios ? post.comentarios.length : 0)}</span></button>
        <button class="action-btn like-btn ${modalIsLiked ? 'liked' : ''}"><i class="${modalIsLiked ? 'fas' : 'far'} fa-heart"></i> <span>${post.likes || 0}</span></button>
        <button class="action-btn save-btn ${modalIsSaved ? 'saved' : ''}"><i class="${modalIsSaved ? 'fas' : 'far'} fa-bookmark"></i> <span>${post.salvos || 0}</span></button>
    `;

    renderizarComentariosNoModal(post, modalComentariosContainer, user, modal, modalAcoes, modalIsLiked, modalIsSaved);
    modal.style.display = 'flex';
}

// Evento para fechar o modal de imagem
(function setupModalImagemPost() {
    const modal = document.getElementById('modal-imagem-post');
    const modalImg = document.getElementById('imagem-modal-ampliada');
    const fecharBtn = document.getElementById('fechar-modal-imagem');
    if (fecharBtn) {
        fecharBtn.onclick = () => {
            if (modal) modal.style.display = 'none';
            if (modalImg) modalImg.src = '';
        };
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modalImg) modalImg.src = '';
            }
        });
    }
})();

function updateUIAfterInteraction(postId) {
    const post = todosPostsUltimaBusca.find(p => p.id == postId);
    if (!post) return;

    const user = getUserData();
    const isLiked = user && post.likedBy && post.likedBy.includes(user.id);
    const isSaved = user && post.savedBy && post.savedBy.includes(user.id);
    
    // Atualiza o card no feed principal e no modal, se estiverem visíveis
    const elementsToUpdate = document.querySelectorAll(
        `.twitter-post-card[data-post-id="${postId}"], .modal-info-direita[data-post-id="${postId}"]`
    );

    elementsToUpdate.forEach(element => {
        const likeBtn = element.querySelector('.like-btn');
        const saveBtn = element.querySelector('.save-btn');

        if (likeBtn) {
            likeBtn.classList.toggle('liked', isLiked);
            likeBtn.querySelector('i').className = isLiked ? 'fas fa-heart' : 'far fa-heart';
            likeBtn.querySelector('span').textContent = post.likes || 0;
        }

        if (saveBtn) {
            saveBtn.classList.toggle('saved', isSaved);
            saveBtn.querySelector('i').className = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
            saveBtn.querySelector('span').textContent = post.salvos || 0;
        }
    });
}

function setupPostInteractions() {
    const feedContainer = document.getElementById('todos-posts');
    const modal = document.getElementById('modal-imagem-post');
    if (!feedContainer || !modal) return;

    const handleInteraction = async (e) => {
        const user = getUserData();
        if (!user) {
            if (e.target.closest('.like-btn') || e.target.closest('.save-btn')) {
                alert('Você precisa estar logado para interagir com os posts.');
            }
            return;
        }

        const likeBtn = e.target.closest('.like-btn');
        const saveBtn = e.target.closest('.save-btn');
        if (!likeBtn && !saveBtn) return;

        const postCard = e.target.closest('.twitter-post-card');
        const modalInfo = e.target.closest('.modal-info-direita');
        
        let postId;
        if (postCard) {
            postId = postCard.dataset.postId;
        } else if (modalInfo) {
            postId = modalInfo.dataset.postId;
        }

        if (!postId) return;

        const post = todosPostsUltimaBusca.find(p => p.id == postId);
        if (!post) return;

        let interactionType = null;
        if (likeBtn) interactionType = 'like';
        if (saveBtn) interactionType = 'save';

        if (interactionType) {
            const userId = user.id;
            const key = interactionType === 'like' ? 'likedBy' : 'savedBy';
            const countKey = interactionType === 'like' ? 'likes' : 'salvos';
            
            post[key] = post[key] || [];
            const isInteracted = post[key].includes(userId);

            // Atualização Otimista da UI
            if (isInteracted) {
                post[countKey] = (post[countKey] || 1) - 1;
                post[key] = post[key].filter(id => id !== userId);
            } else {
                post[countKey] = (post[countKey] || 0) + 1;
                post[key].push(userId);
            }
            updateUIAfterInteraction(postId); // Atualiza a UI imediatamente
            
            try {
                await atualizarPostBackend(postId, { [countKey]: post[countKey], [key]: post[key] });
            } catch (err) {
                 console.error(`Falha ao ${interactionType} o post. Revertendo.`, err);
                 // Reverte a alteração nos dados locais em caso de erro na API
                 if (isInteracted) {
                    post[countKey]++;
                    post[key].push(userId);
                 } else {
                    post[countKey]--;
                    post[key] = post[key].filter(id => id !== userId);
                 }
                 // Atualiza a UI novamente para refletir o estado revertido
                 updateUIAfterInteraction(postId);
            }
        }
    };

    feedContainer.addEventListener('click', handleInteraction);
    modal.addEventListener('click', handleInteraction);
}

// Adicionar função auxiliar para re-renderizar comentários no modal
function renderizarComentariosNoModal(post, modalComentariosContainer, user, modal, modalAcoes, modalIsLiked, modalIsSaved) {
    modalComentariosContainer.innerHTML = '';
    atualizarContadorComentarios(post.id, post.comentarios ? post.comentarios.length : 0);
    if (post.comentarios && post.comentarios.length > 0) {
        post.comentarios.forEach(comentario => {
            const comentarioDiv = document.createElement('div');
            comentarioDiv.className = 'comment-item';
            const podeDeletar = user && (comentario.userId === user.id || post.userId === user.id);
            comentarioDiv.innerHTML = `
                <a href="perfil.html?userId=${comentario.userId}" title="Ver perfil de ${comentario.autor || 'Usuário'}">
                    <img src="${comentario.avatar || '/assets/img/user.png'}" class="comment-avatar">
                </a>
                <div class="comment-content">
                    <div class="comment-header">
                        <a href="perfil.html?userId=${comentario.userId}" title="Ver perfil de ${comentario.autor || 'Usuário'}" style="text-decoration: none; color: inherit;">
                            <span class="comment-author">${comentario.autor || 'Usuário'}</span>
                        </a>
                        <span class="comment-time">${comentario.data ? new Date(comentario.data).toLocaleString('pt-BR') : ''}</span>
                        ${podeDeletar ? `<button class="comment-delete-btn" title="Excluir comentário">&times;</button>` : ''}
                    </div>
                    <div class="comment-text">${comentario.text}</div>
                </div>
            `;
            const deleteBtn = comentarioDiv.querySelector('.comment-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Deseja realmente excluir este comentário?')) {
                        const novosComentarios = post.comentarios.filter(c => c.id !== comentario.id);
                        try {
                            await atualizarPostBackend(post.id, { comentarios: novosComentarios });
                            post.comentarios = novosComentarios;
                            renderizarComentariosNoModal(post, modalComentariosContainer, user, modal, modalAcoes, modalIsLiked, modalIsSaved);
                        } catch (e) {
                            alert('Erro ao excluir comentário.');
                        }
                    }
                });
            }
            modalComentariosContainer.appendChild(comentarioDiv);
        });
    } else {
        modalComentariosContainer.innerHTML = '<div style="color:#888;">Nenhum comentário ainda.</div>';
    }
}

// Função para atualizar o contador de comentários no feed e no modal
function atualizarContadorComentarios(postId, novoTotal) {
    document.querySelectorAll(`.twitter-post-card[data-post-id="${postId}"] .comment-btn span`).forEach(span => {
        span.textContent = novoTotal;
    });
    const modal = document.getElementById('modal-imagem-post');
    if (modal && modal.style.display === 'flex') {
        const modalInfo = modal.querySelector('.modal-info-direita');
        if (modalInfo && modalInfo.dataset.postId == postId) {
            const modalAcoes = modal.querySelector('.modal-acoes');
            if (modalAcoes) {
                const commentBtn = modalAcoes.querySelector('.comment-btn span');
                if (commentBtn) commentBtn.textContent = novoTotal;
            }
        }
    }
}

// Lógica para postar comentários
function setupCommenting() {
    const form = document.getElementById('form-comentario');
    const input = document.getElementById('input-comentario');
    const modal = document.getElementById('modal-imagem-post');
    if (!form || !input || !modal) return;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const user = getUserData();
        if (!user) {
            alert('Você precisa estar logado para comentar.');
            return;
        }

        const modalInfo = modal.querySelector('.modal-info-direita');
        const postId = modalInfo.dataset.postId;
        const post = todosPostsUltimaBusca.find(p => p.id == postId);
        if (!post) return;

        const newComment = {
            id: Date.now(),
            userId: user.id,
            autor: user.nome,
            avatar: user.avatar || '/assets/img/user.png',
            text: text,
            data: new Date().toISOString()
        };

        post.comentarios = post.comentarios || [];
        post.comentarios.push(newComment);

        try {
            await atualizarPostBackend(postId, { comentarios: post.comentarios });
            input.value = '';
            const modalComentariosContainer = modal.querySelector('.modal-comentarios');
            const modalAcoes = modal.querySelector('.modal-acoes');
            const modalIsLiked = user && post.likedBy && post.likedBy.includes(user.id);
            const modalIsSaved = user && post.savedBy && post.savedBy.includes(user.id);
            renderizarComentariosNoModal(post, modalComentariosContainer, user, modal, modalAcoes, modalIsLiked, modalIsSaved);
        } catch (err) {
            console.error('Erro ao postar comentário:', err);
            alert('Não foi possível enviar seu comentário. Tente novamente.');
            post.comentarios.pop();
        }
    };

    form.addEventListener('submit', handleSubmit);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    });
}

// Adicionar event listeners para cliques nos cards
function setupCardClickListeners() {
    document.getElementById('todos-posts').addEventListener('click', function(e) {
        const postCard = e.target.closest('.twitter-post-card');
        if (!postCard) return;

        const postId = postCard.dataset.postId;

        // Caso 1: Clicou no botão de comentário
        if (e.target.closest('.comment-btn')) {
            e.stopPropagation(); // Impede que outros cliques no card sejam acionados
            abrirModalPostPorId(postId);
            setTimeout(() => {
                const commentInput = document.getElementById('input-comentario');
                if (commentInput) {
                    commentInput.focus();
                }
            }, 150); // Delay para garantir que o modal esteja visível
            return;
        }

        // Caso 2: Clicou em outro botão de ação (like, save, delete) ou num link
        if (e.target.closest('button.action-btn') || e.target.closest('a')) {
            // Deixa que os outros event listeners (setupPostInteractions) cuidem disso
            return;
        }

        // Caso 3: Clicou no card em geral (fora dos botões de ação)
        abrirModalPostPorId(postId);
    });
}

// === FIM DE POSTAGENS COM BACKEND === 
document.addEventListener('DOMContentLoaded', () => {
    renderTodosPostsSection(true);
    setupPostInteractions();
    setupCommenting();
    setupCardClickListeners();
    setupNewPostsNotifier();
    setupSortSelector();
}); 

// Função para abrir o modal de um post pelo ID e adaptar a UI
function abrirModalPostPorId(postId) {
    const post = todosPostsUltimaBusca.find(p => p.id == postId);
    if (!post) return;
    const user = getUserData();
    const modal = document.getElementById('modal-imagem-post');
    const modalImg = document.getElementById('imagem-modal-ampliada');
    const modalAvatar = modal.querySelector('.modal-avatar');
    const modalAutor = modal.querySelector('.modal-autor');
    const modalData = modal.querySelector('.modal-data');
    const modalConteudo = modal.querySelector('.modal-conteudo-post');
    const modalAcoes = modal.querySelector('.modal-acoes');
    const modalInfo = modal.querySelector('.modal-info-direita');
    const modalComentariosContainer = modal.querySelector('.modal-comentarios');
    const modalImagemEsquerda = modal.querySelector('.modal-imagem-esquerda');
    const commentUserAvatar = document.getElementById('comment-user-avatar');
    const modalAvatarLink = modal.querySelector('.modal-avatar-link');
    const modalAutorLink = modal.querySelector('.modal-autor-link');

    if (!modal || !modalInfo || !modalComentariosContainer) return;
    
    modalInfo.dataset.postId = post.id;
    if(modalAvatar) modalAvatar.src = post.avatar || '/assets/img/user.png';
    if(modalAutor) modalAutor.textContent = post.autor || 'Usuário';
    if(modalData) modalData.textContent = post.data || '';
    if(modalConteudo) modalConteudo.textContent = post.content || '';

    // Adiciona os links para o perfil no modal
    if (modalAvatarLink) modalAvatarLink.href = `perfil.html?userId=${post.userId}`;
    if (modalAutorLink) modalAutorLink.href = `perfil.html?userId=${post.userId}`;

    // Ajusta o avatar no formulário de comentário
    if (user && commentUserAvatar) {
        commentUserAvatar.src = user.avatar || '/assets/img/user.png';
    } else if (commentUserAvatar) {
        commentUserAvatar.src = '/assets/img/user.png';
    }

    // Adapta o layout do modal com ou sem imagem
    if (post.img) {
        modalImagemEsquerda.style.display = 'flex';
        modalInfo.style.margin = '32px 32px 32px 0';
        if(modalImg) modalImg.src = post.img;
    } else {
        modalImagemEsquerda.style.display = 'none';
        modalInfo.style.margin = 'auto';
        if(modalImg) modalImg.src = '';
    }

    const modalIsLiked = user && post.likedBy && post.likedBy.includes(user.id);
    const modalIsSaved = user && post.savedBy && post.savedBy.includes(user.id);
    
    if(modalAcoes) modalAcoes.innerHTML = `
        <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(post.comentarios ? post.comentarios.length : 0)}</span></button>
        <button class="action-btn like-btn ${modalIsLiked ? 'liked' : ''}"><i class="${modalIsLiked ? 'fas' : 'far'} fa-heart"></i> <span>${post.likes || 0}</span></button>
        <button class="action-btn save-btn ${modalIsSaved ? 'saved' : ''}"><i class="${modalIsSaved ? 'fas' : 'far'} fa-bookmark"></i> <span>${post.salvos || 0}</span></button>
    `;

    renderizarComentariosNoModal(post, modalComentariosContainer, user, modal, modalAcoes, modalIsLiked, modalIsSaved);
    modal.style.display = 'flex';
}

// Função para atualizar o contador de comentários no feed e no modal
function atualizarContadorComentarios(postId, novoTotal) {
    document.querySelectorAll(`.twitter-post-card[data-post-id="${postId}"] .comment-btn span`).forEach(span => {
        span.textContent = novoTotal;
    });
    const modal = document.getElementById('modal-imagem-post');
    if (modal && modal.style.display === 'flex') {
        const modalInfo = modal.querySelector('.modal-info-direita');
        if (modalInfo && modalInfo.dataset.postId == postId) {
            const modalAcoes = modal.querySelector('.modal-acoes');
            if (modalAcoes) {
                const commentBtn = modalAcoes.querySelector('.comment-btn span');
                if (commentBtn) commentBtn.textContent = novoTotal;
            }
        }
    }
}

function setupNewPostsNotifier() {
    const notifier = document.getElementById('new-posts-notifier');
    const postsContainer = document.getElementById('todos-posts-container');
    if (!notifier || !postsContainer) return;

    let isVisible = false;

    // Função para verificar e popular os avatares
    const populateNotifierAvatars = async () => {
        const avatarStack = notifier.querySelector('.user-avatars-stack');
        if (!avatarStack || avatarStack.children.length > 0) return; // Não busca se já tiver avatares

        try {
            const response = await fetch('/posts?_sort=id&_order=desc&_limit=5');
            const recentPosts = await response.json();
            
            const uniqueUsers = [];
            const userIds = new Set();

            for (const post of recentPosts) {
                if (!userIds.has(post.userId) && uniqueUsers.length < 3) {
                    uniqueUsers.push({ avatar: post.avatar, autor: post.autor });
                    userIds.add(post.userId);
                }
            }
            
            avatarStack.innerHTML = '';
            uniqueUsers.reverse().forEach(user => { // Inverte para o mais recente ficar por cima
                const img = document.createElement('img');
                img.src = user.avatar || '/assets/img/user.png';
                img.alt = user.autor;
                img.title = user.autor;
                avatarStack.appendChild(img);
            });
        } catch (error) {
            console.error('Falha ao popular avatares do notificador:', error);
        }
    };

    window.addEventListener('scroll', () => {
        const postsContainerTop = postsContainer.offsetTop;
        const scrollY = window.scrollY;

        if (scrollY > postsContainerTop && !isVisible) {
            isVisible = true;
            populateNotifierAvatars();
            notifier.classList.add('visible');
        } else if (scrollY <= postsContainerTop && isVisible) {
            isVisible = false;
            notifier.classList.remove('visible');
        }
    });

    notifier.addEventListener('click', () => {
        const firstPost = document.querySelector('#todos-posts .twitter-post-card');
        if (firstPost) {
            firstPost.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else {
             postsContainer.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

function setupSortSelector() {
    const filtroBtn = document.getElementById('filtro-btn');
    const filtroOpcoes = document.getElementById('filtro-opcoes');

    if (!filtroBtn || !filtroOpcoes) return;

    filtroBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filtroOpcoes.classList.toggle('visible');
        filtroBtn.classList.toggle('open');
    });

    filtroOpcoes.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('a');
        if (target) {
            ordenacaoAtual = target.dataset.value;

            // Atualiza o estado 'active'
            filtroOpcoes.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            target.classList.add('active');

            filtroOpcoes.classList.remove('visible');
            filtroBtn.classList.remove('open');
            renderTodosPostsSection(true); // Reseta e renderiza com a nova ordenação
        }
    });
    
    // Fecha o dropdown se clicar fora
    document.addEventListener('click', () => {
        if (filtroOpcoes.classList.contains('visible')) {
            filtroOpcoes.classList.remove('visible');
            filtroBtn.classList.remove('open');
        }
    });
}