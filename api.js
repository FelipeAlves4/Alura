// API para gerenciamento de conteúdo
const API = {
    // Endpoint base da API
    // Durante o desenvolvimento, use o servidor local
    baseURL: 'http://localhost:3000/api/v1',
    // Quando for para produção, altere para:
    // baseURL: 'https://api.gamersflix.com/v1',

    // Funções para gerenciamento de vídeos
    videos: {
        // Buscar todos os vídeos
        getAll: async () => {
            try {
                const response = await fetch(`${API.baseURL}/videos`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar vídeos:', error);
                return [];
            }
        },

        // Buscar vídeos por categoria
        getByCategory: async (category) => {
            try {
                const response = await fetch(`${API.baseURL}/videos/category/${category}`);
                return await response.json();
            } catch (error) {
                console.error(`Erro ao buscar vídeos da categoria ${category}:`, error);
                return [];
            }
        },

        // Buscar vídeos em destaque
        getFeatured: async () => {
            try {
                const response = await fetch(`${API.baseURL}/videos/featured`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar vídeos em destaque:', error);
                return [];
            }
        }
    },

    // Funções para gerenciamento de FAQ
    faq: {
        // Buscar todas as perguntas frequentes
        getAll: async () => {
            try {
                const response = await fetch(`${API.baseURL}/faq`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar FAQs:', error);
                return [];
            }
        },

        // Buscar FAQs por categoria
        getByCategory: async (category) => {
            try {
                const response = await fetch(`${API.baseURL}/faq/category/${category}`);
                return await response.json();
            } catch (error) {
                console.error(`Erro ao buscar FAQs da categoria ${category}:`, error);
                return [];
            }
        }
    },

    // Funções para gerenciamento de contato
    contact: {
        // Enviar mensagem de contato
        sendMessage: async (messageData) => {
            try {
                const response = await fetch(`${API.baseURL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });
                return await response.json();
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                throw error;
            }
        }
    }
};

// Tornar API disponível globalmente para compatibilidade
if (typeof window !== 'undefined') {
    window.API = API;
}

// Exportar a API
export default API; 