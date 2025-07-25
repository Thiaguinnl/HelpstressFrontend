import { baseUrl } from './auth.js';

console.log('Script de login carregado!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, formulário de login pronto!');
    const formLogin = document.getElementById('formLogin');
    const loginMessage = document.getElementById('login-message');
    const btnEntrar = formLogin.querySelector('button[type="submit"]');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.style.color = (type === 'success') ? '#28a745' : '#dc3545'; 
        loginMessage.style.display = 'block';

        setTimeout(() => {
            loginMessage.textContent = '';
            loginMessage.style.display = 'none';
        }, 5000);
    }
    
    function clearInputErrors() {
        emailInput.closest('.input-group').classList.remove('input-error');
        senhaInput.closest('.input-group').classList.remove('input-error');
    }
    
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        btnEntrar.disabled = true;
        btnEntrar.textContent = 'Entrando...';

        showMessage('', '');
        clearInputErrors();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        console.log('Attempting login with:', { email, senha }); 
        
        if (!email || !senha) {
            showMessage('Por favor, preencha todos os campos obrigatórios!', 'error');
            if (!email) emailInput.closest('.input-group').classList.add('input-error');
            if (!senha) senhaInput.closest('.input-group').classList.add('input-error');
            btnEntrar.disabled = false; 
            btnEntrar.textContent = 'Entrar';
            return;
        }
        
        try {
            const resposta = await fetch(`${baseUrl}/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response status:', resposta.status); 

            const dados = await resposta.json();
            console.log('Server response data:', dados); 

            if (!resposta.ok || !dados || dados.length === 0) {
                emailInput.closest('.input-group').classList.add('input-error');
                senhaInput.closest('.input-group').classList.add('input-error');
                throw new Error('Email ou senha inválidos');
            }

            // JSON Server retorna um array, pegamos o primeiro usuário
            const usuario = dados[0];
            
            // Criar um token simples (em produção, isso deveria ser feito no backend)
            const token = btoa(JSON.stringify({ id: usuario.id, email: usuario.email, nome: usuario.nome }));

            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify({
                ...usuario,
                token: token
            }));

            console.log('User data from server (login.js):', usuario); 

            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            window.location.href = '/index.html'; 
            
        } catch (erro) {
            console.error('Erro ao fazer login:', erro);
            showMessage(erro.message || 'Erro ao fazer login. Tente novamente mais tarde.', 'error');
        } finally {
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar';
        }
    });
}); 