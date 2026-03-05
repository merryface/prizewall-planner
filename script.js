// Prize Wall Planner Logic
let baseStartingPoints = 3200; // Default to Deluxe
let cart = [];
let eventTickets = 0;
let prizesData = []; // Store loaded prizes
let eventsData = { scheduled: [], ondemand: [] }; // Store loaded events

// Configuration
const CONFIG = {
    ENTRY_TYPES: {
        STANDARD: 100,
        PREMIUM: 1300,
        DELUXE: 3200
    },
    WARNING_THRESHOLD: 500,
    STORAGE_KEY: 'prizewallCart',
    STATE_KEY: 'prizewallState',
    PRIZES_KEY: 'prizewallCustomPrizes',
    EVENTS_KEY: 'prizewallCustomEvents',
    DEFAULT_PRIZES_PATH: 'prizes.json',
    DEFAULT_EVENTS_PATH: 'events.json'
};

const eventBaseRewards = {}; // Will be populated from events data

// DOM Cache for performance
const DOM = {
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    clearCartBtn: document.getElementById('clearCart'),
    exportCartBtn: document.getElementById('exportCart'),
    eventTickets: document.getElementById('eventTickets'),
    startingPoints: document.getElementById('startingPoints'),
    spentPoints: document.getElementById('spentPoints'),
    remainingPoints: document.getElementById('remainingPoints'),
    prizesContainer: document.getElementById('prizesContainer'),
    eventsContainer: document.getElementById('eventsContainer')
};

// Initialize
function init() {
    if (!validateDOM()) {
        console.error('Required DOM elements not found');
        return;
    }
    
    loadState();
    loadCart();
    Promise.all([loadPrizes(), loadEvents()]).then(() => {
        updateDisplay();
        attachEventListeners();
    }).catch(err => {
        console.error('Initialization error:', err);
        attachEventListeners();
    });
}

// Validate DOM elements exist
function validateDOM() {
    return Object.values(DOM).every(el => el !== null);
}

// Event listeners with event delegation
function attachEventListeners() {
    // Clear and export buttons
    DOM.clearCartBtn.addEventListener('click', handleClearCart);
    DOM.exportCartBtn.addEventListener('click', handleExportCart);
    
    // Entry type radios
    document.querySelectorAll('input[name="entry"]').forEach(radio => {
        radio.addEventListener('change', handleEntryChange);
    });
    
    // Event checkboxes
    document.querySelectorAll('.event-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleEventCheckboxChange);
    });
    
    // Win dropdowns
    document.querySelectorAll('.wins-select').forEach(select => {
        select.addEventListener('change', calculateEventTickets);
    });
    
    // Prize buttons - use event delegation for better performance
    document.addEventListener('click', handlePrizeButtonClick);
}

// Calculate total spent
function calculateTotalSpent() {
    return cart.reduce((sum, item) => sum + item.totalPoints, 0);
}

// Handle entry type change
function handleEntryChange(e) {
    baseStartingPoints = parseInt(e.target.value);
    saveState();
    updateDisplay();
}

// Handle event checkbox change
function handleEventCheckboxChange(e) {
    const eventId = e.target.id.replace('evt-', '');
    const placementDiv = document.getElementById(`evt-${eventId}-placement`);
    
    if (!placementDiv) return;
    
    if (e.target.checked) {
        placementDiv.style.display = 'flex';
    } else {
        placementDiv.style.display = 'none';
        const select = placementDiv.querySelector('select');
        if (select) select.value = '0';
    }
    
    saveState();
    calculateEventTickets();
}

// Handle prize button clicks with event delegation
function handlePrizeButtonClick(e) {
    const target = e.target;
    
    if (target.classList.contains('prize-btn-plus')) {
        const name = target.getAttribute('data-name');
        const points = parseInt(target.getAttribute('data-points'));
        addPrizeToCart(name, points, 1);
    } else if (target.classList.contains('prize-btn-minus')) {
        const name = target.getAttribute('data-name');
        removePrizeFromCart(name);
    } else if (target.classList.contains('cart-item-remove')) {
        const id = parseInt(target.getAttribute('data-id'));
        handleRemovePrize(id);
    }
}

// Calculate event tickets
function calculateEventTickets() {
    let total = 0;
    
    document.querySelectorAll('.event-checkbox:checked').forEach(checkbox => {
        const eventId = checkbox.id.replace('evt-', '');
        const baseReward = eventBaseRewards[eventId] || 0;
        total += baseReward;
        
        const select = document.querySelector(`.wins-select[data-event="${eventId}"]`);
        if (select) {
            total += parseInt(select.value) || 0;
        }
    });
    
    eventTickets = total;
    updateDisplay();
}

// Get total starting points (base + event tickets)
function getTotalStartingPoints() {
    return baseStartingPoints + eventTickets;
}

// Add prize to cart
function addPrizeToCart(name, points, quantity) {
    const totalPoints = points * quantity;
    
    // Check if there are enough points
    const currentSpent = calculateTotalSpent();
    const totalAvailable = getTotalStartingPoints();
    if (currentSpent + totalPoints > totalAvailable) {
        showAlert('Not enough tickets! This would exceed your budget.', 'danger');
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPoints = existingItem.points * existingItem.quantity;
    } else {
        // Add new item to cart
        const item = {
            id: Date.now(),
            name,
            points,
            quantity,
            totalPoints
        };
        cart.push(item);
    }
    
    saveCart();
    updateDisplay();
}

// Remove one prize from cart
function removePrizeFromCart(name) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity -= 1;
        existingItem.totalPoints = existingItem.points * existingItem.quantity;
        
        // Remove item completely if quantity reaches 0
        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
        
        saveCart();
        updateDisplay();
    }
}

// Handle removing a prize
function handleRemovePrize(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateDisplay();
}

// Handle clearing cart
function handleClearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateDisplay();
    }
}

// Handle exporting cart
function handleExportCart() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const totalAvailable = getTotalStartingPoints();
    
    let text = '=== PRIZE WALL PURCHASE PLAN ===\n\n';
    text += `Entry Type Tickets: ${baseStartingPoints}\n`;
    text += `Event Tickets Earned: ${eventTickets}\n`;
    text += `Total Available: ${totalAvailable}\n`;
    text += `Total Spent: ${calculateTotalSpent()}\n`;
    text += `Remaining: ${totalAvailable - calculateTotalSpent()}\n\n`;
    text += 'ITEMS:\n';
    text += '-------------------\n';
    
    cart.forEach((item, index) => {
        text += `${index + 1}. ${item.name}\n`;
        text += `   Tickets: ${item.points} x ${item.quantity} = ${item.totalPoints}\n\n`;
    });
    
    // Create download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prize-wall-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Update display
function updateDisplay() {
    const totalAvailable = getTotalStartingPoints();
    const totalSpent = calculateTotalSpent();
    const remaining = totalAvailable - totalSpent;
    
    DOM.eventTickets.textContent = eventTickets;
    DOM.startingPoints.textContent = totalAvailable;
    DOM.spentPoints.textContent = totalSpent;
    DOM.remainingPoints.textContent = remaining;
    
    // Update remaining color based on budget
    updateRemainingColor(remaining);
    
    // Update cart display
    updateCartDisplay();
}

// Update remaining color based on remaining tickets
function updateRemainingColor(remaining) {
    if (remaining < 0) {
        DOM.remainingPoints.style.color = '#e74c3c';
    } else if (remaining < CONFIG.WARNING_THRESHOLD) {
        DOM.remainingPoints.style.color = '#f39c12';
    } else {
        DOM.remainingPoints.style.color = '#27ae60';
    }
}

// Update cart display visibility
function updateCartDisplay() {
    if (cart.length === 0) {
        DOM.cartEmpty.style.display = 'block';
        DOM.cartItems.classList.remove('has-items');
    } else {
        DOM.cartEmpty.style.display = 'none';
        DOM.cartItems.classList.add('has-items');
        DOM.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapeHtml(item.name)}</div>
                    <div class="cart-item-details">
                        ${item.points} tickets × ${item.quantity} = ${item.totalPoints} tickets
                    </div>
                </div>
                <div class="cart-item-points">${item.totalPoints}</div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `).join('');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const section = document.querySelector('section');
    if (section) {
        section.insertBefore(alertDiv, section.firstChild);
        setTimeout(() => alertDiv.remove(), 3000);
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error('Failed to save cart:', e);
    }
}

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load cart:', e);
            cart = [];
        }
    }
}

// Save state (entry type, events) to localStorage
function saveState() {
    try {
        const state = {
            baseStartingPoints,
            eventTickets,
            selectedEvents: Array.from(document.querySelectorAll('.event-checkbox:checked')).map(cb => ({
                id: cb.id,
                wins: document.querySelector(`.wins-select[data-event="${cb.id.replace('evt-', '')}"]`)?.value || '0'
            })),
            entryType: document.querySelector('input[name="entry"]:checked')?.value
        };
        localStorage.setItem(CONFIG.STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem(CONFIG.STATE_KEY);
    if (saved) {
        try {
            const state = JSON.parse(saved);
            
            // Restore entry type
            if (state.entryType) {
                const radio = document.querySelector(`input[name="entry"][value="${state.entryType}"]`);
                if (radio) {
                    radio.checked = true;
                    baseStartingPoints = parseInt(state.entryType);
                }
            }
            
            // Restore events
            if (state.selectedEvents) {
                state.selectedEvents.forEach(evt => {
                    const checkbox = document.getElementById(evt.id);
                    if (checkbox) {
                        checkbox.checked = true;
                        const placementDiv = document.getElementById(`${evt.id}-placement`);
                        if (placementDiv) placementDiv.style.display = 'flex';
                        
                        const select = document.querySelector(`.wins-select[data-event="${evt.id.replace('evt-', '')}"]`);
                        if (select) select.value = evt.wins;
                    }
                });
                calculateEventTickets();
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }
}

// ===== JSON Prize Management =====

// Load prizes from JSON (custom or default)
async function loadPrizes() {
    try {
        // Check if there's custom prizes in localStorage
        const customPrizes = localStorage.getItem(CONFIG.PRIZES_KEY);
        
        if (customPrizes) {
            const data = JSON.parse(customPrizes);
            prizesData = convertPrizesDataToArray(data);
        } else {
            // Load default JSON file
            const response = await fetch(CONFIG.DEFAULT_PRIZES_PATH);
            if (!response.ok) throw new Error('Failed to load default prizes');
            const data = await response.json();
            prizesData = convertPrizesDataToArray(data);
        }
        
        renderPrizes();
    } catch (e) {
        console.error('Failed to load prizes:', e);
        showAlert('Failed to load prizes', 'danger');
    }
}

// Convert JSON prizes data structure to array format
function convertPrizesDataToArray(data) {
    const prizes = [];
    
    // Add boosters
    if (data.boosters) {
        data.boosters.forEach(booster => {
            prizes.push({
                category: 'Booster Pack',
                name: booster.name,
                points: booster.points
            });
        });
    }
    
    // Add cards
    if (data.cards) {
        data.cards.forEach(card => {
            prizes.push({
                category: 'Cards',
                name: card.name,
                points: card.points
            });
        });
    }
    
    // Add mats
    if (data.mats) {
        data.mats.forEach(mat => {
            prizes.push({
                category: 'Game Mats',
                name: mat.name,
                points: mat.points
            });
        });
    }
    
    return prizes;
}

// Render prizes grouped by category
function renderPrizes() {
    if (prizesData.length === 0) {
        DOM.prizesContainer.innerHTML = '<p class="empty-state">No prizes loaded</p>';
        return;
    }
    
    // Group prizes by category
    const grouped = {};
    prizesData.forEach(prize => {
        if (!grouped[prize.category]) {
            grouped[prize.category] = [];
        }
        grouped[prize.category].push(prize);
    });
    
    // Render each category
    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
        html += `
            <div class="prize-category">
                <h3>${escapeHtml(category)}</h3>
                <div class="prize-grid">
        `;
        
        items.forEach(prize => {
            html += `
                <div class="prize-item">
                    <span class="prize-name">${escapeHtml(prize.name)}</span>
                    <button class="prize-btn prize-btn-minus" data-name="${escapeHtml(prize.name)}" data-points="${prize.points}">−</button>
                    <button class="prize-btn prize-btn-plus" data-name="${escapeHtml(prize.name)}" data-points="${prize.points}">+</button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    DOM.prizesContainer.innerHTML = html;
}

// ===== Events Management =====

// Load events from JSON (custom or default)
async function loadEvents() {
    try {
        // Check if there's custom events in localStorage
        const customEvents = localStorage.getItem(CONFIG.EVENTS_KEY);
        
        if (customEvents) {
            eventsData = JSON.parse(customEvents);
        } else {
            // Load default JSON file
            const response = await fetch(CONFIG.DEFAULT_EVENTS_PATH);
            if (!response.ok) throw new Error('Failed to load default events');
            eventsData = await response.json();
        }
        
        // Build eventBaseRewards object from loaded data
        eventBaseRewards.clear?.(); // Clear if exists
        [...eventsData.scheduled, ...eventsData.ondemand].forEach(event => {
            eventBaseRewards[event.id] = event.baseReward;
        });
        
        renderEvents();
    } catch (e) {
        console.error('Failed to load events:', e);
        showAlert('Failed to load events', 'danger');
    }
}

// Render events dynamically
function renderEvents() {
    if (!eventsData.scheduled && !eventsData.ondemand) {
        DOM.eventsContainer.innerHTML = '<p class="empty-state">No events loaded</p>';
        return;
    }
    
    let html = '';
    
    // Render Scheduled Events
    if (eventsData.scheduled && eventsData.scheduled.length > 0) {
        html += `
            <div class="event-category">
                <h3>Scheduled Side Events</h3>
                ${eventsData.scheduled.map(event => renderEventHTML(event)).join('')}
            </div>
        `;
    }
    
    // Render On-Demand Events
    if (eventsData.ondemand && eventsData.ondemand.length > 0) {
        html += `
            <div class="event-category">
                <h3>On-Demand Side Events</h3>
                ${eventsData.ondemand.map(event => renderEventHTML(event)).join('')}
            </div>
        `;
    }
    
    DOM.eventsContainer.innerHTML = html;
}

// Render a single event HTML
function renderEventHTML(event) {
    const baseText = event.baseReward > 0 ? `Base: ${event.baseReward} tickets` : 'No base reward';
    
    return `
        <div class="event-item">
            <div class="event-header">
                <input type="checkbox" id="evt-${event.id}" class="event-checkbox">
                <label for="evt-${event.id}">${escapeHtml(event.name)}</label>
                <span class="base-tickets">${baseText}</span>
            </div>
            <div class="event-placement" id="evt-${event.id}-placement" style="display: none;">
                <label>Wins:</label>
                <select class="wins-select" data-event="${event.id}">
                    ${event.winOptions.map(opt => `
                        <option value="${opt.value}">${escapeHtml(opt.label)}${opt.value > 0 ? ` (+${opt.value})` : ''}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
}

// Initialize app
init();

