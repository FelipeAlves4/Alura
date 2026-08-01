# 🎮 GamersFlix

Plataforma completa para ajudar pessoas a montarem o PC Gamer ideal com o melhor custo-benefício do mercado.

## 📋 Sobre o Projeto

O **GamersFlix** é uma plataforma que traz atualizações constantes sobre hardware, preços e análises detalhadas para você construir o PC perfeito. Nosso objetivo é fornecer informações atualizadas sobre componentes de PC, permitindo que os usuários encontrem as melhores configurações dentro do seu orçamento.

### 🎯 Funcionalidades Principais

- **Montador de PC**: Ferramenta interativa para encontrar configurações ideais baseadas no seu orçamento
- **Comparação de Custo-Benefício**: Visualize componentes com a melhor relação preço/desempenho
- **Análises de Hardware**: Vídeos e análises detalhadas de componentes
- **Categorias Organizadas**: Monitores, Placas de Vídeo, Placas-Mãe, Processadores e mais
- **Atualizações Semanais**: Preços e análises atualizados regularmente

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/GamersFlix.git
cd GamersFlix
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```
MONGODB_URI=mongodb://localhost:27017/gamersflix
PORT=3000
NODE_ENV=development
```

4. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
GamersFlix/
├── public/              # Frontend (HTML, CSS, JS)
│   ├── index.html       # Página principal
│   ├── styles.css       # Estilos
│   └── script.js        # JavaScript
├── src/
│   ├── models/          # Modelos do MongoDB
│   │   ├── Componente.js
│   │   ├── ConfiguracaoPC.js
│   │   └── ...
│   └── config/          # Configurações
│       └── database.js
├── server.js            # Servidor Express
├── api.js               # Cliente API
└── package.json         # Dependências
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilo**: Design moderno com gradientes e animações
- **Ícones**: Font Awesome

## 📊 API Endpoints

### Vídeos
- `GET /api/v1/videos` - Lista todos os vídeos
- `GET /api/v1/videos/category/:category` - Vídeos por categoria
- `GET /api/v1/videos/featured` - Vídeos em destaque

### Componentes
- `GET /api/v1/componentes` - Lista componentes
- `GET /api/v1/componentes/:id` - Detalhes de um componente
- `GET /api/v1/componentes/categoria/:categoria` - Componentes por categoria

### Configurações de PC
- `GET /api/v1/configuracoes` - Lista configurações
- `GET /api/v1/configuracoes/orcamento/:orcamento` - Configurações por orçamento

### FAQ
- `GET /api/v1/faq` - Lista todas as FAQs
- `GET /api/v1/faq/category/:category` - FAQs por categoria

### Contato
- `POST /api/v1/contact` - Envia mensagem de contato

## 🎨 Melhorias Implementadas

✅ Modelos de dados para hardware (Componente, ConfiguracaoPC)  
✅ Backend completo com rotas para componentes e configurações  
✅ Seção de Montador de PC com filtro por orçamento  
✅ Design moderno e responsivo focado em hardware  
✅ Integração completa da API no frontend  
✅ Seção de comparação de custo-benefício  
✅ Sistema de avaliação de componentes  
✅ Interface intuitiva e moderna  

## 📝 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Felipe Alves**
- Instagram: [@felipe_alvesrodri](https://www.instagram.com/felipe_alvesrodri/)

## 🔗 Links

- [Acesse o projeto online](https://felipealves4.github.io/GamersFlix/)

---

Desenvolvido com ❤️ para ajudar gamers a montarem seus PCs ideais!
