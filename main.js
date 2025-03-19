document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const searchForm = document.getElementById("searchBook");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const STORAGE_KEY = "BOOKSHELF_APP";

    document.addEventListener("DOMContentLoaded", function() {
      const yearInput = document.getElementById("bookFormYear");
      const currentYear = new Date().getFullYear(); // Mendapatkan tahun sekarang
      yearInput.value = currentYear; // Mengisi input dengan tahun sekarang
  });
  
  
    function getBooks() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }
  
    function saveBooks(books) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  
    function generateBookId() {
      return new Date().getTime();
    }
  
    function createBookObject(id, title, author, year, isComplete) {
      return { id, title, author, year, isComplete };
    }
  
    function renderBooks() {
      const books = getBooks();
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    }
  
    function createBookElement(book) {
      const bookContainer = document.createElement("div");
      bookContainer.dataset.bookid = book.id;
      bookContainer.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div>
          <button onclick="toggleBook(${book.id})">${book.isComplete ? "Belum Selesai" : "Selesai"} dibaca</button>
          <button onclick="deleteBook(${book.id})">Hapus Buku</button>
          <button onclick="editBook(${book.id})">Edit Buku</button>
        </div>
      `;
      return bookContainer;
    }
  
    window.toggleBook = function(id) {
      let books = getBooks();
      books = books.map(book => {
        if (book.id === id) book.isComplete = !book.isComplete;
        return book;
      });
      saveBooks(books);
      renderBooks();
    };
  
    window.deleteBook = function(id) {
      let books = getBooks();
      books = books.filter(book => book.id !== id);
      saveBooks(books);
      renderBooks();
    };
  
    window.editBook = function(id) {
      let books = getBooks();
      const book = books.find(book => book.id === id);
      if (!book) return;
      
      const newTitle = prompt("Edit Judul Buku:", book.title);
      const newAuthor = prompt("Edit Penulis Buku:", book.author);
      const newYear = prompt("Edit Tahun Buku:", book.year);
      
      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = parseInt(newYear);
        saveBooks(books);
        renderBooks();
      }
    };
  
    bookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = parseInt(document.getElementById("bookFormYear").value);
      const isComplete = document.getElementById("bookFormIsComplete").checked;
      
      const newBook = createBookObject(generateBookId(), title, author, year, isComplete);
      let books = getBooks();
      books.push(newBook);
      saveBooks(books);
      renderBooks();
      bookForm.reset();
    });
  
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
      const books = getBooks().filter(book => book.title.toLowerCase().includes(searchTitle));
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    });
  
    renderBooks();
  });
  