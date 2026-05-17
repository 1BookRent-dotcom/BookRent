// =========================
// HELPER
// =========================

function $(id){
  return document.getElementById(id);
}

// =========================
// LOADER
// =========================

window.addEventListener("load", () => {

  setTimeout(() => {

    $("loader")
    .classList.add("hidden");

  }, 1200);

});

// =========================
// STORAGE
// =========================

let books =
JSON.parse(
  localStorage.getItem("books")
) || [];

let reviews =
JSON.parse(
  localStorage.getItem("reviews")
) || [];

let history =
JSON.parse(
  localStorage.getItem("rent_history")
) || [];

let users =
JSON.parse(
  localStorage.getItem("bookrent_users")
) || [];

let currentUser =
JSON.parse(
  localStorage.getItem(
    "bookrent_current_user"
  )
);

// =========================
// SAVE
// =========================

function saveBooks(){

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

}

function saveReviews(){

  localStorage.setItem(
    "reviews",
    JSON.stringify(reviews)
  );

}

function saveHistory(){

  localStorage.setItem(
    "rent_history",
    JSON.stringify(history)
  );

}

function saveUsers(){

  localStorage.setItem(
    "bookrent_users",
    JSON.stringify(users)
  );

}

function saveCurrentUser(){

  localStorage.setItem(
    "bookrent_current_user",
    JSON.stringify(currentUser)
  );

}

// =========================
// PROFILE UI
// =========================

function updateProfileUI(){

  const guestButtons =
  $("guestButtons");

  const userProfile =
  $("userProfile");

  if(currentUser){

    guestButtons
    .classList.add("hidden");

    userProfile
    .classList.remove("hidden");

    $("profileName").textContent =
    currentUser.username;

    $("profileRole").textContent =
    currentUser.role;

    $("profileImage").src =
    currentUser.image;

  }else{

    guestButtons
    .classList.remove("hidden");

    userProfile
    .classList.add("hidden");

  }

}

// =========================
// OPEN MODAL
// =========================

$("openLoginBtn")
.addEventListener("click", () => {

  $("loginModal")
  .classList.remove("hidden");

});

$("openRegisterBtn")
.addEventListener("click", () => {

  $("registerModal")
  .classList.remove("hidden");

});

// =========================
// CLOSE MODAL
// =========================

$("closeLogin")
.addEventListener("click", () => {

  $("loginModal")
  .classList.add("hidden");

});

$("closeRegister")
.addEventListener("click", () => {

  $("registerModal")
  .classList.add("hidden");

});

$("closeRent")
.addEventListener("click", () => {

  $("rentModal")
  .classList.add("hidden");

});

$("closePayment")
.addEventListener("click", () => {

  $("paymentModal")
  .classList.add("hidden");

});

// =========================
// REGISTER
// =========================

$("registerBtn")
.addEventListener("click", () => {

  const username =
  $("registerUsername")
  .value.trim();

  const phone =
  $("registerPhone")
  .value.trim();

  const password =
  $("registerPassword")
  .value;

  const confirm =
  $("registerConfirmPassword")
  .value;

  if(
    !username ||
    !phone ||
    !password ||
    !confirm
  ){

    alert("กรอกข้อมูลให้ครบ");

    return;

  }

  if(password !== confirm){

    alert("รหัสผ่านไม่ตรงกัน");

    return;

  }

  const duplicate =
  users.find(user =>
    user.username === username
  );

  if(duplicate){

    alert("ชื่อผู้ใช้นี้ถูกใช้แล้ว");

    return;

  }

  const user = {

    id:Date.now(),

    username,
    phone,
    password,

    role:"ผู้ใช้งาน",

    image:
    `https://i.pravatar.cc/150?u=${username}`

  };

  users.push(user);

  saveUsers();

  currentUser = user;

  saveCurrentUser();

  updateProfileUI();

  $("registerModal")
  .classList.add("hidden");

  alert("สมัครสมาชิกสำเร็จ");

});

// =========================
// LOGIN
// =========================

$("loginBtn")
.addEventListener("click", () => {

  const username =
  $("loginUsername")
  .value.trim();

  const password =
  $("loginPassword")
  .value.trim();

  // =====================
  // ADMIN
  // =====================

  if(
    username === "admin" &&
    password === "0007"
  ){

    currentUser = {

      username:"Admin",

      role:"แอดมิน",

      image:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

    };

    saveCurrentUser();

    updateProfileUI();

    $("loginModal")
    .classList.add("hidden");

    // ซ่อน user interface

    $("userInterface")
    .classList.add("hidden");

    // เปิด admin

    $("adminDashboard")
    .classList.remove("hidden");

    renderAdminBooks();

    alert("เข้าสู่ระบบแอดมินสำเร็จ");

    return;

  }

  // =====================
  // USER LOGIN
  // =====================

  const user =
  users.find(user => {

    return (
      user.username === username &&
      user.password === password
    );

  });

  if(!user){

    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");

    return;

  }

  currentUser = user;

  saveCurrentUser();

  updateProfileUI();

  $("loginModal")
  .classList.add("hidden");

  alert("เข้าสู่ระบบสำเร็จ");

});

// =========================
// LOGOUT
// =========================

$("logoutBtn")
.addEventListener("click", () => {

  currentUser = null;

  localStorage.removeItem(
    "bookrent_current_user"
  );

  updateProfileUI();

  $("adminDashboard")
  .classList.add("hidden");

  $("userInterface")
  .classList.remove("hidden");

  alert("ออกจากระบบสำเร็จ");

});

// =========================
// IMAGE PREVIEW
// =========================

$("bookImage")
.addEventListener("change", function(){

  const file =
  this.files[0];

  if(file){

    const reader =
    new FileReader();

    reader.onload = function(e){

      $("previewImage").src =
      e.target.result;

      $("previewImage")
      .classList.remove("hidden");

    };

    reader.readAsDataURL(file);

  }

});

// =========================
// SUBMIT BOOK
// =========================

$("bookForm")
.addEventListener("submit", e => {

  e.preventDefault();

  if(!currentUser){

    alert("กรุณา Login ก่อน");

    return;

  }

  const title =
  $("bookTitle").value;

  const author =
  $("bookAuthor").value;

  const description =
  $("bookDescription").value;

  const deposit =
  $("bookDeposit").value;

  const image =
  $("previewImage").src;

  const checked =
  document.querySelectorAll(
    ".multi-category input:checked"
  );

  const category =
  Array.from(checked)
  .map(item => item.value)
  .join(", ");

  if(!image){

    alert("กรุณาใส่รูปหนังสือ");

    return;

  }

  const newBook = {

    id:Date.now(),

    title,
    author,
    description,
    deposit,
    category,
    image,

    owner:
    currentUser.username,

    status:"pending"

  };

  books.unshift(newBook);

  saveBooks();

  $("statusMessage")
  .classList.remove("hidden");

  $("statusMessage")
  .textContent =
  "⏳ ส่งข้อมูลสำเร็จ รอแอดมินตรวจสอบ";

  $("bookForm").reset();

  $("previewImage")
  .classList.add("hidden");

});

// =========================
// RENDER BOOKS
// =========================

function renderBooks(){

  const approvedBooks =
  $("approvedBooks");

  approvedBooks.innerHTML = "";

  const approved =
  books.filter(book =>
    book.status === "approved"
  );

  if(approved.length === 0){

    approvedBooks.innerHTML = `

      <div class="empty-box">

        <h2>
          ยังไม่มีหนังสือ
        </h2>

      </div>

    `;

    return;

  }

  approved.forEach(book => {

    const card =
    document.createElement("div");

    card.className =
    "book-card";

    card.setAttribute(
      "data-category",
      book.category
    );

    card.innerHTML = `

      <img src="${book.image}">

      <div class="book-content">

        <h3>
          ${book.title}
        </h3>

        <p>
          ✍️ ${book.author}
        </p>

        <p>
          📚 ${book.category}
        </p>

        <p>
          💰 มัดจำ ${book.deposit} บาท
        </p>

        <button
        class="rent-btn"
        onclick='openRentModal(${JSON.stringify(book)})'>

          เช่าหนังสือ

        </button>

      </div>

    `;

    approvedBooks
    .appendChild(card);

  });

}

// =========================
// ADMIN BOOKS
// =========================

function renderAdminBooks(){

  const adminBooks =
  $("adminBooks");

  adminBooks.innerHTML = "";

  books.forEach(book => {

    const card =
    document.createElement("div");

    card.className =
    "admin-card";

    card.innerHTML = `

      <img src="${book.image}">

      <div class="admin-content">

        <h3>
          ${book.title}
        </h3>

        <p>
          ผู้เขียน:
          ${book.author}
        </p>

        <p>
          หมวด:
          ${book.category}
        </p>

        <p>
          มัดจำ:
          ${book.deposit}
          บาท
        </p>

        <p>
          ผู้ปล่อย:
          ${book.owner}
        </p>

        <p>
          สถานะ:
          ${book.status}
        </p>

        <div class="admin-actions">

          <button
          class="approve-btn"
          onclick="approveBook(${book.id})">

            อนุมัติ

          </button>

          <button
          class="reject-btn"
          onclick="rejectBook(${book.id})">

            ลบ

          </button>

        </div>

      </div>

    `;

    adminBooks
    .appendChild(card);

  });

}

// =========================
// APPROVE
// =========================

function approveBook(id){

  books = books.map(book => {

    if(book.id === id){

      book.status =
      "approved";

    }

    return book;

  });

  saveBooks();

  renderAdminBooks();

  renderBooks();

}

// =========================
// REJECT
// =========================

function rejectBook(id){

  books = books.filter(book => {

    return book.id !== id;

  });

  saveBooks();

  renderAdminBooks();

  renderBooks();

}

// =========================
// CATEGORY FILTER
// =========================

const categoryButtons =
document.querySelectorAll(
  ".category-btn"
);

categoryButtons.forEach(button => {

  button.addEventListener("click", () => {

    categoryButtons.forEach(btn => {

      btn.classList.remove("active");

    });

    button.classList.add("active");

    const category =
    button.dataset.category;

    const cards =
    document.querySelectorAll(
      ".book-card"
    );

    cards.forEach(card => {

      if(
        category === "all" ||
        card.dataset.category.includes(category)
      ){

        card.style.display =
        "block";

      }else{

        card.style.display =
        "none";

      }

    });

  });

});

// =========================
// SEARCH
// =========================

$("searchBtn")
.addEventListener("click", () => {

  const keyword =
  $("searchInput")
  .value
  .toLowerCase();

  const cards =
  document.querySelectorAll(
    ".book-card"
  );

  cards.forEach(card => {

    const text =
    card.innerText.toLowerCase();

    if(text.includes(keyword)){

      card.style.display =
      "block";

    }else{

      card.style.display =
      "none";

    }

  });

});

// =========================
// RENT
// =========================

let selectedBook = null;

function openRentModal(book){

  if(!currentUser){

    alert("กรุณา Login ก่อน");

    return;

  }

  selectedBook = book;

  $("rentModal")
  .classList.remove("hidden");

  $("rentBookImage").src =
  book.image;

  $("rentBookTitle").textContent =
  book.title;

  $("rentBookAuthor").textContent =
  "ผู้เขียน: " + book.author;

  $("rentBookCategory").textContent =
  "หมวดหมู่: " + book.category;

  $("rentBookDeposit").textContent =
  "ค่ามัดจำ: " +
  book.deposit +
  " บาท";

}

// =========================
// CONFIRM RENT
// =========================

$("confirmRentBtn")
.addEventListener("click", () => {

  const fullname =
  $("rentFullname").value;

  const phone =
  $("rentPhone").value;

  const address =
  $("rentAddress").value;

  if(
    !fullname ||
    !phone ||
    !address
  ){

    alert("กรอกข้อมูลให้ครบ");

    return;

  }

  $("rentModal")
  .classList.add("hidden");

  $("paymentModal")
  .classList.remove("hidden");

  startTimer();

});

// =========================
// PAYMENT TIMER
// =========================

let countdown;

function startTimer(){

  let time = 600;

  clearInterval(countdown);

  countdown =
  setInterval(() => {

    const minutes =
    Math.floor(time / 60);

    const seconds =
    time % 60;

    $("paymentTimer")
    .textContent =

      `${String(minutes)
      .padStart(2,"0")}:
      ${String(seconds)
      .padStart(2,"0")}`;

    time--;

    if(time < 0){

      clearInterval(countdown);

      $("paymentModal")
      .classList.add("hidden");

      alert("หมดเวลาชำระเงิน");

    }

  }, 1000);

}

// =========================
// CONFIRM PAYMENT
// =========================

$("confirmPaymentBtn")
.addEventListener("click", () => {

  const slip =
  $("paymentSlip").files[0];

  if(!slip){

    alert("กรุณาแนบสลิป");

    return;

  }

  const rentData = {

    id:Date.now(),

    user:
    currentUser.username,

    book:
    selectedBook.title,

    image:
    selectedBook.image,

    deposit:
    selectedBook.deposit,

    date:
    new Date()
    .toLocaleString()

  };

  history.unshift(rentData);

  saveHistory();

  renderHistory();

  $("paymentModal")
  .classList.add("hidden");

  clearInterval(countdown);

  alert(
    "ชำระเงินสำเร็จ"
  );

});

// =========================
// HISTORY
// =========================

function renderHistory(){

  const historyGrid =
  $("historyGrid");

  historyGrid.innerHTML = "";

  if(history.length === 0){

    historyGrid.innerHTML = `

      <div class="empty-box">

        <h2>
          ยังไม่มีประวัติ
        </h2>

      </div>

    `;

    return;

  }

  history.forEach(item => {

    const card =
    document.createElement("div");

    card.className =
    "history-card";

    card.innerHTML = `

      <img src="${item.image}">

      <div class="history-content">

        <h3>
          ${item.book}
        </h3>

        <p>
          ผู้เช่า:
          ${item.user}
        </p>

        <p>
          มัดจำ:
          ${item.deposit}
          บาท
        </p>

        <p>
          ${item.date}
        </p>

      </div>

    `;

    historyGrid
    .appendChild(card);

  });

}

// =========================
// REVIEWS
// =========================

let selectedStars = 0;

const stars =
document.querySelectorAll(
  ".star-select span"
);

stars.forEach(star => {

  star.addEventListener("click", () => {

    selectedStars =
    star.dataset.star;

    stars.forEach(s => {

      s.classList.remove("active");

    });

    for(let i = 0; i < selectedStars; i++){

      stars[i]
      .classList.add("active");

    }

  });

});

// =========================
// SUBMIT REVIEW
// =========================

$("submitReviewBtn")
.addEventListener("click", () => {

  if(!currentUser){

    alert("กรุณา Login ก่อน");

    return;

  }

  const message =
  $("reviewMessage")
  .value
  .trim();

  if(
    !message ||
    selectedStars == 0
  ){

    alert(
      "กรอกข้อความและเลือกดาว"
    );

    return;

  }

  const review = {

    user:
    currentUser.username,

    stars:
    selectedStars,

    message

  };

  reviews.unshift(review);

  saveReviews();

  $("reviewMessage").value =
  "";

  selectedStars = 0;

  stars.forEach(s => {

    s.classList.remove("active");

  });

  renderReviews();

});

// =========================
// RENDER REVIEWS
// =========================

function renderReviews(){

  const reviewList =
  $("reviewList");

  reviewList.innerHTML = "";

  reviews.forEach(review => {

    let starHTML = "";

    for(let i = 0; i < review.stars; i++){

      starHTML += "★";

    }

    const card =
    document.createElement("div");

    card.className =
    "review-card";

    card.innerHTML = `

      <div class="review-top">

        <div class="review-user">

          ${review.user}

        </div>

        <div class="review-stars">

          ${starHTML}

        </div>

      </div>

      <div class="review-text">

        ${review.message}

      </div>

    `;

    reviewList
    .appendChild(card);

  });

}

// =========================
// INIT
// =========================

updateProfileUI();

renderBooks();

renderReviews();

renderHistory();
