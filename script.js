const SUPABASE_FUNCTION_URL =
    "https://dtqktbobvomtpfkqfcck.supabase.co/functions/v1/dynamic-worker";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_6CtN-shAPtSOPBPffprcgw_tcAaI1ui";

const MENCC_WHATSAPP_NUMBER = "2349077428155";

window.addEventListener("DOMContentLoaded", () => {
    
    const body = document.body;
    const pageLoader = document.getElementById("pageLoader");
    const siteHeader = document.getElementById("siteHeader");
    const orderDrawer = document.getElementById("orderDrawer");
    const orderCloseButtons = document.querySelectorAll("[data-order-close]");
    const orderTriggers = document.querySelectorAll("[data-order-trigger]");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");
    const factoryVideo = document.querySelector(".factory-video-element");
    const videoToggle = document.querySelector(".video-toggle");
        /* =========================================================
   DARK MODE
========================================================= */

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

const applyTheme = (theme) => {
    if (theme === "dark") {
        root.setAttribute("data-theme", "dark");

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "aria-pressed",
                "true"
            );

            const icon = themeToggle.querySelector(".theme-icon");

            if (icon) {
                icon.textContent = "☀️";
            }
        }

        localStorage.setItem("mencc-theme", "dark");

    } else {
        root.removeAttribute("data-theme");

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "aria-pressed",
                "false"
            );

            const icon = themeToggle.querySelector(".theme-icon");

            if (icon) {
                icon.textContent = "🌙";
            }
        }

        localStorage.setItem("mencc-theme", "light");
    }
};

const savedTheme =
    localStorage.getItem("mencc-theme");

applyTheme(
    savedTheme === "dark"
        ? "dark"
        : "light"
);

themeToggle?.addEventListener(
    "click",
    () => {
        const isDark =
            root.getAttribute("data-theme") === "dark";

        applyTheme(
            isDark
                ? "light"
                : "dark"
        );
    }
);;

    const hideLoader = () => {
        if (!pageLoader) return;

        pageLoader.classList.add("is-hidden");

        window.setTimeout(() => {
            pageLoader.remove();
        }, 900);
    };

   if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        () => window.setTimeout(hideLoader, 450),
        { once: true }
    );
} else {
    window.setTimeout(hideLoader, 450);
}

// Absolute fallback so the loader can NEVER trap the user
window.setTimeout(hideLoader, 4000);
    /* =========================================================
       HEADER
    ========================================================= */

    const updateHeader = () => {
        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > 36
        );
    };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const openMobileMenu = () => {
        if (!mobileMenu) return;

        mobileMenu.classList.add("is-open");

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("menu-open");

        menuToggle?.setAttribute(
            "aria-expanded",
            "true"
        );
    };

    const closeMobileMenu = () => {
        if (!mobileMenu) return;

        mobileMenu.classList.remove("is-open");

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("menu-open");

        menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );
    };

    menuToggle?.addEventListener(
        "click",
        () => {

            if (
                mobileMenu?.classList.contains(
                    "is-open"
                )
            ) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        }
    );

    mobileLinks.forEach(
        (link) =>
            link.addEventListener(
                "click",
                closeMobileMenu
            )
    );


    /* =========================================================
       ORDER DRAWER
    ========================================================= */

    const openOrderDrawer = (
        selectedProductKey = null
    ) => {

        if (!orderDrawer) return;

        orderDrawer.classList.add("is-open");

        orderDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("order-open");

        document.documentElement.style.scrollBehavior =
            "auto";

        if (selectedProductKey) {

            window.setTimeout(() => {

                const card =
                    document.querySelector(
                        `.order-product[data-product="${selectedProductKey}"]`
                    );

                const button =
                    card?.querySelector(
                        '[data-action="increase"]'
                    );

                if (
                    button &&
                    window.MENCCOrder?.quantities?.[
                        selectedProductKey
                    ] === 0
                ) {
                    button.click();
                }

            }, 250);

        }

    };


    const closeOrderDrawer = () => {

        if (!orderDrawer) return;

        orderDrawer.classList.remove(
            "is-open"
        );

        orderDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "order-open"
        );

        document.documentElement.style.scrollBehavior =
            "smooth";
    };


    orderTriggers.forEach(
        (trigger) => {

            trigger.addEventListener(
                "click",
                () => {

                    const productKey =
                        trigger.dataset.productSelect ||
                        null;

                    closeMobileMenu();

                    openOrderDrawer(
                        productKey
                    );

                }
            );

        }
    );


    document
        .querySelectorAll(
            "[data-product-select]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                        openOrderDrawer(
                            button.dataset.productSelect ||
                            null
                        );

                    }
                );

            }
        );


    orderCloseButtons.forEach(
        (button) =>
            button.addEventListener(
                "click",
                closeOrderDrawer
            )
    );


    /* =========================================================
       ESCAPE KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeMobileMenu();

                closeOrderDrawer();

            }

        }
    );


    /* =========================================================
       SMOOTH ANCHOR NAVIGATION
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                targetId
                            );

                        if (!target) return;

                        event.preventDefault();

                        closeMobileMenu();

                        target.scrollIntoView(
                            {
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            }
                        );

                    }
                );

            }
        );


    /* =========================================================
       SCROLL REVEALS
    ========================================================= */

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.12
            }
        );


    document
        .querySelectorAll(
            ".reveal-up, .reveal-image"
        )
        .forEach(
            (element) =>
                revealObserver.observe(
                    element
                )
        );


    /* =========================================================
       PARALLAX
    ========================================================= */

    const parallaxObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        const media =
                            entry.target.querySelector(
                                ".hero-image, .source-media img, .distribution-media img, .collection-feature-image img"
                            );

                        if (!media) return;

                        if (
                            entry.isIntersecting
                        ) {

                            media.dataset.parallaxActive =
                                "true";

                        } else {

                            delete media.dataset
                                .parallaxActive;

                        }

                    }
                );

            },
            {
                threshold:
                    0
            }
        );


    document
        .querySelectorAll(
            ".hero, .source-section, .distribution-section, .collection-feature"
        )
        .forEach(
            (section) =>
                parallaxObserver.observe(
                    section
                )
        );


    let pointerX = 0;
    let pointerY = 0;
    let rafId = null;


  const animateParallax = () => {
    document
        .querySelectorAll('[data-parallax-active="true"]')
        .forEach((image) => {

            if (
                image.classList.contains("hero-image") ||
                image.closest(".source-media")
            ) {
                image.style.transform = "none";
                return;
            }

            image.style.transform =
                `scale(1.035) translate(${pointerX * 1.1}px, ${pointerY * 1.1}px)`;
        });

    rafId = null;
};


    window.addEventListener(
        "pointermove",
        (event) => {

            if (
                window.innerWidth < 900
            ) {
                return;
            }

            pointerX =
                (
                    event.clientX /
                    window.innerWidth
                    - 0.5
                ) * 2;

            pointerY =
                (
                    event.clientY /
                    window.innerHeight
                    - 0.5
                ) * 2;

            if (!rafId) {

                rafId =
                    requestAnimationFrame(
                        animateParallax
                    );

            }

        },
        {
            passive:
                true
        }
    );


    /* =========================================================
       FACTORY VIDEO
    ========================================================= */

    if (factoryVideo) {

        const playVideo = () => {

            factoryVideo
                .play()
                .catch(() => {});

        };

        const stopVideo = () => {

            factoryVideo.pause();

        };


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                playVideo();

                            } else {

                                stopVideo();

                            }

                        }
                    );

                },
                {
                    threshold:
                        0.25
                }
            );


        observer.observe(
            factoryVideo
        );


        videoToggle?.addEventListener(
            "click",
            () => {

                if (
                    factoryVideo.paused
                ) {

                    playVideo();

                    const label =
                        videoToggle.querySelector(
                            "span"
                        );

                    if (label) {
                        label.textContent =
                            "❚❚";
                    }

                    videoToggle.setAttribute(
                        "aria-label",
                        "Pause production video"
                    );

                } else {

                    stopVideo();

                    const label =
                        videoToggle.querySelector(
                            "span"
                        );

                    if (label) {
                        label.textContent =
                            "▶";
                    }

                    videoToggle.setAttribute(
                        "aria-label",
                        "Play production video"
                    );

                }

            }
        );

    }


    /* =========================================================
       ORDER SYSTEM
    ========================================================= */

    const orderApp =
        document.getElementById(
            "orderApp"
        );

    if (!orderApp) return;


    /* =========================================================
       ORDER STATE
    ========================================================= */

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


    const products = [

        {
            key:
                "50cl",

            name:
                "MENCC 50cl",

            size:
                "50CL",

            image:
                "assets/08-50cl-cinematic-hero.jpg"
        },

        {
            key:
                "75cl",

            name:
                "MENCC 75cl",

            size:
                "75CL",

            image:
                "assets/09-75cl-cinematic-hero.jpg"
        },

        {
            key:
                "19l",

            name:
                "MENCC 19L",

            size:
                "19L",

            image:
                "assets/07-19l-home-space.jpg"
        }

    ];


    window.MENCCOrder = {
        quantities,
        prices
    };


    /* =========================================================
       ORDER ELEMENTS
    ========================================================= */

    const itemCount =
        document.getElementById(
            "orderItemCount"
        );

    const subtotal =
        document.getElementById(
            "orderSubtotal"
        );

    const total =
        document.getElementById(
            "orderTotal"
        );

    const continueToDelivery =
        document.getElementById(
            "continueToDelivery"
        );

    const continueToCustomer =
        document.getElementById(
            "continueToCustomer"
        );

    const continueToReview =
        document.getElementById(
            "continueToReview"
        );

    const backToProducts =
        document.getElementById(
            "backToProducts"
        );

    const backToDelivery =
        document.getElementById(
            "backToDelivery"
        );

    const backToDetails =
        document.getElementById(
            "backToDetails"
        );

    const backToReview =
        document.getElementById(
            "backToReview"
        );

    const placeOrderButton =
        document.getElementById(
            "placeOrderButton"
        );


    const quantityElements = {

        "50cl":
            document.querySelector(
                '[data-quantity="50cl"]'
            ),

        "75cl":
            document.querySelector(
                '[data-quantity="75cl"]'
            ),

        "19l":
            document.querySelector(
                '[data-quantity="19l"]'
            )

    };


    /* =========================================================
       STEPS
    ========================================================= */

    const step1 =
        orderApp.querySelector(
            '.order-step[data-step="1"]'
        );

    const step2 =
        orderApp.querySelector(
            '.order-step[data-step="2"]'
        );

    const step3 =
        document.getElementById(
            "step3"
        );

    const step4 =
        document.getElementById(
            "step4"
        );


    /* =========================================================
       DELIVERY
    ========================================================= */

    const deliveryOptions =
        orderApp.querySelectorAll(
            ".delivery-option"
        );


    const selectedDeliveryType =
        document.getElementById(
            "selectedDeliveryType"
        );


    const deliveryArea =
        document.getElementById(
            "deliveryArea"
        );


    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        );


    const deliveryNotes =
        document.getElementById(
            "deliveryNotes"
        );


    /* =========================================================
       CUSTOMER
    ========================================================= */

    const customerName =
        document.getElementById(
            "customerName"
        );


    const customerPhone =
        document.getElementById(
            "customerPhone"
        );


    const customerEmail =
        document.getElementById(
            "customerEmail"
        );
        const reviewCustomerBirthday =
    document.getElementById(
        "reviewCustomerBirthday"
    );
       

    const customerBirthdayDay = document.getElementById("customerBirthdayDay");
const customerBirthdayMonth = document.getElementById("customerBirthdayMonth");


// Populate birthday days
if (customerBirthdayDay) {
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = day;
        customerBirthdayDay.appendChild(option);
    }
}


// Populate birthday months
if (customerBirthdayMonth) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    months.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = month;
        customerBirthdayMonth.appendChild(option);
    });
}
    /* =========================================================
       OVERVIEW
    ========================================================= */

    const orderOverviewItems =
        document.getElementById(
            "orderOverviewItems"
        );


    const overviewDeliveryType =
        document.getElementById(
            "overviewDeliveryType"
        );


    const overviewDeliveryLocation =
        document.getElementById(
            "overviewDeliveryLocation"
        );


    const overviewTotal =
        document.getElementById(
            "overviewTotal"
        );


    /* =========================================================
       REVIEW
    ========================================================= */

    const reviewProducts =
        document.getElementById(
            "reviewProducts"
        );


    const reviewDeliveryType =
        document.getElementById(
            "reviewDeliveryType"
        );


    const reviewDeliveryArea =
        document.getElementById(
            "reviewDeliveryArea"
        );


    const reviewDeliveryAddress =
        document.getElementById(
            "reviewDeliveryAddress"
        );


    const reviewDeliveryNotes =
        document.getElementById(
            "reviewDeliveryNotes"
        );


    const reviewCustomerName =
        document.getElementById(
            "reviewCustomerName"
        );


    const reviewCustomerPhone =
        document.getElementById(
            "reviewCustomerPhone"
        );


    const reviewCustomerEmail =
        document.getElementById(
            "reviewCustomerEmail"
        );


    const reviewTotal =
        document.getElementById(
            "reviewTotal"
        );


    /* =========================================================
       CONFIRMATION
    ========================================================= */

    /* CONFIRMATION */

const orderConfirmation =
    document.getElementById("orderConfirmation");

const confirmationOrderNumber =
    document.getElementById("confirmationOrderNumber");

const confirmationTotal =
    document.getElementById("confirmationTotal");

const whatsappButton =
    document.getElementById("whatsappButton");




    let selectedType = "";


    /* =========================================================
       LIVE ORDER · WATER DROP GAME
    ========================================================= */

    const catchGame =
        document.getElementById("orderCatchGame");

    const catchGameStage =
        document.getElementById("catchGameStage");

    const catchGameStart =
        document.getElementById("catchGameStart");

    const catchGameTimer =
        document.getElementById("catchGameTimer");

    const catchGameScore =
        document.getElementById("catchGameScore");

    const catchGameMessage =
        document.getElementById("catchGameMessage");

    const catchGameStatus =
        document.getElementById("catchGameStatus");

    const catchBottle =
        document.getElementById("catchBottle");

    const catchGameState = {
        running: false,
        finished: false,
        score: 0,
        timeLeft: 10,
        bottleX: 50,
        targetBottleX: 50,
        drops: [],
        lastTime: 0,
        spawnElapsed: 0,
        animationFrame: null,
        timerInterval: null,
        playedForCurrentOrder: false,
        stageWidth: 0,
        stageHeight: 0,
        bottleWidth: 42,
        bottleHeight: 74,
        pointerActive: false
    };

    const refreshCatchMetrics = () => {
        if (!catchGameStage) return;
        catchGameState.stageWidth = catchGameStage.clientWidth;
        catchGameState.stageHeight = catchGameStage.clientHeight;
    };

    const clearCatchDrops = () => {
        catchGameState.drops.forEach((drop) => drop.node.remove());
        catchGameState.drops.length = 0;
    };

    const renderCatchBottle = () => {
        if (!catchBottle) return;
        const x = Math.max(8, Math.min(92, catchGameState.bottleX));
        catchBottle.style.left = `${x}%`;
    };

    const updateCatchBottle = () => {
        if (!catchBottle) return;
        renderCatchBottle();
    };

    const setCatchGameMessage = (message) => {
        if (catchGameMessage) {
            catchGameMessage.textContent = message;
        }
    };

    const resetCatchGame = () => {
        if (!catchGameStage) return;

        if (catchGameState.animationFrame) {
            cancelAnimationFrame(catchGameState.animationFrame);
            catchGameState.animationFrame = null;
        }

        if (catchGameState.timerInterval) {
            clearInterval(catchGameState.timerInterval);
            catchGameState.timerInterval = null;
        }

        clearCatchDrops();
        refreshCatchMetrics();

        catchGameState.running = false;
        catchGameState.finished = false;
        catchGameState.score = 0;
        catchGameState.timeLeft = 10;
        catchGameState.bottleX = 50;
        catchGameState.targetBottleX = 50;
        catchGameState.lastTime = 0;
        catchGameState.spawnElapsed = 0;
        catchGameState.pointerActive = false;

        catchGameStage.classList.remove("is-playing", "is-finished");
        if (catchGameStart) {
            catchGameStart.disabled = false;
            catchGameStart.textContent = "START GAME →";
        }

        if (catchGameTimer) catchGameTimer.textContent = "10";
        if (catchGameScore) catchGameScore.textContent = "0 DROPLETS";
        if (catchGameStatus) catchGameStatus.textContent = "10 seconds";

        setCatchGameMessage(
            "Move the bottle and catch as many droplets as you can."
        );

        renderCatchBottle();
    };

    const finishCatchGame = () => {
        if (!catchGameState.running) return;

        catchGameState.running = false;
        catchGameState.finished = true;
        catchGameState.pointerActive = false;

        if (catchGameState.animationFrame) {
            cancelAnimationFrame(catchGameState.animationFrame);
            catchGameState.animationFrame = null;
        }

        if (catchGameState.timerInterval) {
            clearInterval(catchGameState.timerInterval);
            catchGameState.timerInterval = null;
        }

        clearCatchDrops();
        catchGameStage?.classList.remove("is-playing");
        catchGameStage?.classList.add("is-finished");

        const name = customerName?.value.trim() || "You";
        setCatchGameMessage(
            `${name} caught ${catchGameState.score} ${catchGameState.score === 1 ? "droplet" : "droplets"}!`
        );

        if (catchGameStatus) {
            catchGameStatus.textContent = "Try again when you place a new order";
        }

        if (catchGameTimer) catchGameTimer.textContent = "0";
        if (catchGameStart) catchGameStart.disabled = true;
    };

    const createCatchDrop = () => {
        if (!catchGameStage || !catchGameState.running) return;

        const node = document.createElement("span");
        node.className = "catch-drop";

        const width = catchGameState.stageWidth || catchGameStage.clientWidth;
        const x = 7 + Math.random() * Math.max(10, width - 14);
        const y = -14;

        node.style.left = `${x}px`;
        node.style.transform = `translate3d(0, ${y}px, 0)`;
        catchGameStage.appendChild(node);

        catchGameState.drops.push({
            node,
            x,
            y,
            speed: 165 + Math.random() * 95
        });
    };

    const catchDropHit = (drop) => {
        const stageWidth = catchGameState.stageWidth || catchGameStage?.clientWidth || 0;
        const stageHeight = catchGameState.stageHeight || catchGameStage?.clientHeight || 0;
        if (!stageWidth || !stageHeight) return false;

        const bottleCenter = (catchGameState.bottleX / 100) * stageWidth;
        const bottleLeft = bottleCenter - (catchGameState.bottleWidth / 2);
        const bottleRight = bottleCenter + (catchGameState.bottleWidth / 2);
        const bottleTop = stageHeight - 9 - catchGameState.bottleHeight;
        const bottleBottom = stageHeight - 9;

        const dropLeft = drop.x;
        const dropRight = drop.x + 8;
        const dropTop = drop.y;
        const dropBottom = drop.y + 11;

        return (
            dropRight >= bottleLeft &&
            dropLeft <= bottleRight &&
            dropBottom >= bottleTop &&
            dropTop <= bottleBottom
        );
    };

    const updateCatchGame = (timestamp) => {
        if (!catchGameState.running || !catchGameStage) return;

        if (!catchGameState.lastTime) {
            catchGameState.lastTime = timestamp;
        }

        const delta = Math.min(0.032, (timestamp - catchGameState.lastTime) / 1000);
        catchGameState.lastTime = timestamp;
        catchGameState.spawnElapsed += delta;

        // Smooth bottle movement without forcing layout recalculation on every pointer event.
        catchGameState.bottleX +=
            (catchGameState.targetBottleX - catchGameState.bottleX) * Math.min(1, delta * 24);
        renderCatchBottle();

        if (catchGameState.spawnElapsed >= 0.24) {
            catchGameState.spawnElapsed = 0;
            createCatchDrop();
        }

        const stageHeight = catchGameState.stageHeight || catchGameStage.clientHeight;

        for (let i = catchGameState.drops.length - 1; i >= 0; i -= 1) {
            const drop = catchGameState.drops[i];
            drop.y += drop.speed * delta;
            drop.node.style.transform = `translate3d(0, ${drop.y}px, 0)`;

            if (catchDropHit(drop)) {
                catchGameState.score += 1;
                if (catchGameScore) {
                    catchGameScore.textContent =
                        `${catchGameState.score} ${catchGameState.score === 1 ? "DROPLET" : "DROPLETS"}`;
                }
                drop.node.remove();
                catchGameState.drops.splice(i, 1);
                continue;
            }

            if (drop.y > stageHeight + 20) {
                drop.node.remove();
                catchGameState.drops.splice(i, 1);
            }
        }

        catchGameState.animationFrame = requestAnimationFrame(updateCatchGame);
    };

    const startCatchGame = () => {
        if (!catchGameStage || catchGameState.running) return;

        clearCatchDrops();
        refreshCatchMetrics();

        catchGameState.running = true;
        catchGameState.finished = false;
        catchGameState.score = 0;
        catchGameState.timeLeft = 10;
        catchGameState.lastTime = 0;
        catchGameState.spawnElapsed = 0;
        catchGameState.bottleX = 50;
        catchGameState.targetBottleX = 50;
        catchGameState.playedForCurrentOrder = true;
        catchGameState.pointerActive = false;

        catchGameStage.classList.remove("is-finished");
        catchGameStage.classList.add("is-playing");

        if (catchGameStart) catchGameStart.disabled = true;
        if (catchGameTimer) catchGameTimer.textContent = "10";
        if (catchGameScore) catchGameScore.textContent = "0 DROPLETS";
        if (catchGameStatus) catchGameStatus.textContent = "Catch them!";
        setCatchGameMessage("");

        renderCatchBottle();
        catchGameStage.focus({ preventScroll: true });

        catchGameState.timerInterval = setInterval(() => {
            if (!catchGameState.running) return;
            catchGameState.timeLeft -= 1;

            if (catchGameTimer) {
                catchGameTimer.textContent = String(Math.max(0, catchGameState.timeLeft));
            }

            if (catchGameState.timeLeft <= 0) {
                finishCatchGame();
            }
        }, 1000);

        catchGameState.animationFrame = requestAnimationFrame(updateCatchGame);
    };

    const moveCatchBottle = (clientX) => {
        if (!catchGameState.running || !catchGameStage) return;

        const rect = catchGameStage.getBoundingClientRect();
        const percentage = ((clientX - rect.left) / rect.width) * 100;
        catchGameState.targetBottleX = Math.max(8, Math.min(92, percentage));
    };

    catchGameStart?.addEventListener("click", startCatchGame);

    catchGameStage?.addEventListener("pointerdown", (event) => {
        if (!catchGameState.running) return;
        catchGameState.pointerActive = true;
        catchGameStage.setPointerCapture?.(event.pointerId);
        moveCatchBottle(event.clientX);
    });

    catchGameStage?.addEventListener("pointermove", (event) => {
        if (!catchGameState.running || !catchGameState.pointerActive) return;
        moveCatchBottle(event.clientX);
    });

    catchGameStage?.addEventListener("pointerup", (event) => {
        catchGameState.pointerActive = false;
        catchGameStage.releasePointerCapture?.(event.pointerId);
    });

    catchGameStage?.addEventListener("pointercancel", () => {
        catchGameState.pointerActive = false;
    });

    catchGameStage?.addEventListener("keydown", (event) => {
        if (!catchGameState.running) return;

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            catchGameState.targetBottleX += event.key === "ArrowLeft" ? -8 : 8;
            catchGameState.targetBottleX = Math.max(8, Math.min(92, catchGameState.targetBottleX));
        }
    });

    customerName?.addEventListener("input", () => {
        if (catchGameState.finished) {
            const name = customerName.value.trim() || "You";
            setCatchGameMessage(
                `${name} caught ${catchGameState.score} ${catchGameState.score === 1 ? "droplet" : "droplets"}!`
            );
        }
    });

    window.addEventListener("resize", () => {
        refreshCatchMetrics();
        renderCatchBottle();
    });

    if (catchGame) {
        resetCatchGame();
    }



    /* =========================================================
       HELPERS
    ========================================================= */

    const formatNaira = (
        amount
    ) => {

        return `₦${Number(
            amount
        ).toLocaleString(
            "en-NG"
        )}`;

    };


    const getOrderTotal = () => {

        return Object.keys(
            quantities
        ).reduce(
            (
                sum,
                key
            ) => {

                return (
                    sum +
                    quantities[key] *
                    prices[key]
                );

            },
            0
        );

    };


    const setProgress = (
        number
    ) => {

        document
            .querySelectorAll(
                ".order-progress-step"
            )
            .forEach(
                (step) => {

                    step.classList.toggle(
                        "active",
                        Number(
                            step.dataset
                                .progressStep
                        ) === number
                    );

                }
            );

    };


    const showStep = (
        stepToShow,
        number
    ) => {

        [
            step1,
            step2,
            step3,
            step4
        ].forEach(
            (step) => {

                if (!step) return;

                step.hidden =
                    step !==
                    stepToShow;

                step.classList.toggle(
                    "active",
                    step ===
                    stepToShow
                );

            }
        );


        setProgress(
            number
        );


        if (stepToShow) {

            stepToShow.scrollIntoView(
                {
                    block:
                        "nearest",

                    behavior:
                        "smooth"
                }
            );

        }

    };


    /* =========================================================
       UPDATE OVERVIEW
    ========================================================= */

    const updateOverview = () => {

        if (!orderOverviewItems)
            return;


        orderOverviewItems.innerHTML =
            "";


        const selectedProducts =
            products.filter(
                (product) =>
                    quantities[
                        product.key
                    ] > 0
            );


        if (
            !selectedProducts.length
        ) {

            orderOverviewItems.innerHTML =
                `
                <div class="order-overview-empty">
                    Select a MENCC product to build your order.
                </div>
                `;

        } else {

            selectedProducts.forEach(
                (product) => {

                    const quantity =
                        quantities[
                            product.key
                        ];


                    const itemTotal =
                        quantity *
                        prices[
                            product.key
                        ];


                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "order-overview-item";


                    row.innerHTML =
                        `
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
                            ${formatNaira(
                                itemTotal
                            )}
                        </div>
                        `;


                    orderOverviewItems.appendChild(
                        row
                    );

                }
            );

        }


        if (overviewTotal) {

            overviewTotal.textContent =
                formatNaira(
                    getOrderTotal()
                );

        }


        if (overviewDeliveryType) {

            overviewDeliveryType.textContent =
                selectedType
                    ? selectedType.replace(
                        /^./,
                        (char) =>
                            char.toUpperCase()
                    )
                    : "Not selected";

        }


        if (overviewDeliveryLocation) {

            overviewDeliveryLocation.textContent =
                deliveryArea?.value.trim() ||
                "Not selected";

        }

    };


    /* =========================================================
       UPDATE ORDER
    ========================================================= */

    const updateOrder = () => {

        const totalItems =
            Object.values(
                quantities
            ).reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            );


        Object.keys(
            quantityElements
        ).forEach(
            (key) => {

                if (
                    quantityElements[key]
                ) {

                    quantityElements[
                        key
                    ].textContent =
                        quantities[key];

                }


                document
                    .querySelector(
                        `.order-product[data-product="${key}"]`
                    )
                    ?.classList.toggle(
                        "is-selected",
                        quantities[key] > 0
                    );

            }
        );


        if (itemCount) {

            itemCount.textContent =
                totalItems;

        }


        if (subtotal) {

            subtotal.textContent =
                formatNaira(
                    getOrderTotal()
                );

        }


        if (total) {

            total.textContent =
                formatNaira(
                    getOrderTotal()
                );

        }


        if (continueToDelivery) {

            continueToDelivery.disabled =
                totalItems === 0;

        }


        updateOverview();

    };


    /* =========================================================
       QUANTITY BUTTONS
    ========================================================= */

    orderApp.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".quantity-btn"
                );


            if (!button)
                return;


            const product =
                button.dataset.product;


            const action =
                button.dataset.action;


            if (
                !product ||
                !Object.hasOwn(
                    quantities,
                    product
                )
            ) {
                return;
            }


            if (
                action ===
                "increase"
            ) {

                quantities[
                    product
                ] += 1;

            }


            if (
                action ===
                "decrease"
            ) {

                quantities[
                    product
                ] =
                    Math.max(
                        0,
                        quantities[
                            product
                        ] - 1
                    );

            }


            updateOrder();

        }
    );


    /* =========================================================
       STEP 1 → STEP 2
    ========================================================= */

    continueToDelivery?.addEventListener(
        "click",
        () => {

            if (
                Object.values(
                    quantities
                ).every(
                    (value) =>
                        value === 0
                )
            ) {
                return;
            }


            showStep(
                step2,
                2
            );

        }
    );


    backToProducts?.addEventListener(
        "click",
        () =>
            showStep(
                step1,
                1
            )
    );


    /* =========================================================
       DELIVERY SELECTION
    ========================================================= */

    deliveryOptions.forEach(
        (option) => {

            option.addEventListener(
                "click",
                () => {

                    deliveryOptions.forEach(
                        (item) =>
                            item.classList.remove(
                                "is-selected"
                            )
                    );


                    option.classList.add(
                        "is-selected"
                    );


                    selectedType =
                        option.dataset.deliveryType ||
                        "";


                    if (
                        selectedDeliveryType
                    ) {

                        selectedDeliveryType.textContent =
                            option
                                .querySelector(
                                    "strong"
                                )
                                ?.textContent
                                .trim() ||
                            "Select a delivery type";

                    }


                    updateDeliveryButton();

                    updateOverview();

                }
            );

        }
    );


    /* =========================================================
       DELIVERY VALIDATION
    ========================================================= */

    const validateDelivery =
        () => {

            return Boolean(
                selectedType &&
                deliveryArea?.value.trim() &&
                deliveryAddress?.value.trim()
            );

        };


    const updateDeliveryButton =
        () => {

            if (!continueToCustomer)
                return;


            continueToCustomer.disabled =
                !validateDelivery();

        };


    deliveryArea?.addEventListener(
        "input",
        () => {

            updateDeliveryButton();

            updateOverview();

        }
    );


    deliveryAddress?.addEventListener(
        "input",
        updateDeliveryButton
    );


    deliveryNotes?.addEventListener(
        "input",
        () => {}
    );


    /* =========================================================
       STEP 2 → STEP 3
    ========================================================= */

    continueToCustomer?.addEventListener(
        "click",
        () => {

            if (
                !validateDelivery()
            ) {
                return;
            }


            updateOverview();


            showStep(
                step3,
                3
            );

        }
    );


    backToDelivery?.addEventListener(
        "click",
        () =>
            showStep(
                step2,
                2
            )
    );


    /* =========================================================
       REVIEW
    ========================================================= */

    const updateReview = () => {

        const selectedProducts =
            products.filter(
                (product) =>
                    quantities[
                        product.key
                    ] > 0
            );


        if (reviewProducts) {

            reviewProducts.innerHTML =
                selectedProducts
                    .map(
                        (product) => {

                            const quantity =
                                quantities[
                                    product.key
                                ];


                            const itemTotal =
                                quantity *
                                prices[
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
                                    ${formatNaira(
                                        itemTotal
                                    )}
                                </strong>

                            </div>
                            `;

                        }
                    )
                    .join("");

        }


        if (reviewTotal) {

            reviewTotal.textContent =
                formatNaira(
                    getOrderTotal()
                );

        }


        if (reviewDeliveryType) {

            reviewDeliveryType.textContent =
                selectedType
                    ? selectedType.replace(
                        /^./,
                        (char) =>
                            char.toUpperCase()
                    )
                    : "Not selected";

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


        if (reviewCustomerName) {

            reviewCustomerName.textContent =
                customerName?.value.trim() ||
                "Not provided";

        }
        if (reviewCustomerBirthday) {

    const day =
        customerBirthdayDay?.value || "";

    const month =
        customerBirthdayMonth?.value || "";

    if (day && month) {

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        reviewCustomerBirthday.textContent =
            `${day} ${monthNames[Number(month) - 1]}`;

    } else {

        reviewCustomerBirthday.textContent =
            "Not provided";

    }

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

    };


    /* =========================================================
       STEP 3 → STEP 4
    ========================================================= */

    continueToReview?.addEventListener(
        "click",
        () => {

            const name = customerName?.value.trim() || "";
const phone = customerPhone?.value.trim() || "";
const birthdayDay = customerBirthdayDay?.value || "";
const birthdayMonth = customerBirthdayMonth?.value || "";

if (!name || !phone) {
    alert("Please enter your full name and phone number.");
    return;
}

if (!birthdayDay || !birthdayMonth) {
    alert("Please select your birthday.");
    return;
}

updateReview();
showStep(step4, 4);

        }
    );


    backToDetails?.addEventListener(
        "click",
        () =>
            showStep(
                step3,
                3
            )
    );


    /* =========================================================
       SHOW CONFIRMATION
    ========================================================= */

    const showConfirmation =
    (backendOrder) => {

        if (
            !backendOrder ||
            !window.MENCCOrder
        ) {

            alert(
                "Order confirmation details could not be found."
            );

            return;

        }


        if (confirmationOrderNumber) {

            confirmationOrderNumber.textContent =
                backendOrder.orderNumber ||
                "MENCC-ORDER";

        }


        const totalNaira =
            Number(
                backendOrder.totalKobo ||
                0
            ) / 100;


        if (confirmationTotal) {

            confirmationTotal.textContent =
                formatNaira(
                    totalNaira
                );

        }


        /* CLOSE CHECKOUT DRAWER */

        closeOrderDrawer();


        /* SHOW SEPARATE SUCCESS PAGE */

        if (orderConfirmation) {

            orderConfirmation.hidden =
                false;

            body.classList.add(
                "order-success-open"
            );

        }

    };


    /* =========================================================
       PLACE ORDER → SUPABASE
    ========================================================= */

    placeOrderButton?.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const items =
                products

                    .filter(
                        (product) =>
                            quantities[
                                product.key
                            ] > 0
                    )

                    .map(
                        (product) => ({
                            slug:
                                product.key,

                            quantity:
                                quantities[
                                    product.key
                                ]
                        })
                    );


            if (!items.length) {

                alert(
                    "Please select at least one product."
                );

                return;
            }


            if (!selectedType) {

                alert(
                    "Please select a delivery type."
                );

                return;
            }


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
            "",

        birthdayDay:
            Number(
                customerBirthdayDay?.value || 0
            ),

        birthdayMonth:
            Number(
                customerBirthdayMonth?.value || 0
            )

    },


                delivery: {

                    type:
                        selectedType,

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


                items

            };


            const originalText =
                placeOrderButton.textContent;


            placeOrderButton.disabled =
                true;


            placeOrderButton.textContent =
                "Creating Order...";


            try {

                const response =
                    await fetch(
                        SUPABASE_FUNCTION_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

                                "apikey":
                                    SUPABASE_PUBLISHABLE_KEY

                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )

                        }
                    );


                const responseText =
                    await response.text();


                let data;


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    throw new Error(
                        `Server returned an invalid response. Status: ${response.status}`
                    );

                }


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.error ||
                        data.message ||
                        `Unable to create order. Server status: ${response.status}`
                    );

                }


                window.MENCCOrder.backendOrder =
                    data;


                showConfirmation(
                    data
                );


            } catch (error) {

                console.error(
                    "MENCC order error:",
                    error
                );


                alert(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while creating your order. Please try again."
                );


            } finally {

                placeOrderButton.disabled =
                    false;


                placeOrderButton.textContent =
                    originalText;

            }

        }
    );


    /* =========================================================
       WHATSAPP
    ========================================================= */

    whatsappButton?.addEventListener(
        "click",
        () => {

            const backendOrder =
                window.MENCCOrder?.backendOrder;


            if (!backendOrder) {

                alert(
                    "Your order details could not be found. Please create your order again."
                );

                return;

            }


            const selectedProducts =
                products.filter(
                    (product) =>
                        quantities[
                            product.key
                        ] > 0
                );


            const productLines =
                selectedProducts

                    .map(
                        (product) =>
                            `• ${product.name} × ${quantities[product.key]}`
                    )

                    .join("\n");


            const totalNaira =
                Number(
                    backendOrder.totalKobo ||
                    0
                ) / 100;


            const deliveryLabel =
                selectedDeliveryType?.textContent.trim() ||
                selectedType ||
                "Not specified";


            const message =
`Hello MENCC,

I have created a new order through the MENCC website.

ORDER NUMBER: ${backendOrder.orderNumber}

PRODUCTS
${productLines}

TOTAL
${formatNaira(totalNaira)}

DELIVERY
Type: ${deliveryLabel}
Area: ${deliveryArea?.value.trim() || "Not specified"}
Address: ${deliveryAddress?.value.trim() || "Not specified"}
Notes: ${deliveryNotes?.value.trim() || "None"}

CUSTOMER
Name: ${customerName?.value.trim() || "Not provided"}
Phone: ${customerPhone?.value.trim() || "Not provided"}
Email: ${customerEmail?.value.trim() || "Not provided"}

Please confirm my order.

Thank you.`;


            const whatsappURL =
                `https://wa.me/${MENCC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    message
                )}`;


            window.location.assign(
                whatsappURL
            );

        }
    );


    /* =========================================================
       BACK TO REVIEW
    ========================================================= */

    backToReview?.addEventListener(
    "click",
    () => {

        if (orderConfirmation) {

            orderConfirmation.hidden =
                true;

        }


        body.classList.remove(
            "order-success-open"
        );


        openOrderDrawer();


        showStep(
            step4,
            4
        );

    }
);


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    updateDeliveryButton();

    updateOrder();

});