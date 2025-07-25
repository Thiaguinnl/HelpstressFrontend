import { baseUrl } from './auth.js';

console.log('Script de cadastro carregado!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, formulário pronto!');
    const formCadastro = document.getElementById('formCadastro');
    const cadastroMessage = document.getElementById('cadastro-message');
    const btnCriarConta = formCadastro.querySelector('button[type="submit"]');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const celularInput = document.getElementById('celular');

    function showMessage(message, type) {
        cadastroMessage.textContent = message;
        cadastroMessage.style.color = (type === 'success') ? '#28a745' : '#dc3545';
        cadastroMessage.style.display = 'block';
        setTimeout(() => {
            cadastroMessage.textContent = '';
            cadastroMessage.style.display = 'none';
        }, 5000);
    }

    function clearInputErrors() {
        nomeInput.closest('.input-group').classList.remove('input-error');
        emailInput.closest('.input-group').classList.remove('input-error');
        senhaInput.closest('.input-group').classList.remove('input-error');
        celularInput.closest('.input-group').classList.remove('input-error');
    }
    
    formCadastro.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        btnCriarConta.disabled = true;
        btnCriarConta.textContent = 'Criando Conta...';

        showMessage('', '');
        clearInputErrors();

        const nome = nomeInput.value;
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const celular = celularInput.value;

        if (!nome || !email || !senha) {
            showMessage('Por favor, preencha todos os campos obrigatórios!', 'error');
            if (!nome) nomeInput.closest('.input-group').classList.add('input-error');
            if (!email) emailInput.closest('.input-group').classList.add('input-error');
            if (!senha) senhaInput.closest('.input-group').classList.add('input-error');
            btnCriarConta.disabled = false; 
            btnCriarConta.textContent = 'Criar Conta';
            return;
        }
        
        const emailRegex = /.+@.+\..+/; 

        if (!emailRegex.test(email)) {
            showMessage('Por favor, insira um email válido!', 'error');
            emailInput.closest('.input-group').classList.add('input-error');
            btnCriarConta.disabled = false;
            btnCriarConta.textContent = 'Criar Conta';
            return;
        }
        
        if (senha.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
            senhaInput.closest('.input-group').classList.add('input-error');
            btnCriarConta.disabled = false;
            btnCriarConta.textContent = 'Criar Conta';
            return;
        }
        
        try {
            // Primeiro, verificar se o email já existe
            const checkEmail = await fetch(`${baseUrl}/usuarios?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const existingUsers = await checkEmail.json();
            
            if (existingUsers && existingUsers.length > 0) {
                emailInput.closest('.input-group').classList.add('input-error');
                throw new Error('Email já cadastrado');
            }

            // Se não existe, criar o usuário
            const resposta = await fetch(`${baseUrl}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nome, 
                    email, 
                    senha, 
                    celular,
                    bio: '',
                    avatar: '/assets/img/user.png'
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error('Erro ao realizar cadastro');
            }

            showMessage('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
            formCadastro.reset();
            clearInputErrors();

            // Criar um token simples (em produção, isso deveria ser feito no backend)
            const token = btoa(JSON.stringify({ id: dados.id, email: dados.email, nome: dados.nome }));

            // Salva o token JUNTO com os dados do usuário
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify({
                ...dados,
                token: token
            }));

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
            
        } catch (erro) {
            console.error('Erro ao cadastrar:', erro);
            showMessage(erro.message || 'Erro ao realizar cadastro. Tente novamente mais tarde.', 'error');
        } finally {
            btnCriarConta.disabled = false;
            btnCriarConta.textContent = 'Criar Conta';
        }
    });
}); 