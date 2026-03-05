// Prize Wall Editor Logic
let editorData = {
    boosters: [],
    cards: [],
    mats: [],
    carboniteEnabled: false
};

const EDITOR_CONFIG = {
    STORAGE_KEY: 'prizewallCustomPrizes',
    DEFAULT_PRIZES_PATH: 'prizes.json'
};

// DOM elements
const DOM = {
    carboniteToggle: document.getElementById('carboniteBoosterToggle'),
    boosterGrid: document.getElementById('boosterGrid'),
    cardsList: document.getElementById('cardsList'),
    matsList: document.getElementById('matsList'),
    addCardBtn: document.getElementById('addCardBtn'),
    addMatBtn: document.getElementById('addMatBtn'),
    saveBtn: document.getElementById('saveEditorBtn'),
    resetBtn: document.getElementById('resetEditorBtn'),
    saveBtn2: document.getElementById('saveEditorBtn2'),
    resetBtn2: document.getElementById('resetEditorBtn2')
};

// Initialize editor
async function initEditor() {
    await loadEditorData();
    renderBoosterSection();
    renderCards();
    renderMats();
    attachEventListeners();
}

// Load existing prize data
async function loadEditorData() {
    try {
        // Check for custom prizes in localStorage
        const customPrizes = localStorage.getItem(EDITOR_CONFIG.STORAGE_KEY);
        
        if (customPrizes) {
            editorData = JSON.parse(customPrizes);
        } else {
            // Load default JSON
            const response = await fetch(EDITOR_CONFIG.DEFAULT_PRIZES_PATH);
            if (!response.ok) throw new Error('Failed to load default prizes');
            const data = await response.json();
            editorData = {
                boosters: data.boosters || [{ name: 'Booster Pack', points: 100 }],
                cards: data.cards || [],
                mats: data.mats || [],
                carboniteEnabled: data.boosters?.some(b => b.name.toLowerCase().includes('carbonite')) || false
            };
        }
        
        // Update toggle state
        DOM.carboniteToggle.checked = editorData.carboniteEnabled;
    } catch (e) {
        console.error('Failed to load prize data:', e);
        // Initialize with empty data
        editorData = {
            boosters: [{ name: 'Booster Pack', points: 100 }],
            cards: [],
            mats: [],
            carboniteEnabled: false
        };
    }
}

// Render booster section
function renderBoosterSection() {
    const regularBoosters = editorData.boosters.filter(b => !b.name.toLowerCase().includes('carbonite'));
    const carboniteBoosters = editorData.boosters.filter(b => b.name.toLowerCase().includes('carbonite'));
    
    let html = '';
    
    // Always show regular booster pack
    regularBoosters.forEach((booster, index) => {
        html += `
            <div class="booster-item">
                <label>Regular Booster Name:</label>
                <input type="text" class="item-name-input" value="${escapeHtml(booster.name)}" 
                       data-type="booster" data-index="${index}" data-field="name">
                <label>Points:</label>
                <input type="number" class="item-points-input" value="${booster.points}" 
                       data-type="booster" data-index="${index}" data-field="points" min="1">
            </div>
        `;
    });
    
    // Show carbonite booster if enabled
    if (editorData.carboniteEnabled) {
        const carboniteIndex = regularBoosters.length;
        const carbonite = carboniteBoosters.length > 0 ? carboniteBoosters[0] : { name: 'Carbonite Booster', points: 150 };
        
        html += `
            <div class="booster-item">
                <label>Carbonite Booster Name:</label>
                <input type="text" class="item-name-input" value="${escapeHtml(carbonite.name)}" 
                       data-type="carbonite" data-index="0" data-field="name">
                <label>Points:</label>
                <input type="number" class="item-points-input" value="${carbonite.points}" 
                       data-type="carbonite" data-index="0" data-field="points" min="1">
            </div>
        `;
    }
    
    DOM.boosterGrid.innerHTML = html;
}

// Render cards list
function renderCards() {
    if (editorData.cards.length === 0) {
        DOM.cardsList.innerHTML = '<p class="empty-state">No cards added yet. Click "Add Card" to get started.</p>';
        return;
    }
    
    const html = editorData.cards.map((card, index) => `
        <div class="item-card">
            <div class="item-info">
                <input type="text" class="item-name-input" placeholder="Card name" 
                       value="${escapeHtml(card.name)}" data-type="card" data-index="${index}" data-field="name">
                <input type="number" class="item-points-input" placeholder="Points" 
                       value="${card.points}" data-type="card" data-index="${index}" data-field="points" min="1">
            </div>
            <div class="item-actions">
                <button class="btn-icon btn-delete" data-action="delete" data-type="card" data-index="${index}">🗑️</button>
            </div>
        </div>
    `).join('');
    
    DOM.cardsList.innerHTML = html;
}

// Render game mats list
function renderMats() {
    if (editorData.mats.length === 0) {
        DOM.matsList.innerHTML = '<p class="empty-state">No game mats added yet. Click "Add Game Mat" to get started.</p>';
        return;
    }
    
    const html = editorData.mats.map((mat, index) => `
        <div class="item-card">
            <div class="item-info">
                <input type="text" class="item-name-input" placeholder="Game mat name" 
                       value="${escapeHtml(mat.name)}" data-type="mat" data-index="${index}" data-field="name">
                <input type="number" class="item-points-input" placeholder="Points" 
                       value="${mat.points}" data-type="mat" data-index="${index}" data-field="points" min="1">
            </div>
            <div class="item-actions">
                <button class="btn-icon btn-delete" data-action="delete" data-type="mat" data-index="${index}">🗑️</button>
            </div>
        </div>
    `).join('');
    
    DOM.matsList.innerHTML = html;
}

// Attach event listeners
function attachEventListeners() {
    // Carbonite toggle
    DOM.carboniteToggle.addEventListener('change', (e) => {
        editorData.carboniteEnabled = e.target.checked;
        renderBoosterSection();
    });
    
    // Add card button
    DOM.addCardBtn.addEventListener('click', () => {
        editorData.cards.push({ name: '', points: 200 });
        renderCards();
    });
    
    // Add mat button
    DOM.addMatBtn.addEventListener('click', () => {
        editorData.mats.push({ name: '', points: 1000 });
        renderMats();
    });
    
    // Save button
    DOM.saveBtn.addEventListener('click', saveEditorData);
    DOM.saveBtn2.addEventListener('click', saveEditorData);
    
    // Reset button
    DOM.resetBtn.addEventListener('click', resetToDefaults);
    DOM.resetBtn2.addEventListener('click', resetToDefaults);
    
    // Event delegation for input changes and deletes
    document.addEventListener('input', handleInputChange);
    document.addEventListener('click', handleButtonClick);
}

// Handle input changes
function handleInputChange(e) {
    const target = e.target;
    if (!target.classList.contains('item-name-input') && !target.classList.contains('item-points-input')) {
        return;
    }
    
    const type = target.dataset.type;
    const index = parseInt(target.dataset.index);
    const field = target.dataset.field;
    const value = field === 'points' ? parseInt(target.value) || 0 : target.value;
    
    if (type === 'booster') {
        editorData.boosters[index][field] = value;
    } else if (type === 'carbonite') {
        // Find or create carbonite booster
        const carboniteIndex = editorData.boosters.findIndex(b => b.name.toLowerCase().includes('carbonite'));
        if (carboniteIndex >= 0) {
            editorData.boosters[carboniteIndex][field] = value;
        } else {
            const newCarb = { name: 'Carbonite Booster', points: 150 };
            newCarb[field] = value;
            editorData.boosters.push(newCarb);
        }
    } else if (type === 'card') {
        editorData.cards[index][field] = value;
    } else if (type === 'mat') {
        editorData.mats[index][field] = value;
    }
}

// Handle button clicks
function handleButtonClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const type = target.dataset.type;
    const index = parseInt(target.dataset.index);
    
    if (action === 'delete') {
        if (!confirm('Delete this item?')) return;
        
        if (type === 'card') {
            editorData.cards.splice(index, 1);
            renderCards();
        } else if (type === 'mat') {
            editorData.mats.splice(index, 1);
            renderMats();
        }
    }
}

// Save editor data to localStorage as JSON
function saveEditorData() {
    try {
        // Filter out carbonite booster if disabled
        const boosters = editorData.boosters.filter(booster => {
            if (booster.name.toLowerCase().includes('carbonite') && !editorData.carboniteEnabled) {
                return false;
            }
            return true;
        });
        
        // Filter out empty entries
        const cards = editorData.cards.filter(card => card.name.trim());
        const mats = editorData.mats.filter(mat => mat.name.trim());
        
        // Build JSON data structure
        const data = {
            boosters,
            cards,
            mats
        };
        
        // Save to localStorage
        localStorage.setItem(EDITOR_CONFIG.STORAGE_KEY, JSON.stringify(data));
        
        // Show success message
        showSuccessMessage('Changes saved successfully!');
    } catch (e) {
        console.error('Failed to save:', e);
        alert('Failed to save changes. Please try again.');
    }
}

// Reset to default prizes
async function resetToDefaults() {
    if (!confirm('Reset to default prizes? This will discard all custom changes.')) {
        return;
    }
    
    try {
        // Clear localStorage
        localStorage.removeItem(EDITOR_CONFIG.STORAGE_KEY);
        
        // Reload default data
        await loadEditorData();
        
        // Re-render everything
        renderBoosterSection();
        renderCards();
        renderMats();
        
        showSuccessMessage('Reset to defaults successfully!');
    } catch (e) {
        console.error('Failed to reset:', e);
        alert('Failed to reset. Please try again.');
    }
}

// Show success message
function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.className = 'save-success';
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on load
initEditor();
