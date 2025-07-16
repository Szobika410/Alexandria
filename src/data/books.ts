export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  condition: string;
  language: string;
  location: string;
  type?: string;
  likeCount?: number;
}

const authors = [
  "Gabriel García Márquez", "Dan Brown", "Jane Austen", "Frank Herbert", "J.R.R. Tolkien", 
  "Walter Isaacson", "Agatha Christie", "Stephen King", "George Orwell", "Harper Lee",
  "F. Scott Fitzgerald", "Ernest Hemingway", "Toni Morrison", "Maya Angelou", "Mark Twain",
  "Charles Dickens", "Virginia Woolf", "Oscar Wilde", "Leo Tolstoy", "Fyodor Dostoevsky",
  "Emily Dickinson", "Edgar Allan Poe", "William Shakespeare", "Homer", "Sophocles",
  "Plato", "Aristotle", "Dante Alighieri", "Miguel de Cervantes", "Johann Wolfgang von Goethe",
  "Victor Hugo", "Alexandre Dumas", "Jules Verne", "H.G. Wells", "Arthur Conan Doyle",
  "Bram Stoker", "Mary Shelley", "Lewis Carroll", "L. Frank Baum", "Roald Dahl",
  "C.S. Lewis", "J.K. Rowling", "Suzanne Collins", "Rick Riordan", "Cassandra Clare",
  "Sarah J. Maas", "Brandon Sanderson", "Patrick Rothfuss", "George R.R. Martin", "Robin Hobb"
];

const titles = [
  "Száz év magány", "A Da Vinci-kód", "Pride and Prejudice", "Dűne", "A Gyűrűk Ura",
  "Steve Jobs", "Hercule Poirot kalandjai", "A Ragyogás", "1984", "Ne bántsátok a feketerigót",
  "A nagy Gatsby", "A búcsú a fegyverektől", "Beloved", "Tudom, miért énekel a kalitba zárt madár", "Tom Sawyer kalandjai",
  "Károly dickens", "Mrs. Dalloway", "Dorian Gray arcképe", "Háború és béke", "Bűn és bűnhődés",
  "Emily versek", "A holló", "Hamlet", "Iliász", "Oidipusz király",
  "A köztársaság", "Nikomakhoszi etika", "Isteni színjáték", "Don Quijote", "Faust",
  "A nyomorultak", "A három testőr", "Nemo kapitány", "Az időgép", "Sherlock Holmes kalandjai",
  "Drakula", "Frankenstein", "Alice Csodaországban", "Óz, a csodák csodája", "Charlie és a csokigyár",
  "Narnia krónikái", "Harry Potter", "Az éhezők viadala", "Percy Jackson", "Árnyékvadász krónikák",
  "Tövisek és rózsák udvara", "A vihar fényei", "A név neve szél", "Tűz és jég dala", "Az őrült hajós"
];

const categories = ["fiction", "crime", "romance", "fantasy", "scifi", "biography", "history"];
const conditions = ["Új", "Kiváló", "Jó", "Elfogadható"];
const languages = ["Magyar", "Angol", "Német", "Francia"];
const locations = ["Budapest", "Debrecen", "Szeged", "Pécs", "Győr", "Miskolc", "Kecskemét", "Nyíregyháza", "Szombathely", "Sopron"];

const images = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop"
];

export const generateBooks = (count: number = 1000): Book[] => {
  const books: Book[] = [];
  
  for (let i = 1; i <= count; i++) {
    books.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)] + (i > 50 ? ` ${Math.floor(i/50)}` : ''),
      author: authors[Math.floor(Math.random() * authors.length)],
      price: Math.floor(Math.random() * 4000) + 1000,
      image: images[Math.floor(Math.random() * images.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      likeCount: Math.floor(Math.random() * 50)
    });
  }
  
  return books;
};

export const allBooks = generateBooks(1000);