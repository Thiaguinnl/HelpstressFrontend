const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'src/db/db.json'));
const middlewares = jsonServer.defaults({ static: path.join(__dirname, 'src/public') });
const db = router.db;

const SECRET_KEY = 'sua_chave_secreta_aqui';

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function isAuthenticated({ email, senha }) {
    return db.get('usuarios').find({ email, senha }).value();
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.user = user;
        next(); 
    });
}

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err);
    if (res.headersSent) {
        return next(err); 
    }
    res.status(500).json({ mensagem: 'Erro interno do servidor.', detalhes: err.message });
});

server.post('/register', (req, res) => {
    const { nome, email, senha, celular } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    const userExists = db.get('usuarios').find({ email }).value();
    if (userExists) {
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
    }

    const newUserId = db.get('usuarios').size().value() + 1;
    const newUser = { 
        id: newUserId, 
        nome, 
        email, 
        senha, 
        celular,
        bio: '', // Campo bio vazio por padrão
        avatar: '/assets/img/user.png' // Avatar padrão
    };
    
    db.get('usuarios').push(newUser).write();

    const token = generateToken({ id: newUserId, email, nome });
    return res.status(201).json({ 
        mensagem: 'Usuário registrado com sucesso.', 
        token, 
        usuario: newUser
    });
});

server.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const user = isAuthenticated({ email, senha });

    if (!user) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    console.log('User object just before response:', user);

    const token = generateToken({ id: user.id, email: user.email, nome: user.nome, celular: user.celular });
    return res.status(200).json({ 
        mensagem: 'Login realizado com sucesso.', 
        token, 
        usuario: user
    });
});

server.get('/api/perfil', verifyToken, (req, res) => {
    res.json({ mensagem: `Bem-vindo ao seu perfil, ${req.user.nome}!`, usuario: req.user });
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server está rodando em http://localhost:${PORT}`);
    console.log(`Acesse a página de cadastro em http://localhost:${PORT}/cadastro`);
}); 