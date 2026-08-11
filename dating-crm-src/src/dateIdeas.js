// Date Designer engine.
//
// A curated library of date "blueprints", each tagged with the interests it
// suits, a vibe, effort/cost, and the relationship stages it fits. Given a
// person we score every blueprint against their interests, food preferences,
// relationship stage, the season, and what you've already done together — then
// pick three distinct ideas: one that fits her perfectly, one that's novel, and
// one that's an easy win. Entirely client-side and explainable.

const BLUEPRINTS = [
  { id: 'pottery', title: 'Pottery class for two', tags: ['pottery', 'ceramic', 'clay', 'art', 'craft', 'creative', 'hands', 'design'], vibe: 'creative', effort: 2, cost: 2, outdoor: false, desc: 'Book a two-person pottery session and each make something you take home.', repeatKeys: ['pottery', 'ceramic'] },
  { id: 'natural-wine', title: 'Natural-wine bar hop', tags: ['wine', 'natural wine', 'sommelier', 'drinks', 'foodie'], vibe: 'foodie', effort: 1, cost: 2, outdoor: false, desc: 'Hop between two or three natural-wine bars and let her lead the picks.', repeatKeys: ['wine bar', 'natural wine'] },
  { id: 'trail-run', title: 'Morning trail run + big brunch', tags: ['running', 'trail running', 'marathon', 'fitness', 'nature'], vibe: 'active', effort: 1, cost: 1, outdoor: true, seasons: ['spring', 'summer', 'autumn'], desc: 'An easy scenic run, then a proper brunch as the reward.', repeatKeys: ['run', 'brunch'] },
  { id: 'climbing', title: 'Bouldering session', tags: ['climbing', 'bouldering', 'boulder', 'fitness'], vibe: 'active', effort: 1, cost: 2, outdoor: false, closeness: true, desc: 'Hit a climbing gym — built-in teamwork and lots of laughing at each other.', repeatKeys: ['climb', 'boulder'] },
  { id: 'cook-home', title: 'Cook a new recipe together', tags: ['cooking', 'cook', 'food', 'foodie', 'baking'], vibe: 'foodie', effort: 2, cost: 1, outdoor: false, private: true, stages: ['Dating', 'Exclusive'], desc: 'Pick a recipe neither of you has made, shop for it, and cook side by side.', repeatKeys: ['cook', 'cooked', 'her place', 'my place'] },
  { id: 'jazz', title: 'Live jazz night', tags: ['jazz', 'music', 'concert', 'gig', 'band', 'live music'], vibe: 'cultured', effort: 1, cost: 2, outdoor: false, desc: 'Find a small jazz club and grab a drink between sets.', repeatKeys: ['jazz', 'concert', 'gig', 'live music'] },
  { id: 'photo-walk', title: 'Film-photography walk', tags: ['photography', 'film photography', 'photo', 'camera', 'art'], vibe: 'creative', effort: 1, cost: 1, outdoor: true, desc: 'Grab cameras, wander a new neighbourhood shooting a roll each, compare later.', repeatKeys: ['photo'] },
  { id: 'sea-sauna', title: 'Cold dip + sauna', tags: ['swimming', 'sea swimming', 'winter bathing', 'sauna', 'swim', 'wellness'], vibe: 'adventurous', effort: 1, cost: 1, outdoor: true, novel: true, closeness: true, desc: 'A bracing cold dip followed by a hot sauna — intimate and memorable.', repeatKeys: ['swim', 'sauna', 'bath', 'dip'] },
  { id: 'bookshop', title: 'Bookshop date + coffee', tags: ['books', 'reading', 'book'], vibe: 'chill', effort: 1, cost: 1, outdoor: false, desc: 'Browse a bookshop, each pick a book for the other, then read over coffee.', repeatKeys: ['bookshop', 'book'] },
  { id: 'boardgames', title: 'Board-game café', tags: ['board games', 'games', 'gaming', 'boardgame'], vibe: 'playful', effort: 1, cost: 1, outdoor: false, desc: 'A board-game café — competitive enough to spark banter.', repeatKeys: ['board game', 'games café'] },
  { id: 'dog-park', title: 'Dog walk + ice cream', tags: ['dogs', 'dog', 'animals', 'nature'], vibe: 'chill', effort: 1, cost: 1, outdoor: true, desc: 'Bring (or borrow) a dog and walk a park, with a treat stop on the way.', repeatKeys: ['dog', 'park walk'] },
  { id: 'yoga', title: 'Yoga class + smoothies', tags: ['yoga', 'wellness', 'pilates'], vibe: 'chill', effort: 1, cost: 1, outdoor: false, desc: 'A beginner-friendly class, then smoothies and a slow walk.', repeatKeys: ['yoga'] },
  { id: 'cocktail-class', title: 'Cocktail-making class', tags: ['cocktails', 'drinks', 'mixology'], vibe: 'playful', effort: 2, cost: 2, outdoor: false, novel: true, desc: 'Learn to make two classic cocktails together — you keep the recipes.', repeatKeys: ['cocktail class'] },
  { id: 'gallery', title: 'Gallery + a glass of wine', tags: ['art', 'museum', 'gallery', 'design', 'architecture', 'history', 'culture'], vibe: 'cultured', effort: 1, cost: 1, outdoor: false, desc: 'A current exhibition, then a glass of wine to debrief what you each loved.', repeatKeys: ['museum', 'gallery', 'exhibition'] },
  { id: 'picnic', title: 'Sunset picnic', tags: ['picnic', 'nature', 'outdoors', 'wine'], vibe: 'romantic', effort: 2, cost: 1, outdoor: true, seasons: ['spring', 'summer'], desc: 'Pack a proper picnic and claim a good sunset spot.', repeatKeys: ['picnic'] },
  { id: 'bike', title: 'Bike ride to somewhere new', tags: ['cycling', 'biking', 'bike', 'nature'], vibe: 'active', effort: 1, cost: 1, outdoor: true, seasons: ['spring', 'summer', 'autumn'], desc: 'Cycle somewhere neither of you has been and find lunch there.', repeatKeys: ['bike', 'cycle'] },
  { id: 'padel', title: 'Padel match', tags: ['padel', 'tennis', 'sport'], vibe: 'active', effort: 1, cost: 2, outdoor: false, desc: 'Book a padel court — fast, social, a good excuse to be competitive.', repeatKeys: ['padel', 'tennis'] },
  { id: 'ski', title: 'A day on the slopes', tags: ['skiing', 'ski', 'snowboard', 'snow'], vibe: 'adventurous', effort: 3, cost: 3, outdoor: true, seasons: ['winter'], stages: ['Dating', 'Exclusive'], desc: 'A full day skiing (or a dry slope) — a big-energy day date.', repeatKeys: ['ski'] },
  { id: 'thrift', title: 'Thrift-shop style swap', tags: ['thrifting', 'fashion', 'vintage', 'design'], vibe: 'playful', effort: 1, cost: 1, outdoor: false, novel: true, desc: 'Thrift with a small budget and pick a whole outfit for each other.', repeatKeys: ['thrift'] },
  { id: 'comedy', title: 'Comedy or improv night', tags: ['comedy', 'improv', 'theatre', 'shows'], vibe: 'playful', effort: 1, cost: 2, outdoor: false, desc: 'A stand-up or improv night — low effort, high laughs.', repeatKeys: ['comedy', 'improv'] },
  { id: 'market-cook', title: 'Farmers market, then cook', tags: ['food', 'foodie', 'cooking', 'market'], vibe: 'foodie', effort: 2, cost: 1, outdoor: true, stages: ['Dating', 'Exclusive'], desc: 'Shop a farmers market with no plan, then cook whatever looked good.', repeatKeys: ['market'] },
  { id: 'trip', title: 'A small weekend away', tags: ['travel', 'trip', 'adventure'], vibe: 'adventurous', effort: 3, cost: 3, outdoor: false, novel: true, stages: ['Dating', 'Exclusive'], desc: 'An overnight or day trip somewhere new — a real change of scene.', repeatKeys: ['trip', 'weekend away', 'skåne', 'bornholm'] },
  { id: 'vinyl', title: 'Record digging + vinyl café', tags: ['vinyl', 'music', 'records'], vibe: 'cultured', effort: 1, cost: 1, outdoor: false, desc: 'Dig through record crates, then a café that plays good vinyl.', repeatKeys: ['vinyl', 'record'] },
  { id: 'walk-coffee', title: 'Great coffee + a long walk', tags: ['coffee', 'walk', 'nature'], vibe: 'chill', effort: 1, cost: 1, outdoor: true, desc: 'A good coffee and a long, wandering walk — the reliable connector.', repeatKeys: ['walk', 'coffee at', 'lakes'] },
  { id: 'good-bar', title: 'Drinks at one great bar', tags: ['drinks', 'cocktails', 'wine'], vibe: 'chill', effort: 1, cost: 2, outdoor: false, desc: 'One genuinely good bar, no agenda but the conversation.', repeatKeys: ['drinks', 'bar'] },
  { id: 'dinner', title: 'Dinner at a place she’ll love', tags: ['food', 'foodie', 'dinner', 'sushi', 'ramen', 'pasta', 'tacos'], vibe: 'romantic', effort: 2, cost: 2, outdoor: false, desc: 'A proper dinner at a spot matched to her taste.', repeatKeys: ['dinner'] },
  { id: 'baking', title: 'Ambitious baking afternoon', tags: ['baking', 'bake', 'sourdough', 'cake', 'cooking'], vibe: 'foodie', effort: 2, cost: 1, outdoor: false, stages: ['Dating', 'Exclusive'], desc: 'Bake something ambitious together and eat it warm.', repeatKeys: ['bake', 'baking'] },
  { id: 'festival', title: 'Open-air gig or festival', tags: ['festivals', 'festival', 'music', 'concert'], vibe: 'adventurous', effort: 2, cost: 2, outdoor: true, seasons: ['summer'], desc: 'Catch a festival or open-air gig and make a day of it.', repeatKeys: ['festival'] },
  { id: 'stargazing', title: 'Stargazing drive', tags: ['nature', 'astronomy', 'stars', 'photography'], vibe: 'romantic', effort: 2, cost: 1, outdoor: true, novel: true, desc: 'Drive out past the city lights with blankets and something warm to drink.', repeatKeys: ['stargaz', 'stars'] },
  { id: 'escape-room', title: 'Escape room', tags: ['games', 'puzzle', 'escape'], vibe: 'playful', effort: 1, cost: 2, outdoor: false, novel: true, desc: 'An escape room — instant teamwork test, always sparks a story.', repeatKeys: ['escape room'] },
  { id: 'dancing', title: 'Dancing or a salsa class', tags: ['dancing', 'music', 'salsa'], vibe: 'playful', effort: 1, cost: 2, outdoor: false, novel: true, closeness: true, desc: 'A beginner dance class — built-in closeness and a lot of laughing.', repeatKeys: ['dancing', 'salsa'] },
  { id: 'night-in', title: 'Cozy night in', tags: ['cooking', 'film', 'wine', 'cinema', 'movies'], vibe: 'romantic', effort: 1, cost: 1, outdoor: false, private: true, intimacyMin: 3, stages: ['Dating', 'Exclusive'], desc: 'Cook something easy, open a bottle, and put on a film with nowhere to be.', repeatKeys: ['night in', 'movie night', 'film at'] },
  { id: 'lazy-morning', title: 'Slow morning in', tags: ['coffee', 'breakfast', 'brunch'], vibe: 'romantic', effort: 1, cost: 1, outdoor: false, private: true, intimacyMin: 4, desc: 'Breakfast in, good coffee, no alarm — lean into the comfort.', repeatKeys: ['morning in', 'breakfast in'] },
  { id: 'spa-day', title: 'Spa or hot-springs afternoon', tags: ['wellness', 'spa', 'sauna', 'swim', 'relax'], vibe: 'romantic', effort: 2, cost: 3, outdoor: false, intimacyMin: 3, novel: true, desc: 'A spa or hot-springs afternoon — warm, relaxed, and close.', repeatKeys: ['spa', 'hot spring'] },
]

const ACTIVE_EARLY = ['New', 'Talking']

function seasonForMonth(m) {
  if (m >= 2 && m <= 4) return 'spring'
  if (m >= 5 && m <= 7) return 'summer'
  if (m >= 8 && m <= 10) return 'autumn'
  return 'winter'
}

function clean(s) {
  return (s || '').trim().replace(/[.;,\s]+$/, '')
}
function lc(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

// A short, human note about food, respecting likes / diet / dislikes.
function foodNote(person) {
  const likes = clean(person.foodLikes)
  const diet = clean(person.dietary)
  const dislikes = clean(person.foodDislikes)
  const parts = []
  if (likes) parts.push(`she loves ${lc(likes)}`)
  if (diet && !/^(no restrictions?|none|n\/a|-)$/i.test(diet)) parts.push(`keep it ${lc(diet)}-friendly`)
  if (dislikes) parts.push(`skip ${lc(dislikes)}`)
  if (!parts.length) return null
  return cap(parts.join(' · '))
}

function personKeywords(person) {
  return [...(person.interests || []), person.hobbies || '', person.foodLikes || '']
    .join(' ')
    .toLowerCase()
}

const VIBE_LABEL = {
  creative: 'Creative',
  active: 'Active',
  foodie: 'Foodie',
  cultured: 'Cultured',
  chill: 'Low-key',
  adventurous: 'Adventurous',
  romantic: 'Romantic',
  playful: 'Playful',
}

const NOVEL_VIBES = ['adventurous', 'playful', 'creative', 'romantic']

function stageLine(status) {
  if (ACTIVE_EARLY.includes(status)) return 'Low-key and public — right while things are still new.'
  if (status === 'Dating') return 'A natural step up that keeps the momentum going.'
  if (status === 'Exclusive') return 'Something a little special for where you two are now.'
  if (status === 'Paused') return 'A light, no-pressure way to test if the spark is still there.'
  return 'If you’re thinking of rekindling things, keep it easy.'
}

function buildWhy(item, person, ctx, intent) {
  const { b, hits } = item
  const why = []
  if (hits.length) {
    why.push(`Built around her love of ${hits.slice(0, 2).join(' & ')}.`)
  }
  // Intimacy-aware pacing.
  if ((b.private || b.intimacyMin) && ctx.intimacy >= 3) {
    why.push('You’re past the early stage physically — somewhere private works now.')
  } else if (b.closeness && ctx.intimacy <= 1) {
    why.push('A natural, low-pressure way to get a little closer.')
  }
  // Each intent gets its own distinct rationale so the three cards don't echo.
  if (intent === 'novel') {
    why.push(
      ctx.pastCount > 0
        ? 'Different from anything you’ve done together so far.'
        : 'A memorable first date that stands out from the usual coffee.',
    )
  } else if (intent === 'easy') {
    why.push('Minimal planning and hard to get wrong.')
  } else {
    why.push(stageLine(person.status))
  }
  if (b.outdoor && (ctx.season === 'spring' || ctx.season === 'summer')) {
    why.push('Makes the most of the season.')
  }
  // Always give at least two reasons.
  if (why.length < 2) why.push(stageLine(person.status))
  return why.slice(0, 3)
}

function toIdea(item, intent, person, ctx) {
  const { b, hits } = item
  return {
    id: b.id,
    title: b.title,
    vibe: b.vibe,
    vibeLabel: VIBE_LABEL[b.vibe] || b.vibe,
    intent, // 'fit' | 'novel' | 'easy'
    blurb: b.desc,
    effort: b.effort,
    cost: b.cost,
    outdoor: b.outdoor,
    matched: hits,
    why: buildWhy(item, person, ctx, intent),
    food: foodNote(person),
  }
}

// Score and rank all blueprints for a person.
function rank(person, ctx) {
  const kw = personKeywords(person)
  const intimacy = ctx.intimacy
  return BLUEPRINTS.map((b) => {
    let hits = b.tags.filter((t) => kw.includes(t))
    // Drop near-duplicate matches (keep "natural wine" over "wine", "dogs" over "dog").
    hits = hits.filter((h, i, arr) => !arr.some((o) => o !== h && o.includes(h)))
    let score = hits.length * 10
    if (b.stages && !b.stages.includes(person.status)) {
      // Physical closeness can unlock private dates a little earlier.
      score -= b.private && intimacy >= 4 ? 2 : 7
    }
    // Gate intimate dates until things have physically progressed.
    if (b.intimacyMin) score += intimacy >= b.intimacyMin ? 2 : -6
    if (b.seasons) score += b.seasons.includes(ctx.season) ? 3 : -1
    if (b.outdoor && ctx.season === 'winter') score -= 3
    const repeated = (b.repeatKeys || []).some((k) => ctx.history.includes(k))
    if (repeated) score -= 2
    return { b, hits, score, repeated }
  }).sort((a, b) => b.score - a.score || a.b.effort - b.b.effort)
}

// Produce three distinct date ideas. `seed` rotates the picks so the user can
// regenerate for fresh suggestions.
export function designDates(person, seed = 0) {
  const now = new Date()
  const ctx = {
    season: seasonForMonth(now.getMonth()),
    history: (person.timeline || []).map((t) => `${t.type} ${t.title}`.toLowerCase()).join(' | '),
    pastCount: (person.timeline || []).length,
    intimacy: person.intimacy || 0,
  }

  const ranked = rank(person, ctx)
  const chosen = new Set()
  const pickFrom = (list, offset = 0) => {
    const avail = list.filter((x) => !chosen.has(x.b.id))
    if (!avail.length) return null
    const item = avail[offset % avail.length]
    chosen.add(item.b.id)
    return item
  }

  // 1) Right up her alley — best interest match (fall back to top overall).
  const withHits = ranked.filter((x) => x.hits.length > 0)
  const fit = pickFrom(withHits.length ? withHits : ranked, seed)

  // 2) Something new — novel-flagged or adventurous, not already done.
  const novelPool = ranked.filter(
    (x) => (x.b.novel || NOVEL_VIBES.includes(x.b.vibe)) && !x.repeated,
  )
  const novel = pickFrom(novelPool.length ? novelPool : ranked, seed)

  // 3) Easy win — low effort and stage-appropriate.
  const easyPool = ranked.filter((x) => x.b.effort <= 1 && x.score >= -2)
  const easy = pickFrom(easyPool.length ? easyPool : ranked, seed)

  const ideas = [
    fit && toIdea(fit, 'fit', person, ctx),
    novel && toIdea(novel, 'novel', person, ctx),
    easy && toIdea(easy, 'easy', person, ctx),
  ].filter(Boolean)

  return { ideas, context: ctx }
}

export const INTENT_META = {
  fit: { label: 'Right up her alley', color: '#db2777', bg: '#fdf2f8' },
  novel: { label: 'Something new', color: '#7c3aed', bg: '#f5f3ff' },
  easy: { label: 'Easy win', color: '#0891b2', bg: '#ecfeff' },
}

export const EFFORT_LABEL = { 1: 'Easy to plan', 2: 'Some planning', 3: 'Big day out' }
