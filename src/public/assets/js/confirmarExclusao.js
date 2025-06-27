document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backFromDeleteBtn');
    const confirmDeleteButton = document.getElementById('confirmDeleteAccountBtn');

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'editarPerfil.html';
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', async () => {
            const userDataString = localStorage.getItem('userData');

            if (!userDataString) {
                alert('Usuário não logado. Redirecionando para a página inicial.');
                window.location.href = 'index.html';
                return;
            }

            try {
                const user = JSON.parse(userDataString);
                const userId = user.id;

                if (!userId) {
                    alert('ID do usuário não encontrado. Não foi possível excluir a conta.');
                    return;
                }

                const confirmation = confirm('Tem certeza que deseja EXCLUIR sua conta? Esta ação é irreversível.');
                if (!confirmation) {
                    return;
                }

                // Requisição DELETE para o JSON Server
                const response = await fetch(`/usuarios/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    alert('Conta excluída com sucesso! Sentiremos sua falta.');
                    window.location.href = 'index.html'; 
                } else {
                    alert('Erro ao excluir a conta. Verifique o console para mais detalhes.');
                    console.error('Erro na resposta da API ao tentar excluir conta:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Erro ao processar exclusão da conta:', error);
                alert('Ocorreu um erro inesperado ao tentar excluir a conta.');
            }
        });
    }
}); 