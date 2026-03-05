// Events Editor Logic
let eventsData = {
    scheduled: [],
    ondemand: []
};

const EVENTS_CONFIG = {
    STORAGE_KEY: 'prizewallCustomEvents',
    DEFAULT_PATH: 'events.json'
};

// DOM elements
const DOM = {
    scheduledList: document.getElementById('scheduledList'),
    ondemandList: document.getElementById('ondemandList'),
    addScheduledBtn: document.getElementById('addScheduledBtn'),
    addOnDemandBtn: document.getElementById('addOnDemandBtn'),
    saveBtn: document.getElementById('saveEventsBtn'),
    resetBtn: document.getElementById('resetEventsBtn'),
    saveBtn2: document.getElementById('saveEventsBtn2'),
    resetBtn2: document.getElementById('resetEventsBtn2')
};

// Initialize editor
async function initEventsEditor() {
    await loadEventsData();
    renderEvents();
    attachEventListeners();
}

// Load existing events data
async function loadEventsData() {
    try {
        // Check for custom events in localStorage
        const customEvents = localStorage.getItem(EVENTS_CONFIG.STORAGE_KEY);
        
        if (customEvents) {
            eventsData = JSON.parse(customEvents);
        } else {
            // Load default JSON
            const response = await fetch(EVENTS_CONFIG.DEFAULT_PATH);
            if (!response.ok) throw new Error('Failed to load default events');
            eventsData = await response.json();
        }
    } catch (e) {
        console.error('Failed to load events data:', e);
        // Initialize with empty data
        eventsData = {
            scheduled: [],
            ondemand: []
        };
    }
}

// Render all events
function renderEvents() {
    renderEventsList('scheduled', eventsData.scheduled, DOM.scheduledList);
    renderEventsList('ondemand', eventsData.ondemand, DOM.ondemandList);
}

// Render events list for a category
function renderEventsList(category, events, container) {
    if (events.length === 0) {
        container.innerHTML = '<p class="empty-state">No events added yet.</p>';
        return;
    }
    
    const html = events.map((event, index) => `
        <div class="event-card">
            <div class="event-card-header">
                <div class="event-input-group">
                    <label>Event Name</label>
                    <input type="text" value="${escapeHtml(event.name)}" 
                           data-category="${category}" data-index="${index}" data-field="name" 
                           class="event-name-input">
                </div>
                <div class="event-input-group">
                    <label>Base Reward (tickets)</label>
                    <input type="number" value="${event.baseReward}" min="0"
                           data-category="${category}" data-index="${index}" data-field="baseReward" 
                           class="event-base-input">
                </div>
                <div class="event-card-actions">
                    <button class="btn-icon btn-delete" data-action="delete" data-category="${category}" data-index="${index}">🗑️</button>
                </div>
            </div>
            
            <div class="win-options-section">
                <h4>Win/Performance Options</h4>
                <div class="win-options-list" data-category="${category}" data-index="${index}">
                    ${renderWinOptions(event.winOptions, category, index)}
                </div>
                <div class="win-options-controls">
                    <button class="btn btn-secondary btn-small" data-action="addWin" data-category="${category}" data-index="${index}">+ Add Option</button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Render win options for an event
function renderWinOptions(winOptions, category, eventIndex) {
    return winOptions.map((option, optIndex) => `
        <div class="win-option-item">
            <input type="text" value="${escapeHtml(option.label)}" placeholder="e.g., 2 Wins"
                   data-category="${category}" data-event="${eventIndex}" data-option="${optIndex}" data-field="label">
            <input type="number" value="${option.value}" placeholder="Tickets" min="0"
                   data-category="${category}" data-event="${eventIndex}" data-option="${optIndex}" data-field="value">
            <button class="btn-icon btn-delete" data-action="deleteWin" 
                    data-category="${category}" data-event="${eventIndex}" data-option="${optIndex}">✕</button>
        </div>
    `).join('');
}

// Attach event listeners
function attachEventListeners() {
    // Add event buttons
    DOM.addScheduledBtn.addEventListener('click', () => addNewEvent('scheduled'));
    DOM.addOnDemandBtn.addEventListener('click', () => addNewEvent('ondemand'));
    
    // Save button
    DOM.saveBtn.addEventListener('click', saveEventsData);
    DOM.saveBtn2.addEventListener('click', saveEventsData);
    
    // Reset button
    DOM.resetBtn.addEventListener('click', handleResetEvents);
    DOM.resetBtn2.addEventListener('click', handleResetEvents);
    
    // Event delegation for inputs and buttons
    document.addEventListener('input', handleInputChange);
    document.addEventListener('click', handleButtonClick);
}

// Add new event
function addNewEvent(category) {
    const newEvent = {
        id: `event_${Date.now()}`,
        name: '',
        baseReward: 0,
        winOptions: [
            { label: '0 Wins', value: 0 }
        ]
    };
    
    eventsData[category].push(newEvent);
    renderEvents();
}

// Handle input changes
function handleInputChange(e) {
    const target = e.target;
    
    // Event name/base reward changes
    if (target.classList.contains('event-name-input') || target.classList.contains('event-base-input')) {
        const category = target.dataset.category;
        const index = parseInt(target.dataset.index);
        const field = target.dataset.field;
        const value = field === 'baseReward' ? parseInt(target.value) || 0 : target.value;
        
        eventsData[category][index][field] = value;
    }
    
    // Win option changes
    if (target.dataset.option !== undefined) {
        const category = target.dataset.category;
        const eventIndex = parseInt(target.dataset.event);
        const optIndex = parseInt(target.dataset.option);
        const field = target.dataset.field;
        const value = field === 'value' ? parseInt(target.value) || 0 : target.value;
        
        eventsData[category][eventIndex].winOptions[optIndex][field] = value;
    }
}

// Handle button clicks
function handleButtonClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const category = target.dataset.category;
    
    if (action === 'delete') {
        const index = parseInt(target.dataset.index);
        if (!confirm('Delete this event?')) return;
        eventsData[category].splice(index, 1);
        renderEvents();
    }
    
    if (action === 'addWin') {
        const index = parseInt(target.dataset.index);
        eventsData[category][index].winOptions.push({ label: '', value: 0 });
        renderEvents();
    }
    
    if (action === 'deleteWin') {
        const eventIndex = parseInt(target.dataset.event);
        const optIndex = parseInt(target.dataset.option);
        if (eventsData[category][eventIndex].winOptions.length <= 1) {
            alert('Events must have at least one win option');
            return;
        }
        eventsData[category][eventIndex].winOptions.splice(optIndex, 1);
        renderEvents();
    }
}

// Save events data to localStorage
function saveEventsData() {
    try {
        // Validate data
        for (const category of ['scheduled', 'ondemand']) {
            for (const event of eventsData[category]) {
                if (!event.name.trim()) {
                    alert('All events must have a name');
                    return;
                }
                if (event.winOptions.length === 0) {
                    alert('All events must have at least one win option');
                    return;
                }
            }
        }
        
        // Save to localStorage
        localStorage.setItem(EVENTS_CONFIG.STORAGE_KEY, JSON.stringify(eventsData));
        
        // Show success message
        showSuccessMessage('Changes saved successfully!');
    } catch (e) {
        console.error('Failed to save:', e);
        alert('Failed to save changes. Please try again.');
    }
}

// Reset to default events
async function handleResetEvents() {
    if (!confirm('Reset to default events? This will remove all custom changes.')) {
        return;
    }
    
    try {
        localStorage.removeItem(EVENTS_CONFIG.STORAGE_KEY);
        await loadEventsData();
        renderEvents();
        showSuccessMessage('Reset to default events');
    } catch (e) {
        console.error('Failed to reset:', e);
        alert('Failed to reset to default events');
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
initEventsEditor();
