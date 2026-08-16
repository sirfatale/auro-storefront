const ICONS = {
  laptops: '\u{1F4BB}',
  laptop: '\u{1F4BB}',
  computers: '\u{1F5A5}\u{FE0F}',
  components: '\u{1F529}',
  peripherals: '\u{1F5B1}\u{FE0F}',
  'smart home': '\u{1F3E0}',
  audio: '\u{1F3A7}',
  accessories: '\u{1F50C}',
  monitors: '\u{1F5A5}\u{FE0F}',
  networking: '\u{1F4E1}',
  storage: '\u{1F4BE}',
  gaming: '\u{1F3AE}',
  technology: '\u{1F4BB}',
  tools: '\u{1F6E0}\u{FE0F}',
  electronics: '\u{1F50B}',
}

export function categoryIcon(category) {
  return ICONS[category?.toLowerCase()] || '\u{1F4E6}'
}
