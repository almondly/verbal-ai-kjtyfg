
import { Tile } from '../types';

const categoryColor: Record<string, string> = {
  core: '#4D9EFF',
  people: '#FF77FF',
  actions: '#00FFA5',
  feelings: '#FFD700',
  food: '#FF6F61',
  home: '#7F7FFF',
  school: '#7FFF7F',
  body: '#FFE066',
  places: '#BF7FFF',
  routines: '#FFB266',
  questions: '#FFE066',
  colours: '#66D9FF', // Australian spelling
  numbers: '#66D9FF',
  animals: '#FF9966',
  clothing: '#CC99FF',
  weather: '#66B2FF',
  time: '#FF66FF',
  toys: '#FF99CC',
};

// Helper to build tiles quickly with AAC-style images - Australian English
const t = (category: string, text: string, imageUri?: string): Tile => ({
  id: `${category}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  text,
  category,
  color: categoryColor[category] || '#FFFFFF',
  imageUri,
});

export const defaultTiles: Tile[] = [
  // Core - Essential communication words (Australian English)
  t('core', 'I', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('core', 'you', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'),
  t('core', 'he', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
  t('core', 'she', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),
  t('core', 'we', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop'),
  t('core', 'they', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=200&fit=crop'),
  t('core', 'it', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'),
  t('core', 'me', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('core', 'my', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'mine', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'your', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'want', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'need', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'like', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('core', "don't", 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('core', 'help', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop'),
  t('core', 'more', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'again', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'different', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'same', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'this', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'that', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'here', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'there', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'go', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('core', 'stop', 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=200&h=200&fit=crop'),
  t('core', 'come', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('core', 'look', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop'),
  t('core', 'put', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'make', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'turn', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'open', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'close', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'all done', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'finished', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'please', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'thank you', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'cheers', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian thanks
  t('core', 'ta', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian thanks
  t('core', 'yes', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'yeah', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian yes
  t('core', 'no', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('core', 'nah', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'), // Australian no
  t('core', 'because', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'and', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'or', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'with', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'without', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'big', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'small', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'fast', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('core', 'slow', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('core', 'good', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('core', 'bonzer', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'), // Australian good
  t('core', 'bad', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('core', 'favourite', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'), // Australian spelling

  // People - Family and social connections (Australian terms)
  t('people', 'mum', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'), // Australian
  t('people', 'dad', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
  t('people', 'nan', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face'), // Australian grandma
  t('people', 'pop', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face'), // Australian grandpa
  t('people', 'brother', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'sister', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),
  t('people', 'bub', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=200&fit=crop&crop=face'), // Australian baby
  t('people', 'mate', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop'), // Australian friend
  t('people', 'teacher', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),
  t('people', 'principal', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
  t('people', 'nurse', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'),
  t('people', 'bus driver', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'coach', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
  t('people', 'neighbour', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'), // Australian spelling
  t('people', 'doctor', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'dentist', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'police', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('people', 'firefighter', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
  t('people', 'postie', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'), // Australian mailman

  // Actions - Verbs and activities (Australian expressions)
  t('actions', 'eat', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'),
  t('actions', 'scoff', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian eat
  t('actions', 'drink', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'),
  t('actions', 'play', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'),
  t('actions', 'muck about', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'), // Australian play
  t('actions', 'read', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop'),
  t('actions', 'write', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop'),
  t('actions', 'draw', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop'),
  t('actions', 'colour', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop'), // Australian spelling
  t('actions', 'cut', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'paste', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'build', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=200&fit=crop'),
  t('actions', 'ride', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'),
  t('actions', 'walk', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('actions', 'run', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('actions', 'jump', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
  t('actions', 'sit', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'stand', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'turn', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'show', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'give', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop'),
  t('actions', 'take', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'say', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'yarn', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian talk
  t('actions', 'listen', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop'),
  t('actions', 'look', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop'),
  t('actions', 'point', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'wait', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'wash', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'brush', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'sleep', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'),
  t('actions', 'wake', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('actions', 'help', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop'),
  t('actions', 'lend a hand', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop'), // Australian help

  // Feelings - Emotions and states (Australian expressions)
  t('feelings', 'happy', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'chuffed', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'), // Australian happy
  t('feelings', 'stoked', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'), // Australian excited
  t('feelings', 'sad', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'gutted', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'), // Australian sad
  t('feelings', 'mad', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'cranky', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'), // Australian angry
  t('feelings', 'frustrated', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'excited', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'tired', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'),
  t('feelings', 'knackered', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'), // Australian tired
  t('feelings', 'bored', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'crook', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'), // Australian sick
  t('feelings', 'scared', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'spooked', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'), // Australian scared
  t('feelings', 'worried', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'calm', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'chilled', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'), // Australian calm
  t('feelings', 'proud', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'silly', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'surprised', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'okay', 'https://images.unsplash.com/photo-1516627145497-ae4099d4e6ed?w=200&h=200&fit=crop'),
  t('feelings', 'hurt', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop'),
  t('feelings', 'hungry', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'),
  t('feelings', 'peckish', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian hungry
  t('feelings', 'thirsty', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'),
  t('feelings', 'parched', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'), // Australian thirsty
  t('feelings', 'hot', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('feelings', 'roasting', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian hot
  t('feelings', 'cold', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('feelings', 'freezing', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),

  // Food - Expanded food and drink vocabulary (Australian foods)
  t('food', 'apple', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop'),
  t('food', 'banana', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop'),
  t('food', 'bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'),
  t('food', 'milk', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'),
  t('food', 'water', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'),
  t('food', 'juice', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'),
  t('food', 'brekkie', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian breakfast
  t('food', 'tucker', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian food
  t('food', 'meat pie', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop'), // Australian
  t('food', 'sausage roll', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop'), // Australian
  t('food', 'lamington', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop'), // Australian
  t('food', 'pavlova', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop'), // Australian
  t('food', 'vegemite', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'), // Australian
  t('food', 'tim tams', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop'), // Australian
  t('food', 'fairy bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'), // Australian
  t('food', 'anzac biscuits', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop'), // Australian
  t('food', 'fish and chips', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'),
  t('food', 'barbie', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian BBQ
  t('food', 'cuppa', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'), // Australian tea/coffee
  t('food', 'milo', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop'), // Australian drink

  // Home - Household items and rooms (Australian terms)
  t('home', 'bed', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'),
  t('home', 'chair', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'),
  t('home', 'table', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'),
  t('home', 'lounge', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'), // Australian sofa
  t('home', 'telly', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'), // Australian TV
  t('home', 'dunny', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop'), // Australian toilet
  t('home', 'kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'),
  t('home', 'bathroom', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop'),
  t('home', 'bedroom', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'),
  t('home', 'lounge room', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'), // Australian living room
  t('home', 'garage', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'),
  t('home', 'backyard', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'), // Australian yard
  t('home', 'verandah', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'), // Australian porch
  t('home', 'esky', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'), // Australian cooler
  t('home', 'fridge', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'), // Australian refrigerator

  // School - Educational items and activities (Australian terms)
  t('school', 'book', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop'),
  t('school', 'pencil', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop'),
  t('school', 'rubber', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop'), // Australian eraser
  t('school', 'texta', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop'), // Australian marker
  t('school', 'exercise book', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop'), // Australian notebook
  t('school', 'port', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop'), // Australian school bag
  t('school', 'tuckshop', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian canteen
  t('school', 'playground', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'),
  t('school', 'assembly', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('school', 'sport', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),

  // Places - Locations and destinations (Australian places)
  t('places', 'park', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'),
  t('places', 'school', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('places', 'home', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop'),
  t('places', 'shops', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'), // Australian shopping
  t('places', 'servo', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'), // Australian service station
  t('places', 'bottle-o', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'), // Australian bottle shop
  t('places', 'beach', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop'),
  t('places', 'bush', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'), // Australian wilderness
  t('places', 'oval', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'), // Australian sports ground
  t('places', 'RSL', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian club

  // Time - Time-related vocabulary (Australian terms)
  t('time', 'morning', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'),
  t('time', 'arvo', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'), // Australian afternoon
  t('time', 'evening', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'),
  t('time', 'night', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'),
  t('time', 'today', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('time', 'tomorrow', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('time', 'yesterday', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),

  // Colours - Color vocabulary (Australian spelling)
  t('colours', 'red', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop'),
  t('colours', 'blue', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop'),
  t('colours', 'green', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop'),
  t('colours', 'yellow', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop'),
  t('colours', 'orange', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop'),
  t('colours', 'purple', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop'),
  t('colours', 'pink', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop'),
  t('colours', 'brown', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'),
  t('colours', 'black', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('colours', 'white', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),

  // Questions - Question words and phrases (Australian style)
  t('questions', 'who', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('questions', 'what', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'where', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'when', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'why', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'how', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'can I', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('questions', 'how ya going', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian greeting

  // Greetings and farewells (Australian)
  t('core', 'g\'day', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian hello
  t('core', 'hiya', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian hi
  t('core', 'see ya', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian goodbye
  t('core', 'cheerio', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian goodbye
  t('core', 'catch ya later', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian goodbye
  t('core', 'hooroo', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian goodbye

  // Weather - Australian weather terms
  t('weather', 'sunny', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'),
  t('weather', 'stinking hot', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'), // Australian very hot
  t('weather', 'bucketing down', 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&h=200&fit=crop'), // Australian heavy rain
  t('weather', 'drizzling', 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&h=200&fit=crop'),
  t('weather', 'brass monkeys', 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=200&h=200&fit=crop'), // Australian very cold
  t('weather', 'lovely day', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'), // Australian nice weather

  // Animals - Australian animals
  t('animals', 'dog', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop'),
  t('animals', 'cat', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop'),
  t('animals', 'kangaroo', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian
  t('animals', 'koala', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian
  t('animals', 'wombat', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian
  t('animals', 'echidna', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian
  t('animals', 'platypus', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian
  t('animals', 'kookaburra', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop'), // Australian
  t('animals', 'magpie', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop'), // Australian
  t('animals', 'possum', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop'), // Australian

  // Numbers - Australian context
  t('numbers', 'one', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'two', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'three', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'four', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'five', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'heaps', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian lots
  t('numbers', 'a few', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('numbers', 'loads', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian many

  // Toys and activities - Australian context
  t('toys', 'footy', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'), // Australian football
  t('toys', 'cricket bat', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'), // Australian sport
  t('toys', 'bike', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'),
  t('toys', 'skateboard', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'),
  t('toys', 'ball', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'),
  t('toys', 'teddy', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'), // Australian teddy bear

  // Body parts - standard with some Australian terms
  t('body', 'head', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('body', 'noggin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'), // Australian head
  t('body', 'arm', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('body', 'leg', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('body', 'hand', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('body', 'foot', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('body', 'eye', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop'),
  t('body', 'ear', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop'),
  t('body', 'nose', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('body', 'mouth', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
  t('body', 'tummy', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian stomach

  // Routines - Daily activities (Australian context)
  t('routines', 'have brekkie', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian breakfast
  t('routines', 'go to school', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('routines', 'brush teeth', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('routines', 'have a shower', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop'), // Australian bath
  t('routines', 'get dressed', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('routines', 'have lunch', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'),
  t('routines', 'have tea', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'), // Australian dinner
  t('routines', 'go to bed', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop'),
  t('routines', 'wake up', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('routines', 'wash hands', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('routines', 'watch telly', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'), // Australian watch TV
  t('routines', 'play outside', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop'),
  t('routines', 'do homework', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop'),

  // Clothing - Australian terms
  t('clothing', 'shirt', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('clothing', 'pants', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('clothing', 'trousers', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian pants
  t('clothing', 'shoes', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('clothing', 'thongs', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian flip-flops
  t('clothing', 'jumper', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian sweater
  t('clothing', 'trackies', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian tracksuit
  t('clothing', 'sunnies', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian sunglasses
  t('clothing', 'hat', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'),
  t('clothing', 'akubra', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop'), // Australian hat
];

export { categoryColor, t };
