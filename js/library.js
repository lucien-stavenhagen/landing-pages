const titleoff = "Click to add new book";
const titleon = "Click to hide this form";
const toggleAddNewMenu = () => {
  let show = true;
  return () => {
    const newbookform = document.querySelector("#add-book");
    const formtitle = document.querySelector("#form-title");
    if (show) {
      newbookform.style.display = "none";
      formtitle.innerHTML = titleoff;
    } else {
      newbookform.style.display = "flex";
      formtitle.innerHTML = titleon;
    }
    show = !show;
  };
};
const toggleMenu = toggleAddNewMenu();

const formtitle = document.querySelector("#form-title");
formtitle.addEventListener("click", toggleMenu);
toggleMenu();
function Book(title, author, pages, ifread) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.ifread = ifread;
  this.info = function() {
    let text = `<div class='inner-list'>
    <div>Title: ${this.title}</div>
    <div>Author: ${this.author}</div>
    <div>No. of pages: ${this.pages}</div>
    <div>Read it yet?: ${this.ifread}</div>`;
    text += `</div>`;
    return text;
  };
}
const validateForm = () => {
  document.getElementById("bad-title").innerHTML = "";
  document.getElementById("bad-author").innerHTML = "";
  document.getElementById("bad-pages").innerHTML = "";
  document.getElementById("bad-isread").innerHTML = "";
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isread = document.getElementById("isread").value;
  if (
    title.length > 0 &&
    author.length > 0 &&
    pages.length > 0 &&
    isread.length > 0
  ) {
    return true;
  }
  if (title.length === 0) {
    document.getElementById("bad-title").innerHTML = "title can't be empty";
  }
  if (author.length === 0) {
    document.getElementById("bad-author").innerHTML = "author can't be empty";
  }
  if (pages.length === 0) {
    document.getElementById("bad-pages").innerHTML = "pages can't be empty";
  }
  if (isread.length === 0) {
    document.getElementById("bad-isread").innerHTML = "isread can't be empty";
  }
  return false;
};
let myLibrary = [];

const addBookToLibrary = e => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isread = document.getElementById("isread").value;
  if (!validateForm()) {
    return;
  }
  myLibrary.push(new Book(title, author, pages, isread));
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("isread").value = "";
  displayBooks();
};

const displayBooks = () => {
  //
  // now build the tree
  // and mount it on the display
  // div
  //
  const display = document.getElementById("display");
  display.classList.add("container");
  //
  // clear out existing children
  // library persists in the list
  //
  while (display.firstChild) {
    display.removeChild(display.firstChild);
  }
  const liblist = document.createElement("div");
  liblist.classList.add("outer-list");
  for (let i = 0; i < myLibrary.length; i++) {
    let li = document.createElement("div");
    li.classList.add("card");
    li.innerHTML = myLibrary[i].info();
    let button = document.createElement("button");
    button.innerHTML = "Delete";
    button.addEventListener("click", deleteItem);
    button.setAttribute("data-id", i);
    li.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "Mark as read";
    button.addEventListener("click", markAsRead);
    button.setAttribute("data-id", i);
    li.appendChild(button);
    liblist.appendChild(li);
  }
  display.appendChild(liblist);
};

const deleteItem = e => {
  const delmeIndex = e.target.getAttribute("data-id");
  myLibrary = myLibrary.filter((value, index, arr) => {
    return index != delmeIndex;
  });
  displayBooks();
};

const markAsRead = e => {
  const editmeIndex = e.target.getAttribute("data-id");
  myLibrary = myLibrary.map((value, index, arr) => {
    if (index == editmeIndex) {
      return { ...value, ifread: "marked as read" };
    }
    return value;
  });
  displayBooks();
};
