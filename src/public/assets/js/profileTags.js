document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const modal = document.getElementById('addTagModal');
    
    if (addButton && modal) {
        // Abre o modal ao clicar no botão '+'
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('hidden');
        });

        // Fecha o modal ao clicar fora da área de conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}); 