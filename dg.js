document.addEventListener('DOMContentLoaded', () => {

  // ─── مفاتيح التخزين ─────────────────────────────
  const STORAGE_KEY_USER      = 'geokoot_user';
  const STORAGE_KEY_POINTS    = 'geokoot_points';
  const STORAGE_KEY_SCANS     = 'geokoot_scan_history';
  const STORAGE_KEY_PURCHASES = 'geokoot_purchases';

  const mainContent = document.querySelector('main');
  const header      = document.querySelector('header');
  const footer      = document.querySelector('footer');

  // ───────────────────────────────────────────────
  //               شاشة التسجيل
  // ───────────────────────────────────────────────
  function showRegisterScreen() {
    header.style.display = 'none';
    footer.style.display = 'none';
    mainContent.innerHTML = `
      <section class="card" style="max-width:400px;margin:auto;text-align:center;">
        <h2>تسجيل الدخول إلى متحف جيو كوت</h2>
        <p class="muted">أدخل اسمك وبريدك الإلكتروني للمتابعة</p>
        <input id="regName" type="text" placeholder="الاسم" style="width:100%;padding:10px;margin:8px 0;border-radius:8px;">
        <input id="regEmail" type="email" placeholder="البريد الإلكتروني" style="width:100%;padding:10px;margin:8px 0;border-radius:8px;">
        <button id="registerBtn" class="buy-btn" style="width:100%;margin-top:10px;">تسجيل الدخول</button>
      </section>
    `;

    document.getElementById('registerBtn').onclick = () => {
      const name  = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();

      if (!name || !email) {
        alert('الرجاء إدخال الاسم والبريد الإلكتروني.');
        return;
      }

      const user = { name, email, joined: Date.now() };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      alert(`مرحبًا ${name}! 🎉`);
      location.reload();
    };
  }

  // ───────────────────────────────────────────────
  //               التحقق من المستخدم
  // ───────────────────────────────────────────────
  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || 'null');
  if (!currentUser) {
    showRegisterScreen();
    return; // توقف الكود هنا حتى يسجل المستخدم
  }

  // إذا المستخدم مسجل
  const userNameDisplay = document.createElement('div');
  userNameDisplay.innerHTML = `
    <p style="color:#e2e8f0;font-size:14px;">👋 أهلاً، ${currentUser.name}</p>
    <button id="logoutBtn" style="background:#e53e3e;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">تسجيل الخروج</button>
  `;
  header.appendChild(userNameDisplay);

  document.getElementById('logoutBtn').onclick = () => {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.clear();
      location.reload();
    }
  };

  // ───────────────────────────────────────────────
  //               بقية الأكواد السابقة
  // ───────────────────────────────────────────────

  const TICKETS = [
    { id:'normal', title:'تذكرة المتحف العادي', price:2, desc:'دخول إلى قاعات المتحف الرئيسية.' },
    { id:'vr', title:'تجربة الواقع الافتراضي', price:4, desc:'تجربة VR مميزة في قاعة التجارب.' },
    { id:'kids', title:'تذكرة الكيدزاريا', price:1.5, desc:'منطقة ترفيهية وتعليمية للأطفال.' }
  ];

  const ticketsGrid   = document.getElementById('ticketsGrid');
  const modal         = document.getElementById('modal');
  const modalTitle    = document.getElementById('modalTitle');
  const modalDesc     = document.getElementById('modalDesc');
  const qtyInput      = document.getElementById('qty');
  const totalPriceEl  = document.getElementById('totalPrice');
  const lastPointsEl  = document.getElementById('lastPoints');
  const totalPointsEl = document.getElementById('totalPoints');
  const scoreTable    = document.getElementById('scoreTable');
  const scanStatus    = document.getElementById('scanStatus');

  let selectedTicket = null;

  // ─── عرض التذاكر ───────────────────────────────
  function renderTickets(){
    ticketsGrid.innerHTML = '';
    TICKETS.forEach(ticket=>{
      const div = document.createElement('div');
      div.className = 'ticket';
      div.innerHTML = `
        <h3>${ticket.title}</h3>
        <p class="price">${ticket.price.toFixed(1)} د.ك</p>
        <p>${ticket.desc}</p>
        <button class="buy-btn" onclick="openModal('${ticket.id}')">شراء</button>
      `;
      ticketsGrid.appendChild(div);
    });
  }

  // ─── المودال ───────────────────────────────────
  window.openModal = function(id){
    selectedTicket = TICKETS.find(t=>t.id===id);
    if(!selectedTicket) return;

    modalTitle.textContent = selectedTicket.title;
    qtyInput.value = '1';
    updateTotalPrice();
    renderPurchaseHistory();
    modal.classList.add('show');
  };

  function updateTotalPrice(){
    if(!selectedTicket) return;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    totalPriceEl.textContent = (selectedTicket.price * qty).toFixed(1);
  }

  qtyInput.addEventListener('input', updateTotalPrice);

  window.closeModal = function(){
    modal.classList.remove('show');
    selectedTicket = null;
  };

  document.getElementById('confirmBuy').onclick = () => {
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const purchase = {
      id: selectedTicket.id,
      title: selectedTicket.title,
      price: selectedTicket.price,
      qty: qty,
      total: selectedTicket.price * qty,
      date: Date.now()
    };

    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY_PURCHASES) || '[]');
    purchases.push(purchase);
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(purchases));

    closeModal();
    alert(`✅ تم شراء ${qty} × ${selectedTicket.title}\nالإجمالي: ${purchase.total.toFixed(1)} د.ك`);
  };

  function renderPurchaseHistory(){
    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY_PURCHASES) || '[]');
    let html = '';
    let totalAll = 0;

    purchases.forEach(p => {
      html += `<p>${p.qty} × ${p.title} = ${p.total.toFixed(1)} د.ك</p>`;
      totalAll += p.total;
    });

    if(html){
      html = `<h4 style="margin-top:8px;">مشترياتك السابقة:</h4>${html}<hr><p><strong>إجمالي المشتريات: ${totalAll.toFixed(1)} د.ك</strong></p>`;
    } else {
      html = '<p>لا توجد مشتريات سابقة</p>';
    }

    modalDesc.innerHTML = selectedTicket.desc + '<br>' + html;
  }

  // ─── النقاط والماسح ─────────────────────────────
  function loadAndRenderPoints(){
    const points  = parseInt(localStorage.getItem(STORAGE_KEY_POINTS) || '0');
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY_SCANS) || '[]');

    totalPointsEl.textContent = points;
    lastPointsEl.textContent  = history.length > 0 ? history[history.length-1].points : 0;

    scoreTable.innerHTML = '';
    history.slice().reverse().slice(0,30).forEach(item=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.code || '—'}</td>
        <td>${item.points}</td>
        <td>${new Date(item.date).toLocaleString('ar-EG')}</td>
      `;
      scoreTable.appendChild(tr);
    });
  }

  function addPoints(code, points=1){
    let total = parseInt(localStorage.getItem(STORAGE_KEY_POINTS) || '0');
    total += points;
    localStorage.setItem(STORAGE_KEY_POINTS, total);

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY_SCANS) || '[]');
    history.push({ code, points, date: Date.now() });
    localStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify(history));

    loadAndRenderPoints();
    scanStatus.textContent = `تم إضافة ${points} نقطة! 🎉`;
    scanStatus.style.color = '#10b981';
    setTimeout(()=> scanStatus.textContent = '', 4000);
  }

  window.resetData = function(){
    if(!confirm('هل أنت متأكد من مسح جميع النقاط والسجل؟')) return;
    localStorage.removeItem(STORAGE_KEY_POINTS);
    localStorage.removeItem(STORAGE_KEY_SCANS);
    localStorage.removeItem(STORAGE_KEY_PURCHASES);
    loadAndRenderPoints();
    scanStatus.textContent = 'تم مسح البيانات';
    scanStatus.style.color = '#ef4444';
  };

  // ─── ماسح QR ───────────────────────────────────
  const html5QrCode = new Html5Qrcode("reader");
  const startBtn = document.getElementById('startScan');
  const stopBtn  = document.getElementById('stopScan');

  startBtn.onclick = () => {
    scanStatus.textContent = '📷 جاري تشغيل الكاميرا...';
    Html5Qrcode.getCameras().then(devices=>{
      if(devices && devices.length){
        const cameraId = devices[0].id;
        html5QrCode.start(
          { deviceId: { exact: cameraId } },
          { fps: 10, qrbox: 250 },
          (decodedText)=> addPoints(decodedText, 1),
          ()=>{}
        ).then(()=>{
          scanStatus.textContent = '✅ جاهز للمسح — وجه الكاميرا للـ QR';
        }).catch(err=>{
          scanStatus.textContent = '❌ خطأ في بدء المسح: ' + err;
        });
      }
    }).catch(err=>{
      scanStatus.textContent = '❌ لا يمكن الوصول للكاميرا: ' + err;
    });
  };

  stopBtn.onclick = () => {
    html5QrCode.stop().then(()=>{
      scanStatus.textContent = '⛔ تم إيقاف المسح';
    }).catch(err=>{
      scanStatus.textContent = 'خطأ في الإيقاف: ' + err;
    });
  };

  // ─── أدوات عامة ───────────────────────────────
  window.scrollToSection = function(id){
    document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
  };

  // ─── بدء التشغيل ───────────────────────────────
  renderTickets();
  loadAndRenderPoints();

});
