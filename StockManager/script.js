const storageKey = "stock-manager-products";
const savedAtKey = "stock-manager-saved-at";
const balanceKey = "stock-manager-cash-balance";
const salesKey = "stock-manager-sales";

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productStockInput = document.getElementById("productStock");
const productTableBody = document.getElementById("productTableBody");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const saveButton = document.getElementById("saveButton");
const lastSaved = document.getElementById("lastSaved");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const stockValue = document.getElementById("stockValue");
const cashBalance = document.getElementById("cashBalance");
const totalSalesCount = document.getElementById("totalSalesCount");
const salesSummary = document.getElementById("salesSummary");
const salesEmptyState = document.getElementById("salesEmptyState");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu-item[data-view]");
const pageSections = document.querySelectorAll(".page-section[data-view-panel]");

const pageTitles = {
    products: "Ürünler",
    "add-product": "Ürün Ekle",
    summary: "Özet"
};

let products = loadProducts();
let balance = loadBalance();
let sales = loadSales();

function showView(view) {
    pageSections.forEach((section) => {
        section.classList.toggle("active-section", section.dataset.viewPanel === view);
    });

    menuItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.view === view);
    });

    pageTitle.textContent = pageTitles[view] || "Ürünler";

    if (view === "add-product") {
        productNameInput.focus();
    }
}

function loadProducts() {
    const savedProducts = localStorage.getItem(storageKey);

    if (!savedProducts) {
        return [];
    }

    try {
        return JSON.parse(savedProducts);
    } catch {
        return [];
    }
}

function loadBalance() {
    const savedBalance = Number(localStorage.getItem(balanceKey));
    return Number.isNaN(savedBalance) ? 0 : savedBalance;
}

function loadSales() {
    const savedSales = localStorage.getItem(salesKey);

    if (!savedSales) {
        return {};
    }

    try {
        return JSON.parse(savedSales);
    } catch {
        return {};
    }
}

function saveProducts(showMessage = false) {
    localStorage.setItem(storageKey, JSON.stringify(products));
    localStorage.setItem(balanceKey, String(balance));
    localStorage.setItem(salesKey, JSON.stringify(sales));
    localStorage.setItem(savedAtKey, new Date().toISOString());
    updateSavedText();

    if (showMessage) {
        showStatus("Veriler kaydedildi.");
    }
}

function updateSavedText() {
    const savedAt = localStorage.getItem(savedAtKey);

    if (!savedAt) {
        lastSaved.textContent = "Henüz kaydedilmedi";
        return;
    }

    const date = new Date(savedAt);
    lastSaved.textContent = `Son kayıt: ${date.toLocaleString("tr-TR")}`;
}

function getNextId() {
    if (products.length === 0) {
        return 1;
    }

    return Math.max(...products.map((product) => product.id)) + 1;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(value);
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderProducts() {
    productTableBody.innerHTML = "";
    emptyState.classList.toggle("visible", products.length === 0);

    products.forEach((product) => {
        const row = document.createElement("tr");
        const stockClass = product.stock === 0 ? "stock-badge empty" : "stock-badge";

        row.innerHTML = `
            <td>#${product.id}</td>
            <td>${escapeHtml(product.name)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><span class="${stockClass}">${product.stock}</span></td>
            <td>
                <div class="actions">
                    <button class="action-button sell-button" type="button" data-action="sell" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>Satış Yap</button>
                    <button class="action-button delete-button" type="button" data-action="delete" data-id="${product.id}">Sil</button>
                </div>
            </td>
        `;

        productTableBody.appendChild(row);
    });

    updateSummary();
}

function updateSummary() {
    const stockCount = products.reduce((total, product) => total + product.stock, 0);
    const value = products.reduce((total, product) => total + product.price * product.stock, 0);
    const soldCount = Object.values(sales).reduce((total, item) => total + item.quantity, 0);

    totalProducts.textContent = products.length;
    totalStock.textContent = stockCount;
    stockValue.textContent = formatCurrency(value);
    cashBalance.textContent = formatCurrency(balance);
    totalSalesCount.textContent = `${soldCount} adet`;
    renderSalesSummary();
}

function renderSalesSummary() {
    salesSummary.innerHTML = "";
    const salesItems = Object.values(sales).sort((first, second) => second.quantity - first.quantity);
    salesEmptyState.classList.toggle("visible", salesItems.length === 0);

    salesItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${escapeHtml(item.name)}</span>
            <strong>${item.quantity} adet - ${formatCurrency(item.total)}</strong>
        `;
        salesSummary.appendChild(listItem);
    });
}

function showStatus(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#dc2626" : "#15803d";

    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(() => {
        message.textContent = "";
    }, 2500);
}

function addProduct(event) {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const price = Number(productPriceInput.value);
    const stock = Number(productStockInput.value);

    if (!name || Number.isNaN(price) || Number.isNaN(stock) || price < 0 || stock < 0 || !Number.isInteger(stock)) {
        showStatus("Lütfen geçerli ürün bilgileri girin.", true);
        return;
    }

    products.push({
        id: getNextId(),
        name,
        price,
        stock
    });

    productForm.reset();
    saveProducts();
    renderProducts();
    showStatus("Ürün listeye eklendi.");
    productNameInput.focus();
}

function handleProductAction(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const product = products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    if (action === "sell") {
        if (product.stock === 0) {
            showStatus("Stok 0 olduğu için satış yapılamaz.", true);
            return;
        }

        product.stock -= 1;
        balance += product.price;
        sales[product.id] = sales[product.id] || {
            name: product.name,
            quantity: 0,
            total: 0
        };
        sales[product.id].name = product.name;
        sales[product.id].quantity += 1;
        sales[product.id].total += product.price;
        showStatus(`${product.name} için satış yapıldı.`);
    }

    if (action === "delete") {
        products = products.filter((item) => item.id !== id);
        showStatus(`${product.name} silindi.`);
    }

    saveProducts();
    renderProducts();
}

productForm.addEventListener("submit", addProduct);
productTableBody.addEventListener("click", handleProductAction);
saveButton.addEventListener("click", () => saveProducts(true));
menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();
        const view = item.dataset.view;

        window.location.hash = item.getAttribute("href");
        showView(view);
    });
});

updateSavedText();
renderProducts();
showView(window.location.hash === "#summary" ? "summary" : window.location.hash === "#add-product" ? "add-product" : "products");
