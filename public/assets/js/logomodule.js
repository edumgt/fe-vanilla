import { buildApiUrl, createTanslations } from './common.js';
const translations = createTanslations;

export const cmmContainer = document.getElementById('cmmContainer');
if (cmmContainer) {
    cmmContainer.innerHTML = `
        <div class="gnb-menu">
            <ul class="flex">
                <div id="logo"></div>
                <div id="tabs-container"></div>
                <div id="dropdown-container"></div>
                <div id="memberIcon"></div>
                <div id="memberMenu"></div>
            </ul>
        </div>
        <div id="toast-container"></div>
        <div id="offCanvasContainer"></div>
        <div id="buttonContainer"></div>
        <div id="appContainer"></div>
    `;
}


export const currentPage = window.location.pathname.split("/").pop();
window.currentPage = currentPage;

export const lang = localStorage.getItem('lang') || 'ko';
window.lang = lang;

localStorage.setItem('lang', lang);

/* Tool Tip */
export function createTooltip(element, text) {
    const tooltip = document.createElement("div");
    tooltip.textContent = text;
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "12px";
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.2s ease-in-out";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.zIndex = "1000";

    document.body.appendChild(tooltip);

    element.addEventListener("mouseenter", function (event) {
        tooltip.style.left = `${event.clientX - 200}px`;
        tooltip.style.top = `${event.clientY - 40}px`;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    element.addEventListener("mousemove", function (event) {
        tooltip.style.left = `${event.clientX - 200}px`;
        tooltip.style.top = `${event.clientY - 40}px`;
    });

    element.addEventListener("mouseleave", function () {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });
}
window.createTooltip = createTooltip;

function saveModal() {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};
    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
        grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
        grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
        grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
    }
    document.getElementById('modal').classList.add('hidden');
    saveData(grid.getData());
    showToast('well-done', 'success', 'en');
}

const allMenuButton = document.createElement('button');

function renderOffCanvasMenu(menuItems) {
    const offCanvas = document.createElement('div');
    offCanvas.id = 'offCanvas';
    offCanvas.className = 'fixed top-14 h-full bg-gray-100 z-50 overflow-y-auto';


    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex flex-col h-full';

    const ul = document.createElement('ul');
    ul.className = 'flex-grow p-4 space-y-2';

    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.width = '120px';
        //li.classList.add('relative');

        const a = document.createElement('a');
        a.href = item.href || "#";
        a.className = 'menu-item flex items-center justify-between rounded-md text-gray-600 hover:text-blue-500';

        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center';

        const icon = document.createElement('i');
        icon.className = `fas ${item.icon} mr-2`;

        const span = document.createElement('span');
        span.className = 'menu-text mr-2';
        span.textContent = item.text;

        leftDiv.appendChild(icon);
        leftDiv.appendChild(span);
        a.appendChild(leftDiv);
        li.appendChild(a);

        if (item.children && item.children.length > 0) {
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down text-xs "></i>';
            toggleBtn.className = 'submenu-toggle text-gray-400 hover:text-blue-500';
            toggleBtn.style.marginRight = '-32px'; // 추가된 부분
            toggleBtn.style.marginLeft = '-32px'; // 추가된 부분



            a.appendChild(toggleBtn);

            const subUl = document.createElement('ul');

            subUl.style.border = 'none';

            subUl.className = 'hidden';
            subUl.id = `submenu-${index}`;

            item.children.forEach(subItem => {
                const subLi = document.createElement('li');
                subLi.style.height = '26px';
                subLi.style.paddingLeft = '10px';
                // subLi.style.paddingRight = '0px';
                // subLi.style.border = '1px solid #333';
                subLi.style.width = '120px';

                const subA = document.createElement('a');
                subA.href = subItem.href;

                subA.className = 'block text-gray-500 hover:text-blue-500';
                subA.fontSize = '14px';

                const subIcon = document.createElement('i');
                subIcon.className = `fas ${subItem.icon || 'fa-circle'} text-xs mr-2`;

                const subSpan = document.createElement('span');
                subSpan.className = 'menu-text';
                subSpan.textContent = subItem.text;

                subA.appendChild(subIcon);
                subA.appendChild(subSpan);
                subLi.appendChild(subA);
                subUl.appendChild(subLi);
            });

            li.appendChild(subUl);

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                subUl.classList.toggle('hidden');
            });


        }

        ul.appendChild(li);
    });

    const buttonsContainer = document.createElement('div');

    const expandButton = document.createElement('button');
    expandButton.id = 'expandOffCanvas';
    expandButton.className = 'text-gray-600 hover:text-blue-500 text-md';
    expandButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    expandButton.style.border = '1px solid #333';

    const collapseButton = document.createElement('button');
    collapseButton.id = 'collapseOffCanvas';
    collapseButton.className = 'text-gray-600 hover:text-blue-500 text-md';
    collapseButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    collapseButton.style.border = '1px solid #333';

    buttonsContainer.appendChild(expandButton);
    buttonsContainer.appendChild(collapseButton);


    allMenuButton.id = 'showAllMenu';
    allMenuButton.className = 'text-gray-600 hover:text-blue-500 text-md';
    allMenuButton.innerHTML = '<i class="fas fa-th-large"></i>';
    allMenuButton.style.border = '1px solid #333';
    allMenuButton.style.marginBottom = '10px';
    allMenuButton.style.position = 'absolute';
    allMenuButton.style.left = '8px';
    allMenuButton.style.bottom = '80px';
    allMenuButton.style.width = '36px';
    allMenuButton.style.padding = '0px';

    allMenuButton.addEventListener('click', () => {
        let modal = document.getElementById('allMenuModal');
        if (!modal) {
            createAllMenuModal(defaultMenuItems);
            modal = document.getElementById('allMenuModal');
        }
        modal.classList.remove('hidden');
    });


    buttonsContainer.insertBefore(allMenuButton, expandButton);

    flexContainer.appendChild(ul);
    flexContainer.appendChild(buttonsContainer);
    offCanvas.appendChild(flexContainer);

    const offCanvasContainer = document.getElementById('offCanvasContainer');
    if (offCanvasContainer) {
        offCanvasContainer.appendChild(offCanvas);
    }
}


const iconMapping = {
    "일반 업무":      "fa-building",
    "AI 용 업무":     "fa-brain",
    "게임 FE":        "fa-dice-d20",
    "포털 허브":      "fa-home",
    "AI·시장분석":    "fa-microchip",
    "AI기업정보":     "fa-robot",
    "AI 영상판별":    "fa-film",
    "CEO 다이어리":   "fa-user-tie",
    "일정·이벤트":    "fa-calendar-alt",
    "실적·이벤트 일정": "fa-calendar-check",
    "이벤트 타임라인": "fa-stream",
    "리서치 태스크":  "fa-tasks",
    "재무·통계":      "fa-chart-line",
    "매출·재무분석":  "fa-chart-bar",
    "시장통계":       "fa-chart-area",
    "섹터·공급망":    "fa-link",
    "투자정보":       "fa-book-open",
    "투자 용어사전":  "fa-book",
    "뉴스 문서분석":  "fa-file-alt",
    "데이터관리":     "fa-database",
    "종목 코드 관리": "fa-server",
    "권한관리":       "fa-user-shield",
    "설정관리":       "fa-cogs",
    "부루마블 3D":    "fa-dice",
};

const storedData = localStorage.getItem('menuConfigurations');
let menuConfigurations = storedData ? JSON.parse(storedData) : {};

fetch(buildApiUrl('/api/menu'))
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('menuConfigurations', JSON.stringify(data));
        Object.assign(menuConfigurations, data);
        Object.keys(data).forEach(key => {
            menuConfigurations[key] = data[key];
        });
    })
    .catch(console.error);

const defaultMenuItems = [
    {
        id: "p1",
        text: '일반 업무',
        icon: 'fa-building',
        href: 'system.html',
        children: [
            { id: "p11", text: '종목 코드 관리', href: 'system.html',   icon: 'fa-server' },
            { id: "p12", text: '실적·이벤트 일정', href: 'calendar.html', icon: 'fa-calendar-check' },
            { id: "p13", text: '매출·재무분석',  href: 'flow.html',     icon: 'fa-chart-bar' },
            { id: "p14", text: '리서치 태스크',   href: 'trello.html',   icon: 'fa-tasks' },
            { id: "p15", text: '시장통계',       href: 'stati.html',    icon: 'fa-chart-area' },
            { id: "p16", text: '권한관리',       href: 'orgtree.html',  icon: 'fa-user-shield' }
        ]
    },
    {
        id: "p2",
        text: 'AI 용 업무',
        icon: 'fa-brain',
        href: 'aistock.html',
        children: [
            { id: "p21", text: 'AI기업정보',    href: 'aistock.html',  icon: 'fa-robot' },
            { id: "p22", text: 'AI 영상판별',    href: 'video-ai.html', icon: 'fa-film' },
            { id: "p23", text: 'CEO 다이어리',  href: 'ceo-diary.html',icon: 'fa-user-tie' },
            { id: "p24", text: '뉴스 문서분석',  href: 'document.html', icon: 'fa-file-alt' },
            { id: "p25", text: '투자 용어사전',  href: 'glos.html',     icon: 'fa-book' },
            { id: "p26", text: '섹터·공급망',   href: 'chain.html',    icon: 'fa-link' }
        ]
    },
    {
        id: "p3",
        text: '게임 FE',
        icon: 'fa-dice-d20',
        href: 'burumable.html',
        children: [
            { id: "p31", text: '부루마블 3D',    href: 'burumable.html', icon: 'fa-dice' }
        ]
    },
    {
        id: "p0",
        text: '포털 허브',
        icon: 'fa-home',
        href: 'index.html',
        children: [
            { id: "p01", text: '인트로 허브',    href: 'index.html',     icon: 'fa-home' }
        ]
    }
];

// Dev Data 연동 안될 경우 
const menuItems = (menuConfigurations[currentPage] ? defaultMenuItems : []).map(item => ({
    ...item,
    icon: iconMapping[item.text]
}));
renderOffCanvasMenu(defaultMenuItems);
//////////////////////////////////////

export function createModal(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalContent = `
        <div class="bg-white rounded-lg shadow-sm p-6 w-1/3 relative">
            <button class="close" onclick="document.getElementById('${modalId}').classList.add('hidden');">&times;</button>
            <h4 class="text-md mb-4">${title}</h4>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button id="saveModal" class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
            </div>
        </div>`;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}

window.createModal = createModal;

createModal(
    'modal',
    '상세정보',
    '<form id="modalForm" class="space-y-4"></form>',
    [
        { label: '저장', class: 'bg-blue-500 text-white ', onClick: 'saveModal()' },
        { label: '닫기', class: 'bg-gray-500 text-white ', onClick: "document.getElementById('modal').classList.add('hidden');" }
    ]
);

createModal(
    'logoutModal',
    '로그아웃 하시겠습니까?',
    '',
    [
        { label: '로그아웃', class: 'bg-blue-500 text-white ', onClick: "window.location.href='login.html';" },
        { label: '닫기', class: 'bg-gray-500 text-white ', onClick: "document.getElementById('logoutModal').classList.add('hidden');" }
    ]
);

export function createModal2(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
    const modalContent = `
        <div class="modal-content bg-white rounded-lg shadow-sm p-6 w-1/3 relative">
            <h4 class="text-md mb-4">${title}</h4>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button id="saveModal" class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
            </div>
        </div>`;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}
window.createModal2 = createModal2;

export function createModal3(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
    const modalContent = `${content}`;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}
window.createModal3 = createModal3;


function renderFloatingNav(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const floatingNav = document.createElement('div');
    floatingNav.id = 'floatingNav';
    floatingNav.className = 'fixed bottom-4 right-4 bg-gray-700 text-white rounded-lg p-2 hidden space-y-4 z-50';
    floatingNav.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="text-white">다국어지정</h3>
            <button id="closeFloatingNav" class="text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="languageSwitcher" class="flex space-x-2">
            <img src="assets/img/usa.svg" alt="English" data-lang="en" class="w-8 h-8 cursor-pointer">
            <img src="assets/img/kor.svg" alt="한국어" data-lang="ko" class="w-8 h-8 cursor-pointer">
            <img src="assets/img/jpn.svg" alt="日本語" data-lang="ja" class="w-6 h-6 cursor-pointer">
        </div>
    `;

    container.appendChild(floatingNav);

    const closeButton = floatingNav.querySelector('#closeFloatingNav');
    closeButton.addEventListener('click', () => {
        floatingNav.classList.add('hidden');
    });

    const languageSwitcher = floatingNav.querySelector('#languageSwitcher');
    languageSwitcher.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const selectedLang = event.target.getAttribute('data-lang');
        }
    });
}

if (document.getElementById('appContainer')) {
    renderFloatingNav('appContainer');
}

const tabsData = [
    { href: "index.html",     icon: "fas fa-home",       label: "포털 허브" },
    { href: "system.html",    icon: "fas fa-building",   label: "일반 업무" },
    { href: "aistock.html",   icon: "fas fa-brain",      label: "AI 용 업무" },
    { href: "video-ai.html",  icon: "fas fa-film",       label: "AI 영상판별" },
    { href: "burumable.html", icon: "fas fa-dice-d20",   label: "게임 FE" },
];

function renderTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const tabsDiv = document.createElement("div");
    tabsDiv.className = "px-8 tabs flex";

    tabsData.forEach(tab => {
        const li = document.createElement("li");

        const anchor = document.createElement("a");
        anchor.href = tab.href;
        anchor.className = "gnb-item tab-link flex ";

        const icon = document.createElement("i");
        icon.className = tab.icon;

        const span = document.createElement("span");
        span.textContent = tab.label;

        anchor.appendChild(icon);
        anchor.appendChild(span);
        li.appendChild(anchor);
        tabsDiv.appendChild(li);
    });

    container.appendChild(tabsDiv);
}

renderTabs("tabs-container");

class AppBrand {
    constructor(containerId, brandName, logoHref = "#") {
        this.container = document.getElementById(containerId);
        this.brandName = brandName;
        this.logoHref = logoHref;
        if (this.container) {
            this.render();
        }
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
                <a href="${this.logoHref}">
                    <span class="logo-text">${this.brandName}</span>
                </a>`;
    }
}

const appBrand = new AppBrand('logo', 'EDUMGT');

const button = document.createElement('div');
createTooltip(button, "다국어를 지정 합니다.");

button.id = 'gearIcon';
button.className = 'fixed bottom-4 right-4 bg-black text-white rounded-3xl p-2 z-50';
const icon = document.createElement('i');
icon.className = 'fas fa-globe';
button.appendChild(icon);
const buttonContainer = document.getElementById('buttonContainer');
if (buttonContainer) {
    buttonContainer.appendChild(button);
}

const gearIcon = document.getElementById('gearIcon');
if (gearIcon) {
    gearIcon.addEventListener('click', () => {
        const floatingNav = document.getElementById('floatingNav');
        if (floatingNav) floatingNav.classList.remove('hidden');
    });
}

const closeFloatingNav = document.getElementById('closeFloatingNav');
if (closeFloatingNav) {
    closeFloatingNav.addEventListener('click', () => {
        const floatingNav = document.getElementById('floatingNav');
        if (floatingNav) floatingNav.classList.add('hidden');
    });
}

const offCanvas = document.getElementById('offCanvas');
const expandOffCanvas = document.getElementById('expandOffCanvas');
const collapseOffCanvas = document.getElementById('collapseOffCanvas');

if (offCanvas && expandOffCanvas && collapseOffCanvas) {
    expandOffCanvas.addEventListener('click', function () {
        offCanvas.classList.remove('collapsed');
        offCanvas.classList.add('expanded');
        expandOffCanvas.classList.add('hidden');
        collapseOffCanvas.classList.remove('hidden');
        if (allMenuButton) allMenuButton.classList.add('hidden');
    });

    collapseOffCanvas.addEventListener('click', function () {
        offCanvas.classList.add('collapsed');
        offCanvas.classList.remove('expanded');
        collapseOffCanvas.classList.add('hidden');
        expandOffCanvas.classList.remove('hidden');
        if (allMenuButton) allMenuButton.classList.remove('hidden');
    });

    offCanvas.classList.remove('hidden', '-translate-x-full');
    offCanvas.classList.add('collapsed');
    offCanvas.classList.remove('expanded');
}

function loadMessages() {
    fetch('assets/mock/messages.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('messages', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading data:', error));
}

function getMsg(key, lang = 'en') {
    const messages = JSON.parse(localStorage.getItem('messages'));
    return messages[lang][key] || key;
}


loadMessages();

export function showToast(messageKey, type = 'success', lang = 'en') {
    const message = getMsg(messageKey, lang);
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
window.showToast = showToast;

// languageSwitcher is handled below

export const breadcrumb = document.querySelector(".breadcrumb");
window.breadcrumb = breadcrumb;

const buttons = document.querySelectorAll("#content button span");

export const tabs = document.querySelectorAll(".tabs li a span");
window.tabs = tabs;

export const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");
window.offCanvasItems = offCanvasItems;

const menuLinks = document.querySelectorAll(".gnb-item");
const menuLinks2 = document.querySelectorAll(".menu-item");

// ── 페이지 → GNB 탭 활성화 매핑 ──────────────────────────────────────────
const PAGE_TAB_MAP = {
    "index.html":     "index.html",
    "system.html":    "system.html",
    "calendar.html":  "system.html",
    "timeline.html":  "system.html",
    "trello.html":    "system.html",
    "flow.html":      "system.html",
    "stati.html":     "system.html",
    "orgtree.html":   "system.html",
    "1.html":         "system.html",
    "2.html":         "system.html",
    "4.html":         "system.html",
    "5.html":         "system.html",
    "aistock.html":   "aistock.html",
    "ceo-diary.html": "aistock.html",
    "glos.html":      "aistock.html",
    "document.html":  "aistock.html",
    "chain.html":     "aistock.html",
    "video-ai.html":  "video-ai.html",
    "burumable.html": "burumable.html",
};
const activeTab = PAGE_TAB_MAP[currentPage];
if (activeTab) {
    menuLinks.forEach(link => {
        if (link.getAttribute("href") === activeTab) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

export function generateNanoId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
window.generateNanoId = generateNanoId;

const memberIcon = document.getElementById('memberIcon');
const memberMenu = document.getElementById('memberMenu');
const logoutModal = document.getElementById('logoutModal');

if (memberMenu) {
    memberMenu.classList.add("hidden");
    memberMenu.innerHTML = `<div class="bg-white shadow-lg p-3 rounded-md border">
                     <a class="dropdown-item" href="#">
                        <div class="d-flex">
                           <div class="me-3">
                              <div class="avatar avatar-online">
                                 <img class="rounded-circle bg-primary-subtle" src="sample/sample.svg"
                                    alt="Avatar" width="40px">
                              </div>
                           </div>
                           <div class="">
                              <h6 class="fs-4 mb-0">관리자</h6>
                              <small class="text-muted">주식 KMS</small>
                           </div>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-user fs-5"></i>
                           <span>Profile</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="index.html" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-home fs-5 text-blue-500"></i>
                           <span>포털 인트로 허브</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="system.html" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-building fs-5 text-blue-500"></i>
                           <span>일반 업무 (코드/일정/재무)</span>
                        </div>
                     </a>
                     <a href="aistock.html" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-brain fs-5 text-teal-500"></i>
                           <span>AI 용 업무 (기업/CEO/문서)</span>
                        </div>
                     </a>
                     <a href="video-ai.html" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-film fs-5 text-teal-500"></i>
                           <span>AI 동영상 생성 판별 포렌식</span>
                        </div>
                     </a>
                     <a href="burumable.html" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-dice-d20 fs-5 text-purple-500"></i>
                           <span>게임 FE (부루마블 3D)</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item" id="logoutButton">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-sign-out-alt fs-5"></i>
                           <span>로그아웃</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                </div>`;
}

if (memberIcon && memberMenu) {
    memberIcon.classList.add("text-gray-200", "hover:text-white", "p-2");
    memberIcon.innerHTML = `<i class="fas fa-user"></i>`;

    memberIcon.addEventListener('click', function (event) {
        event.stopPropagation();
        memberMenu.style.position = `absolute`;
        memberMenu.style.top = `45px`;
        memberMenu.style.right = `20px`;
        memberMenu.classList.remove('hidden');
        memberMenu.classList.add('show');
    });

    document.addEventListener('click', function (event) {
        if (!memberIcon.contains(event.target) && !memberMenu.contains(event.target)) {
            memberMenu.classList.remove('show');
            memberMenu.classList.add('hidden');
        }
    });

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton && logoutModal) {
        logoutButton.addEventListener('click', function () {
            logoutModal.classList.remove('hidden');
            logoutModal.classList.add('show');
        });
    }
}


function getFavorites() {
    let firstFavorite = JSON.parse(localStorage.getItem('favorite-1st')) || null;
    let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

    let favoriteHTML = '';

    if (firstFavorite) {
        favoriteHTML += `
            <a href="${firstFavorite.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h5>${firstFavorite.title}</h5>
                <small>처음화면</small>
            </a>
        `;
    }

    quickFavorites.forEach(fav => {
        favoriteHTML += `
            <a href="${fav.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h6>${fav.title}</h6>
                <small>바로가기</small>
            </a>
        `;
    });

    return favoriteHTML;
}

function renderDropdown(containerId) {
    const container = document.getElementById(containerId);
    const dropdownHTML = `
        <div class="dropdown">
            <div class="dropdown-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <div id="dropdown-menu-shortcuts" class="dropdown-menu dropdown-menu-end">
                    <div>
                        ${getFavorites()}
                    </div>
            </div>
        </div>
    `;

    container.innerHTML = dropdownHTML;

    const dropdownToggle = container.querySelector('.dropdown-toggle');
    const dropdownMenu = container.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDropdown('dropdown-container');
});

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) =>
    dropdownToggle.addEventListener('click', (event) => {
        const dropdown = dropdownToggle.closest('.dropdown');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        hideAllDropdowns(event);
        dropdownMenu.classList.toggle('show');
        event.stopPropagation();
    })
);


function hideAllDropdowns(event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus.forEach((dropdownMenu) => {
        if (dropdownMenu.classList.contains('show')) {
            const dropdown = dropdownMenu.closest('.dropdown');
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            if (event.currentTarget !== dropdownToggle) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
}

export function saveFavorite(key) {
    const title = document.querySelector('.breadcrumb')?.innerText || 'No Title';
    const fullPath = window.location.pathname;
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'login.html';

    let favoriteData = { title, url: fileName };

    if (key === '1st') {
        localStorage.setItem('favorite-1st', JSON.stringify(favoriteData));
        showToast('favo-login', 'success', lang);
    } else if (key === 'Quick') {
        let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

        const isDuplicate = quickFavorites.some(item => item.url === fileName);
        if (isDuplicate) {
            showToast('favo-already', 'warning', lang);
            return;
        }

        if (quickFavorites.length >= 8) {
            quickFavorites.shift();
        }
        quickFavorites.push(favoriteData);
        localStorage.setItem('favorite-Quick', JSON.stringify(quickFavorites));

        showToast('favo-save', 'success', lang);
    }
    renderDropdown('dropdown-container');
}
window.saveFavorite = saveFavorite;

function addBreadcrumbBadges() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer || !breadcrumbContainer.parentNode) return;
    const favoriteContainer = document.createElement('div');
    favoriteContainer.id = 'favorite';
    favoriteContainer.style.display = 'flex';
    favoriteContainer.style.alignItems = 'center';
    favoriteContainer.style.position = 'absolute';
    favoriteContainer.style.top = '70px';
    favoriteContainer.style.right = '30px';

    favoriteContainer.innerHTML += `
        <span id="fav1" class="favo-1" onclick="saveFavorite('1st', window.location.href)">1</span>
        <span id="fav2" class="favo-2" onclick="saveFavorite('Quick', window.location.href)">Q</span>
    `;

    breadcrumbContainer.parentNode.insertBefore(favoriteContainer, breadcrumbContainer.nextSibling);
}
addBreadcrumbBadges();

const fav1 = document.getElementById("fav1");
if (fav1) createTooltip(fav1, "현재 페이지를 로그인 후 바로가기로 저장합니다.");
const fav2 = document.getElementById("fav2");
if (fav2) createTooltip(fav2, "현재 페이지를 바로가기 목록에 저장합니다.");

// ── 공통: 페이지별 브레드크럼·사이드바 텍스트 업데이트 ──────────────────────
function applyPageLabels(offCanvasLabels) {
    const PAGE_LABELS = {
        "aistock.html":   ["aistock",   ["aistock",  "ceodirary"]],
        "ceo-diary.html": ["ceodirary", ["aistock",  "ceodirary"]],
        "calendar.html":  ["calendar",  ["calendar", "timeline", "trello"]],
        "timeline.html":  ["timeline",  ["calendar", "timeline", "trello"]],
        "trello.html":    ["trello",    ["calendar", "timeline", "trello"]],
        "flow.html":      ["flow",      ["flow",     "stati",    "chain"]],
        "stati.html":     ["stati",     ["flow",     "stati",    "chain"]],
        "chain.html":     ["chain",     ["flow",     "stati",    "chain"]],
        "glos.html":      ["glos",      ["glos",     "document"]],
        "document.html":  ["document",  ["glos",     "document"]],
        "system.html":    ["system",    ["system",   "orgtree"]],
        "orgtree.html":   ["orgtree",   ["system",   "orgtree"]],
    };
    const entry = PAGE_LABELS[currentPage];
    if (!entry) return;
    const [bcKey, sideKeys] = entry;
    if (breadcrumb && offCanvasLabels[bcKey]) breadcrumb.textContent = offCanvasLabels[bcKey];
    sideKeys.forEach((key, i) => {
        if (offCanvasItems[i] && offCanvasLabels[key]) offCanvasItems[i].textContent = offCanvasLabels[key];
    });
}

const languageSwitcher = document.getElementById("languageSwitcher");
if (languageSwitcher) {
    languageSwitcher.addEventListener("click", function (event) {
        let lang = event.target.getAttribute("data-lang");
        localStorage.setItem('lang', lang);
        if (!lang || !translations[lang]) return;

        let tabLabels = translations[lang].tabs;
        if (tabs && tabs.length >= 6) {
            if (tabs[0]) tabs[0].textContent = tabLabels.system;
            if (tabs[1]) tabs[1].textContent = tabLabels.organization;
            if (tabs[2]) tabs[2].textContent = tabLabels.task;
            if (tabs[3]) tabs[3].textContent = tabLabels.schedule;
            if (tabs[4]) tabs[4].textContent = tabLabels.statistics;
            if (tabs[5]) tabs[5].textContent = tabLabels.settings;
        }

        let offCanvasLabels = translations[lang].offCanvas;
        if (offCanvasLabels) applyPageLabels(offCanvasLabels);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let lang = localStorage.getItem('lang') || 'ko';
    if (!translations[lang]) lang = 'ko';
    let tabLabels = translations[lang]?.tabs;
    if (tabLabels && tabs && tabs.length >= 6) {
        if (tabs[0]) tabs[0].textContent = tabLabels.system;
        if (tabs[1]) tabs[1].textContent = tabLabels.organization;
        if (tabs[2]) tabs[2].textContent = tabLabels.task;
        if (tabs[3]) tabs[3].textContent = tabLabels.schedule;
        if (tabs[4]) tabs[4].textContent = tabLabels.statistics;
        if (tabs[5]) tabs[5].textContent = tabLabels.settings;
    }

    let offCanvasLabels = translations[lang]?.offCanvas;
    if (offCanvasLabels) applyPageLabels(offCanvasLabels);
});

//////////////////////////////////////
// 모달 생성
const modal = document.createElement('div');
modal.id = 'fullscreenModal';
Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    background: 'white',
    zIndex: 9999
});

// 닫기 버튼 생성
const closeBtn = document.createElement('button');
closeBtn.innerHTML = 'Close';
Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '15px',
    right: '15px',
    zIndex: 10000,
    fontSize: '15px',
    color: 'yellow',
    background: 'blue',
    border: 'none',
    cursor: 'pointer',
    paddingBottom: '15px'
});
closeBtn.onclick = () => {
    iframe.src = '';
    modal.style.display = 'none';
};

// iframe 생성
const iframe = document.createElement('iframe');
iframe.id = 'modalIframe';
Object.assign(iframe.style, {
    width: '99%',
    height: '99%',
    border: 'none'
});

// 구성 요소 삽입
modal.appendChild(closeBtn);
modal.appendChild(iframe);
document.body.appendChild(modal);

// 링크 이벤트 바인딩
document.querySelectorAll('.modal-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        iframe.src = this.getAttribute('href');
        modal.style.display = 'block';
    });
});

function createAllMenuModal(menuItems) {
    const modal = document.createElement('div');
    modal.id = 'allMenuModal';
    modal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';

    const content = document.createElement('div');
    content.className = 'relative bg-white rounded-lg shadow-md p-6 max-h-[80%] overflow-y-auto w-2/3';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'absolute top-2 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold';
    closeBtn.onclick = () => modal.classList.add('hidden');

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold mb-6';
    title.textContent = '전체 메뉴';

    const menuList = document.createElement('div');
    menuList.className = 'grid grid-cols-3 gap-6';

    menuItems.forEach(item => {
        const box = document.createElement('div');
        box.className = 'border border-gray-200 rounded p-4 hover:bg-gray-50 transition';

        const link = document.createElement('a');
        link.href = item.href || '#';
        link.className = 'text-blue-600 font-semibold flex items-start gap-2 mb-2';

        link.innerHTML = `
            <i class="fas ${item.icon} mt-1 text-base"></i>
            <div class="flex flex-col leading-tight">
                <span>${item.text}</span>
                <span class="text-xs text-gray-400">${item.href || '-'}</span>
            </div>
        `;

        box.appendChild(link);

        if (item.children?.length) {
            const subList = document.createElement('ul');
            subList.className = 'mt-2 space-y-1 text-sm';

            item.children.forEach(sub => {
                const subItem = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.href = sub.href || '#';
                subLink.className = 'flex justify-between text-gray-600 hover:text-blue-500';

                subLink.innerHTML = `
                    <span>${sub.text}</span>
                    <span class="text-xs text-gray-400">${sub.href || '-'}</span>
                `;

                subItem.appendChild(subLink);
                subList.appendChild(subItem);
            });

            box.appendChild(subList);
        }

        menuList.appendChild(box);
    });

    content.appendChild(closeBtn);
    content.appendChild(title);
    content.appendChild(menuList);
    modal.appendChild(content);
    document.body.appendChild(modal);
}
