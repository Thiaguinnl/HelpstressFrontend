document.addEventListener('DOMContentLoaded', () => {
    console.log('auth.js carregado!');
    const userNotLoggedInDesktopDiv = document.getElementById('user-not-logged-in-desktop');
    const userLoggedInDesktopDiv = document.getElementById('user-logged-in-desktop');
    const desktopLoggedInButton = userLoggedInDesktopDiv ? userLoggedInDesktopDiv.querySelector('.btn-criar-conta') : null;
    const desktopLoggedOutButton = userNotLoggedInDesktopDiv ? userNotLoggedInDesktopDiv.querySelector('.btn-criar-conta') : null;
    const desktopUserProfileImg = userLoggedInDesktopDiv ? userLoggedInDesktopDiv.querySelector('#desktop-user-profile-img') : null;

    const userNotLoggedInMobileDiv = document.getElementById('user-not-logged-in-mobile');
    const userLoggedInMobileDiv = document.getElementById('user-logged-in-mobile');
    const mobileLoggedInButton = userLoggedInMobileDiv ? userLoggedInMobileDiv.querySelector('.btn-criar-conta') : null;
    const mobileLoggedOutButton = userNotLoggedInMobileDiv ? userNotLoggedInMobileDiv.querySelector('.btn-criar-conta') : null;
    const mobileUserProfileImg = userLoggedInMobileDiv ? userLoggedInMobileDiv.querySelector('#mobile-user-profile-img') : null;

    function checkAuthentication() {
        const authToken = localStorage.getItem('authToken');
        const userDataString = localStorage.getItem('userData');

        console.log('checkAuthentication: authToken', authToken);
        console.log('checkAuthentication: userDataString', userDataString);

        if (authToken && userDataString) {
            console.log('Usuário está logado.');
            try {
                const userData = JSON.parse(userDataString);
                console.log('Dados do usuário (logado):', userData);
                
                if (userNotLoggedInDesktopDiv) userNotLoggedInDesktopDiv.classList.add('hidden');
                if (userLoggedInDesktopDiv) userLoggedInDesktopDiv.classList.remove('hidden');
                
                if (userNotLoggedInMobileDiv) userNotLoggedInMobileDiv.classList.add('hidden');
                if (userLoggedInMobileDiv) userLoggedInMobileDiv.classList.remove('hidden');

                const profilePicSrc = userData.avatar || '/assets/img/user.png'; 
                if (desktopUserProfileImg) desktopUserProfileImg.src = profilePicSrc;
                if (mobileUserProfileImg) mobileUserProfileImg.src = profilePicSrc;

                if (desktopLoggedInButton) {
                    desktopLoggedInButton.onclick = () => window.location.href = 'perfil.html';
                }
                if (mobileLoggedInButton) {
                    mobileLoggedInButton.onclick = () => window.location.href = 'perfil.html';
                }

            } catch (e) {
                console.error('Erro ao parsear dados do usuário do localStorage:', e);
                logoutUser(); 
            }
        } else {
            console.log('Usuário NÃO está logado.');
            if (userNotLoggedInDesktopDiv) userNotLoggedInDesktopDiv.classList.remove('hidden');
            if (userLoggedInDesktopDiv) userLoggedInDesktopDiv.classList.add('hidden');

            if (userNotLoggedInMobileDiv) userNotLoggedInMobileDiv.classList.remove('hidden');
            if (userLoggedInMobileDiv) userLoggedInMobileDiv.classList.add('hidden');

            if (desktopLoggedOutButton) {
                desktopLoggedOutButton.onclick = () => window.location.href = 'login.html';
            }
            if (mobileLoggedOutButton) {
                mobileLoggedOutButton.onclick = () => window.location.href = 'login.html';
            }
        }
    }

    function logoutUser() {
        console.log('Efetuando logout...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'index.html'; 
    }

    window.logoutUser = logoutUser;

    const logoutButtonDesktop = document.getElementById('logout-button'); 
    const logoutButtonMobile = document.getElementById('logout-button-mobile'); 

    if (logoutButtonDesktop) {
        logoutButtonDesktop.addEventListener('click', logoutUser);
    }
    if (logoutButtonMobile) {
        logoutButtonMobile.addEventListener('click', logoutUser);
    }
    
    checkAuthentication();
    function verificarLogin() {
        console.log('Verificando login...');
        
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        console.log('Token:', token);
        console.log('userData:', userData);
        console.log('Página atual:', window.location.pathname);
        
        function isUsuarioLogado() {
            return (
                token && token !== 'null' && token !== 'undefined' && token.trim() !== '' &&
                userData && userData !== 'null' && userData !== 'undefined' && userData.trim() !== ''
            );
        }
        
        if (window.location.pathname.split('/').pop() === 'comunidadeOFF.html') {
            console.log('Estou na página comunidadeOFF.html');
            if (isUsuarioLogado()) {
                console.log('Usuário está logado, redirecionando para comunidade.html');
                window.location.href = 'comunidade.html';
                return;
            } else {
                console.log('Usuário não está logado, permanecendo em comunidadeOFF.html');
            }
        }
        
        if (window.location.pathname.split('/').pop() === 'comunidade.html') {
            console.log('Estou na página comunidade.html');
            if (!isUsuarioLogado()) {
                console.log('Usuário não está logado, redirecionando para comunidadeOFF.html');
                window.location.href = 'comunidadeOFF.html';
                return;
            } else {
                console.log('Usuário está logado, permanecendo em comunidade.html');
            }
        }
    }

    function redirecionarComunidade(event) {
        console.log('Função redirecionarComunidade chamada');
        
        if (event) {
            event.preventDefault();
        }
        
        const token = localStorage.getItem('authToken');
        
        console.log('Token no redirecionamento:', token);
        
        if (token) {
            console.log('Redirecionando para comunidade.html');
            window.location.href = 'comunidade.html';
        } else {
            console.log('Redirecionando para comunidadeOFF.html');
            window.location.href = 'comunidadeOFF.html';
        }
    }

    function verificarAutenticacao() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('Usuário não está autenticado');
            return false;
        }
        
        try {
            console.log('Token válido encontrado');
            return true;
        } catch (e) {
            console.error('Erro ao verificar autenticação:', e);
            return false;
        }
    }
    verificarLogin();
}); 