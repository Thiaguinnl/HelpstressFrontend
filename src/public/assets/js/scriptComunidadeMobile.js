// Script para o modal mobile da comunidade

// Função para atualizar a UI do feed principal
function updateFeedUI(postId) {
  const post = window.todosPostsUltimaBusca ? window.todosPostsUltimaBusca.find(p => p.id == postId) : null;
  if (!post) return;

  const user = window.getUserData ? window.getUserData() : null;
  const isLiked = user && post.likedBy && post.likedBy.includes(user.id);
  const isSaved = user && post.savedBy && post.savedBy.includes(user.id);
  
  // Atualizar o card no feed principal
  const feedCard = document.querySelector(`.twitter-post-card[data-post-id="${postId}"]`);
  if (feedCard) {
    const likeBtn = feedCard.querySelector('.like-btn');
    const saveBtn = feedCard.querySelector('.save-btn');

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
  }
}

export function abrirModalPostMobile(post) {
  const modal = document.getElementById('modal-imagem-post-mobile');
  if (!modal) return;

  // Preencher header
  const avatar = modal.querySelector('.modal-avatar-mobile');
  const autor = modal.querySelector('.modal-autor-mobile');
  const data = modal.querySelector('.modal-data-mobile');
  // Fallback robusto para avatar
  if (avatar) {
    avatar.onerror = function() { this.src = '/assets/img/user.png'; };
    avatar.src = (post.avatar && post.avatar !== '' && post.avatar !== 'null' && post.avatar !== 'undefined') ? post.avatar : '/assets/img/user.png';
  }
  if (autor) autor.textContent = post.autor || 'Usuário';
  if (data) data.textContent = post.data || '';

  // Preencher conteúdo
  const conteudo = modal.querySelector('.modal-conteudo-post-mobile');
  if (conteudo) conteudo.textContent = post.content || '';

  // Preencher imagem do post
  const img = modal.querySelector('#imagem-modal-ampliada-mobile');
  const imgDiv = modal.querySelector('.modal-imagem-esquerda-mobile');
  if (img) {
    img.onerror = function() { this.style.display = 'none'; };
    if (post.img && post.img !== '' && post.img !== 'null' && post.img !== 'undefined') {
      img.src = post.img;
      img.style.display = 'block';
      if (imgDiv) imgDiv.style.display = 'flex';
    } else {
      img.src = '';
      img.style.display = 'none';
      if (imgDiv) imgDiv.style.display = 'none';
    }
  }

  // Preencher ações (curtir, salvar, comentar)
  const acoes = modal.querySelector('.modal-acoes-mobile');
  if (acoes) {
    // Determinar se o usuário atual curtiu/salvou
    const user = window.getUserData ? window.getUserData() : null;
    const isLiked = user && post.likedBy && post.likedBy.includes(user.id);
    const isSaved = user && post.savedBy && post.savedBy.includes(user.id);
    acoes.innerHTML = `
      <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${(post.comentarios ? post.comentarios.length : 0)}</span></button>
      <button class="action-btn like-btn${isLiked ? ' liked' : ''}"><i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> <span>${post.likes || 0}</span></button>
      <button class="action-btn save-btn${isSaved ? ' saved' : ''}"><i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> <span>${post.salvos || 0}</span></button>
    `;
  }

  // Adicionar listeners para curtir/salvar
  if (acoes) {
    const likeBtn = acoes.querySelector('.like-btn');
    const saveBtn = acoes.querySelector('.save-btn');
    likeBtn && likeBtn.addEventListener('click', async function(e) {
      e.stopPropagation();
      const user = window.getUserData ? window.getUserData() : null;
      if (!user) {
        alert('Você precisa estar logado para curtir posts.');
        return;
      }
      // Buscar post atualizado do array global
      let todosPostsUltimaBusca = window.todosPostsUltimaBusca || [];
      let postAtual = todosPostsUltimaBusca.find(p => p.id == post.id);
      if (!postAtual) postAtual = post; // fallback
      postAtual.likedBy = postAtual.likedBy || [];
      const isLiked = postAtual.likedBy.includes(user.id);
      if (isLiked) {
        postAtual.likes = (postAtual.likes || 1) - 1;
        postAtual.likedBy = postAtual.likedBy.filter(id => id !== user.id);
      } else {
        postAtual.likes = (postAtual.likes || 0) + 1;
        postAtual.likedBy.push(user.id);
      }
      // Atualizar UI imediatamente (modal e feed)
      abrirModalPostMobile(postAtual);
      updateFeedUI(postAtual.id);
      try {
        if (window.atualizarPostBackend) {
          await window.atualizarPostBackend(postAtual.id, { likes: postAtual.likes, likedBy: postAtual.likedBy });
        }
      } catch (err) {
        alert('Erro ao atualizar curtida.');
      }
    });
    saveBtn && saveBtn.addEventListener('click', async function(e) {
      e.stopPropagation();
      const user = window.getUserData ? window.getUserData() : null;
      if (!user) {
        alert('Você precisa estar logado para salvar posts.');
        return;
      }
      let todosPostsUltimaBusca = window.todosPostsUltimaBusca || [];
      let postAtual = todosPostsUltimaBusca.find(p => p.id == post.id);
      if (!postAtual) postAtual = post; // fallback
      postAtual.savedBy = postAtual.savedBy || [];
      const isSaved = postAtual.savedBy.includes(user.id);
      if (isSaved) {
        postAtual.salvos = (postAtual.salvos || 1) - 1;
        postAtual.savedBy = postAtual.savedBy.filter(id => id !== user.id);
      } else {
        postAtual.salvos = (postAtual.salvos || 0) + 1;
        postAtual.savedBy.push(user.id);
      }
      // Atualizar UI imediatamente (modal e feed)
      abrirModalPostMobile(postAtual);
      updateFeedUI(postAtual.id);
      try {
        if (window.atualizarPostBackend) {
          await window.atualizarPostBackend(postAtual.id, { salvos: postAtual.salvos, savedBy: postAtual.savedBy });
        }
      } catch (err) {
        alert('Erro ao atualizar salvamento.');
      }
    });
  }

  // Preencher comentários
  const comentariosDiv = modal.querySelector('.modal-comentarios-mobile');
  if (comentariosDiv) {
    comentariosDiv.innerHTML = '';
    if (post.comentarios && post.comentarios.length > 0) {
      post.comentarios.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comment-item-mobile';
        comentarioDiv.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="${(comentario.avatar && comentario.avatar !== '' && comentario.avatar !== 'null' && comentario.avatar !== 'undefined') ? comentario.avatar : '/assets/img/user.png'}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;" onerror="this.src='/assets/img/user.png'">
            <span style="font-weight:600;">${comentario.autor || 'Usuário'}</span>
            <span style="color:#aaa;font-size:0.9em;">${comentario.data ? new Date(comentario.data).toLocaleString('pt-BR') : ''}</span>
          </div>
          <div style="margin-left:36px;color:#444;">${comentario.text}</div>
        `;
        comentariosDiv.appendChild(comentarioDiv);
      });
    } else {
      comentariosDiv.innerHTML = '<div style="color:#888;">Nenhum comentário ainda.</div>';
    }
  }

  // Preencher avatar do campo de comentário
  const commentUserAvatar = modal.querySelector('#comment-user-avatar-mobile');
  if (commentUserAvatar) {
    commentUserAvatar.onerror = function() { this.src = '/assets/img/user.png'; };
    commentUserAvatar.src = (post.avatar && post.avatar !== '' && post.avatar !== 'null' && post.avatar !== 'undefined') ? post.avatar : '/assets/img/user.png';
  }

  // Limpar campo de comentário
  const inputComentario = modal.querySelector('#input-comentario-mobile');
  if (inputComentario) inputComentario.value = '';

  // Exibir modal usando classe .aberto
  modal.classList.add('aberto');
}

export function fecharModalPostMobile() {
  const modal = document.getElementById('modal-imagem-post-mobile');
  if (modal) {
    modal.classList.remove('aberto');
    console.log('Modal mobile fechado');
  }
}

// Delegação para garantir que o botão de fechar funcione mesmo se o DOM mudar
if (!window._modalMobileCloseListener) {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'fechar-modal-imagem-mobile') {
      console.log('Botão de fechar do modal mobile clicado');
      fecharModalPostMobile();
    }
  });
  window._modalMobileCloseListener = true;
} 