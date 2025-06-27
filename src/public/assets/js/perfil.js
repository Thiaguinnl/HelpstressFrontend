document.addEventListener('DOMContentLoaded', () => {
    const perfilNomeUsuario = document.getElementById('perfil-nome-usuario');
    const perfilDescricaoUsuario = document.getElementById('perfil-descricao-usuario');
    const editarPerfilButton = document.getElementById('editar-perfil-button');
    const logoutButtonPerfil = document.getElementById('logout-button-perfil');
    const perfilAvatarImg = document.querySelector('.perfil-avatar');
    const perfilPostsGrid = document.querySelector('.perfil-posts-grid');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const postsTab = document.getElementById('posts-tab');
    const likesTab = document.getElementById('likes-tab');
    const savedTab = document.getElementById('saved-tab');

    let viewedUserId = null;
    let currentContent = [];

    function getLoggedInUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    async function fetchProfileData(userId) {
        const loggedInUser = getLoggedInUser();
        // Se o perfil visualizado for o do usuário logado, retorna os dados do localStorage, que são os mais completos.
        if (loggedInUser && loggedInUser.id == userId) {
            return loggedInUser;
        }

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${userId}`);
            if (response.ok) return await response.json();
            
            console.warn(`Endpoint /usuarios/${userId} não encontrado. Buscando dados alternativos.`);
            const postResponse = await fetch(`http://localhost:3000/posts?userId=${userId}&_limit=1`);
            if (postResponse.ok) {
                const posts = await postResponse.json();
                if (posts.length > 0) {
                    return { id: posts[0].userId, nome: posts[0].autor, avatar: posts[0].avatar, bio: 'Ainda não há uma biografia disponível para este usuário.' };
                }
            }
            throw new Error('Usuário não encontrado.');
        } catch (error) {
            console.error('Falha ao buscar dados do perfil:', error);
            return null;
        }
    }

    async function fetchContent(tab, userId) {
        let endpoint = '';
        if (tab === postsTab) endpoint = `http://localhost:3000/posts?userId=${userId}&_sort=id&_order=desc`;
        else if (tab === likesTab) endpoint = `http://localhost:3000/posts?likedBy_like=${userId}&_sort=id&_order=desc`;
        else if (tab === savedTab) endpoint = `http://localhost:3000/posts?savedBy_like=${userId}&_sort=id&_order=desc`;
        
        if (!endpoint) return [];

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Falha ao carregar conteúdo.');
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            return [];
        }
    }
    
    function renderProfileHeader(profileData, loggedInUser) {
        if (!profileData) return;

        perfilNomeUsuario.textContent = profileData.nome || 'Usuário';
        perfilDescricaoUsuario.textContent = profileData.bio || 'Compartilhe um pouco sobre você e seus interesses!';
        if (perfilAvatarImg) perfilAvatarImg.src = profileData.avatar || '/assets/img/user.png';
        document.title = `Perfil de ${profileData.nome || 'Usuário'} - Help Stress`;

        if (loggedInUser && loggedInUser.id == profileData.id) {
            if (editarPerfilButton) editarPerfilButton.style.display = 'block';
            if (logoutButtonPerfil) logoutButtonPerfil.style.display = 'block';
        } else {
            if (editarPerfilButton) editarPerfilButton.style.display = 'none';
            if (logoutButtonPerfil) logoutButtonPerfil.style.display = 'none';
        }
    }
    
    async function showContentForTab(tab, userId) {
        [postsTab, likesTab, savedTab].forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        noPostsMessage.classList.add('hidden');
        perfilPostsGrid.classList.remove('hidden');
        perfilPostsGrid.innerHTML = 'Carregando...';
        perfilPostsGrid.style.alignItems = 'start';

        const content = await fetchContent(tab, userId);
        currentContent = content;

        if (content.length > 0) {
            renderContent(content, perfilPostsGrid);
            perfilPostsGrid.classList.remove('hidden');
        } else {
            let messageTitle = 'Nenhum conteúdo aqui!';
            let messageText = 'Parece que ainda não há nada para mostrar nesta seção.';
            let buttonText = 'Explorar Comunidade';
            let buttonAction = () => window.location.href = 'comunidade.html';

            if (tab === postsTab) {
                messageTitle = 'Nenhuma postagem encontrada';
                messageText = 'Que tal compartilhar suas histórias com a comunidade?';
                buttonText = 'FAZER UMA POSTAGEM';
                buttonAction = () => window.location.href = 'comunidade.html#postagem';
            } else if (tab === likesTab) {
                messageTitle = 'Nenhuma curtida ainda!';
                messageText = 'Curta posts na comunidade para vê-los aqui.';
            } else if (tab === savedTab) {
                messageTitle = 'Nenhum item salvo!';
                messageText = 'Salve posts e artigos para vê-los aqui.';
            }

            noPostsMessage.querySelector('h2').textContent = messageTitle;
            noPostsMessage.querySelector('p').textContent = messageText;
            const btn = noPostsMessage.querySelector('.share-post-button');
            btn.textContent = buttonText;
            btn.onclick = buttonAction;
            btn.style.display = 'inline-block';
            noPostsMessage.classList.remove('hidden');
        }
    }

    async function main() {
        const loggedInUser = getLoggedInUser();
        const params = new URLSearchParams(window.location.search);
        let targetUserId = params.get('userId');

        if (!targetUserId && loggedInUser) {
            targetUserId = loggedInUser.id;
        } else if (!targetUserId && !loggedInUser) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
            return;
        }
        
        viewedUserId = targetUserId;
        const profileData = await fetchProfileData(targetUserId);

        if (!profileData) {
            alert('Não foi possível encontrar este usuário.');
            window.location.href = 'comunidade.html';
            return;
        }

        renderProfileHeader(profileData, loggedInUser);
        const isOwner = loggedInUser && loggedInUser.id == targetUserId;
        setupEventListeners(targetUserId);
        initializeTagSystem(profileData, isOwner);
        showContentForTab(postsTab, targetUserId); // Carrega a aba de posts por padrão
    }

    function setupEventListeners(userId) {
        if (editarPerfilButton) {
            editarPerfilButton.addEventListener('click', () => window.location.href = 'editarPerfil.html');
        }
        if (logoutButtonPerfil) {
            logoutButtonPerfil.addEventListener('click', () => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                alert('Você foi desconectado!');
                window.location.href = 'index.html';
            });
        }
        [postsTab, likesTab, savedTab].forEach(tab => {
            if (tab) {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    showContentForTab(tab, userId);
                });
            }
        });
        setupPostInteractions();
    }

    function initializeTagSystem(profileData, isOwner) {
        const tagsContainer = document.getElementById('tagsContainer');
        const addButton = document.getElementById('addButton');
        const modal = document.getElementById('addTagModal');
        const confirmBtn = document.getElementById('confirmAddTag');
        const tagInput = document.getElementById('newTagInput');
        
        let currentTags = profileData.tags || [];

        const renderTags = () => {
            tagsContainer.innerHTML = '';
            currentTags.forEach(tag => {
                const tagEl = document.createElement('div');
                tagEl.className = 'tag';
                tagEl.textContent = tag;

                if (isOwner) {
                    tagEl.classList.add('editable-tag');
                    tagEl.title = 'Clique para remover';
                    tagEl.onclick = async (e) => {
                        e.stopPropagation();
                        currentTags = currentTags.filter(t => t !== tag);
                        await updateUserTags(currentTags);
                        renderTags();
                    };
                }
                tagsContainer.appendChild(tagEl);
            });

            if (isOwner) {
                tagsContainer.appendChild(addButton);
            }
        };

        const updateUserTags = async (newTags) => {
            const userId = profileData.id;
            const token = getLoggedInUser()?.token;
            try {
                await fetch(`http://localhost:3000/usuarios/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) },
                    body: JSON.stringify({ tags: newTags })
                });
                const loggedInUser = getLoggedInUser();
                if (loggedInUser && loggedInUser.id === userId) {
                    loggedInUser.tags = newTags;
                    localStorage.setItem('userData', JSON.stringify(loggedInUser));
                }
            } catch (error) {
                console.error("Falha ao atualizar tags:", error);
                alert("Não foi possível atualizar as tags.");
            }
        };
        
        if (!isOwner) {
            addButton.style.display = 'none';
        }
        
        if (isOwner && confirmBtn) {
            confirmBtn.onclick = async () => {
                const newTag = tagInput.value.trim();
                if (newTag && !currentTags.includes(newTag)) {
                    currentTags.push(newTag);
                    await updateUserTags(currentTags);
                    renderTags();
                    tagInput.value = '';
                    if (modal) modal.classList.add('hidden');
                } else {
                    alert("A tag não pode estar vazia ou ser repetida.");
                }
            };
        }
        
        renderTags();
    }
    
    function renderContent(contentArray, containerElement) {
        containerElement.innerHTML = '';
        const loggedInUser = getLoggedInUser();
        const userId = loggedInUser ? loggedInUser.id : null;

        contentArray.forEach(item => {
            const isAuthor = item.userId == userId;
            const isLiked = loggedInUser && item.likedBy && item.likedBy.includes(loggedInUser.id);
            const isSaved = loggedInUser && item.savedBy && item.savedBy.includes(loggedInUser.id);
    
            const card = document.createElement('div');
            card.className = 'twitter-post-card';
            card.dataset.postId = item.id;
            card.innerHTML = `
                <div class="post-header" style="position: relative;">
                    <img src="${item.avatar || '/assets/img/user.png'}" alt="avatar" class="post-avatar">
                    <div class="post-user-info">
                        <span class="post-author">${item.autor || 'Usuário'}</span>
                        <span class="post-time">• ${item.data || ''}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${item.content || ''}</p>
                    ${item.img ? `<img src="${item.img}" alt="imagem do post" class="post-img">` : ''}
                </div>
                <div class="post-actions">
                    <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(item.comentarios ? item.comentarios.length : 0)}</span></button>
                    <button class="action-btn like-btn ${isLiked ? 'liked' : ''}"><i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> <span>${item.likes || 0}</span></button>
                    <button class="action-btn save-btn ${isSaved ? 'saved' : ''}"><i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> <span>${item.salvos || 0}</span></button>
                    ${isAuthor ? `<button class="action-btn delete-post-btn" title="Excluir" data-id="${item.id}"><i class="fas fa-trash"></i></button>` : ''}
                </div>
            `;
            containerElement.appendChild(card);
        });
    }

    async function atualizarPostBackend(postId, data) {
        const token = getLoggedInUser()?.token;
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
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

    function setupPostInteractions() {
        const grid = document.querySelector('.perfil-posts-grid');
        if (!grid) return;

        grid.addEventListener('click', async (e) => {
            const user = getLoggedInUser();
            if (!user) {
                if (e.target.closest('.like-btn') || e.target.closest('.save-btn')) {
                    alert('Você precisa estar logado para interagir com os posts.');
                }
                return;
            }

            const likeBtn = e.target.closest('.like-btn');
            const saveBtn = e.target.closest('.save-btn');
            const postCard = e.target.closest('.twitter-post-card');
            if (!likeBtn && !saveBtn) return;
            if (!postCard) return;

            const postId = postCard.dataset.postId;
            const post = currentContent.find(p => p.id == postId);
            if (!post) return;

            if (likeBtn) {
                post.likedBy = post.likedBy || [];
                const isLiked = post.likedBy.includes(user.id);
                if (isLiked) {
                    post.likes = (post.likes || 1) - 1;
                    post.likedBy = post.likedBy.filter(id => id !== user.id);
                } else {
                    post.likes = (post.likes || 0) + 1;
                    post.likedBy.push(user.id);
                }
                await atualizarPostBackend(postId, { likes: post.likes, likedBy: post.likedBy });
            }

            if (saveBtn) {
                post.savedBy = post.savedBy || [];
                const isSaved = post.savedBy.includes(user.id);
                if (isSaved) {
                    post.salvos = (post.salvos || 1) - 1;
                    post.savedBy = post.savedBy.filter(id => id !== user.id);
                } else {
                    post.salvos = (post.salvos || 0) + 1;
                    post.savedBy.push(user.id);
                }
                await atualizarPostBackend(postId, { salvos: post.salvos, savedBy: post.savedBy });
            }
            
            const activeTab = document.querySelector('.perfil-nav-tabs .active');
            showContentForTab(activeTab, viewedUserId); 
        });
    }

    main();
}); 