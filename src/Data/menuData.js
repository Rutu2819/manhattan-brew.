export const categories = [
  {
    slug: 'coffee',
    name: 'Coffee',
    badge: 'CO',
    color: '#c1502e',
    icon: '☕',
    image: '/images/menu/coffee-2.jpg',
    items: [
      { id: 'coffee-1', name: 'Espresso', price: 140, desc: 'Double shot, no apologies.', image: '/images/menu/coffee-1.jpg' },
      { id: 'coffee-2', name: 'Latte', price: 190, desc: 'Silky steamed milk, light foam.', image: '/images/menu/coffee-2.jpg' },
      { id: 'coffee-3', name: 'Cold Brew', price: 210, desc: 'Steeped 18 hours, served over ice.', image: '/images/menu/coffee-3.jpg' },
      // Flat White: put a DIFFERENT photo in public/images/menu/ named coffee-4.jpg (replace the existing file)
      { id: 'coffee-4', name: 'Flat White', price: 200, desc: 'Ristretto base, microfoam finish.', image: '/images/menu/coffee-4.jpg' },
    ],
  },
  {
    slug: 'croissant',
    name: 'Croissant',
    badge: 'CR',
    color: '#c9a227',
    icon: '🥐',
    image: '/images/menu/croissant-1.jpg',
    items: [
      { id: 'croissant-1', name: 'Classic Butter Croissant', price: 120, desc: 'Flaky, golden, straight from the oven.', image: '/images/menu/croissant-1.jpg' },
      { id: 'croissant-2', name: 'Almond Croissant', price: 160, desc: 'Frangipane-filled, toasted almonds.', image: '/images/menu/croissant-2.jpg' },
      // FIXED: chocolate <-> ham swapped
      { id: 'croissant-3', name: 'Chocolate Croissant', price: 150, desc: 'Dark chocolate batons, double-baked.', image: '/images/menu/croissant-4.jpg' },
      { id: 'croissant-4', name: 'Ham & Gruyère Croissant', price: 180, desc: 'Laminated dough, black forest ham, nutty Gruyère.', tag: 'Savory', image: '/images/menu/croissant-3.jpg' },
    ],
  },
  {
    slug: 'muffin',
    name: 'Muffin',
    badge: 'MU',
    color: '#3e6259',
    icon: '🧁',
    image: '/images/menu/muffin-2.jpg',
    items: [
      { id: 'muffin-1', name: 'Double Chocolate Muffin', price: 130, desc: 'Rich cocoa crumb, molten center.', image: '/images/menu/muffin-1.jpg' },
      { id: 'muffin-2', name: 'Blueberry Muffin', price: 130, desc: 'Bursting with real blueberries.', image: '/images/menu/muffin-2.jpg' },
      { id: 'muffin-3', name: 'Banana Walnut Muffin', price: 140, desc: 'Moist, nutty, lightly spiced.', image: '/images/menu/muffin-3.jpg' },
    ],
  },
  {
    slug: 'cheesecake',
    name: 'Cheese Cake',
    badge: 'CC',
    color: '#d98a8a',
    icon: '🍰',
    image: '/images/menu/cheesecake-2.jpg',
    items: [
      // FIXED: all three re-mapped
      { id: 'cheesecake-1', name: 'Classic NY Cheesecake', price: 220, desc: 'Graham crust, vanilla bean batter.', image: '/images/menu/cheesecake-2.jpg' },
      { id: 'cheesecake-2', name: 'Strawberry Swirl Cheesecake', price: 240, desc: 'Fresh strawberry compote ribboned in.', image: '/images/menu/cheesecake-3.jpg' },
      { id: 'cheesecake-3', name: 'Basque Burnt Cheesecake', price: 260, desc: 'Deliberately scorched top, molten center.', image: '/images/menu/cheesecake-1.jpg' },
    ],
  },
  {
    slug: 'mojito',
    name: 'Mojito',
    badge: 'MJ',
    color: '#3e6259',
    icon: '🍹',
    image: '/images/menu/mojito-1.jpg',
    items: [
      { id: 'mojito-1', name: 'Classic Virgin Mojito', price: 180, desc: 'Muddled mint, fresh lime, soda.', image: '/images/menu/mojito-1.jpg' },
      // FIXED: watermelon <-> passionfruit swapped
      { id: 'mojito-2', name: 'Watermelon Mojito', price: 200, desc: 'Muddled watermelon, cooling and sweet.', image: '/images/menu/mojito-3.jpg' },
      { id: 'mojito-3', name: 'Passionfruit Mojito', price: 210, desc: 'Muddled mint, passionfruit pulp, soda.', image: '/images/menu/mojito-2.jpg' },
    ],
  },
  {
    slug: 'ny-coke',
    name: 'New York Style Coke',
    badge: 'NY',
    color: '#c1502e',
    icon: '🥤',
    image: '/images/menu/ny-coke-2.jpg',
    items: [
      { id: 'ny-coke-1', name: 'Classic Fountain Coke', price: 90, desc: 'Extra carbonation, diner-style pour.', image: '/images/menu/ny-coke-1.jpg' },
      // FIXED: cherry <-> lime swapped
      { id: 'ny-coke-2', name: 'Cherry Coke', price: 110, desc: 'Cherry syrup, classic combination.', image: '/images/menu/ny-coke-3.jpg' },
      { id: 'ny-coke-3', name: 'Lime Coke', price: 100, desc: 'Fresh lime wedge, extra fizz.', image: '/images/menu/ny-coke-2.jpg' },
    ],
  },
  {
    slug: 'matcha',
    name: 'Matcha',
    badge: 'MA',
    color: '#c9a227',
    icon: '🍵',
    image: '/images/menu/matcha-1.jpg',
    items: [
      { id: 'matcha-1', name: 'Iced Matcha Latte', price: 210, desc: 'Stone-ground matcha, oat milk.', image: '/images/menu/matcha-1.jpg' },
      { id: 'matcha-2', name: 'Strawberry Matcha', price: 230, desc: 'Layered strawberry purée and matcha.', image: '/images/menu/matcha-2.jpg' },
    ],
  },
  {
    slug: 'pasta',
    name: 'Pasta',
    badge: 'PA',
    color: '#2b1b12',
    icon: '🍝',
    image: '/images/menu/pasta-1.jpg',
    items: [
      { id: 'pasta-1', name: 'Arrabbiata Penne', price: 320, desc: 'Spicy tomato, garlic, fresh basil.', image: '/images/menu/pasta-1.jpg' },
      { id: 'pasta-2', name: 'Classic Alfredo', price: 350, desc: 'Parmesan cream, cracked pepper.', image: '/images/menu/pasta-2.jpg' },
      { id: 'pasta-3', name: 'Aglio e Olio (small)', price: 260, desc: 'Garlic, chili flakes, olive oil, half portion.', image: '/images/menu/pasta-3.jpg' },
    ],
  },
]
export const allItems = categories.flatMap(category => category.items);