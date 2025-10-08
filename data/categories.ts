
export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'grid-outline', color: '#6B7280' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keypad-outline', color: '#9B59B6' },
  { id: 'core', label: 'Core', icon: 'star-outline', color: '#4D9EFF' },
  { id: 'people', label: 'People', icon: 'people-outline', color: '#FF77FF' },
  { id: 'actions', label: 'Actions', icon: 'flash-outline', color: '#00FFA5' },
  { id: 'feelings', label: 'Feelings', icon: 'happy-outline', color: '#FFD700' },
  { id: 'food', label: 'Tucker', icon: 'restaurant-outline', color: '#FF6F61' },
  { id: 'home', label: 'Home', icon: 'home-outline', color: '#7F7FFF' },
  { id: 'school', label: 'School', icon: 'school-outline', color: '#7FFF7F' },
  { id: 'body', label: 'Body', icon: 'body-outline', color: '#FFE066' },
  { id: 'places', label: 'Places', icon: 'location-outline', color: '#BF7FFF' },
  { id: 'routines', label: 'Routines', icon: 'time-outline', color: '#FFB266' },
  { id: 'questions', label: 'Questions', icon: 'help-circle-outline', color: '#FFE066' },
  { id: 'colours', label: 'Colours', icon: 'color-palette-outline', color: '#66D9FF' },
  { id: 'numbers', label: 'Numbers', icon: 'calculator-outline', color: '#66D9FF' },
  { id: 'animals', label: 'Animals', icon: 'paw-outline', color: '#FF9966' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt-outline', color: '#CC99FF' },
  { id: 'weather', label: 'Weather', icon: 'sunny-outline', color: '#66B2FF' },
  { id: 'time', label: 'Time', icon: 'alarm-outline', color: '#FF66FF' },
  { id: 'toys', label: 'Toys', icon: 'game-controller-outline', color: '#FF99CC' },
];
