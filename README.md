# 🎯 Prize Wall Purchase Planner

A mobile-friendly web-based planner to help you manage your prize wall purchases at Magic: The Gathering events. Calculate your available tickets from entry type and event participation, then plan your prize purchases efficiently.

## ✨ Features

- **Entry Type Selection**: Choose from Standard (100 tickets), Premium (1300 tickets), or Deluxe (3200 tickets)
- **Event Ticket Calculator**: Calculate additional tickets from 11 event types:
  - **Scheduled Side Events**: Deluxe Sector Cup, Standard Sector Cup, Eternal Sector Cup, Draft Challenge, Chaos Draft
  - **On-Demand Events**: Standard On-Demand, Draft On-Demand, Sealed On-Demand, Commander On-Demand, Chaos On-Demand, Bonus Event
  - Track participation and placement rewards with dropdown selectors
- **Dynamic Prize Wall**: Prizes loaded from JSON file for easy customization
  - Default: All prizes from London event included
  - Edit prizes through web-based GUI editor
  - Prizes persist in localStorage with reset to defaults option
- **Direct Cart Addition**: Add/remove prizes with +/- buttons
- **Real-Time Budget Tracking**: See available, spent, and remaining tickets instantly
- **Visual Feedback**: Color-coded remaining tickets display
- **Export Functionality**: Download your purchase plan as a text file
- **Auto-Save**: All selections persist using localStorage (entry type, events, cart, custom prizes)
- **Mobile-Optimized**: Responsive design with touch-friendly 44px minimum tap targets

## 📱 Mobile Friendly

Fully optimized for mobile devices with:
- Touch-friendly button sizes (44px minimum)
- Single-column layouts on small screens
- Reduced padding for better space usage
- Larger checkboxes and form controls
- Full-width buttons for easy tapping
- Responsive typography that scales appropriately

## 🚀 How to Use

1. Open `index.html` in your web browser
2. **Select Your Entry Type**: Choose Standard, Premium, or Deluxe
3. **Add Event Tickets**:
   - Check the events you're participating in
   - Select your expected placement from the dropdown
   - Watch your Event Tickets total update automatically
4. **Add Prizes to Cart**:
   - Browse the prize wall items
   - Use **+** button to add prizes to your cart
   - Use **-** button to remove prizes from cart
   - Budget validation prevents overspending
5. **Customize Prize Wall (Optional)**:
   - Click "✏️ Edit Prize Wall" to open the GUI editor
   - Add/remove cards and game mats
   - Enable Carbonite Booster option if needed
   - Click "Save Changes" to update the prize wall
   - Use "Reset to Defaults" to restore original prizes
6. **Customize Events (Optional)**:
   - Click "✏️ Edit Events" to open the events editor
   - Add/remove/edit scheduled and on-demand events
   - Customize win options and base rewards
   - Changes persist across browser sessions
7. **Export Your Plan**: Click "Export List" to download your selections
8. **Start Fresh**: Use "Clear Cart" to remove all items

## 📝 Prize Data Format

Prizes are stored in JSON format with three categories:

```json
{
  "boosters": [
    { "name": "Booster Pack", "points": 100 }
  ],
  "cards": [
    { "name": "Vernestra Rwoh (Set 5)", "points": 200 },
    { "name": "HK-47 (Set 5)", "points": 200 }
  ],
  "mats": [
    { "name": "Babu Frik (Set 5) Game Mat", "points": 1000 }
  ]
}
```

- **boosters**: Array of booster pack options
- **cards**: Array of individual cards
- **mats**: Array of game mats
- Each item has `name` (display name) and `points` (ticket cost)

Use the built-in GUI editor to manage prizes without editing JSON directly.

## 💰 Ticket Display

- **Event Tickets**: Total earned from selected events
- **Total Available**: Base tickets (entry type) + event tickets
- **Spent**: Total tickets allocated to cart items
- **Remaining**: Tickets left to spend
  - **Green**: Plenty of tickets (>500)
  - **Orange**: Running low (<500)
  - **Red**: Over budget or near limit

## 📁 Files

### Main Application
- `index.html` - Main planner application
- `styles.css` - Mobile-first responsive styling with gradient UI
- `script.js` - Application logic with event delegation, JSON loading, and state management

### Data Files
- `prizes.json` - Prize wall data structure
- `events.json` - Events data structure

### Editor Pages
- `prizes-editor.html` / `prizes-editor.css` / `prizes-editor.js` - Prize wall GUI editor
- `events-editor.html` / `events-editor.css` / `events-editor.js` - Events GUI editor

### Documentation
- `README.md` - This documentation

## 🛠️ Technical Details

### Architecture
- **Pure Vanilla Stack**: HTML5, CSS3, JavaScript ES6+ (no frameworks or dependencies)
- **JSON-Based Data**: Prizes and events loaded from JSON files with GUI editors
- **Event Delegation**: Single event handler for all prize/cart buttons (performance optimized)
- **DOM Caching**: Minimizes repeated DOM queries for better performance
- **State Persistence**: localStorage for cart, entry type, selected events, custom prizes, and custom events
- **XSS Protection**: HTML escaping for user data
- **Error Handling**: Try-catch blocks for localStorage and file operations

### Design Patterns
- Centralized CONFIG object for maintainable configuration
- Modular function design for readability
- State validation with validateDOM()
- Responsive CSS Grid and Flexbox layouts
- Mobile-first approach with 44px minimum touch targets

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage API support required
- CSS Grid and Flexbox support required

## 🎮 Event Details

### Scheduled Side Events
- **Deluxe Sector Cup**: Base 2000 tickets + up to 2400 for wins
- **Standard/Eternal Sector Cup**: Base 1000 tickets + up to 1200 for wins
- **Draft/Chaos Draft Challenge**: Base 800 tickets + up to 800 for wins

### On-Demand Events
- **Standard/Draft On-Demand**: Base 400 tickets + up to 400 for wins
- **Sealed/Commander On-Demand**: Base 300 tickets + up to 400 for wins
- **Chaos On-Demand**: Base 300 tickets + up to 300 for wins
- **Bonus Event**: Base 200 tickets + up to 200 for wins

## 💡 Tips

- Plan your event schedule first to maximize ticket earnings
- Higher entry types provide significantly more base tickets
- Deluxe Sector Cup offers the highest ticket rewards
- Export your plan before the event for easy reference
- Your cart persists between browser sessions

---

Built for Magic: The Gathering London event prize wall planning. Enjoy your purchases! 🎉
