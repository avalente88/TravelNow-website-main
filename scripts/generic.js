// ----------------------------
// Expandir / Ocultar todos
// ----------------------------
const expandAllBtn  = document.getElementById('expandAll');
const collapseAllBtn = document.getElementById('collapseAll');

expandAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.day-details').forEach((el, i) => {
    el.classList.add('open');
    const btn = document.querySelector(`.day-line[data-index="${i}"] .btn-tag`);
    if(btn){ btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar'; }
    });
});

collapseAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.day-details').forEach((el, i) => {
    el.classList.remove('open');
    const btn = document.querySelector(`.day-line[data-index="${i}"] .btn-tag`);
    if(btn){ btn.setAttribute('aria-expanded','false'); btn.textContent = 'Ver detalhes'; }
    });
});


// ----------------------------
// Carregar o html para mobile para os voos
// ----------------------------

 // Aplica data-labels a todas as TD com base no texto dos TH
function applyDataLabels(table) {
if (!table) return;
const ths = Array.from(table.querySelectorAll('thead th'));
if (!ths.length) return;

// Extrai os textos dos TH (tratando espaços e quebras)
const headers = ths.map(th => (th.textContent || '').replace(/\s+/g, ' ').trim());

// Aplica em cada TD
table.querySelectorAll('tbody tr').forEach(tr => {
    Array.from(tr.children).forEach((td, i) => {
    const label = headers[i] || '';
    if (label) td.setAttribute('data-label', label);
    });
});
}

// Aplica aos seletores desejados
function makeStackedTables(...selectors) {
selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(applyDataLabels);
});
}

// Corre quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
makeStackedTables('#voos table', '#hoteis table');

// OPCIONAL: se a tua página renderiza/atualiza tabelas via JS depois do load
// ativa este observer para voltar a aplicar labels quando o tbody mudar
const observer = new MutationObserver(() => {
    makeStackedTables('#voos table', '#hoteis table');
});
document.querySelectorAll('#voos table tbody, #hoteis table tbody').forEach(tbody => {
    observer.observe(tbody, { childList: true, subtree: true });
});
});