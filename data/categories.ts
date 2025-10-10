
export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'grid-outline', color: '#666666' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keypad-outline', color: '#9966CC' },
  { id: 'core', label: 'Core', icon: 'star-outline', color: '#0066CC' },
  { id: 'people', label: 'People', icon: 'people-outline', color: '#CC00CC' },
  { id: 'actions', label: 'Actions', icon: 'flash-outline', color: '#00CC66' },
  { id: 'feelings', label: 'Feelings', icon: 'happy-outline', color: '#FFCC00' },
  { id: 'food', label: 'Food', icon: 'restaurant-outline', color: '#FF6633' },
  { id: 'home', label: 'Home', icon: 'home-outline', color: '#6666FF' },
  { id: 'school', label: 'School', icon: 'school-outline', color: '#66CC66' },
  { id: 'body', label: 'Body', icon: 'body-outline', color: '#FFDD66' },
  { id: 'places', label: 'Places', icon: 'location-outline', color: '#9966FF' },
  { id: 'routines', label: 'Routines', icon: 'time-outline', color: '#FF9966' },
  { id: 'questions', label: 'Questions', icon: 'help-circle-outline', color: '#FFCC66' },
  { id: 'colours', label: 'Colours', icon: 'color-palette-outline', color: '#33CCFF' },
  { id: 'numbers', label: 'Numbers', icon: 'calculator-outline', color: '#3399FF' },
  { id: 'animals', label: 'Animals', icon: 'paw-outline', color: '#FF8855' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt-outline', color: '#BB88FF' },
  { id: 'weather', label: 'Weather', icon: 'sunny-outline', color: '#5599FF' },
  { id: 'time', label: 'Time', icon: 'alarm-outline', color: '#FF55FF' },
  { id: 'toys', label: 'Toys', icon: 'game-controller-outline', color: '#FFAACC' },
];
