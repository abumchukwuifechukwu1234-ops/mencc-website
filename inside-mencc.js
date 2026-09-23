/* ========================================
   INSIDE MENCC
   Cinematic Animation System
======================================== */

document.addEventListener("DOMContentLoaded", () => {



    /* =========================================================
       SHARED MENCC THEME
       Uses the exact same localStorage key as the homepage.
       ========================================================= */

    const themeToggle = document.querySelector(".inside-theme-toggle");
    const themeIcon = document.querySelector(".inside-theme-icon");
    const root = document.documentElement;

    const applyTheme = (theme, persist = true) => {
        const isDark = theme === "dark";

        if (isDark) {
            root.setAttribute("data-theme", "dark");
        } else {
            root.removeAttribute("data-theme");
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );
        }

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (persist) {
            localStorage.setItem("mencc-theme", isDark ? "dark" : "light");
        }
    };

    const savedTheme = localStorage.getItem("mencc-theme");
    applyTheme(savedTheme === "dark" ? "dark" : "light", false);

    themeToggle?.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        applyTheme(isDark ? "light" : "dark", true);
    });

    /* If the homepage is open in another tab, stay synchronized. */
    window.addEventListener("storage", (event) => {
        if (event.key !== "mencc-theme") return;
        applyTheme(event.newValue === "dark" ? "dark" : "light", false);
    });

    const videos = document.querySelectorAll("video");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /*
     * ======================================
     * 1. CINEMATIC MEDIA REVEALS
     * ======================================
     */

    const mediaElements = document.querySelectorAll(
        ".inside-hero-media video, " +
        ".inside-section-media video, " +
        ".inside-process-media video, " +
        ".inside-process-detail-media video, " +
        ".inside-production-video video, " +
        ".inside-quality-feature video, " +
        ".inside-quality-video video, " +
        ".inside-people-feature video, " +
        ".inside-people-story-media video, " +
        ".inside-distribution-feature video, " +
        ".inside-distribution-media video, " +
        ".inside-product-media video, " +
        ".inside-closing-media video"
    );


    mediaElements.forEach((media) => {

        media.classList.add("media-reveal");

        if (prefersReducedMotion) {
            media.classList.add("is-visible");
        }

    });


    if (!prefersReducedMotion && mediaElements.length) {

        const mediaObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        mediaElements.forEach((media) => {
            mediaObserver.observe(media);
        });

    }



    /*
     * ======================================
     * 2. VIDEO PLAYBACK
     * ======================================
     *
     * Videos play only while visible.
     *
     * Reduced-motion users do not receive
     * automatic video playback.
     */

    if (videos.length && !prefersReducedMotion) {

        const videoObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const video = entry.target;


                    if (entry.isIntersecting) {

                        video.play().catch(() => {});

                    } else {

                        video.pause();

                    }

                });

            },
            {
                threshold: 0.25,
                rootMargin: "0px"
            }
        );


        videos.forEach((video) => {
            videoObserver.observe(video);
        });


        /*
         * Pause all videos when the browser tab
         * is no longer visible.
         */

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {

                videos.forEach((video) => {
                    video.pause();
                });

            }

        });

    }



    /*
     * ======================================
     * 3. SCROLL REVEALS
     * ======================================
     *
     * Text elements gently appear as they
     * enter the viewport.
     */

    const revealElements = document.querySelectorAll(
        ".inside-eyebrow, " +
        ".inside-hero h1, " +
        ".inside-hero-description, " +
        ".inside-scroll-link, " +
        ".inside-section h2, " +
        ".inside-section-content > p:last-child, " +
        ".inside-process-intro h2, " +
        ".inside-process-intro > p:last-child, " +
        ".inside-process-detail-text h3, " +
        ".inside-production-heading h2, " +
        ".inside-quality-heading h2, " +
        ".inside-quality-heading > p:last-child, " +
        ".inside-quality-copy h3, " +
        ".inside-quality-copy > p:last-child, " +
        ".inside-people-heading h2, " +
        ".inside-people-heading > p:last-child, " +
        ".inside-people-story-text h3, " +
        ".inside-distribution-heading h2, " +
        ".inside-distribution-heading > p:last-child, " +
        ".inside-distribution-copy h3, " +
        ".inside-distribution-copy > p:last-child, " +
        ".inside-collection-heading h2, " +
        ".inside-collection-heading > p:last-child, " +
        ".inside-product h3, " +
        ".inside-product-info > p:not(.inside-eyebrow), " +
        ".inside-product-link, " +
        ".inside-closing-content h2, " +
        ".inside-closing-content > p:not(.inside-eyebrow), " +
        ".inside-closing-actions"
    );



    /*
     * Add the reveal class to every target.
     *
     * If the user has reduced motion enabled,
     * show everything immediately.
     */

    revealElements.forEach((element) => {

        element.classList.add("reveal");


        if (prefersReducedMotion) {

            element.classList.add("is-visible");

        }

    });



    /*
     * ======================================
     * 4. REVEAL OBSERVER
     * ======================================
     *
     * Normal users receive the smooth reveal.
     *
     * Reduced-motion users skip the observer,
     * but the rest of the page JavaScript
     * continues working.
     */

    if (!prefersReducedMotion && revealElements.length) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;


                    entry.target.classList.add("is-visible");


                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    }



    /*
     * ======================================
     * 5. CHAPTER NAVIGATION
     * ======================================
     */

    const chapterNav = document.querySelector(
        ".inside-chapter-nav"
    );


    const chapterLinks = document.querySelectorAll(
        ".inside-chapter-nav a"
    );


    const chapters = [

        document.querySelector("#mencc-story"),

        document.querySelector("#mencc-process"),

        document.querySelector("#mencc-production"),

        document.querySelector("#mencc-quality"),

        document.querySelector("#mencc-people"),

        document.querySelector("#mencc-distribution"),

        document.querySelector("#mencc-collection"),

        document.querySelector("#mencc-closing")

    ].filter(Boolean);



    /*
     * Only activate chapter navigation when
     * the navigation and all required sections
     * actually exist.
     */

    if (
        chapterNav &&
        chapterLinks.length &&
        chapters.length
    ) {


        /*
         * ==================================
         * SHOW NAVIGATION AFTER HERO
         * ==================================
         */

        const hero = document.querySelector(
            ".inside-hero"
        );


        if (hero) {

            const heroObserver = new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            chapterNav.classList.remove(
                                "is-visible"
                            );

                        } else {

                            chapterNav.classList.add(
                                "is-visible"
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


            heroObserver.observe(hero);

        }



        /*
         * ==================================
         * DETECT CURRENT CHAPTER
         * ==================================
         */

        const chapterObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;


                    const currentId =
                        entry.target.id;


                    chapterLinks.forEach((link) => {

                        link.classList.toggle(
                            "is-active",
                            link.getAttribute("href") ===
                                `#${currentId}`
                        );

                    });

                });

            },
            {
                threshold: 0.25,

                rootMargin:
                    "-20% 0px -55% 0px"
            }
        );


        chapters.forEach((chapter) => {

            chapterObserver.observe(chapter);

        });



        /*
         * ==================================
         * SMOOTH CHAPTER NAVIGATION
         * ==================================
         */

        chapterLinks.forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();


                    const targetId =
                        link.getAttribute("href");


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    target.scrollIntoView({

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth",

                        block: "start"

                    });

                }
            );

        });

    }

});