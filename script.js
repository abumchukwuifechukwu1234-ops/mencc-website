/* =========================================================
   MENCC 2.0 — JAVASCRIPT FOUNDATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body = document.body;

    const pageLoader = document.getElementById("pageLoader");
    const siteHeader = document.getElementById("siteHeader");

    const orderDrawer = document.getElementById("orderDrawer");
    const orderClose = document.querySelector("[data-order-close]");

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    const orderTriggers = document.querySelectorAll(
        "[data-order-trigger]"
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-menu a"
    );


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    const hideLoader = () => {

        if (!pageLoader) return;

        pageLoader.classList.add("is-hidden");

        setTimeout(() => {
            pageLoader.remove();
        }, 1000);

    };


    /*
        Give the browser a moment to render the first
        MENCC frame before removing the loader.
    */

    window.addEventListener("load", () => {

        setTimeout(hideLoader, 900);

    });


    /* =====================================================
       NAVBAR SCROLL STATE
    ===================================================== */

    const updateHeader = () => {

        if (!siteHeader) return;

        if (window.scrollY > 50) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }

    };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       ORDER DRAWER
    ===================================================== */

    const openOrderDrawer = () => {

        if (!orderDrawer) return;

        orderDrawer.classList.add("is-open");
        orderDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("order-open");

    };


    const closeOrderDrawer = () => {

        if (!orderDrawer) return;

        orderDrawer.classList.remove("is-open");
        orderDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("order-open");

    };


    orderTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            openOrderDrawer
        );

    });


    if (orderClose) {

        orderClose.addEventListener(
            "click",
            closeOrderDrawer
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeOrderDrawer();
            closeMobileMenu();

        }

    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const openMobileMenu = () => {

        if (!mobileMenu) return;

        mobileMenu.classList.add("is-open");
        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("menu-open");

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }

    };


    function closeMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("is-open");
        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("menu-open");

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    }


    if (menuToggle) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mobileMenu.classList.contains("is-open");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        });

    }


    mobileLinks.forEach((link) => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /* =====================================================
       FACTORY VIDEO
    ===================================================== */

    const factoryVideo = document.querySelector(
        ".factory-video-element"
    );


    if (factoryVideo) {

        /*
            Attempt to play when the factory section enters
            the viewport. Browser policies are respected because
            the video is muted and playsinline.
        */

        const videoObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            factoryVideo
                                .play()
                                .catch(() => {
                                    /*
                                        Some browsers may block
                                        autoplay. That's okay.
                                    */
                                });

                        } else {

                            factoryVideo.pause();

                        }

                    });

                },
                {
                    threshold: 0.25
                }
            );


        videoObserver.observe(factoryVideo);

    }


    /* =====================================================
       IMAGE LAZY-LOAD FEEDBACK
    ===================================================== */

    const lazyImages = document.querySelectorAll(
        'img[loading="lazy"]'
    );


    lazyImages.forEach((image) => {

        image.addEventListener("load", () => {

            image.classList.add("image-loaded");

        });

    });


    /* =====================================================
       PRODUCT BUTTON FOUNDATION
    ===================================================== */

    const productButtons = document.querySelectorAll(
        "[data-product-select]"
    );


    productButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const product =
                button.dataset.productSelect;

            /*
                Product ordering logic will be connected
                in the next ordering-system phase.
            */

            console.log(
                `MENCC product selected: ${product}`
            );

            openOrderDrawer();

        });

    });


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
    ===================================================== */

    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );


    anchorLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    console.log(
        "MENCC 2.0 — Interactive foundation loaded."
    );

});
/* =========================================================
   MENCC ORDER SYSTEM — STEP 1 CART
   ========================================================= */

(function () {
    const orderApp = document.getElementById("orderApp");

    if (!orderApp) return;

    const quantities = {
        "50cl": 0,
        "75cl": 0,
        "19l": 0
    };

    const prices = {
    "50cl": 400,
    "75cl": 700,
    "19l": 5000
};
window.MENCCOrder = {
    quantities: quantities,
    prices: prices
};

    const itemCount = document.getElementById("orderItemCount");
    const subtotal = document.getElementById("orderSubtotal");
    const total = document.getElementById("orderTotal");
    const continueButton = document.getElementById("continueToDelivery");

    const quantityElements = {
        "50cl": document.querySelector('[data-quantity="50cl"]'),
        "75cl": document.querySelector('[data-quantity="75cl"]'),
        "19l": document.querySelector('[data-quantity="19l"]')
    };
    const overviewItems =
    document.getElementById("orderOverviewItems");

const overviewDeliveryType =
    document.getElementById("overviewDeliveryType");

const overviewDeliveryLocation =
    document.getElementById("overviewDeliveryLocation");

const overviewTotal =
    document.getElementById("overviewTotal");

    function updateOrder() {
        const totalItems =
            quantities["50cl"] +
            quantities["75cl"] +
            quantities["19l"];
        if (continueButton) {
    continueButton.disabled = totalItems === 0;
}
        /* Update quantity numbers */
        Object.keys(quantities).forEach((product) => {
            const element = quantityElements[product];

            if (element) {
                element.textContent = quantities[product];
            }
        });

        /* Update item count */
        if (itemCount) {
            itemCount.textContent = totalItems;
        }

        /*
         * Prices are intentionally not calculated yet.
         * MENCC prices will be added once the real prices
         * are confirmed.
         */
        const subtotalAmount =
    (quantities["50cl"] * prices["50cl"]) +
    (quantities["75cl"] * prices["75cl"]) +
    (quantities["19l"] * prices["19l"]);

const formattedTotal =
    `₦${subtotalAmount.toLocaleString("en-NG")}`;

if (subtotal) {
    subtotal.textContent =
        formattedTotal;
}

if (total) {
    total.textContent =
        formattedTotal;
}
if (overviewTotal) {
    overviewTotal.textContent =
        formattedTotal;
}
/* =====================================================
   LIVE ORDER OVERVIEW
===================================================== */

if (overviewItems) {

    overviewItems.innerHTML = "";

    const products = [
        {
            key: "50cl",
            name: "MENCC 50cl",
            size: "50CL",
            image: "assets/08-50cl-cinematic-hero.jpg"
        },
        {
            key: "75cl",
            name: "MENCC 75cl",
            size: "75CL",
            image: "assets/09-75cl-cinematic-hero.jpg"
        },
        {
            key: "19l",
            name: "MENCC 19L",
            size: "19L",
            image: "assets/07-19l-home-space.jpg"
        }
    ];

    const selectedProducts =
        products.filter(product =>
            quantities[product.key] > 0
        );

    if (selectedProducts.length === 0) {

        overviewItems.innerHTML = `
            <div class="order-overview-empty">
                Select a MENCC product to build your order.
            </div>
        `;

    } else {

        selectedProducts.forEach(product => {

            const quantity =
                quantities[product.key];

            const itemTotal =
                quantity * prices[product.key];

            const item =
                document.createElement("div");

            item.className =
                "order-overview-item";

            item.innerHTML = `
                <div class="order-overview-item-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                </div>

                <div class="order-overview-item-info">
                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.size} × ${quantity}
                    </span>
                </div>

                <div class="order-overview-item-price">
                    ₦${itemTotal.toLocaleString("en-NG")}
                </div>
            `;

            overviewItems.appendChild(item);
        });
    }
}

        /* Highlight selected products */
        Object.keys(quantities).forEach((product) => {
            const card = document.querySelector(
                `.order-product[data-product="${product}"]`
            );

            if (!card) return;

            card.classList.toggle(
                "is-selected",
                quantities[product] > 0
            );
        });
    }


    /* ---------------------------------------------------------
       QUANTITY BUTTONS
       --------------------------------------------------------- */

    orderApp.addEventListener("click", function (event) {

        const button = event.target.closest(".quantity-btn");

        if (!button) return;

        const product = button.dataset.product;
        const action = button.dataset.action;

        if (!product || !quantities.hasOwnProperty(product)) {
            return;
        }

        if (action === "increase") {
            quantities[product]++;
        }

        if (action === "decrease") {
            quantities[product] = Math.max(
                0,
                quantities[product] - 1
            );
        }

        updateOrder();
    });


    /* ---------------------------------------------------------
       CONTINUE TO DELIVERY
       --------------------------------------------------------- */

    if (continueButton) {
        continueButton.addEventListener("click", function () {

            const totalItems =
                quantities["50cl"] +
                quantities["75cl"] +
                quantities["19l"];

            if (totalItems === 0) return;

            console.log("MENCC order:", {
                products: { ...quantities },
                items: totalItems
            });

            /*
             * Delivery step will be connected here next.
             */
        });
    }


    /* Initial state */
    updateOrder();

})();
/* =========================================================
   MENCC ORDER SYSTEM — STEP 1 → STEP 2
   DELIVERY NAVIGATION
   ========================================================= */

(function () {

    const orderApp = document.getElementById("orderApp");

    if (!orderApp) return;


    const step1 = orderApp.querySelector(
        '.order-step[data-step="1"]'
    );

    const step2 = orderApp.querySelector(
        '.order-step[data-step="2"]'
    );


    const continueToDelivery =
        document.getElementById("continueToDelivery");

    const backToProducts =
        document.getElementById("backToProducts");

    const continueToCustomer =
        document.getElementById("continueToCustomer");


    const deliveryOptions =
        orderApp.querySelectorAll(".delivery-option");

    const selectedDeliveryType =
        document.getElementById("selectedDeliveryType");

    const deliveryArea =
        document.getElementById("deliveryArea");
   

const overviewDelivery =
    document.getElementById("overviewDeliveryType");

const overviewLocation =
    document.getElementById("overviewDeliveryLocation");

    const deliveryAddress =
        document.getElementById("deliveryAddress");


    let selectedType = "";
    const step3 =
    document.getElementById("step3");

const backToDelivery =
    document.getElementById("backToDelivery");

const continueToReview =
    document.getElementById("continueToReview");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerEmail =
    document.getElementById("customerEmail");

    /* ---------------------------------------------------------
       SHOW STEP 2
       --------------------------------------------------------- */

    function showDeliveryStep() {

        if (!step1 || !step2) return;

                document
            .querySelectorAll(".order-progress-step")
            .forEach((step) => {
                step.classList.remove("active");
            });

        const deliveryProgress =
            document.querySelector(
                '.order-progress-step[data-progress-step="2"]'
            );

        if (deliveryProgress) {
            deliveryProgress.classList.add("active");
        }
        step1.hidden = true;
        step1.classList.remove("active");

        step2.hidden = false;
        step2.classList.add("active");

        step2.scrollTop = 0;

    }


    /* ---------------------------------------------------------
       RETURN TO STEP 1
       --------------------------------------------------------- */

    function showProductStep() {

        if (!step1 || !step2) return;

        step2.hidden = true;
        step2.classList.remove("active");

        step1.hidden = false;
        step1.classList.add("active");

    }


    /* ---------------------------------------------------------
       CHECK DELIVERY FORM
       --------------------------------------------------------- */

    function validateDelivery() {

        const hasType = selectedType !== "";

        const hasArea =
            deliveryArea &&
            deliveryArea.value.trim() !== "";

        const hasAddress =
            deliveryAddress &&
            deliveryAddress.value.trim() !== "";

        return hasType && hasArea && hasAddress;

    }


    /* ---------------------------------------------------------
       UPDATE CONTINUE BUTTON
       --------------------------------------------------------- */

    function updateDeliveryButton() {

        if (!continueToCustomer) return;

        continueToCustomer.disabled =
            !validateDelivery();

    }


    /* ---------------------------------------------------------
       CONTINUE TO DELIVERY
       --------------------------------------------------------- */

    if (continueToDelivery) {

        continueToDelivery.addEventListener(
            "click",
            function () {

                showDeliveryStep();

            }
        );

    }


    /* ---------------------------------------------------------
       DELIVERY TYPE SELECTION
       --------------------------------------------------------- */

    deliveryOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                deliveryOptions.forEach(
                    function (item) {
                        item.classList.remove("is-selected");
                    }
                );

                option.classList.add("is-selected");

                selectedType =
                    option.dataset.deliveryType || "";

                const label =
                    option.querySelector(
                        ".delivery-option-content strong"
                    );

                if (
                    selectedDeliveryType &&
                    label
                ) {
                    selectedDeliveryType.textContent =
                        label.textContent;
                if (overviewDelivery) {
    overviewDelivery.textContent =
        label.textContent;
}
                }

                updateDeliveryButton();

            }
        );

    });


    /* ---------------------------------------------------------
       WATCH ADDRESS FIELDS
       --------------------------------------------------------- */

    if (deliveryArea) {

        deliveryArea.addEventListener(
            "input",
            updateDeliveryButton
        );

    }


    if (deliveryAddress) {

        deliveryAddress.addEventListener(
            "input",
            updateDeliveryButton
        );

    }
    if (deliveryArea) {

    deliveryArea.addEventListener(
        "input",
        function () {

            if (overviewLocation) {
                overviewLocation.textContent =
                    deliveryArea.value.trim() ||
                    "Not selected";
            }

        }
    );

}


    /* ---------------------------------------------------------
       BACK TO PRODUCTS
       --------------------------------------------------------- */

    if (backToProducts) {

        backToProducts.addEventListener(
            "click",
            function () {

                showProductStep();

            }
        );

    }


    /* ---------------------------------------------------------
       CONTINUE TO CUSTOMER
       --------------------------------------------------------- */

    if (continueToCustomer) {

    continueToCustomer.addEventListener(
        "click",
        function () {

            if (!validateDelivery()) {
                return;
            }

            if (step2) {
                step2.hidden = true;
                step2.classList.remove("active");
            }

            if (step3) {
                step3.hidden = false;
                step3.classList.add("active");
                step3.scrollTop = 0;
            }

            document
                .querySelectorAll(".order-progress-step")
                .forEach(function (step) {
                    step.classList.remove("active");
                });

            const detailsProgress =
                document.querySelector(
                    '.order-progress-step[data-progress-step="3"]'
                );

            if (detailsProgress) {
                detailsProgress.classList.add("active");
            }

        }
    );

}

    updateDeliveryButton();
/* ---------------------------------------------------------
   BACK TO DETAILS
   --------------------------------------------------------- */

if (backToDelivery) {

    backToDelivery.addEventListener(
        "click",
        function () {

            if (step3) {
                step3.hidden = true;
                step3.classList.remove("active");
            }

            if (step2) {
                step2.hidden = false;
                step2.classList.add("active");
            }

            document
                .querySelectorAll(".order-progress-step")
                .forEach(function (step) {
                    step.classList.remove("active");
                });

            const deliveryProgress =
                document.querySelector(
                    '.order-progress-step[data-progress-step="2"]'
                );

            if (deliveryProgress) {
                deliveryProgress.classList.add("active");
            }

        }
    );

}

})();

/* =========================================================
   MENCC CHECKOUT — STEP 3 → STEP 4 → CONFIRMATION
   SINGLE CONSOLIDATED SYSTEM
   ========================================================= */

(function () {

    const step3 =
        document.getElementById("step3");

    const step4 =
        document.getElementById("step4");

    const continueToReview =
        document.getElementById("continueToReview");

    const backToDetails =
        document.getElementById("backToDetails");

    const placeOrderButton =
        document.getElementById("placeOrderButton");

    const backToReview =
        document.getElementById("backToReview");

    /* CUSTOMER */

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const customerEmail =
        document.getElementById("customerEmail");

    /* DELIVERY */

    const deliveryArea =
        document.getElementById("deliveryArea");

    const deliveryAddress =
        document.getElementById("deliveryAddress");

    const deliveryNotes =
        document.getElementById("deliveryNotes");

    const selectedDeliveryType =
        document.getElementById("selectedDeliveryType");

    /* REVIEW */

    const reviewProducts =
        document.getElementById("reviewProducts");

    const reviewDeliveryType =
        document.getElementById("reviewDeliveryType");

    const reviewDeliveryArea =
        document.getElementById("reviewDeliveryArea");

    const reviewDeliveryAddress =
        document.getElementById("reviewDeliveryAddress");

    const reviewDeliveryNotes =
        document.getElementById("reviewDeliveryNotes");

    const reviewCustomerName =
        document.getElementById("reviewCustomerName");

    const reviewCustomerPhone =
        document.getElementById("reviewCustomerPhone");

    const reviewCustomerEmail =
        document.getElementById("reviewCustomerEmail");

    const reviewTotal =
        document.getElementById("reviewTotal");

    /* CONFIRMATION */

    const orderConfirmation =
        document.getElementById("orderConfirmation");

    const confirmationOrderNumber =
        document.getElementById("confirmationOrderNumber");

    const confirmationTotal =
        document.getElementById("confirmationTotal");

    const whatsappButton =
        document.getElementById("whatsappButton");


    /* =========================================================
       PRODUCTS
       ========================================================= */

    const products = [

        {
            key: "50cl",
            name: "MENCC 50cl",
            size: "50CL",
            image: "assets/08-50cl-cinematic-hero.jpg"
        },

        {
            key: "75cl",
            name: "MENCC 75cl",
            size: "75CL",
            image: "assets/09-75cl-cinematic-hero.jpg"
        },

        {
            key: "19l",
            name: "MENCC 19L",
            size: "19L",
            image: "assets/07-19l-home-space.jpg"
        }

    ];


    /* =========================================================
       PROGRESS
       ========================================================= */

    function setProgress(number) {

        document
            .querySelectorAll(".order-progress-step")
            .forEach(function (step) {

                step.classList.remove("active");

            });


        const progress =
            document.querySelector(
                `.order-progress-step[data-progress-step="${number}"]`
            );


        if (progress) {

            progress.classList.add("active");

        }

    }


    /* =========================================================
       CALCULATE TOTAL
       ========================================================= */

    function getOrderTotal() {

        const order =
            window.MENCCOrder;

        if (!order) return 0;


        return Object.keys(order.quantities)
            .reduce(function (sum, key) {

                return sum +
                    (
                        order.quantities[key] *
                        order.prices[key]
                    );

            }, 0);

    }


    /* =========================================================
       BUILD REVIEW
       ========================================================= */

    function updateReview() {

        const order =
            window.MENCCOrder;

        if (!order) return;


        const selectedProducts =
            products.filter(function (product) {

                return (
                    order.quantities[product.key] > 0
                );

            });


        /* PRODUCTS */

        if (reviewProducts) {

            if (selectedProducts.length === 0) {

                reviewProducts.innerHTML = `
                    <div class="order-overview-empty">
                        No products selected.
                    </div>
                `;

            } else {

                reviewProducts.innerHTML =
                    selectedProducts
                        .map(function (product) {

                            const quantity =
                                order.quantities[
                                    product.key
                                ];

                            const itemTotal =
                                quantity *
                                order.prices[
                                    product.key
                                ];


                            return `
                                <div class="review-product-row">

                                    <div class="review-product-image">

                                        <img
                                            src="${product.image}"
                                            alt="${product.name}"
                                        >

                                    </div>


                                    <div class="review-product-info">

                                        <strong>
                                            ${product.name}
                                        </strong>

                                        <span>
                                            ${product.size} × ${quantity}
                                        </span>

                                    </div>


                                    <strong class="review-product-price">

                                        ₦${itemTotal.toLocaleString("en-NG")}

                                    </strong>

                                </div>
                            `;

                        })
                        .join("");

            }

        }


        /* TOTAL */

        const total =
            getOrderTotal();


        if (reviewTotal) {

            reviewTotal.textContent =
                `₦${total.toLocaleString("en-NG")}`;

        }


        /* DELIVERY */

        if (reviewDeliveryType) {

            reviewDeliveryType.textContent =
                selectedDeliveryType?.textContent.trim() ||
                "Not selected";

        }


        if (reviewDeliveryArea) {

            reviewDeliveryArea.textContent =
                deliveryArea?.value.trim() ||
                "Not selected";

        }


        if (reviewDeliveryAddress) {

            reviewDeliveryAddress.textContent =
                deliveryAddress?.value.trim() ||
                "Not selected";

        }


        if (reviewDeliveryNotes) {

            reviewDeliveryNotes.textContent =
                deliveryNotes?.value.trim() ||
                "None";

        }


        /* CUSTOMER */

        if (reviewCustomerName) {

            reviewCustomerName.textContent =
                customerName?.value.trim() ||
                "Not provided";

        }


        if (reviewCustomerPhone) {

            reviewCustomerPhone.textContent =
                customerPhone?.value.trim() ||
                "Not provided";

        }


        if (reviewCustomerEmail) {

            reviewCustomerEmail.textContent =
                customerEmail?.value.trim() ||
                "Not provided";

        }

    }


    /* =========================================================
       STEP 3 → STEP 4
       ========================================================= */

    if (continueToReview) {

        continueToReview.addEventListener(
            "click",
            function () {

                const name =
                    customerName?.value.trim();

                const phone =
                    customerPhone?.value.trim();


                if (!name || !phone) {

                    alert(
                        "Please enter your full name and phone number."
                    );

                    return;

                }


                updateReview();


                /* HIDE STEP 3 */

                if (step3) {

                    step3.hidden = true;

                    step3.classList.remove(
                        "active"
                    );

                }


                /* SHOW STEP 4 */

                if (step4) {

                    step4.hidden = false;

                    step4.classList.add(
                        "active"
                    );

                    step4.scrollTop = 0;

                }


                setProgress(4);

            }
        );

    }


    /* =========================================================
       STEP 4 → STEP 3
       ========================================================= */

    if (backToDetails) {

        backToDetails.addEventListener(
            "click",
            function () {

                if (step4) {

                    step4.hidden = true;

                    step4.classList.remove(
                        "active"
                    );

                }


                if (step3) {

                    step3.hidden = false;

                    step3.classList.add(
                        "active"
                    );

                    step3.scrollTop = 0;

                }


                setProgress(3);

            }
        );

    }


    /* =========================================================
       GENERATE ORDER NUMBER
       ========================================================= */

    function generateOrderNumber() {

        const randomNumber =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return `#MENCC-${randomNumber}`;

    }


    /* =========================================================
       SHOW CONFIRMATION
       ========================================================= */

    function showConfirmation(
    backendOrder
) {

    const order =
        window.MENCCOrder;


    if (!order) return;


    if (!backendOrder) {

        alert(
            "Order confirmation details could not be found."
        );

        return;

    }


    updateReview();


    /* =============================================
       REAL ORDER NUMBER FROM POSTGRESQL
    ============================================= */

    const orderNumber =
        backendOrder.orderNumber;


    /* =============================================
       BACKEND TOTAL

       The database stores money in kobo.
       Convert kobo to naira.
    ============================================= */

    const total =

        Number(
            backendOrder.totalKobo
        ) / 100;


    /* =============================================
       DISPLAY REAL ORDER NUMBER
    ============================================= */

    if (confirmationOrderNumber) {

        confirmationOrderNumber.textContent =
            orderNumber;

    }


    /* =============================================
       DISPLAY REAL TOTAL
    ============================================= */

    if (confirmationTotal) {

        confirmationTotal.textContent =

            `₦${total.toLocaleString(
                "en-NG"
            )}`;

    }


    /* =============================================
       HIDE REVIEW
    ============================================= */

    document
        .querySelectorAll(

            "#step4 > .order-step-header, #step4 > .review-layout, #step4 > .review-actions"

        )
        .forEach(function (element) {

            element.hidden =
                true;

        });


    /* =============================================
       SHOW CONFIRMATION
    ============================================= */

    if (orderConfirmation) {

        orderConfirmation.hidden =
            false;


        orderConfirmation.scrollTop =
            0;

    }

}


    /* =========================================================
       PLACE ORDER
       ========================================================= */

if (placeOrderButton) {

    placeOrderButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const order =
                window.MENCCOrder;


            if (!order) {

                alert(
                    "Your order could not be found. Please try again."
                );

                return;

            }


            /* =================================================
               BUILD ORDER ITEMS
            ================================================= */

            const items =
                products
                    .filter(function (product) {

                        return (
                            order.quantities[
                                product.key
                            ] > 0
                        );

                    })
                    .map(function (product) {

                        return {

                            slug:
                                product.key,

                            quantity:
                                order.quantities[
                                    product.key
                                ]

                        };

                    });


            if (items.length === 0) {

                alert(
                    "Please select at least one product."
                );

                return;

            }


            /* =================================================
               GET DELIVERY TYPE

               The backend requires:
               home
               office
               business
               event
            ================================================= */

            const selectedDeliveryOption =
                document.querySelector(
                    ".delivery-option.is-selected"
                );


            const deliveryType =
                selectedDeliveryOption?.dataset
                    .deliveryType ||
                "";


            if (!deliveryType) {

                alert(
                    "Please select a delivery type."
                );

                return;

            }


            /* =================================================
               BUILD REQUEST DATA
            ================================================= */

            const orderData = {

                customer: {

                    fullName:
                        customerName?.value.trim() ||
                        "",

                    phone:
                        customerPhone?.value.trim() ||
                        "",

                    email:
                        customerEmail?.value.trim() ||
                        ""

                },


                delivery: {

                    type:
                        deliveryType,

                    area:
                        deliveryArea?.value.trim() ||
                        "",

                    city:
                        "",

                    address:
                        deliveryAddress?.value.trim() ||
                        "",

                    notes:
                        deliveryNotes?.value.trim() ||
                        ""

                },


                items:
                    items

            };


            /* =================================================
               PREVENT DOUBLE CLICKS
            ================================================= */

            const originalText =
                placeOrderButton.textContent;


            placeOrderButton.disabled =
                true;


            placeOrderButton.textContent =
                "Creating Order...";


            try {
/* =============================================
   SEND ORDER DIRECTLY TO WHATSAPP
============================================= */

placeOrderButton.textContent =
    "Opening WhatsApp...";


/* PRODUCTS */

const selectedProducts =
    products.filter(function (product) {

        return (
            order.quantities[product.key] > 0
        );

    });


const productLines =
    selectedProducts
        .map(function (product) {

            const quantity =
                order.quantities[product.key];

            const itemTotal =
                quantity *
                order.prices[product.key];

            return `• ${product.name} × ${quantity} — ₦${itemTotal.toLocaleString("en-NG")}`;

        })
        .join("\n");


/* TOTAL */

const total =
    getOrderTotal();


/* CUSTOMER DETAILS */

const name =
    customerName?.value.trim() ||
    "Not provided";


const phone =
    customerPhone?.value.trim() ||
    "Not provided";


const email =
    customerEmail?.value.trim() ||
    "Not provided";


/* DELIVERY DETAILS */

const area =
    deliveryArea?.value.trim() ||
    "Not specified";


const address =
    deliveryAddress?.value.trim() ||
    "Not specified";


const notes =
    deliveryNotes?.value.trim() ||
    "None";


/* WHATSAPP MESSAGE */

const message =

`Hello MENCC! 👋

🛒 NEW ORDER

📦 ORDER DETAILS
${productLines}

💰 TOTAL
₦${total.toLocaleString("en-NG")}

🚚 DELIVERY DETAILS
Type: ${deliveryType}
Area: ${area}
Address: ${address}
Notes: ${notes}

👤 CUSTOMER DETAILS
Name: ${name}
Phone: ${phone}
Email: ${email}

Please confirm my order.

Thank you!`;


/* MENCC WHATSAPP NUMBER */

const whatsappNumber =
    "2349077428155";


/* OPEN WHATSAPP */

const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


window.location.href =
    whatsappURL;


            } catch (error) {

                console.error(
                    "MENCC order error:",
                    error
                );


                alert(

                    error.message ||

                    "Something went wrong while creating your order. Please try again."

                );


            } finally {

                placeOrderButton.disabled =
                    false;


                placeOrderButton.textContent =
                    originalText;

            }

        }
    );

}


    /* =========================================================
       BACK TO REVIEW
       ========================================================= */

    if (backToReview) {

        backToReview.addEventListener(
            "click",
            function () {

                if (orderConfirmation) {

                    orderConfirmation.hidden = true;

                }


                document
                    .querySelectorAll(
                        "#step4 > .order-step-header, #step4 > .review-layout, #step4 > .review-actions"
                    )
                    .forEach(function (element) {

                        element.hidden = false;

                    });


                setProgress(4);

            }
        );

    }

})();