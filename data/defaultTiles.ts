
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
  colours: '#66D9FF',
  numbers: '#66D9FF',
  animals: '#FF9966',
  clothing: '#CC99FF',
  weather: '#66B2FF',
  time: '#FF66FF',
  toys: '#FF99CC',
};

// Helper to build tiles quickly with ARASAAC pictogram images
const t = (category: string, text: string, arasaacId?: number): Tile => ({
  id: `${category}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  text,
  category,
  color: categoryColor[category] || '#FFFFFF',
  imageUri: arasaacId ? `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_300.png` : undefined,
});

export const defaultTiles: Tile[] = [
  // Core - Essential communication words
  t('core', 'I', 8502),           // I/me pointing to self
  t('core', 'you', 8687),          // you pointing to other
  t('core', 'he', 8485),           // he/male person
  t('core', 'she', 8622),          // she/female person
  t('core', 'we', 8679),           // we/group of people
  t('core', 'they', 8650),         // they/multiple people
  t('core', 'it', 8509),           // it/object
  t('core', 'me', 8541),           // me/self
  t('core', 'my', 8555),           // my/possession
  t('core', 'mine', 8547),         // mine/ownership
  t('core', 'your', 8688),         // your/belonging to you
  t('core', 'want', 8677),         // want/desire
  t('core', 'need', 8558),         // need/necessity
  t('core', 'like', 8524),         // like/enjoy
  t('core', "don't", 8421),        // don't/negative
  t('core', 'help', 8486),         // help/assistance
  t('core', 'more', 8551),         // more/additional
  t('core', 'again', 8289),        // again/repeat
  t('core', 'different', 8414),    // different/not same
  t('core', 'same', 8612),         // same/identical
  t('core', 'this', 8652),         // this/near object
  t('core', 'that', 8649),         // that/far object
  t('core', 'here', 8487),         // here/this location
  t('core', 'there', 8648),        // there/that location
  t('core', 'go', 8471),           // go/move
  t('core', 'stop', 8638),         // stop/halt
  t('core', 'come', 8377),         // come/approach
  t('core', 'look', 8527),         // look/see
  t('core', 'put', 8594),          // put/place
  t('core', 'make', 8532),         // make/create
  t('core', 'turn', 8664),         // turn/rotate
  t('core', 'open', 8568),         // open/unlock
  t('core', 'close', 8373),        // close/shut
  t('core', 'all done', 8293),     // all done/finished
  t('core', 'finished', 8452),     // finished/complete
  t('core', 'please', 8584),       // please/polite request
  t('core', 'thank you', 8647),    // thank you/gratitude
  t('core', 'yes', 8686),          // yes/affirmative
  t('core', 'no', 8560),           // no/negative
  t('core', 'because', 8318),      // because/reason
  t('core', 'and', 8298),          // and/plus
  t('core', 'or', 8569),           // or/alternative
  t('core', 'with', 8683),         // with/together
  t('core', 'without', 8684),      // without/lacking
  t('core', 'big', 8324),          // big/large
  t('core', 'small', 8627),        // small/little
  t('core', 'fast', 8447),         // fast/quick
  t('core', 'slow', 8626),         // slow/gradual
  t('core', 'good', 8472),         // good/positive
  t('core', 'bad', 8313),          // bad/negative
  t('core', 'favourite', 8448),    // favourite/preferred
  t('core', 'hello', 8485),        // hello/greeting
  t('core', 'goodbye', 8473),      // goodbye/farewell

  // People - Family and social connections
  t('people', 'mum', 8553),        // mum/mother
  t('people', 'dad', 8402),        // dad/father
  t('people', 'grandma', 8475),    // grandma/grandmother
  t('people', 'grandpa', 8476),    // grandpa/grandfather
  t('people', 'brother', 8339),    // brother/male sibling
  t('people', 'sister', 8625),     // sister/female sibling
  t('people', 'baby', 8312),       // baby/infant
  t('people', 'friend', 8460),     // friend/companion
  t('people', 'teacher', 8646),    // teacher/educator
  t('people', 'student', 8639),    // student/pupil
  t('people', 'principal', 8588),  // principal/headmaster
  t('people', 'nurse', 8563),      // nurse/medical staff
  t('people', 'bus driver', 8343), // bus driver/driver
  t('people', 'coach', 8374),      // coach/trainer
  t('people', 'neighbour', 8559),  // neighbour/nearby person
  t('people', 'doctor', 8419),     // doctor/physician
  t('people', 'dentist', 8410),    // dentist/tooth doctor
  t('people', 'police', 8585),     // police/officer
  t('people', 'firefighter', 8453),// firefighter/fire service
  t('people', 'mail carrier', 8531),// mail carrier/postman

  // Actions - Verbs and activities
  t('actions', 'eat', 8428),       // eat/consume food
  t('actions', 'drink', 8422),     // drink/consume liquid
  t('actions', 'play', 8583),      // play/have fun
  t('actions', 'read', 8598),      // read/look at text
  t('actions', 'write', 8685),     // write/make text
  t('actions', 'draw', 8423),      // draw/make picture
  t('actions', 'colour', 8376),    // colour/add color
  t('actions', 'cut', 8401),       // cut/use scissors
  t('actions', 'paste', 8577),     // paste/glue
  t('actions', 'build', 8341),     // build/construct
  t('actions', 'ride', 8605),      // ride/travel on
  t('actions', 'walk', 8676),      // walk/move on foot
  t('actions', 'run', 8610),       // run/move fast
  t('actions', 'jump', 8512),      // jump/leap
  t('actions', 'sit', 8624),       // sit/be seated
  t('actions', 'stand', 8636),     // stand/be upright
  t('actions', 'turn', 8663),      // turn/rotate
  t('actions', 'show', 8622),      // show/display
  t('actions', 'give', 8469),      // give/hand over
  t('actions', 'take', 8645),      // take/grab
  t('actions', 'say', 8613),       // say/speak
  t('actions', 'talk', 8644),      // talk/converse
  t('actions', 'listen', 8525),    // listen/hear
  t('actions', 'look', 8526),      // look/observe
  t('actions', 'point', 8586),     // point/indicate
  t('actions', 'wait', 8675),      // wait/pause
  t('actions', 'wash', 8678),      // wash/clean
  t('actions', 'brush', 8340),     // brush/clean with brush
  t('actions', 'sleep', 8625),     // sleep/rest
  t('actions', 'wake', 8674),      // wake/wake up
  t('actions', 'help', 8487),      // help/assist

  // Feelings - Emotions and states
  t('feelings', 'happy', 8481),    // happy/joyful
  t('feelings', 'sad', 8611),      // sad/unhappy
  t('feelings', 'angry', 8299),    // angry/mad
  t('feelings', 'frustrated', 8461),// frustrated/annoyed
  t('feelings', 'excited', 8442),  // excited/enthusiastic
  t('feelings', 'tired', 8656),    // tired/exhausted
  t('feelings', 'bored', 8335),    // bored/uninterested
  t('feelings', 'sick', 8623),     // sick/ill
  t('feelings', 'scared', 8614),   // scared/afraid
  t('feelings', 'worried', 8684),  // worried/anxious
  t('feelings', 'calm', 8348),     // calm/peaceful
  t('feelings', 'proud', 8591),    // proud/satisfied
  t('feelings', 'silly', 8624),    // silly/playful
  t('feelings', 'surprised', 8642),// surprised/shocked
  t('feelings', 'okay', 8566),     // okay/fine
  t('feelings', 'hurt', 8498),     // hurt/in pain
  t('feelings', 'hungry', 8497),   // hungry/need food
  t('feelings', 'thirsty', 8653),  // thirsty/need drink
  t('feelings', 'hot', 8494),      // hot/warm
  t('feelings', 'cold', 8375),     // cold/chilly

  // Food - Expanded food and drink vocabulary
  t('food', 'apple', 8302),        // apple/red fruit
  t('food', 'banana', 8314),       // banana/yellow fruit
  t('food', 'bread', 8337),        // bread/loaf
  t('food', 'milk', 8546),         // milk/dairy drink
  t('food', 'water', 8677),        // water/clear liquid
  t('food', 'juice', 8511),        // juice/fruit drink
  t('food', 'breakfast', 8338),    // breakfast/morning meal
  t('food', 'lunch', 8529),        // lunch/midday meal
  t('food', 'dinner', 8415),       // dinner/evening meal
  t('food', 'snack', 8628),        // snack/small food
  t('food', 'sandwich', 8612),     // sandwich/bread with filling
  t('food', 'pizza', 8582),        // pizza/Italian food
  t('food', 'pasta', 8576),        // pasta/noodles
  t('food', 'rice', 8604),         // rice/grain
  t('food', 'chicken', 8365),      // chicken/poultry
  t('food', 'fish', 8454),         // fish/seafood
  t('food', 'vegetables', 8671),   // vegetables/veggies
  t('food', 'fruit', 8462),        // fruit/fresh produce
  t('food', 'cake', 8346),         // cake/dessert
  t('food', 'biscuit', 8325),      // biscuit/cookie
  t('food', 'ice cream', 8499),    // ice cream/frozen dessert
  t('food', 'tea', 8645),          // tea/hot drink
  t('food', 'coffee', 8376),       // coffee/hot drink

  // Home - Household items and rooms
  t('home', 'bed', 8319),          // bed/sleeping furniture
  t('home', 'chair', 8359),        // chair/seat
  t('home', 'table', 8643),        // table/flat surface
  t('home', 'sofa', 8630),         // sofa/couch
  t('home', 'television', 8647),   // television/TV
  t('home', 'toilet', 8657),       // toilet/bathroom fixture
  t('home', 'kitchen', 8516),      // kitchen/cooking room
  t('home', 'bathroom', 8317),     // bathroom/wash room
  t('home', 'bedroom', 8320),      // bedroom/sleeping room
  t('home', 'living room', 8526),  // living room/lounge
  t('home', 'garage', 8465),       // garage/car storage
  t('home', 'garden', 8466),       // garden/outdoor space
  t('home', 'door', 8420),         // door/entrance
  t('home', 'window', 8681),       // window/glass opening
  t('home', 'refrigerator', 8600), // refrigerator/fridge

  // School - Educational items and activities
  t('school', 'book', 8334),       // book/reading material
  t('school', 'pencil', 8579),     // pencil/writing tool
  t('school', 'eraser', 8437),     // eraser/rubber
  t('school', 'marker', 8536),     // marker/felt pen
  t('school', 'notebook', 8562),   // notebook/exercise book
  t('school', 'backpack', 8311),   // backpack/school bag
  t('school', 'canteen', 8350),    // canteen/cafeteria
  t('school', 'playground', 8583), // playground/play area
  t('school', 'assembly', 8305),   // assembly/gathering
  t('school', 'sport', 8635),      // sport/physical activity
  t('school', 'classroom', 8371),  // classroom/learning room
  t('school', 'desk', 8411),       // desk/work table

  // Body - Body parts
  t('body', 'head', 8484),         // head/top of body
  t('body', 'face', 8445),         // face/front of head
  t('body', 'eyes', 8444),         // eyes/vision organs
  t('body', 'ears', 8427),         // ears/hearing organs
  t('body', 'nose', 8561),         // nose/smell organ
  t('body', 'mouth', 8552),        // mouth/eating organ
  t('body', 'teeth', 8646),        // teeth/chewing tools
  t('body', 'hands', 8480),        // hands/grasping tools
  t('body', 'fingers', 8451),      // fingers/hand digits
  t('body', 'arms', 8304),         // arms/upper limbs
  t('body', 'legs', 8522),         // legs/lower limbs
  t('body', 'feet', 8449),         // feet/walking tools
  t('body', 'toes', 8656),         // toes/foot digits
  t('body', 'stomach', 8637),      // stomach/belly
  t('body', 'back', 8310),         // back/rear of body

  // Places - Locations and destinations
  t('places', 'park', 8575),       // park/outdoor space
  t('places', 'school', 8615),     // school/learning place
  t('places', 'home', 8492),       // home/house
  t('places', 'shop', 8621),       // shop/store
  t('places', 'library', 8523),    // library/book place
  t('places', 'hospital', 8493),   // hospital/medical place
  t('places', 'beach', 8318),      // beach/seaside
  t('places', 'playground', 8584), // playground/play area
  t('places', 'restaurant', 8603), // restaurant/eating place
  t('places', 'cinema', 8369),     // cinema/movie theater

  // Routines - Daily activities
  t('routines', 'wake up', 8673),      // wake up/get up
  t('routines', 'get dressed', 8468),  // get dressed/put on clothes
  t('routines', 'brush teeth', 8341),  // brush teeth/dental hygiene
  t('routines', 'wash face', 8677),    // wash face/clean face
  t('routines', 'have breakfast', 8339),// have breakfast/eat morning meal
  t('routines', 'go to school', 8616), // go to school/attend school
  t('routines', 'have lunch', 8530),   // have lunch/eat midday meal
  t('routines', 'have dinner', 8416),  // have dinner/eat evening meal
  t('routines', 'take a bath', 8315),  // take a bath/bathe
  t('routines', 'go to bed', 8318),    // go to bed/sleep time

  // Questions - Question words
  t('questions', 'what', 8680),    // what/which thing
  t('questions', 'where', 8679),   // where/which place
  t('questions', 'when', 8678),    // when/which time
  t('questions', 'who', 8682),     // who/which person
  t('questions', 'why', 8683),     // why/for what reason
  t('questions', 'how', 8495),     // how/in what way
  t('questions', 'which', 8680),   // which/what one

  // Time - Time-related vocabulary
  t('time', 'morning', 8550),      // morning/early day
  t('time', 'afternoon', 8290),    // afternoon/midday
  t('time', 'evening', 8438),      // evening/late day
  t('time', 'night', 8559),        // night/dark time
  t('time', 'today', 8655),        // today/this day
  t('time', 'tomorrow', 8658),     // tomorrow/next day
  t('time', 'yesterday', 8687),    // yesterday/previous day
  t('time', 'now', 8561),          // now/current time
  t('time', 'later', 8520),        // later/future time
  t('time', 'soon', 8631),         // soon/near future

  // Colours - Colour vocabulary
  t('colours', 'red', 8599),       // red/red color
  t('colours', 'blue', 8330),      // blue/blue color
  t('colours', 'green', 8477),     // green/green color
  t('colours', 'yellow', 8686),    // yellow/yellow color
  t('colours', 'orange', 8570),    // orange/orange color
  t('colours', 'purple', 8593),    // purple/purple color
  t('colours', 'pink', 8581),      // pink/pink color
  t('colours', 'brown', 8338),     // brown/brown color
  t('colours', 'black', 8326),     // black/black color
  t('colours', 'white', 8680),     // white/white color
  t('colours', 'grey', 8478),      // grey/grey color

  // Numbers - Number vocabulary
  t('numbers', 'one', 8567),       // one/1
  t('numbers', 'two', 8665),       // two/2
  t('numbers', 'three', 8654),     // three/3
  t('numbers', 'four', 8458),      // four/4
  t('numbers', 'five', 8455),      // five/5
  t('numbers', 'six', 8624),       // six/6
  t('numbers', 'seven', 8621),     // seven/7
  t('numbers', 'eight', 8429),     // eight/8
  t('numbers', 'nine', 8559),      // nine/9
  t('numbers', 'ten', 8646),       // ten/10

  // Animals - Animal vocabulary
  t('animals', 'dog', 8418),       // dog/canine
  t('animals', 'cat', 8354),       // cat/feline
  t('animals', 'bird', 8324),      // bird/avian
  t('animals', 'fish', 8453),      // fish/aquatic
  t('animals', 'rabbit', 8595),    // rabbit/bunny
  t('animals', 'horse', 8492),     // horse/equine
  t('animals', 'cow', 8394),       // cow/bovine
  t('animals', 'sheep', 8620),     // sheep/ovine
  t('animals', 'pig', 8580),       // pig/porcine
  t('animals', 'chicken', 8364),   // chicken/hen

  // Clothing - Clothing vocabulary
  t('clothing', 'shirt', 8620),    // shirt/top
  t('clothing', 'trousers', 8662), // trousers/pants
  t('clothing', 'dress', 8421),    // dress/frock
  t('clothing', 'skirt', 8623),    // skirt/bottom
  t('clothing', 'shoes', 8619),    // shoes/footwear
  t('clothing', 'socks', 8629),    // socks/foot covering
  t('clothing', 'hat', 8482),      // hat/head covering
  t('clothing', 'coat', 8373),     // coat/jacket
  t('clothing', 'jumper', 8510),   // jumper/sweater

  // Weather - Weather vocabulary
  t('weather', 'sunny', 8641),     // sunny/bright
  t('weather', 'rainy', 8596),     // rainy/wet
  t('weather', 'cloudy', 8372),    // cloudy/overcast
  t('weather', 'windy', 8680),     // windy/breezy
  t('weather', 'snowy', 8627),     // snowy/snow
  t('weather', 'hot', 8493),       // hot/warm
  t('weather', 'cold', 8374),      // cold/chilly

  // Toys - Toy vocabulary
  t('toys', 'ball', 8313),         // ball/sphere
  t('toys', 'doll', 8419),         // doll/toy person
  t('toys', 'car', 8351),          // car/toy vehicle
  t('toys', 'blocks', 8329),       // blocks/building toys
  t('toys', 'puzzle', 8592),       // puzzle/jigsaw
  t('toys', 'game', 8464),         // game/play activity
  t('toys', 'teddy bear', 8645),   // teddy bear/stuffed bear
];
