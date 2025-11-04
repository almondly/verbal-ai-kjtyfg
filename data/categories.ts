
export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// Using ONLY the 5 approved colors: #2faad6, #f35e69, #8fd2b0, #f271ab, #f9d809
export const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'grid-outline', color: '#8fd2b0' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keypad-outline', color: '#f271ab' },
  { id: 'core', label: 'Core', icon: 'star-outline', color: '#2faad6' }, 
  { id: 'greetings', label: 'Greetings', icon: 'hand-left-outline', color: '#f35e69' },
  { id: 'people', label: 'People', icon: 'people-outline', color: '#f271ab' },
  { id: 'actions', label: 'Actions', icon: 'flash-outline', color: '#8fd2b0' },
  { id: 'feelings', label: 'Feelings', icon: 'happy-outline', color: '#f9d809' },
  { id: 'food', label: 'Food', icon: 'restaurant-outline', color: '#f35e69' },
  { id: 'home', label: 'Home', icon: 'home-outline', color: '#2faad6' },
  { id: 'school', label: 'School', icon: 'school-outline', color: '#8fd2b0' },
  { id: 'body', label: 'Body', icon: 'body-outline', color: '#f9d809' },
  { id: 'places', label: 'Places', icon: 'location-outline', color: '#f271ab' },
  { id: 'routines', label: 'Routines', icon: 'time-outline', color: '#f35e69' },
  { id: 'questions', label: 'Questions', icon: 'help-circle-outline', color: '#f9d809' },
  { id: 'colours', label: 'Colours', icon: 'color-palette-outline', color: '#2faad6' },
  { id: 'numbers', label: 'Numbers', icon: 'calculator-outline', color: '#8fd2b0' },
  { id: 'animals', label: 'Animals', icon: 'paw-outline', color: '#f271ab' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt-outline', color: '#f35e69' },
  { id: 'weather', label: 'Weather', icon: 'sunny-outline', color: '#2faad6' },
  { id: 'time', label: 'Time', icon: 'alarm-outline', color: '#f9d809' },
  { id: 'toys', label: 'Toys', icon: 'game-controller-outline', color: '#f271ab' },
];
