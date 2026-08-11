import { uid } from './utils.js'

// Hver bruger (se users.js) har sit eget namespacede storage-key, så Lasse,
// Mikkel, Emil, Christian og Jacob ikke deler data i samme browser.
function storageKey(userSlug) {
  return `dating-crm.people.v3.${userSlug}`
}

// A blank person record. Spread this when creating a new entry so every
// field has a defined default and controlled inputs stay happy.
export function emptyPerson() {
  return {
    id: uid(),
    name: '',
    age: '',
    pronouns: '',
    status: 'New',
    rating: 0,
    photo: '', // profile picture (data URL or remote URL)
    photos: [], // gallery of pictures
    metOn: 'Tinder',
    metDate: '',
    location: '',
    occupation: '',
    phone: '',
    instagram: '',
    interests: [],
    hobbies: '',
    family: '',
    friends: '',
    foodLikes: '',
    foodDislikes: '',
    dietary: '',
    lastContact: '',
    nextDate: '',
    nextNote: '',
    timeline: [], // { id, date, type, title, notes }
    notes: '',
    greenFlags: '',
    redFlags: '',
    intimacy: 0, // physical-progression level, 0–5 (see INTIMACY_LEVELS)
    chemistry: 0, // physical-chemistry rating, 0–5
    firstKiss: '', // milestone date
    intimacyNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Demo profile pictures, keyed by seed id, so existing installs can be
// back-filled during migration without losing the user's own data.
const SEED_PHOTOS = {
  'seed-anna': 'https://i.pravatar.cc/400?img=47',
  'seed-sofie': 'https://i.pravatar.cc/400?img=45',
  'seed-mia': 'https://i.pravatar.cc/400?img=32',
}

// Demo intimacy data, back-filled onto existing seed records during migration.
const SEED_INTIMACY = {
  'seed-anna': { intimacy: 3, chemistry: 4, firstKiss: '2026-05-08', intimacyNotes: 'Great physical chemistry. Takes it slow but warm.' },
  'seed-sofie': { intimacy: 1, chemistry: 3 },
  'seed-mia': { intimacy: 2, chemistry: 2, firstKiss: '2026-03-18' },
  'seed-freja': { intimacy: 5, chemistry: 5, firstKiss: '2026-02-20', intimacyNotes: 'Effortless and very comfortable together.' },
  'seed-clara': { intimacy: 0, chemistry: 0 },
  'seed-ida': { intimacy: 2, chemistry: 3, firstKiss: '2026-04-28' },
  'seed-laura': { intimacy: 2, chemistry: 2, firstKiss: '2026-05-22' },
}

// The original three example people, now with photos.
function seedCore(now) {
  return [
    {
      ...emptyPerson(),
      id: 'seed-anna',
      name: 'Anna Berg',
      age: 29,
      pronouns: 'she/her',
      status: 'Dating',
      rating: 4,
      photo: SEED_PHOTOS['seed-anna'],
      photos: [
        'https://picsum.photos/seed/anna-pottery/640/480',
        'https://picsum.photos/seed/anna-lakes/640/480',
        'https://picsum.photos/seed/anna-dinner/640/480',
      ],
      metOn: 'Hinge',
      metDate: '2026-05-02',
      location: 'Nørrebro, Copenhagen',
      occupation: 'Architect',
      instagram: '@anna.builds',
      interests: ['Pottery', 'Trail running', 'Natural wine', 'Jazz'],
      hobbies: 'Throws pottery on weekends, training for a half marathon in the fall.',
      family: 'Younger brother in Aarhus. Close with her mum, lost her dad two years ago.',
      friends: 'Tight group from architecture school — Mette and Jonas come up a lot.',
      foodLikes: 'Natural wine, oysters, anything with chili.',
      foodDislikes: 'Coriander, overly sweet desserts.',
      dietary: 'Pescatarian',
      lastContact: '2026-06-15',
      nextDate: '2026-06-21',
      nextNote: 'Pottery studio open house, then dinner at Bæst.',
      timeline: [
        { id: uid(), date: '2026-05-08', type: 'Drinks', title: 'First date — Ved Stranden 10', notes: 'Great energy, talked for 3 hours. She picked the wine.' },
        { id: uid(), date: '2026-05-19', type: 'Dinner', title: 'Second date — her pick', notes: 'Cooked at her place. Met her cat, Pixel.' },
        { id: uid(), date: '2026-06-15', type: 'Date', title: 'Walk + coffee at the lakes', notes: 'Talked about going to Bornholm in July.' },
      ],
      greenFlags: 'Curious, asks good questions, very independent.',
      redFlags: 'Works a lot — can go quiet for a few days.',
      notes: 'Remember: her cat is named Pixel. Anniversary of dad in late June — be gentle.',
      createdAt: now,
      updatedAt: now,
    },
    {
      ...emptyPerson(),
      id: 'seed-sofie',
      name: 'Sofie Lund',
      age: 26,
      pronouns: 'she/her',
      status: 'Talking',
      rating: 3,
      photo: SEED_PHOTOS['seed-sofie'],
      metOn: 'Tinder',
      metDate: '2026-06-05',
      location: 'Aarhus',
      occupation: 'Nurse',
      interests: ['Bouldering', 'True crime podcasts', 'Baking'],
      hobbies: 'Climbs twice a week, bakes sourdough.',
      foodLikes: 'Spicy ramen, dark chocolate.',
      foodDislikes: 'Cilantro (again!).',
      lastContact: '2026-06-16',
      nextDate: '',
      nextNote: 'Suggested a climbing gym for the first date — waiting on a day.',
      timeline: [{ id: uid(), date: '2026-06-05', type: 'Text', title: 'Matched', notes: 'Good banter about bad first-date ideas.' }],
      notes: 'Long distance (Aarhus). See if she comes to CPH often.',
      createdAt: now,
      updatedAt: now,
    },
    {
      ...emptyPerson(),
      id: 'seed-mia',
      name: 'Mia Holm',
      age: 31,
      pronouns: 'she/her',
      status: 'Ended',
      rating: 2,
      photo: SEED_PHOTOS['seed-mia'],
      metOn: 'Bumble',
      metDate: '2026-03-11',
      location: 'Frederiksberg',
      occupation: 'Product manager',
      interests: ['Skiing', 'Startups'],
      foodLikes: 'Sushi.',
      lastContact: '2026-04-02',
      timeline: [{ id: uid(), date: '2026-03-18', type: 'Drinks', title: 'First date — Lidkoeb', notes: 'Nice but no spark.' }],
      notes: 'Friendly ending. Different life pace.',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

// Extra example people, added for new installs and appended on migration.
function seedExtras(now) {
  return [
    {
      ...emptyPerson(),
      id: 'seed-freja',
      name: 'Freja Dahl',
      age: 28,
      pronouns: 'she/her',
      status: 'Exclusive',
      rating: 5,
      photo: 'https://i.pravatar.cc/400?img=44',
      photos: ['https://picsum.photos/seed/freja-trip/640/480', 'https://picsum.photos/seed/freja-cafe/640/480'],
      metOn: 'Hinge',
      metDate: '2026-02-14',
      location: 'Vesterbro, Copenhagen',
      occupation: 'Veterinarian',
      instagram: '@frejaandfriends',
      interests: ['Climbing', 'Film photography', 'Cooking', 'Dogs'],
      hobbies: 'Analog photography, makes a mean ragù, volunteers at a dog shelter.',
      family: 'Big family on Funen, three siblings. Sunday calls with her grandmother.',
      friends: 'Knows half the city. Best friend Caro is the gatekeeper — make a good impression.',
      foodLikes: 'Pasta, red wine, weekend brunch.',
      foodDislikes: 'Licorice.',
      dietary: 'No restrictions',
      lastContact: '2026-06-17',
      nextDate: '2026-06-20',
      nextNote: 'Meeting her friends for the first time — drinks at Mikkeller.',
      timeline: [
        { id: uid(), date: '2026-02-20', type: 'Coffee', title: 'First date — Andersen & Maillard', notes: 'Instant click. Stayed until they closed.' },
        { id: uid(), date: '2026-03-15', type: 'Date', title: 'Weekend in Skåne', notes: 'Big step, went really well.' },
        { id: uid(), date: '2026-05-30', type: 'Dinner', title: 'Made the "exclusive" talk', notes: 'Both on the same page. 🎉' },
      ],
      greenFlags: 'Warm, consistent, great communicator. Texts back.',
      redFlags: 'None so far — keep paying attention.',
      notes: 'Allergic to penicillin (mentioned offhand). Her dog is called Bono.',
      createdAt: now,
      updatedAt: now,
    },
    {
      ...emptyPerson(),
      id: 'seed-clara',
      name: 'Clara Vinter',
      age: 24,
      pronouns: 'she/her',
      status: 'New',
      rating: 0,
      photo: 'https://i.pravatar.cc/400?img=49',
      metOn: 'Tinder',
      metDate: '2026-06-16',
      location: 'Østerbro, Copenhagen',
      occupation: 'Graphic design student',
      interests: ['Vinyl', 'Skateboarding', 'Thrifting'],
      foodLikes: 'Tacos, bubble tea.',
      lastContact: '2026-06-17',
      nextNote: 'Vibe is good over text — suggest a first date this week.',
      timeline: [{ id: uid(), date: '2026-06-16', type: 'Text', title: 'Matched', notes: 'Funny opener about her cat in her photos.' }],
      notes: 'Just matched. Move it off the app before it fizzles.',
      createdAt: now,
      updatedAt: now,
    },
    {
      ...emptyPerson(),
      id: 'seed-ida',
      name: 'Ida Krogh',
      age: 30,
      pronouns: 'she/her',
      status: 'Paused',
      rating: 3,
      photo: 'https://i.pravatar.cc/400?img=24',
      metOn: 'Bumble',
      metDate: '2026-04-22',
      location: 'Amager, Copenhagen',
      occupation: 'Physiotherapist',
      interests: ['Yoga', 'Sea swimming', 'Travel'],
      hobbies: 'Winter bathing year-round, did Camino last summer.',
      foodLikes: 'Thai food, oat lattes.',
      foodDislikes: 'Heavy meat dishes.',
      dietary: 'Mostly vegetarian',
      lastContact: '2026-05-28',
      nextNote: 'Slow fade — she travels a lot for work. Decide whether to revive it.',
      timeline: [
        { id: uid(), date: '2026-04-28', type: 'Coffee', title: 'First date — La Cabra', notes: 'Pleasant, a little reserved.' },
        { id: uid(), date: '2026-05-10', type: 'Drinks', title: 'Second date', notes: 'Better, more relaxed. Then she went quiet.' },
      ],
      greenFlags: 'Calm, grounded, healthy lifestyle.',
      redFlags: 'Hard to pin down — lots of "maybe next week".',
      notes: 'Ball is in my court. Either ask directly or let it go.',
      createdAt: now,
      updatedAt: now,
    },
    {
      ...emptyPerson(),
      id: 'seed-laura',
      name: 'Laura Find',
      age: 27,
      pronouns: 'she/her',
      status: 'Ghosted',
      rating: 2,
      photo: 'https://i.pravatar.cc/400?img=16',
      metOn: 'Tinder',
      metDate: '2026-05-15',
      location: 'Valby, Copenhagen',
      occupation: 'Marketing',
      interests: ['Festivals', 'Padel'],
      foodLikes: 'Burgers, natural wine.',
      lastContact: '2026-05-26',
      timeline: [{ id: uid(), date: '2026-05-22', type: 'Drinks', title: 'First date — Brus', notes: 'Fun night, then radio silence.' }],
      notes: 'Disappeared after one good date. Don’t double-text.',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function seedData() {
  const now = new Date().toISOString()
  const all = [...seedCore(now), ...seedExtras(now)]
  return all.map((p) => (SEED_INTIMACY[p.id] ? { ...p, ...SEED_INTIMACY[p.id] } : p))
}

// Ensure newer fields exist on records loaded from storage.
function normalize(person) {
  return {
    photo: '',
    photos: [],
    intimacy: 0,
    chemistry: 0,
    firstKiss: '',
    intimacyNotes: '',
    ...person,
    photos: Array.isArray(person.photos) ? person.photos : [],
  }
}

export function loadPeople(userSlug) {
  try {
    const raw = localStorage.getItem(storageKey(userSlug))
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map(normalize) : []
    }

    const seeded = seedData()
    savePeople(seeded, userSlug)
    return seeded
  } catch (err) {
    console.error('Failed to load people from storage:', err)
    return []
  }
}

export function savePeople(people, userSlug) {
  try {
    localStorage.setItem(storageKey(userSlug), JSON.stringify(people))
    return true
  } catch (err) {
    console.error('Failed to save people to storage:', err)
    const quota =
      err && (err.name === 'QuotaExceededError' || /quota|exceeded/i.test(String(err.message || err)))
    if (quota) {
      alert(
        'Could not save — your browser storage is full. Try removing some photos or older entries.',
      )
    }
    return false
  }
}
