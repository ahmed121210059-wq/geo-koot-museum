// ======== Side Menu ========
function openMenu() {
  document.getElementById("side-menu").classList.add("open");
  document.getElementById("menu-overlay").classList.add("show");
}
function closeMenu() {
  document.getElementById("side-menu").classList.remove("open");
  document.getElementById("menu-overlay").classList.remove("show");
}

// ======== Login Modal ========
const loginModal = document.getElementById("login-modal");
const loginBtn = document.getElementById("login-btn");

function showLoginModal() {
  loginModal.style.display = "flex";
}

// إذا لم يسجل المستخدم الدخول مسبقاً
if(!localStorage.getItem("loggedIn")) {
  // لا تفتح تلقائياً، فقط عند الضغط على تسجيل الدخول
}

// تسجيل الدخول
loginBtn.addEventListener("click", () => {
  const name = document.getElementById("login-name").value.trim();
  const email = document.getElementById("login-email").value.trim();
  if(name && email){
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("userName", name);
    loginModal.style.display = "none";
    alert("مرحباً " + name + "، يمكنك الآن استخدام الموقع");
    updateAccountMenu();
  } else {
    alert("الرجاء إدخال الاسم والبريد الإلكتروني");
  }
});

// ======== QR Points ========
let points = parseInt(localStorage.getItem("points")) || 0;
document.getElementById("points").textContent = points;

document.getElementById("qr-input")?.addEventListener("change", () => {
  points++;
  localStorage.setItem("points", points);
  document.getElementById("points").textContent = points;
  alert("تم إضافة نقطة! مجموع نقاطك الآن: " + points);
});

// ======== Purchase Modal ========
const purchaseModal = document.getElementById("purchase-modal");
const purchaseBtnConfirm = document.getElementById("purchase-btn");
let currentTicket = "";

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if(!localStorage.getItem("loggedIn")){
      alert("يجب تسجيل الدخول أولاً");
      showLoginModal();
      return;
    }
    currentTicket = btn.getAttribute("data-ticket");
    document.getElementById("ticket-name").textContent = currentTicket;
    purchaseModal.style.display = "flex";
  });
});

purchaseBtnConfirm.addEventListener("click", () => {
  const cardName = document.getElementById("card-name").value.trim();
  const cardNumber = document.getElementById("card-number").value.trim();
  const cardExp = document.getElementById("card-exp").value.trim();
  const cardCVV = document.getElementById("card-cvv").value.trim();

  if(cardName && cardNumber && cardExp && cardCVV){
    alert(`تم شراء تذكرة "${currentTicket}" بنجاح ✅`);
    closePurchaseModal();
  } else {
    alert("الرجاء ملء جميع بيانات البطاقة");
  }
});

function closePurchaseModal(){
  purchaseModal.style.display = "none";
}

// ======== Account Menu ========
const accountBtn = document.getElementById('account-btn');
const accountOptions = document.getElementById('account-options');
const loginOption = document.getElementById('login-option');
const logoutOption = document.getElementById('logout-option');

function updateAccountMenu(){
  if(localStorage.getItem('loggedIn')){
    loginOption.style.display = 'none';
    logoutOption.style.display = 'block';
  } else {
    loginOption.style.display = 'block';
    logoutOption.style.display = 'none';
  }
}

// فتح/إغلاق قائمة الحساب
accountBtn.addEventListener('click', (e) => {
  e.preventDefault();
  accountOptions.style.display = accountOptions.style.display === 'block' ? 'none' : 'block';
});

// الضغط على تسجيل الدخول من القائمة
loginOption.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginModal();
  accountOptions.style.display = 'none';
});

// الضغط على تسجيل الخروج
logoutOption.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('points'); // إعادة ضبط النقاط عند الخروج
  alert("تم تسجيل الخروج بنجاح!");
  accountOptions.style.display = 'none';
  updateAccountMenu();
  location.reload();
});

// تحديث القائمة عند تحميل الصفحة
window.addEventListener('load', () => {
  updateAccountMenu();
});

// ======== باقي الأكواد ========
// هنا تضع باقي الأكواد مثل QR Scanner، Fade-in، Purchase Modal، إلخ
