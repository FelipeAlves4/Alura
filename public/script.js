const API_BASE_URL = '/api/v1';
const componentLabels = {
    processador: ['Processador', 'fa-microchip'], placaVideo: ['Placa de vídeo', 'fa-display'], placaMae: ['Placa-mãe', 'fa-object-group'], memoria: ['Memória RAM', 'fa-memory'], armazenamento: ['Armazenamento', 'fa-hard-drive'], fonte: ['Fonte', 'fa-bolt'], gabinete: ['Gabinete', 'fa-cube']
};

const state = { budget: 5000, category: 'placa-video' };
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);

async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) throw new Error('Não foi possível carregar os dados agora.');
    return response.json();
}

function updateBudget(value) {
    state.budget = Number(value);
    document.getElementById('orcamento').value = state.budget;
    document.getElementById('budget-display').textContent = money.format(state.budget);
    document.querySelectorAll('[data-budget]').forEach((button) => button.classList.toggle('active', Number(button.dataset.budget) === state.budget));
}

function renderLoading(container, message) {
    container.innerHTML = `<div class="loading-card"><div><i class="fa-solid fa-circle-notch fa-spin"></i><p>${escapeHTML(message)}</p></div></div>`;
}

function renderConfiguration(config) {
    const parts = Object.entries(config.componentes || {}).filter(([, item]) => item?.nome).map(([key, item]) => {
        const [label, icon] = componentLabels[key] || [key, 'fa-puzzle-piece'];
        return `<div class="build-component"><span class="component-icon"><i class="fa-solid ${icon}"></i></span><span><small>${label}</small><strong title="${escapeHTML(item.nome)}">${escapeHTML(item.nome)}</strong></span></div>`;
    }).join('');
    const performance = config.desempenho || {};
    const pills = [['1080p', performance.jogos1080p], ['1440p', performance.jogos1440p], ['4K', performance.jogos4k]].filter(([, value]) => value).map(([label, value]) => `<span class="performance-pill">${label}: ${escapeHTML(value)}</span>`).join('');

    return `<article class="recommendation-card"><div class="rec-top"><div><span class="rec-label">Recomendação para você</span><h3>${escapeHTML(config.nome)}</h3></div><div class="rec-price"><span>Faixa estimada</span><strong>${money.format(config.precoTotal || state.budget)}</strong></div></div><p class="rec-description">${escapeHTML(config.descricao)}</p><div class="build-components">${parts}</div><div class="rec-footer">${pills || '<span class="performance-pill">Configuração equilibrada</span>'}</div></article>`;
}

async function loadRecommendation() {
    const container = document.getElementById('configuracoes-container');
    renderLoading(container, 'Analisando o melhor equilíbrio para o seu setup...');
    try {
        const configurations = await request(`/configuracoes/orcamento/${state.budget}`);
        container.innerHTML = configurations.length ? renderConfiguration(configurations[0]) : '<div class="empty-card">Nenhuma configuração foi encontrada nessa faixa.</div>';
    } catch (error) {
        container.innerHTML = '<div class="empty-card"><div><i class="fa-solid fa-triangle-exclamation"></i><p>Não foi possível gerar a recomendação agora. Tente novamente.</p></div></div>';
    }
}

function renderComponent(component) {
    const efficiency = Math.min(10, Number(component.desempenho?.custoBeneficio) || 0);
    const score = Number(component.desempenho?.nota) || 0;
    return `<article class="component-card"><div class="component-card-top"><div><h3>${escapeHTML(component.nome)}</h3><p>${escapeHTML(component.marca || '')} ${component.modelo ? `· ${escapeHTML(component.modelo)}` : ''}</p></div><span class="score">${efficiency.toFixed(1)}</span></div><p>${escapeHTML(component.descricao || 'Uma opção selecionada pelo custo-benefício.')}</p><div class="component-price">${money.format(component.preco || 0)}${component.precoAnterior ? ` <del>${money.format(component.precoAnterior)}</del>` : ''}</div><div class="meter-label"><span>Custo-benefício</span><span>${efficiency.toFixed(1)}/10</span></div><div class="meter"><span style="width:${efficiency * 10}%"></span></div><div class="meter-label"><span>Desempenho</span><span>${score.toFixed(1)}/10</span></div><div class="meter"><span style="width:${score * 10}%"></span></div></article>`;
}

async function loadComparison() {
    const container = document.getElementById('comparacao-container');
    renderLoading(container, 'Selecionando peças com o melhor custo-benefício...');
    try {
        const components = await request(`/componentes?categoria=${encodeURIComponent(state.category)}&limit=6&sort=-desempenho.custoBeneficio`);
        container.innerHTML = components.length ? components.map(renderComponent).join('') : '<div class="empty-card">Não encontramos opções nesta categoria ainda.</div>';
    } catch (error) {
        container.innerHTML = '<div class="empty-card">Não foi possível carregar a comparação agora.</div>';
    }
}

async function submitContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const feedback = document.getElementById('form-feedback');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = 'Enviando sua mensagem...';
    try {
        const result = await request('/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
        feedback.textContent = result.message || 'Mensagem enviada com sucesso!';
        feedback.classList.add('success');
        form.reset();
    } catch (error) {
        feedback.textContent = 'Não foi possível enviar. Revise os campos e tente novamente.';
        feedback.classList.add('error');
    } finally {
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    const setMenu = (open) => { nav.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); menuButton.innerHTML = `<i class="fa-solid fa-${open ? 'xmark' : 'bars'}"></i>`; };
    menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuButton.focus(); } });
    document.getElementById('orcamento').addEventListener('input', (event) => updateBudget(event.target.value));
    document.querySelectorAll('[data-budget]').forEach((button) => button.addEventListener('click', () => { updateBudget(button.dataset.budget); loadRecommendation(); }));
    document.getElementById('build-button').addEventListener('click', loadRecommendation);
    document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => { state.category = tab.dataset.category; document.querySelectorAll('.tab').forEach((item) => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); }); loadComparison(); }));
    document.getElementById('contactForm').addEventListener('submit', submitContact);
    loadRecommendation();
    loadComparison();
});
