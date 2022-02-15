class Book {
  constructor(title, author, genre, status) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.status = status;
  }
}

class UI {
  constructor() {
    this.bookshelf = [];
  }

  addBook(book) {
    this.bookshelf.push(book);
  }

  isInLibrary(title) {
    return this.bookshelf.some((book) => book.title == title);
  }
}

let myLibrary = new UI();

const addBtn = document.querySelector(".add");
const closeBtn = document.querySelector("#close-btn");
const submitBtn = document.getElementById("submit");
const form = document.getElementById("form");
const mainContent = document.querySelector(".main-content");
const welcomeMessage = document.querySelector(".welcome");
const errorMessage = document.querySelector(".error-msg");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const readStatus = document.getElementById("readStatus");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const booksGrid = document.querySelector(".books-grid");

addBtn.addEventListener("click", (e) => {
  form.reset();
  overlay.classList.add("active");
  modal.classList.add("active");
});

closeBtn.addEventListener("click", (e) => {
  overlay.classList.remove("active");
  modal.classList.remove("active");
  errorMessage.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target == overlay) {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    errorMessage.classList.remove("active");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

const createBookCard = (book) => {
  bookCard = document.createElement("div");
  bookCard.classList.add("book-card");

  removeBtnIcon = document.createElement("i");
  bookTitle = document.createElement("div");
  bookAuthor = document.createElement("div");
  bookGenre = document.createElement("div");
  bookStatus = document.createElement("button");
  bookTitle.textContent = `"${book.title}"`;
  bookAuthor.textContent = book.author;
  bookGenre.textContent = book.genre;

  if (book.status) {
    bookStatus.textContent = "Read";
    bookStatus.classList.add("read");
  } else bookStatus.textContent = "Unread";

  bookStatus.classList.add("status");
  bookStatus.addEventListener("click", handleToggleReadStatus);

  removeBtnIcon.classList.add("del", "fa-solid", "fa-trash-can");
  removeBtnIcon.addEventListener("click", handleRemove);

  bookCard.appendChild(removeBtnIcon);
  bookCard.appendChild(bookTitle);
  bookCard.appendChild(bookAuthor);
  bookCard.appendChild(bookGenre);
  bookCard.appendChild(bookStatus);
  booksGrid.appendChild(bookCard);
};

const displayBooks = (bookshelf) => {
  booksGrid.textContent = "";
  bookshelf.forEach((book) => {
    createBookCard(book);
  });
  setDataIndex(bookshelf);
};

const handleSubmit = () => {
  const newBook = new Book(
    titleInput.value,
    authorInput.value,
    genreInput.value,
    readStatus.checked
  );
  if (!myLibrary.isInLibrary(newBook.title)) {
    myLibrary.addBook(newBook);
    errorMessage.classList.remove("active");
  } else {
    errorMessage.classList.add("active");
    return;
  }
  displayBooks(myLibrary.bookshelf);
  saveInLocalStorage();
  overlay.classList.remove("active");
  modal.classList.remove("active");
  if (!!document.querySelector(".welcome")) {
    mainContent.removeChild(welcomeMessage);
  }
};

const handleToggleReadStatus = (e) => {
  e.target.classList.toggle("read");
  e.target.textContent == "Read"
    ? (e.target.textContent = "Unread")
    : (e.target.textContent = "Read");
  setDataIndex(myLibrary.bookshelf);
  let bookElement = e.target.parentNode;
  let bookIndex = bookElement.dataset.index;
  let book = myLibrary.bookshelf[bookIndex];
  book.status == false ? (book.status = true) : (book.status = false);
  saveInLocalStorage();
};

const handleRemove = (e) => {
  let element = e.target.parentNode;
  myLibrary.bookshelf.splice(element.dataset.index, 1);
  if (myLibrary.bookshelf.length) {
    displayBooks(myLibrary.bookshelf);
    saveInLocalStorage();
  } else {
    booksGrid.textContent = "";
    mainContent.appendChild(welcomeMessage);
    localStorage.clear();
  }
};

const saveInLocalStorage = () => {
  localStorage.setItem("bookshelf", JSON.stringify(myLibrary.bookshelf));
};
const setDataIndex = (bookshelf) => {
  for (let i = 0; i < bookshelf.length; i++) {
    let el = booksGrid.children[i];
    el.dataset.index = i;
  }
};

const populateBooksGrid = () => {
  const localBookshelf = JSON.parse(localStorage.getItem("bookshelf"));
  if (localBookshelf) {
    mainContent.removeChild(welcomeMessage);
    localBookshelf.forEach((book) => {
      myLibrary.addBook(book);
      createBookCard(book);
    });
  } else {
    myLibrary.bookshelf = [];
  }
};

// keyboard support
const handleKeyboard = (e) => {
  if (e.key === "Escape") {
    overlay.classList.remove("active");
    modal.classList.remove("active");
  }
};

window.onkeydown = handleKeyboard;
window.addEventListener("DOMContentLoaded", populateBooksGrid);
