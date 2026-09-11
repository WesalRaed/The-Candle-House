/* ==========================================
   THE CANDLE HOUSE
   Main JavaScript
   ========================================== */


/* ================= DEFAULT PRODUCTS ================= */

const defaultProducts = [

    {
        id: 1,
        name: "Vanilla Dream",
        category: "scented",
        price: 24,
        image: "images/vanilla-dream.jpg"
    },

    {
        id: 2,
        name: "Rose Bloom",
        category: "scented",
        price: 28,
        image: "images/rose-bloom.jpg"
    },

    {
        id: 3,
        name: "Lavender Calm",
        category: "scented",
        price: 26,
        image: "images/lavender-calm.jpg"
    },

    {
        id: 4,
        name: "Flower Glow",
        category: "decorative",
        price: 22,
        image: "images/flower-glow.jpg"
    },

    {
        id: 5,
        name: "Birthday Glow",
        category: "gift",
        price: 30,
        image: "images/birthday-glow.jpg"
    },

    {
        id: 6,
        name: "Cloud Candle",
        category: "decorative",
        price: 25,
        image: "images/cloud-candle.jpg"
    },

    {
        id: 7,
        name: "Personalized Candle",
        category: "custom",
        price: 35,
        image: "images/personalized-candle.jpg"
    },

    {
        id: 8,
        name: "Coffee & Vanilla",
        category: "scented",
        price: 29,
        image: "images/coffee-vanilla.jpg"
    }

];


/* ================= PRODUCTS ================= */

/*
   Get products from Admin Dashboard.
   If no Admin products exist, use default products.
*/

function getProducts() {

    const savedProducts =
        JSON.parse(
            localStorage.getItem(
                "candleHouseProducts"
            )
        );


    if (
        Array.isArray(savedProducts) &&
        savedProducts.length > 0
    ) {

        return savedProducts;

    }


    return defaultProducts;

}


/*
   Main product list.
   This is refreshed from localStorage
   whenever needed.
*/

let products = getProducts();


/* ================= CART ================= */

let cart =
    JSON.parse(
        localStorage.getItem(
            "candleHouseCart"
        )
    ) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "candleHouseCart",
        JSON.stringify(cart)
    );

}


/* ================= CART COUNT ================= */

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    products = getProducts();


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();


    alert(
        `${product.name} has been added to your cart!`
    );

}


/* ================= PRODUCT BUTTONS ================= */

function setupProductButtons() {

    const buttons =
        document.querySelectorAll(
            ".product-card button"
        );


    if (!buttons.length) return;


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    /*
                       If the button has a product ID,
                       use it directly.
                    */

                    const buttonId =
                        button.dataset.productId;


                    if (buttonId) {

                        addToCart(
                            buttonId
                        );

                        return;

                    }


                    /*
                       Fallback for the existing
                       hardcoded Shop cards.
                    */

                    const card =
                        button.closest(
                            ".product-card"
                        );


                    if (!card) return;


                    const cards =
                        Array.from(
                            document.querySelectorAll(
                                ".product-card"
                            )
                        );


                    const index =
                        cards.indexOf(card);


                    if (
                        products[index]
                    ) {

                        addToCart(
                            products[index].id
                        );

                    }

                }
            );

        }
    );

}


/* ================= SEARCH ================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchButton =
        document.getElementById(
            "searchBtn"
        );


    if (!searchInput) return;


    function searchProducts() {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            card => {

                const name =
                    card.querySelector(
                        "h3"
                    )
                    ?.textContent
                    .toLowerCase();


                if (
                    name &&
                    name.includes(
                        searchValue
                    )
                ) {

                    card.style.display =
                        "";

                } else {

                    card.style.display =
                        "none";

                }

            }
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );

    }


    searchInput.addEventListener(
        "keyup",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchProducts();

            }

        }
    );

}


/* ================= CATEGORY FILTER ================= */

function setupCategoryFilter() {

    const filter =
        document.getElementById(
            "categoryFilter"
        );


    if (!filter) return;


    filter.addEventListener(
        "change",
        function () {

            products =
                getProducts();


            const selected =
                filter.value;


            const productCards =
                document.querySelectorAll(
                    ".product-card"
                );


            productCards.forEach(
                (card, index) => {

                    const product =
                        products[index];


                    if (!product) {

                        card.style.display =
                            "none";

                        return;

                    }


                    const category =
                        String(
                            product.category
                        )
                        .toLowerCase();


                    if (
                        selected ===
                            "all" ||
                        category ===
                            selected
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* ================= SORT PRODUCTS ================= */

function setupSorting() {

    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (!sort) return;


    sort.addEventListener(
        "change",
        function () {

            const grid =
                document.querySelector(
                    ".products-grid"
                );


            if (!grid) return;


            const cards =
                Array.from(
                    grid.querySelectorAll(
                        ".product-card"
                    )
                );


            const value =
                sort.value;


            if (
                value ===
                "default"
            ) {

                return;

            }


            if (
                value ===
                "low"
            ) {

                cards.sort(
                    (a, b) => {

                        const priceA =
                            parseFloat(
                                a.querySelector(
                                    ".product-info p"
                                )
                                ?.textContent
                                .replace(
                                    "$",
                                    ""
                                )
                            ) || 0;


                        const priceB =
                            parseFloat(
                                b.querySelector(
                                    ".product-info p"
                                )
                                ?.textContent
                                .replace(
                                    "$",
                                    ""
                                )
                            ) || 0;


                        return (
                            priceA -
                            priceB
                        );

                    }
                );

            }


            if (
                value ===
                "high"
            ) {

                cards.sort(
                    (a, b) => {

                        const priceA =
                            parseFloat(
                                a.querySelector(
                                    ".product-info p"
                                )
                                ?.textContent
                                .replace(
                                    "$",
                                    ""
                                )
                            ) || 0;


                        const priceB =
                            parseFloat(
                                b.querySelector(
                                    ".product-info p"
                                )
                                ?.textContent
                                .replace(
                                    "$",
                                    ""
                                )
                            ) || 0;


                        return (
                            priceB -
                            priceA
                        );

                    }
                );

            }


            cards.forEach(
                card => {

                    grid.appendChild(
                        card
                    );

                }
            );

        }
    );

}


/* ================= NEWSLETTER ================= */

function setupNewsletter() {

    const form =
        document.querySelector(
            ".newsletter form"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                form.querySelector(
                    "input"
                );


            const email =
                input
                    ?.value
                    .trim();


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            alert(
                "Thank you for joining The Candle House! 🕯️"
            );


            form.reset();

        }
    );

}


/* ================= HOME FEATURED PRODUCTS ================= */

/*
   The Home page has four featured cards.
   This function replaces their information
   with the first four Admin products.
*/

function setupFeaturedProducts() {

    const featuredGrid =
        document.querySelector(
            ".featured .products-grid"
        );


    if (!featuredGrid) return;


    products =
        getProducts();


    const cards =
        featuredGrid.querySelectorAll(
            ".product-card"
        );


    if (!cards.length) return;


    cards.forEach(
        (card, index) => {

            const product =
                products[index];


            if (!product) {

                card.style.display =
                    "none";

                return;

            }


            card.style.display =
                "";


            const image =
                card.querySelector(
                    ".product-image"
                );


            const category =
                card.querySelector(
                    ".product-category"
                );


            const name =
                card.querySelector(
                    "h3"
                );


            const price =
                card.querySelector(
                    ".product-info > p"
                );


            if (image) {

                image.style.backgroundImage =
                    `url("${product.image}")`;

            }


            if (category) {

                category.textContent =
                    product.category;

            }


            if (name) {

                name.textContent =
                    product.name;

            }


            if (price) {

                price.textContent =
                    `$${Number(
                        product.price
                    ).toFixed(2)}`;

            }

        }
    );

}

/* ================= DYNAMIC SHOP PRODUCTS ================= */

function renderShopProducts() {

    const grid =
        document.getElementById("productsGrid");

    if (!grid) return;

    products = getProducts();

    grid.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";
card.innerHTML = `

    <div class="product-image-wrapper">

        <a
            href="product-details.html?id=${product.id}"
            class="product-image-link">

            <div
                class="product-image"
                style="
                    background-image:
                    url('${product.image}');
                ">
            </div>

        </a>

        <button
            type="button"
            class="wishlist-button"
            data-wishlist-id="${product.id}">

            ♡

        </button>

    </div>


    <div class="product-info">

        <span class="product-category">
            ${product.category}
        </span>

        <h3>
            ${product.name}
        </h3>

        <p>
            $${Number(product.price).toFixed(2)}
        </p>

        <button
            type="button"
            data-product-id="${product.id}">

            Add to Cart

        </button>

    </div>

`;

        grid.appendChild(card);

    });

setupProductButtons();

setupWishlistButtons();
}

/* ================= PRODUCT DETAILS ================= */

function loadProductDetails() {

    const container =
        document.getElementById(
            "productDetails"
        );

    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        container.innerHTML = `
            <div class="product-not-found">
                <h2>Product not found</h2>

                <a href="products.html">
                    Back to Shop
                </a>
            </div>
        `;

        return;

    }


    products = getProducts();


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        container.innerHTML = `
            <div class="product-not-found">

                <h2>
                    Product not found
                </h2>

                <a href="products.html">
                    Back to Shop
                </a>

            </div>
        `;

        return;

    }


    container.innerHTML = `

        <div class="product-details-image">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div class="product-details-info">

            <span class="product-category">
                ${product.category}
            </span>


            <h1>
                ${product.name}
            </h1>


            <div class="product-details-price">
                $${Number(product.price).toFixed(2)}
            </div>


            <p class="product-description">

                Handcrafted with care, this beautiful
                candle is made to bring warmth,
                comfort and a special atmosphere
                to your space.

            </p>


            <div class="quantity-box">

                <button
                    type="button"
                    id="minusQuantity">
                    −
                </button>

                <span id="productQuantity">
                    1
                </span>

                <button
                    type="button"
                    id="plusQuantity">
                    +
                </button>

            </div>


            <button
                type="button"
                id="detailsAddToCart"
                class="details-cart-button">

                Add to Cart

            </button>


            <a
                href="products.html"
                class="back-shop">

                ← Back to Shop

            </a>

        </div>

    `;


    let quantity = 1;


    const quantityDisplay =
        document.getElementById(
            "productQuantity"
        );


    document
        .getElementById("minusQuantity")
        .addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                    quantityDisplay.textContent =
                        quantity;

                }

            }
        );


    document
        .getElementById("plusQuantity")
        .addEventListener(
            "click",
            function () {

                quantity++;

                quantityDisplay.textContent =
                    quantity;

            }
        );


    document
        .getElementById("detailsAddToCart")
        .addEventListener(
            "click",
            function () {

                for (
                    let i = 0;
                    i < quantity;
                    i++
                ) {

                    addToCart(product.id);

                }

            }
        );

}


/* ================= WISHLIST ================= */

let wishlist =
    JSON.parse(
        localStorage.getItem(
            "candleHouseWishlist"
        )
    ) || [];


function saveWishlist() {

    localStorage.setItem(
        "candleHouseWishlist",
        JSON.stringify(wishlist)
    );

}


function toggleWishlist(productId) {

    products = getProducts();

    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    let currentWishlist =
        JSON.parse(
            localStorage.getItem("candleHouseWishlist")
        ) || [];

    const exists = currentWishlist.some(
        item => String(item.id) === String(product.id)
    );

    if (exists) {

        currentWishlist = currentWishlist.filter(
            item => String(item.id) !== String(product.id)
        );

    } else {

        currentWishlist.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            category: product.category,
            image: product.image
        });

    }

    localStorage.setItem(
        "candleHouseWishlist",
        JSON.stringify(currentWishlist)
    );

    wishlist = currentWishlist;

    renderShopProducts();

    renderWishlistPage();
}


    saveWishlist();

    renderShopProducts();
function setupWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            ".wishlist-button"
        );


    buttons.forEach(button => {

        const productId =
            button.dataset.wishlistId;


        const isSaved =
            wishlist.some(
                item =>
                    String(item.id) ===
                    String(productId)
            );


        if (isSaved) {

            button.textContent = "♥";

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                toggleWishlist(productId);

            }
        );

    });

}

/* ================= WISHLIST PAGE ================= */

function renderWishlistPage() {

    const container =
        document.getElementById(
            "wishlistContainer"
        );

    if (!container) return;


    wishlist =
        JSON.parse(
            localStorage.getItem(
                "candleHouseWishlist"
            )
        ) || [];


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <div class="empty-heart">
                    ♡
                </div>

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save your favorite candles
                    and find them here later.
                </p>

                <a
                    href="products.html"
                    class="wishlist-shop-button">

                    Explore Candles

                </a>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    wishlist.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image-wrapper">

                <a
                    href="product-details.html?id=${product.id}"
                    class="product-image-link">

                    <div
                        class="product-image"
                        style="
                            background-image:
                            url('${product.image}');
                        ">
                    </div>

                </a>

                <button
                    type="button"
                    class="wishlist-remove"
                    data-id="${product.id}">

                    ♥

                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    $${Number(product.price).toFixed(2)}
                </p>

                <button
                    type="button"
                    class="wishlist-cart"
                    data-id="${product.id}">

                    Add to Cart

                </button>

            </div>

        `;


        container.appendChild(card);

    });


    setupWishlistPageButtons();

}
function setupWishlistPageButtons() {

    const removeButtons =
        document.querySelectorAll(
            ".wishlist-remove"
        );


    removeButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const id =
                    button.dataset.id;


                wishlist =
                    wishlist.filter(
                        item =>
                            String(item.id) !==
                            String(id)
                    );


                saveWishlist();

                renderWishlistPage();

            }
        );

    });


    const cartButtons =
        document.querySelectorAll(
            ".wishlist-cart"
        );


    cartButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const id =
                    button.dataset.id;

                addToCart(id);

            }
        );

    });

}
/* ================= INITIALIZE ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        products =
            getProducts();


        updateCartCount();

        setupProductButtons();

        setupSearch();

        setupCategoryFilter();

        setupSorting();

        setupNewsletter();

setupFeaturedProducts();

renderShopProducts();

loadProductDetails();
renderWishlistPage();
    }
);
