
export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'grid-outline', color: '#7F8C8D' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keypad-outline', color: '#9B59B6' },
  { id: 'core', label: 'Core', icon: 'star-outline', color: '#3498DB' },
  { id: 'people', label: 'People', icon: 'people-outline', color: '#9B59B6' },
  { id: 'actions', label: 'Actions', icon: 'flash-outline', color: '#2ECC71' },
  { id: 'feelings', label: 'Feelings', icon: 'happy-outline', color: '#F1C40F' },
  { id: 'food', label: 'Food', icon: 'restaurant-outline', color: '#E67E22' },
  { id: 'home', label: 'Home', icon: 'home-outline', color: '#5DADE2' },
  { id: 'school', label: 'School', icon: 'school-outline', color: '#52BE80' },
  { id: 'body', label: 'Body', icon: 'body-outline', color: '#F8B739' },
  { id: 'places', label: 'Places', icon: 'location-outline', color: '#AF7AC5' },
  { id: 'routines', label: 'Routines', icon: 'time-outline', color: '#EC7063' },
  { id: 'questions', label: 'Questions', icon: 'help-circle-outline', color: '#F4D03F' },
  { id: 'colours', label: 'Colours', icon: 'color-palette-outline', color: '#48C9B0' },
  { id: 'numbers', label: 'Numbers', icon: 'calculator-outline', color: '#5DADE2' },
  { id: 'animals', label: 'Animals', icon: 'paw-outline', color: '#EB984E' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt-outline', color: '#BB8FCE' },
  { id: 'weather', label: 'Weather', icon: 'sunny-outline', color: '#85C1E2' },
  { id: 'time', label: 'Time', icon: 'alarm-outline', color: '#F1948A' },
  { id: 'toys', label: 'Toys', icon: 'game-controller-outline', color: '#F8B4D9' },
];
