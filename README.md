# 🎯 Prize Wall Purchase Planner

A mobile-friendly web-based planner to help you manage your prize wall purchases at Magic: The Gathering events. Calculate your available tickets from entry type and event participation, then plan your prize purchases efficiently.

## ✨ Features

- **Entry Type Selection**: Choose from Standard (100 tickets), Premium (1300 tickets), or Deluxe (3200 tickets)
- **Event Ticket Calculator**: Calculate additional tickets from 11 event types:
  - **Scheduled Side Events**: Deluxe Sector Cup, Standard Sector Cup, Eternal Sector Cup, Draft Challenge, Chaos Draft
  - **On-Demand Events**: Standard On-Demand, Draft On-Demand, Sealed On-Demand, Commander On-Demand, Chaos On-Demand, Bonus Event
  - Track participation and placement rewards with dropdown selectors
- **Predefined Prize Wall**: All prizes from London event included:
  - 1 Play Booster Pack (100 tickets)
  - 12 Different cards (150-200 tickets each)
  - 4 Game mats (200-750 tickets each)
- **Direct Cart Addition**: Add/remove prizes with +/- buttons
- **Real-Time Budget Tracking**: See available, spent, and remaining tickets instantly
- **Visual Feedback**: Color-coded remaining tickets display
- **Export Functionality**: Download your purchase plan as a text file
- **Auto-Save**: All selections persist using localStorage (entry type, events, cart)
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
5. **Export Your Plan**: Click "Export List" to download your selections
6. **Start Fresh**: Use "Clear Cart" to remove all items

## 💰 Ticket Display

- **Event Tickets**: Total earned from selected events
- **Total Available**: Base tickets (entry type) + event tickets
- **Spent**: Total tickets allocated to cart items
- **Remaining**: Tickets left to spend
  - **Green**: Plenty of tickets (>500)
  - **Orange**: Running low (<500)
  - **Red**: Over budget or near limit

## 📁 Files

- `index.html` - Main application structure with entry selection, events, and prize wall
- `styles.css` - Mobile-first responsive styling with gradient UI
- `script.js` - Application logic with event delegation and state management
- `README.md` - This documentation

## 🛠️ Technical Details

### Architecture
- **Pure Vanilla Stack**: HTML5, CSS3, JavaScript ES6+ (no frameworks or dependencies)
- **Event Delegation**: Single event handler for all prize/cart buttons (performance optimized)
- **DOM Caching**: Minimizes repeated DOM queries for better performance
- **State Persistence**: localStorage for cart, entry type, and selected events
- **XSS Protection**: HTML escaping for user data
- **Error Handling**: Try-catch blocks for localStorage operations

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
