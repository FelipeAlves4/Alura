require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Componente = require('./src/models/Componente');
const ConfiguracaoPC = require('./src/models/ConfiguracaoPC');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MAX_LIMIT = 30;
const COMPONENT_SORTS = new Set([
    '-desempenho.custoBeneficio',
    '-desempenho.nota',
    'preco',
    '-preco'
]);

mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const componentCatalog = [
    { categoria: 'placa-video', nome: 'GeForce RTX 4060', marca: 'NVIDIA', modelo: '8 GB', preco: 2199, precoAnterior: 2399, descricao: 'Ótima opção para jogar em 1080p com DLSS 3.', desempenho: { nota: 8.2, custoBeneficio: 8.6 }, destaque: true },
    { categoria: 'placa-video', nome: 'Radeon RX 7600', marca: 'AMD', modelo: '8 GB', preco: 1899, precoAnterior: 2099, descricao: 'Desempenho sólido em Full HD pelo menor preço.', desempenho: { nota: 7.9, custoBeneficio: 8.8 }, destaque: true },
    { categoria: 'processador', nome: 'Ryzen 5 5600', marca: 'AMD', modelo: '6c / 12t', preco: 739, precoAnterior: 859, descricao: 'Base confiável para um PC gamer equilibrado.', desempenho: { nota: 7.8, custoBeneficio: 9.2 }, destaque: true },
    { categoria: 'processador', nome: 'Core i5-12400F', marca: 'Intel', modelo: '6c / 12t', preco: 829, precoAnterior: 959, descricao: 'Boa performance em jogos e tarefas diárias.', desempenho: { nota: 8.0, custoBeneficio: 8.5 }, destaque: true },
    { categoria: 'monitor', nome: 'Monitor 24" 180 Hz IPS', marca: 'AOC', modelo: 'Full HD', preco: 849, precoAnterior: 999, descricao: 'Fluidez e cores consistentes para jogos competitivos.', desempenho: { nota: 8.1, custoBeneficio: 8.7 }, destaque: true },
    { categoria: 'monitor', nome: 'Monitor 27" 165 Hz IPS', marca: 'LG', modelo: 'QHD', preco: 1499, precoAnterior: 1699, descricao: 'Resolução QHD para quem busca mais definição.', desempenho: { nota: 8.6, custoBeneficio: 8.1 }, destaque: true },
    { categoria: 'memoria-ram', nome: 'Kingston Fury Beast 16 GB', marca: 'Kingston', modelo: 'DDR4 3200 MHz', preco: 329, precoAnterior: 399, descricao: 'Kit de 16 GB para manter os jogos atuais confortáveis.', desempenho: { nota: 7.6, custoBeneficio: 9.0 }, destaque: true },
    { categoria: 'memoria-ram', nome: 'Corsair Vengeance 32 GB', marca: 'Corsair', modelo: 'DDR4 3200 MHz', preco: 579, precoAnterior: 649, descricao: 'Mais espaço para multitarefa, criação e streaming.', desempenho: { nota: 8.4, custoBeneficio: 8.2 }, destaque: true }
];

const fallbackVideos = [
    {
        id: 'rtx-4060',
        title: 'RTX 4060: análise para jogos em 1080p',
        description: 'O que esperar de desempenho e custo-benefício.',
        thumbnail: 'https://img.youtube.com/vi/lZ0FppdYAzM/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=lZ0FppdYAzM',
        category: 'placa-video'
    }
];

const faqs = [
    { id: 1, category: 'montagem', question: 'Como escolher meu orçamento?', answer: 'Defina primeiro a resolução e os jogos que você quer rodar. A recomendação prioriza a placa de vídeo dentro desse limite.' },
    { id: 2, category: 'componentes', question: 'Posso trocar uma peça da sugestão?', answer: 'Sim. Use a configuração como ponto de partida e confira a compatibilidade de soquete, memória, fonte e gabinete.' },
    { id: 3, category: 'atualizacoes', question: 'Os preços são atualizados?', answer: 'Os valores são referências. Antes da compra, confirme estoque, frete, garantia e preço final na loja.' }
];

function clampLimit(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, MAX_LIMIT) : fallback;
}

function fallbackComponents(category, limit) {
    const filtered = category ? componentCatalog.filter((item) => item.categoria === category) : componentCatalog;
    return filtered.slice(0, limit);
}

function buildFallbackConfiguration(budget) {
    const profile = budget >= 12000
        ? { gpu: 'GeForce RTX 4070 Super', gpuPrice: 4799, cpu: 'AMD Ryzen 7 5700X', cpuPrice: 1149, level: 'Ultra', resolution: '1440p' }
        : budget >= 7500
            ? { gpu: 'GeForce RTX 4060 Ti', gpuPrice: 2949, cpu: 'AMD Ryzen 5 5600', cpuPrice: 739, level: 'Alto', resolution: '1440p' }
            : { gpu: 'Radeon RX 7600', gpuPrice: 1899, cpu: 'AMD Ryzen 5 5600', cpuPrice: 739, level: 'Alto', resolution: '1080p' };

    const components = {
        processador: { nome: profile.cpu, preco: profile.cpuPrice },
        placaVideo: { nome: profile.gpu, preco: profile.gpuPrice },
        placaMae: { nome: 'Placa-mãe B550M', preco: 649 },
        memoria: { nome: '16 GB DDR4 3200 MHz', preco: 329 },
        armazenamento: { nome: 'SSD NVMe 1 TB', preco: 409 },
        fonte: { nome: 'Fonte 650 W 80 Plus Bronze', preco: 379 },
        gabinete: { nome: 'Gabinete airflow com 3 fans', preco: 299 }
    };
    const price = Object.values(components).reduce((total, item) => total + item.preco, 0);

    return {
        _id: `suggestion-${budget}`,
        nome: `Setup Gamer ${profile.resolution}`,
        descricao: `Configuração equilibrada para jogar em ${profile.resolution}, com foco em qualidade gráfica e possibilidade de upgrades futuros.`,
        orcamento: budget,
        precoTotal: Math.min(price, budget),
        componentes: components,
        desempenho: { notaGeral: budget >= 7500 ? 8.6 : 7.9, jogos1080p: 'ultra', jogos1440p: profile.level.toLowerCase(), jogos4k: budget >= 12000 ? 'medio' : 'baixo' }
    };
}

async function queryComponents(query, sort, limit) {
    if (mongoose.connection.readyState !== 1) {
        return fallbackComponents(query.categoria, limit);
    }

    const components = await Componente.find(query).sort(sort).limit(limit).lean();
    return components.length ? components : fallbackComponents(query.categoria, limit);
}

function populateConfigurationComponents(query) {
    return query
        .populate('componentes.processador', 'nome preco imagem')
        .populate('componentes.placaMae', 'nome preco imagem')
        .populate('componentes.placaVideo', 'nome preco imagem')
        .populate('componentes.memoria', 'nome preco imagem')
        .populate('componentes.armazenamento', 'nome preco imagem')
        .populate('componentes.fonte', 'nome preco imagem')
        .populate('componentes.gabinete', 'nome preco imagem');
}

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gamersflix';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB conectado.'))
    .catch((error) => console.warn('MongoDB indisponível; usando recomendações de demonstração.', error.message));

app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'unavailable' });
});

app.get('/api/v1/videos', async (req, res) => {
    try {
        const components = await queryComponents({ 'videoAnalise.url': { $exists: true } }, '-desempenho.custoBeneficio', 20);
        const videos = components
            .filter((component) => component.videoAnalise?.url)
            .map((component) => ({
                id: component._id,
                title: component.videoAnalise.titulo || component.nome,
                description: `Análise de ${component.nome}`,
                thumbnail: component.videoAnalise.thumbnail || component.imagem,
                url: component.videoAnalise.url,
                category: component.categoria
            }));
        res.json(videos.length ? videos : fallbackVideos);
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error.message);
        res.json(fallbackVideos);
    }
});

app.get('/api/v1/videos/category/:category', async (req, res) => {
    const videos = fallbackVideos.filter((video) => video.category === req.params.category);
    res.json(videos);
});

app.get('/api/v1/videos/featured', (req, res) => res.json(fallbackVideos));
app.get('/api/v1/faq', (req, res) => res.json(faqs));
app.get('/api/v1/faq/category/:category', (req, res) => {
    const category = req.params.category;
    res.json(category === 'all' ? faqs : faqs.filter((faq) => faq.category === category));
});

app.get('/api/v1/componentes', async (req, res) => {
    const { categoria, destaque, limit = 12, sort = '-desempenho.custoBeneficio' } = req.query;
    const query = {};
    if (categoria) query.categoria = categoria;
    if (destaque === 'true') query.destaque = true;

    try {
        const safeSort = COMPONENT_SORTS.has(sort) ? sort : '-desempenho.custoBeneficio';
        res.json(await queryComponents(query, safeSort, clampLimit(limit, 12)));
    } catch (error) {
        console.error('Erro ao buscar componentes:', error.message);
        res.json(fallbackComponents(categoria, clampLimit(limit, 12)));
    }
});

app.get('/api/v1/componentes/categoria/:categoria', async (req, res) => {
    try {
        res.json(await queryComponents({ categoria: req.params.categoria }, '-desempenho.custoBeneficio', 20));
    } catch (error) {
        res.json(fallbackComponents(req.params.categoria, 20));
    }
});

app.get('/api/v1/componentes/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Identificador de componente inválido.' });
    }
    try {
        const component = mongoose.connection.readyState === 1 ? await Componente.findById(req.params.id).lean() : null;
        if (!component) return res.status(404).json({ error: 'Componente não encontrado.' });
        res.json(component);
    } catch (error) {
        res.status(500).json({ error: 'Não foi possível carregar o componente.' });
    }
});

app.get('/api/v1/configuracoes', async (req, res) => {
    const limit = clampLimit(req.query.limit, 6);
    const budget = Number.parseInt(req.query.orcamento, 10) || 5000;
    if (mongoose.connection.readyState !== 1) return res.json([buildFallbackConfiguration(budget)].slice(0, limit));

    try {
        const query = req.query.orcamento ? { orcamento: { $lte: budget } } : {};
        const configs = await populateConfigurationComponents(ConfiguracaoPC.find(query))
            .sort('-desempenho.notaGeral')
            .limit(limit)
            .lean();
        res.json(configs.length ? configs : [buildFallbackConfiguration(budget)]);
    } catch (error) {
        res.json([buildFallbackConfiguration(budget)]);
    }
});

app.get('/api/v1/configuracoes/orcamento/:orcamento', async (req, res) => {
    const budget = Number.parseInt(req.params.orcamento, 10);
    if (!Number.isInteger(budget) || budget < 2000 || budget > 50000) {
        return res.status(400).json({ error: 'Informe um orçamento entre R$ 2.000 e R$ 50.000.' });
    }

    if (mongoose.connection.readyState !== 1) return res.json([buildFallbackConfiguration(budget)]);

    try {
        const configs = await populateConfigurationComponents(ConfiguracaoPC.find({ orcamento: { $lte: budget } }))
            .sort('-desempenho.notaGeral')
            .limit(5)
            .lean();
        res.json(configs.length ? configs : [buildFallbackConfiguration(budget)]);
    } catch (error) {
        res.json([buildFallbackConfiguration(budget)]);
    }
});

app.post('/api/v1/contact', (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

    if (!name || !subject || !message || !validEmail || message.length > 3000) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos com dados válidos.' });
    }

    console.log('Nova mensagem de contato:', { name, email, subject });
    res.json({ success: true, message: 'Mensagem recebida. Retornaremos em breve!' });
});

app.use('/api/v1', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`GamersFlix disponível em http://localhost:${PORT}`));
