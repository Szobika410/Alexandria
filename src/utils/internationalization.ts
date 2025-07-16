export interface Country {
  code: string;
  name: string;
  currency: string;
  language: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'HU', name: 'Magyarország', currency: 'Ft', language: 'hu', flag: '🇭🇺' },
  { code: 'RO', name: 'România', currency: 'Lei', language: 'ro', flag: '🇷🇴' },
  { code: 'US', name: 'United States', currency: '$', language: 'en', flag: '🇺🇸' },
];

export const translations = {
  hu: {
    home: "Főoldal",
    wishlist: "Kívánságlista",
    messages: "Üzenetek",
    profile: "Profil",
    settings: "Beállítások",
    category: "Kategória",
    language: "Nyelv",
    condition: "Állapot",
    type: "Típus",
    applyFilters: "Szűrők alkalmazása",
    clearFilters: "Szűrők törlése",
    country: "Ország",
    currency: "Valuta",
    appLanguage: "Alkalmazás nyelve",
    accountSettings: "Fiók beállítások",
    notifications: "Értesítések",
    privacy: "Adatvédelem",
    helpAndSupport: "Segítség és támogatás",
    bookDetails: "Könyv részletei",
    shortDescription: "Rövid leírás",
    noDescription: "Nincs leírás elérhető",
    sellerInfo: "Eladó információk",
    ratings: "értékelés",
    lastActive: "Utoljára aktív",
    responseTime: "Válaszidő",
    usually: "általában",
    hoursAgo: "{hours} órája",
    withinHour: "1 órán belül",
    // Navigation
    homeTab: "Főoldal",
    wishlistTab: "Kívánságok",
    messagesTab: "Üzenetek",
    profileTab: "Profil",
    // Wishlist page
    emptyWishlist: "Üres a kívánságlistád",
    emptyWishlistDesc: "Szívezd meg a könyveket a főoldalon, hogy itt megjelenjenek!",
    // Group posts
    like: "Tetszik",
    comment: "Hozzászólás",
    comments: "hozzászólás",
    writeComment: "Írd le a hozzászólásodat...",
    postComment: "Küldés",
    // Filters and categories
    filters: "Szűrők",
    sortBy: "Rendezés",
    relevance: "Relevancia",
    priceAsc: "Ár: alacsonyról magasra",
    priceDesc: "Ár: magasról alacsonyra",
    newest: "Legújabb",
    oldest: "Legrégebbi",
    mostLiked: "Legtöbb kedvelés",
    leastLiked: "Legkevesebb kedvelés",
    selectCategory: "Válassz kategóriát",
    selectLanguage: "Válassz nyelvet",
    all: "Összes",
    fiction: "Szépirodalom",
    crime: "Krimi",
    romance: "Romantikus",
    fantasy: "Fantasy",
    scifi: "Sci-fi",
    biography: "Életrajz",
    history: "Történelem",
    novel: "Regény",
    professional: "Szakkönyv",
    children: "Gyermekkönyv",
    poetry: "Költészet",
    // Languages
    hungarian: "Magyar",
    romanian: "Román",
    english: "Angol",
    german: "Német",
    french: "Francia",
    italian: "Olasz",
    spanish: "Spanyol",
    russian: "Orosz",
    // Conditions
    new: "Újszerű",
    good: "Jó állapot",
    acceptable: "Elfogadható",
    // Price range
    priceRange: "Ár intervallum",
    min: "Min",
    max: "Max"
  },
  ro: {
    home: "Acasă",
    wishlist: "Lista de dorințe",
    messages: "Mesaje",
    profile: "Profil",
    settings: "Setări",
    category: "Categorie",
    language: "Limba",
    condition: "Stare",
    type: "Tip",
    applyFilters: "Aplică filtrele",
    clearFilters: "Șterge filtrele",
    country: "Țara",
    currency: "Moneda",
    appLanguage: "Limba aplicației",
    accountSettings: "Setări cont",
    notifications: "Notificări",
    privacy: "Confidențialitate",
    helpAndSupport: "Ajutor și suport",
    bookDetails: "Detalii carte",
    shortDescription: "Descriere scurtă",
    noDescription: "Nu există descriere disponibilă",
    sellerInfo: "Informații vânzător",
    ratings: "evaluări",
    lastActive: "Ultima dată activ",
    responseTime: "Timp de răspuns",
    usually: "de obicei",
    hoursAgo: "acum {hours} ore",
    withinHour: "în termen de 1 oră",
    // Navigation
    homeTab: "Acasă",
    wishlistTab: "Lista de dorințe",
    messagesTab: "Mesaje",
    profileTab: "Profil",
    // Wishlist page
    emptyWishlist: "Lista de dorințe este goală",
    emptyWishlistDesc: "Adaugă cărți la favorite pentru a le vedea aici!",
    // Group posts
    like: "Îmi place",
    comment: "Comentariu",
    comments: "comentarii",
    writeComment: "Scrie un comentariu...",
    postComment: "Trimite",
    // Additional filters
    filters: "Filtre",
    sortBy: "Sortează după",
    relevance: "Relevanță",
    priceAsc: "Preț: de la mic la mare",
    priceDesc: "Preț: de la mare la mic",
    newest: "Cel mai nou",
    oldest: "Cel mai vechi",
    mostLiked: "Cele mai apreciate",
    leastLiked: "Cele mai puțin apreciate",
    selectCategory: "Selectează categoria",
    selectLanguage: "Selectează limba",
    all: "Toate",
    fiction: "Ficțiune",
    crime: "Crimă",
    romance: "Romantic",
    fantasy: "Fantasy",
    scifi: "Sci-fi",
    biography: "Biografie",
    history: "Istorie",
    novel: "Roman",
    professional: "Carte profesională",
    children: "Carte pentru copii",
    poetry: "Poezie",
    // Languages
    hungarian: "Maghiară",
    romanian: "Română",
    english: "Engleză",
    german: "Germană",
    french: "Franceză",
    italian: "Italiană",
    spanish: "Spaniolă",
    russian: "Rusă",
    // Conditions
    new: "Nou",
    good: "Stare bună",
    acceptable: "Acceptabil",
    // Price range
    priceRange: "Interval de preț",
    min: "Min",
    max: "Max"
  },
  en: {
    home: "Home",
    wishlist: "Wishlist",
    messages: "Messages",
    profile: "Profile",
    settings: "Settings",
    category: "Category",
    language: "Language",
    condition: "Condition",
    type: "Type",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
    country: "Country",
    currency: "Currency",
    appLanguage: "App Language",
    accountSettings: "Account Settings",
    notifications: "Notifications",
    privacy: "Privacy",
    helpAndSupport: "Help and Support",
    bookDetails: "Book Details",
    shortDescription: "Short Description",
    noDescription: "No description available",
    sellerInfo: "Seller Information",
    ratings: "ratings",
    lastActive: "Last active",
    responseTime: "Response time",
    usually: "usually",
    hoursAgo: "{hours} hours ago",
    withinHour: "within 1 hour",
    // Navigation
    homeTab: "Home",
    wishlistTab: "Wishlist",
    messagesTab: "Messages",
    profileTab: "Profile",
    // Wishlist page
    emptyWishlist: "Your wishlist is empty",
    emptyWishlistDesc: "Like books on the homepage to see them here!",
    // Group posts
    like: "Like",
    comment: "Comment",
    comments: "comments",
    writeComment: "Write a comment...",
    postComment: "Post",
    // Additional filters
    filters: "Filters",
    sortBy: "Sort by",
    relevance: "Relevance",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    newest: "Newest",
    oldest: "Oldest",
    mostLiked: "Most liked",
    leastLiked: "Least liked",
    selectCategory: "Select category",
    selectLanguage: "Select language",
    all: "All",
    fiction: "Fiction",
    crime: "Crime",
    romance: "Romance",
    fantasy: "Fantasy",
    scifi: "Sci-fi",
    biography: "Biography",
    history: "History",
    novel: "Novel",
    professional: "Professional book",
    children: "Children's book",
    poetry: "Poetry",
    // Languages
    hungarian: "Hungarian",
    romanian: "Romanian",
    english: "English",
    german: "German",
    french: "French",
    italian: "Italian",
    spanish: "Spanish",
    russian: "Russian",
    // Conditions
    new: "New",
    good: "Good condition",
    acceptable: "Acceptable",
    // Price range
    priceRange: "Price range",
    min: "Min",
    max: "Max"
  }
};

export const getTranslation = (key: string, language: string = 'hu') => {
  return translations[language as keyof typeof translations]?.[key as keyof typeof translations.hu] || key;
};

export const getCurrentCountry = (): Country => {
  const saved = localStorage.getItem('selectedCountry');
  if (saved) {
    return JSON.parse(saved);
  }
  return countries[0]; // Default to Hungary
};

export const setCurrentCountry = (country: Country) => {
  localStorage.setItem('selectedCountry', JSON.stringify(country));
};

export const formatPrice = (price: number, currency: string = 'Ft') => {
  if (currency === 'Lei') {
    return `${Math.round(price * 0.2)} Lei`; // Example conversion
  } else if (currency === '$') {
    return `$${Math.round(price * 0.003)}`;
  }
  return `${price} ${currency}`;
};