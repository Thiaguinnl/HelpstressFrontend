document.addEventListener('DOMContentLoaded', () => {
    const editarPerfilNomeUsuario = document.querySelector('.editar-perfil-nome');
    const editarPerfilCategoriaAtiva = document.querySelector('.editar-perfil-categoria');
    const categoriasMenu = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const accountEmailInput = document.getElementById('accountEmail');
    const recentPostsContainer = document.getElementById('recentPostsContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const headerAvatar = document.querySelector('.editar-perfil-avatar');
    const profileAvatar = document.getElementById('profileAvatar');
    const uploadProfilePictureInput = document.getElementById('uploadProfilePicture');
    const deleteProfilePictureBtn = document.getElementById('deleteProfilePicture');
    const profileNameInput = document.getElementById('profileName');
    const profileBioTextarea = document.getElementById('profileBio');
    const profilePhoneInput = document.getElementById('profilePhone');
    const saveProfileChangesBtn = document.getElementById('saveProfileChangesBtn'); 

    function loadUserEditProfile() {
        const userData = localStorage.getItem('userData');

        if (userData) {
            try {
                const user = JSON.parse(userData);
                editarPerfilNomeUsuario.textContent = user.nome || 'Nome não disponível';
                accountEmailInput.value = user.email || '';
                loadUserPosts(user.id);

                profileNameInput.value = user.nome || '';
                profileBioTextarea.value = user.bio || ''; 
                profilePhoneInput.value = user.celular || '';
                profileAvatar.src = user.avatar || '/assets/img/user.png';
                headerAvatar.src = user.avatar || '/assets/img/user.png';

            } catch (e) {
                console.error('Erro ao carregar dados do usuário do localStorage:', e);
                editarPerfilNomeUsuario.textContent = 'Erro ao carregar nome';
                accountEmailInput.value = '';
                profileNameInput.value = '';
                profileBioTextarea.value = '';
                profilePhoneInput.value = '';
                profileAvatar.src = '/assets/img/user.png';
                headerAvatar.src = '/assets/img/user.png';
            }
        } else {
            editarPerfilNomeUsuario.textContent = 'Usuário não logado';
            accountEmailInput.value = '';
            profileNameInput.value = '';
            profileBioTextarea.value = '';
            profilePhoneInput.value = '';
            profileAvatar.src = '/assets/img/user.png';
            headerAvatar.src = '/assets/img/user.png';
        }
    }

    function setActiveCategory(categoryElement) {
        
        categoriasMenu.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        categoryElement.classList.add('active');

        editarPerfilCategoriaAtiva.textContent = categoryElement.textContent;

        const targetId = categoryElement.textContent.toLowerCase().replace(' ', '-') + '-content'; 
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    // Função para carregar e exibir os posts do usuário
    async function loadUserPosts(userId) {
        try {
            const response = await fetch(`/posts?userId=${userId}&_sort=id&_order=desc`); 
            const userPosts = await response.json();
            const postsPorPagina = 3;
            let indiceAtual = 0;
            const track = document.getElementById('carouselTrack');
            const noPostsMessage = document.getElementById('noPostsMessage');
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');

            function renderizarCarrossel() {
                track.innerHTML = '';
                const postsVisiveis = userPosts.slice(indiceAtual, indiceAtual + postsPorPagina);
                postsVisiveis.forEach(post => {
                    const div = document.createElement('div');
                    div.className = 'carousel-post';
                    let resumo = post.content.substring(0, 60);
                    // Só mostra o resumo se for diferente do título
                    let resumoHtml = '';
                    if (resumo && resumo.trim() !== post.title.trim()) {
                        resumoHtml = `<div class="post-desc">${resumo}...</div>`;
                    }
                    div.innerHTML = `
                        <img src="${post.img || '/assets/img/user.png'}" alt="${post.title}">
                        <div class="post-title">${post.title}</div>
                        ${resumoHtml}
                    `;
                    track.appendChild(div);
                });
                // Ajusta o deslocamento do carrossel
                track.style.transform = `translateX(-${indiceAtual * 190}px)`;
                // Exibe ou oculta botões
                prevBtn.style.visibility = indiceAtual === 0 ? 'hidden' : 'visible';
                nextBtn.style.visibility = (indiceAtual + postsPorPagina >= userPosts.length) ? 'hidden' : 'visible';
            }

            if (userPosts.length > 0) {
                noPostsMessage.style.display = 'none';
                renderizarCarrossel();
                prevBtn.onclick = function() {
                    if (indiceAtual > 0) {
                        indiceAtual -= postsPorPagina;
                        if (indiceAtual < 0) indiceAtual = 0;
                        renderizarCarrossel();
                    }
                };
                nextBtn.onclick = function() {
                    if (indiceAtual + postsPorPagina < userPosts.length) {
                        indiceAtual += postsPorPagina;
                        renderizarCarrossel();
                    }
                };
            } else {
                track.innerHTML = '';
                noPostsMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro ao carregar posts do usuário:', error);
            const noPostsMessage = document.getElementById('noPostsMessage');
            if (noPostsMessage) {
                noPostsMessage.style.display = 'block';
                noPostsMessage.textContent = 'Não foi possível carregar as postagens.';
            }
        }
    }

    // Event Listeners para a aba Editar Perfil
    uploadProfilePictureInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (window.validateImageFile && !window.validateImageFile(file)) {
                return;
            }
            try {
                // Faz upload para o Cloudinary
                if (window.uploadToCloudinary) {
                    const imageUrl = await window.uploadToCloudinary(file);
                    profileAvatar.src = imageUrl;
                    headerAvatar.src = imageUrl;
                    alert('Imagem enviada com sucesso! Lembre-se de clicar em "Salvar Mudanças" na aba de perfil.');
                } else {
                    alert('Função de upload do Cloudinary não encontrada.');
                }
            } catch (error) {
                alert('Erro ao enviar imagem para o Cloudinary.');
            }
        }
    });

    deleteProfilePictureBtn.addEventListener('click', () => {
        profileAvatar.src = '/assets/img/user.png'; 
        headerAvatar.src = '/assets/img/user.png'; 
        alert('Imagem redefinida para o padrão! Lembre-se de clicar em "Salvar Mudanças" na aba de perfil.');
    });

    saveProfileChangesBtn.addEventListener('click', async () => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            alert('Usuário não logado.');
            return;
        }

        try {
            let user = JSON.parse(userData);
            const newName = profileNameInput.value;
            const newBio = profileBioTextarea.value;
            const newPhone = profilePhoneInput.value;
            const newAvatar = profileAvatar.src; 

            const updatedFields = {};
            if (newName !== user.nome) updatedFields.nome = newName;
            if (newBio !== user.bio) updatedFields.bio = newBio;
            if (newPhone !== user.celular) updatedFields.celular = newPhone;
            if (newAvatar !== user.avatar) updatedFields.avatar = newAvatar; 

            if (Object.keys(updatedFields).length === 0) {
                alert('Nenhuma mudança no perfil para salvar.');
                return;
            }

            const response = await fetch(`/usuarios/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields)
            });

            if (response.ok) {
                user = { ...user, ...updatedFields };
                localStorage.setItem('userData', JSON.stringify(user));
                alert('Perfil atualizado com sucesso!');
            } else {
                alert('Erro ao atualizar o perfil. Verifique o console para mais detalhes.');
                console.error('Erro na resposta da API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Erro ao salvar as mudanças do perfil:', error);
            alert('Ocorreu um erro ao salvar as mudanças do perfil.');
        }
    });

    saveChangesBtn.addEventListener('click', async () => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            alert('Usuário não logado.');
            return;
        }

        try {
            const user = JSON.parse(userData);
            const newEmail = accountEmailInput.value;

            if (newEmail === user.email) {
                alert('Nenhuma mudança no e-mail para salvar.');
                return;
            }

            const response = await fetch(`/usuarios/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail })
            });

            if (response.ok) {
                user.email = newEmail;
                localStorage.setItem('userData', JSON.stringify(user));
                alert('E-mail atualizado com sucesso!');
            } else {
                alert('Erro ao atualizar o e-mail. Verifique o console para mais detalhes.');
                console.error('Erro na resposta da API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Erro ao salvar as mudanças:', error);
            alert('Ocorreu um erro ao salvar as mudanças.');
        }
    });

    categoriasMenu.forEach(item => {
        item.addEventListener('click', () => {
            setActiveCategory(item);
        });
    });

    const categoriaGeral = document.querySelector('.tab-item.active');
    if (categoriaGeral) {
        setActiveCategory(categoriaGeral);
    } else if (categoriasMenu.length > 0) {
        setActiveCategory(categoriasMenu[0]);
    }

    // Event Listener para logout
    const logoutButtonGeral = document.getElementById('logoutButtonGeral');
    if (logoutButtonGeral) {
        logoutButtonGeral.addEventListener('click', () => {
            localStorage.removeItem('userData');
            window.location.href = 'index.html'; 
        });
    }

    // Event Listener para exclusão de conta
    const deleteAccountMenuItem = document.getElementById('deleteAccountBtn');
    if (deleteAccountMenuItem) {
        deleteAccountMenuItem.addEventListener('click', () => {
            window.location.href = 'confirmarExclusao.html';
        });
    }

    loadUserEditProfile();
}); 