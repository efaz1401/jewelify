// Blog posts for /blog — targets long-tail BD search queries that Daraz
// doesn't bother with. Keep slugs in sync with BLOG_SLUGS in server/src/utils/seo.js.
// Content block types: p (paragraph), h2 (heading), ul (bulleted list), quote.

export const POSTS = [
  {
    slug: 'best-earrings-for-your-face-shape',
    title: 'Best Earrings for Your Face Shape — A Bangladeshi Girl’s Guide',
    excerpt:
      'Round, oval, heart or square — the right earring can balance your features and upgrade every selfie. Here’s how to pick yours, with budget-friendly picks under ৳500.',
    date: '2026-09-15',
    readMinutes: 5,
    cover: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=80',
    content: [
      { type: 'p', text: 'Ever bought a gorgeous pair of earrings online, put them on, and felt… underwhelmed? It’s not you, and it’s not the earrings. It’s face shape. The same hoops that look incredible on your favourite influencer can fall flat on a different face. The good news: once you know your face shape, choosing earrings becomes the easiest styling decision you’ll ever make.' },
      { type: 'h2', text: 'First, find your face shape' },
      { type: 'p', text: 'Pull your hair back, stand in front of a mirror, and trace the outline of your face with your finger. Is your forehead the widest part? Your cheekbones? Is your jaw soft and rounded or sharp and angular? Most Bangladeshi women fall into one of four shapes: round, oval, heart, or square.' },
      { type: 'h2', text: 'Round face: go long' },
      { type: 'p', text: 'If your face is about as wide as it is long with soft cheeks, you want earrings that add length. Drop earrings, dangles and slim tassels visually stretch your face and look amazing in photos. Avoid large round hoops — they echo the roundness you’re trying to balance.' },
      { type: 'h2', text: 'Oval face: you won the lottery' },
      { type: 'p', text: 'Oval faces are balanced, so almost everything works — studs for class, huggies for the office, chandeliers for weddings. Your only job is matching the earring to the occasion instead of your face. If you’re building your first collection, start with a Korean stud set and one pair of pearl drops.' },
      { type: 'h2', text: 'Heart face: add width at the jaw' },
      { type: 'p', text: 'Wide forehead, narrow chin? Choose earrings that are wider at the bottom — teardrops, chandelier styles, and triangle-shaped drops. They balance your jawline beautifully. Skip tiny top-heavy studs for big events; they disappear on you.' },
      { type: 'h2', text: 'Square face: soften the angles' },
      { type: 'p', text: 'A strong jawline is striking — pair it with curves. Round hoops, circular studs and flowing dangles soften angular features. Avoid square or geometric designs that mirror your jaw.' },
      { type: 'h2', text: 'The rule that beats every other rule' },
      { type: 'p', text: 'Wear what makes you feel confident. Face-shape rules are a starting point, not a law — the best earring is the one that makes you check yourself out in shop windows. Start with one “safe” pair for your face shape and one wild-card pair you just love. Both will get worn constantly.' },
      { type: 'quote', text: 'Budget tip: a 4–6 pair Korean stud set (around ৳300–350) lets you test several styles for less than the price of one statement pair.' },
    ],
  },
  {
    slug: 'stop-earrings-tarnishing-humid-bangladesh',
    title: 'How to Stop Earrings from Tarnishing in Bangladesh’s Humid Weather',
    excerpt:
      'Your favourite gold earrings turning black after two weeks isn’t bad luck — it’s chemistry. Here’s how to make fashion jewellery survive Dhaka’s humidity, sweat and monsoon.',
    date: '2026-09-20',
    readMinutes: 4,
    cover: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80',
    content: [
      { type: 'p', text: 'You buy a beautiful pair of gold earrings. Two weeks of Dhaka weather later, they’re dull, dark, and your earlobe is slightly green. Sound familiar? Bangladesh’s humidity is brutal on fashion jewellery — but a few habits (and the right purchases) can make a ৳300 pair last a year instead of a fortnight.' },
      { type: 'h2', text: 'Why earrings tarnish faster in Bangladesh' },
      { type: 'p', text: 'Tarnish is a chemical reaction between metal, oxygen, moisture and the acids in your sweat. Our climate supercharges all three: 70–90% humidity for half the year, plus heat that makes us sweat more. Perfume, hairspray and sunscreen speed it up further.' },
      { type: 'h2', text: 'Buy smarter: the anti-tarnish checklist' },
      { type: 'ul', items: [
        'Look for “anti-tarnish” or “tarnish-resistant” in the product description — this means a protective coating over the base metal.',
        'Stainless steel and 18k gold-plated steel last dramatically longer than bare alloy.',
        'For very sensitive ears, choose nickel-free posts to avoid itching and dark marks.',
      ] },
      { type: 'h2', text: 'The 30-second after-wear habit' },
      { type: 'p', text: 'Wipe your earrings with a soft dry cloth before putting them away. That’s it. This removes sweat and oil before they can react with the metal overnight. It takes less time than unlocking your phone and doubles the life of plated jewellery.' },
      { type: 'h2', text: 'Store them like you mean it' },
      { type: 'ul', items: [
        'Never leave earrings in the bathroom — steam is tarnish fuel.',
        'Keep each pair in a small ziplock or the pouch it came in; less air contact = slower tarnish.',
        'Throw in the silica gel packet from any shoe box or parcel — free humidity absorber.',
      ] },
      { type: 'h2', text: 'Last on, first off' },
      { type: 'p', text: 'Earrings go on after makeup, perfume and setting spray — and come off before your shower, workout or sleep. Chemicals and sweat do more damage in one humid night than a month of careful wear.' },
      { type: 'quote', text: 'Rescue tip: already tarnished? A gentle rub with a soft cloth and a tiny dab of toothpaste, rinsed and dried fully, revives most plated pieces. Skip this for pearls.' },
    ],
  },
];
