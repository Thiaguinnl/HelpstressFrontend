// Configuração do Cloudinary
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dsh5vvzyv', 
    UPLOAD_PRESET: 'helpstress_avatars', 
    FOLDER: 'avatars',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

async function uploadToCloudinary(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        let data;
        try {
            data = await response.json();
        } catch (e) {
            const text = await response.text();
            throw new Error('Resposta inesperada do Cloudinary: ' + text);
        }

        if (!response.ok) {
            throw new Error(data.error?.message || 'Erro no upload');
        }

        return data.secure_url;
    } catch (error) {
        console.error('Erro no upload para Cloudinary:', error);
        alert('Erro ao enviar imagem para o Cloudinary: ' + (error.message || error));
        throw error;
    }
}

function validateImageFile(file) {
    if (!CLOUDINARY_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WEBP).');
        return false;
    }

    if (file.size > CLOUDINARY_CONFIG.MAX_FILE_SIZE) {
        alert('A imagem deve ter no máximo 10MB.');
        return false;
    }

    return true;
}

window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
window.uploadToCloudinary = uploadToCloudinary;
window.validateImageFile = validateImageFile; 