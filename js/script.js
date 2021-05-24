function shaderInit() {
  const frag = `
  precision highp float;
  
  varying vec2 v_texcoord;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform sampler2D displacement;
  
  vec4 rgb(float r, float g, float b) {
    return vec4(r / 255.0, g / 255.0, b / 255.0, 1.0);
  }
  
  vec4 makeColor(vec2 uv, vec4 tl, vec4 tr, vec4 bl, vec4 br) {
    float size = 0.1;
    float speed = 0.05;
  
    vec2 movement = vec2(u_time * speed);
  
    vec2 point = fract(
      uv * size + movement
    );
  
    vec4 dispColor = texture2D(
      displacement, 
      point
    );
  
    float dispX = mix(-0.5, 0.5, dispColor.r);
    float dispY = mix(-0.5, 0.5, dispColor.r);
  
    return mix(
      mix(bl, br, uv.x + dispX),
      mix(tl, tr, uv.x - dispX),
      uv.y + dispY
    );
  }
  
  void main(){
    vec2 uv = v_texcoord;
  
    vec4 color = makeColor(
      uv, 
      rgb(226.0, 221.0, 215.0),
      rgb(199.0, 189.0, 179.0),
      rgb(219.0, 213.0, 201.0),
      rgb(218.0, 218.0, 252.0)
    );
  
    gl_FragColor = color;
  }
  `;

  const canvas = document.querySelector("canvas");
  const sandbox = new GlslCanvas(canvas);

  sandbox.setUniform("displacement", "../img/displacement1.jpeg");
  sandbox.load(frag);
}

function hoverImageInit() {
  const cursorCopy = document.querySelector("div.featured__case__content h2");
  const cursorCopyResults = Splitting({
    target: cursorCopy,
    by: "lines",
  });

  const cursorCopyInfo = document.querySelectorAll(
    "div.featured__case__info p"
  );

  const cursorImage = document.querySelector(
    "div.featured__case__img figure img"
  );
  const cursor = document.querySelector("div.featured__case__img__hover");

  let currentX = 0;
  let currentY = 0;
  let aimX = 0;
  let aimY = 0;
  let speed = 0.1;

  const animateCursor = function (e) {
    currentX += (aimX - currentX) * speed;
    currentY += (aimY - currentY) * speed;

    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";

    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  cursorImage.addEventListener("mouseover", function () {
    cursor.classList.add("show");
    const cursorImageTl = new gsap.timeline({
      defaults: {
        duration: 1,
        ease: "SlowMo.ease.config(0.7, 0.7, false)",
      },
    });

    const cursorOverlay = document.querySelector("div.featured__case__overlay");

    cursorImageTl
      .to(cursorImage, { scale: 1.125, delay: -1 }, 0)
      .to(cursorOverlay, { opacity: 0.6 }, 1)
      .to(
        cursorCopyInfo,
        { y: "0%", opacity: 1, delay: 0.2, stagger: 0.125 },
        1
      )
      .to(
        cursorCopyResults[0].words,
        { opacity: 1, y: "0%", delay: 0.2, stagger: 0.075 },
        1
      );

    cursorImage.addEventListener("mousemove", function (e) {
      aimX = e.pageX;
      aimY = e.pageY;
    });
  });

  cursorImage.addEventListener("mouseout", function () {
    cursor.classList.remove("show");

    const cursorImageTl = new gsap.timeline({
      defaults: {
        duration: 1,
        ease: "SlowMo.ease.config(0.7, 0.7, false)",
      },
    });

    const cursorCopy = document.querySelector("div.featured__case__content h2");
    const cursorOverlay = document.querySelector("div.featured__case__overlay");

    cursorImageTl
      .to(cursorImage, { scale: 1, delay: -1 }, 0)
      .to(cursorOverlay, { opacity: 0 }, 1)
      .to(
        cursorCopyInfo,
        { y: "-300%", opacity: 0, delay: 0.2, stagger: 0.125 },
        1
      )
      .to(
        cursorCopyResults[0].words,
        { opacity: 0, y: "-100%", delay: 0.2, stagger: 0.075 },
        1
      )
      .set(cursorCopyInfo, { y: "300%", opacity: 0 })
      .set(cursorCopyResults[0].words, { opacity: 0, y: "100%" });
  });
}

function capabilitiesReveal() {
  const items = document.querySelectorAll("div.capabilities__wrapper > *");

  const tl = new gsap.timeline({
    scrollTrigger: {
      trigger: "div.capabilities__inner",
      start: "top center",
    },
  });

  tl.fromTo(
    items,
    { y: "50%", opacity: 0 },
    { y: "0%", opacity: 1, stagger: 0.075 }
  );
}

function featuredImageReveal() {
  const image = document.querySelector("div.featured__case__img figure img");
  const headline = document.querySelector(
    "section.featured div.featured__headline"
  );

  const tl = new gsap.timeline({
    scrollTrigger: {
      trigger: headline,
      start: "center bottom",
    },
  });

  tl.to(image, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 3,
    delay: 1,
    ease: "SlowMo.ease.config(0.7, 0.7, false)",
  });
}

function runInit() {
  // SELECTORS
  const bodyTag = document.querySelector("body");
  const navToggle = document.querySelector("#nav-toggle");
  const aboutToggle = document.querySelector("#about-toggle");
  const navSection = document.querySelector("section.nav");
  const aboutSection = document.querySelector("section.about");
  const navToggleText = navToggle.querySelector("p");
  const aboutToggleText = aboutToggle.querySelector("p");
  const dimm = document.querySelector("div.dimmed");

  // FUNCTIONS
  const heroCopySwitch = function () {
    const heroCopyHolder = document.querySelector("span.flexible");
    const heroTl = new gsap.timeline({
      repeat: -1,
      ease: Power4.easeOut,
    });

    heroTl
      .set(heroCopyHolder, { opacity: 0, y: "24px" })
      .to(heroCopyHolder, { opacity: 1, y: "0px", duration: 1 })
      .to(heroCopyHolder, { opacity: 0, duration: 1, delay: 2.5 })
      .set(heroCopyHolder, {
        y: "24px",
        text: "lorem ipsum dolor sit amet vedibum lol.",
      })
      .to(heroCopyHolder, { opacity: 1, y: "0px", duration: 1 })
      .to(heroCopyHolder, { opacity: 0, duration: 1, delay: 2.5 })
      .set(heroCopyHolder, {
        y: "24px",
        text: "some other mighty powerful text.",
      })
      .to(heroCopyHolder, { opacity: 1, y: "0px", duration: 1 })
      .to(heroCopyHolder, { opacity: 0, duration: 1, delay: 2.5 });
  };

  const heroImageSwitch = function () {
    const imgs = gsap.utils.toArray("div.home-content__img img");
    const next = 4.5; // time to change
    const fade = 1.5; // fade time

    //only for the first
    gsap.set(imgs[0], { autoAlpha: 1 });

    // ====================
    function crossfade() {
      const action = gsap
        .timeline()
        .to(imgs[0], { autoAlpha: 0, duration: fade })
        .to(imgs[1], { autoAlpha: 1, duration: fade }, 0);

      imgs.push(imgs.shift());
      // start endless run
      gsap.delayedCall(next, crossfade);
    }

    // start the crossfade after next = 4.5 sec
    gsap.delayedCall(0, crossfade);
  };

  const openNav = function (e) {
    const navHeadline = navSection.querySelector("h4");
    const portfolioLinks = navSection.querySelectorAll("figure");

    function removeClasses() {
      navSection.classList.remove("active");
      aboutSection.classList.remove("active");
      navToggle.classList.remove("active");
      aboutToggle.classList.remove("active");
      bodyTag.classList.remove("body-locked");
    }

    function addClasses() {
      navSection.classList.add("active");
      aboutSection.classList.add("active");
      navToggle.classList.add("active");
      aboutToggle.classList.add("active");
      bodyTag.classList.add("body-locked");
    }

    const navigationTl = new gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power4.easeOut",
      },
    });

    if (
      navSection.classList.contains("active") &&
      aboutSection.classList.contains("active")
    ) {
      navToggleText.innerText = "Index";
      aboutToggleText.innerText = "About";

      navigationTl
        .to(
          portfolioLinks,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          0
        )
        .to(navHeadline, { y: "101%", onComplete: removeClasses }, 0)
        .to(dimm, { opacity: 0 });
    } else if (
      !navSection.classList.contains("active") &&
      aboutSection.classList.contains("active")
    ) {
      navSection.classList.add("active");
      navToggle.classList.add("active");
      navToggleText.innerText = "Close";
      aboutToggleText.innerText = "About";

      navigationTl.to(navHeadline, { y: "0%", delay: 0.5 }, 0).to(
        portfolioLinks,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          stagger: 0.25,
          delay: 0.25,
        },
        1
      );
    } else if (
      !navSection.classList.contains("active") &&
      !aboutSection.classList.contains("active")
    ) {
      addClasses();
      navToggleText.innerText = "Close";
      aboutToggleText.innerText = "About";

      navigationTl
        .to(navHeadline, { y: "0%", delay: 0.25 }, 0)
        .to(
          portfolioLinks,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            y: "0%",
            opacity: 1,
            stagger: 0.5,
          },
          1
        )
        .to(dimm, { opacity: 0.8 }, 1);
    }
  };

  const openAbout = function (e) {
    const aboutContainer = document.querySelectorAll(
      "div.about__container p, div.about__container a"
    );
    const aboutPortrait = document.querySelector("div.intro-portrait figure");

    function removeClasses() {
      aboutSection.classList.remove("active");
      aboutToggle.classList.remove("active");
      bodyTag.classList.remove("body-locked");
    }

    const aboutTl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power4.easeOut",
      },
    });
    if (
      aboutSection.classList.contains("active") &&
      navSection.classList.contains("active")
    ) {
      navSection.classList.remove("active");
      navToggle.classList.remove("active");
      bodyTag.classList.remove("body-locked");
      aboutToggleText.innerText = "About";
      navToggleText.innerText = "Index";

      aboutTl
        .set(
          aboutPortrait,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          0
        )
        .set(aboutContainer, { opacity: 0, y: "48px" }, 0)
        .to(
          dimm,
          {
            opacity: "0.8",
            duration: 0.5,
            delay: 1,
          },
          0
        )
        .to(
          aboutContainer,
          { opacity: 1, y: "0px", stagger: 0.25, duration: 1 },
          0
        )
        .to(
          aboutPortrait,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          },
          1
        );
    } else if (!aboutSection.classList.contains("active")) {
      aboutSection.classList.add("active");
      aboutToggle.classList.add("active");
      bodyTag.classList.add("body-locked");

      aboutToggleText.innerText = "Close";
      navToggleText.innerText = "Index";

      aboutTl
        .set(
          aboutPortrait,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          0
        )
        .set(aboutContainer, { opacity: 0, y: "48px" }, 0)
        .to(
          aboutContainer,
          {
            opacity: 1,
            y: "0px",
            stagger: 0.25,
            duration: 1,
            delay: 0.5,
          },
          0
        )
        .to(
          aboutPortrait,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          },
          1
        )
        .to(
          dimm,
          {
            opacity: "0.8",
            duration: 1,
          },
          1
        );
    } else if (aboutSection.classList.contains("active")) {
      aboutToggleText.innerText = "About";
      navToggleText.innerText = "Index";

      aboutTl
        .to(
          aboutContainer,
          {
            opacity: 0,
            y: "48px",
            duration: 0.5,
            stagger: 0.0175,
          },
          0
        )
        .to(
          aboutPortrait,
          {
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            duration: 0.5,
            onComplete: removeClasses,
          },
          0
        )
        .to(dimm, { opacity: 0, duration: 0.5 }, 1)
        .set(
          dimm,
          {
            opacity: 0,
          },
          2
        )
        .set(dimm, { opacity: 0 }, 2);
    }
  };

  const footerReveal = function () {
    const footer = document.querySelector("footer");
    const footerContent = footer.querySelector("div.footer__inner");

    const tl = new gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "bottom bottom",
        end: "bottom top+=33.333%",
        scrub: true,
      },
    });

    tl.fromTo(footerContent, { y: "50%" }, { y: "0%" });
  };

  const logoLargeScroll = function () {
    const logo = document.querySelector("div.home-logo");

    const logoLargeTl = new gsap.timeline({
      scrollTrigger: {
        trigger: ".home-hero",
        start: "top top",
        scrub: true,
      },
    });

    logoLargeTl.to(logo, { yPercent: 125 });
  };

  const logoSmallScroll = function () {
    const logo = document.querySelector("div.mini-logo");

    const logoSmallTl = new gsap.timeline({
      defaults: {
        ease: "power4.easeOut",
      },
      scrollTrigger: {
        trigger: "#hero",
        start: "center top",
        toggleActions: "play none none reverse",
      },
    });

    logoSmallTl.to(logo, { y: 0 });
  };

  const caseHeroImgScroll = function () {
    const caseHeroImg = document.querySelector(
      "div.case-hero__right figure img"
    );

    const caseHeroImgTl = new gsap.timeline({
      defaults: {
        ease: "power4.easeOut",
      },
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        toggleActions: "play none none reverse",
        scrub: true,
      },
    });

    caseHeroImgTl.to(caseHeroImg, { yPercent: 25, scale: 1.05 });
  };

  const revealCaseImages = function () {
    let revealContainers = document.querySelectorAll(".reveal");

    revealContainers.forEach((container) => {
      let image = container.querySelector("img");
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          toggleActions: "restart none none reset",
        },
      });

      tl.set(container, { autoAlpha: 1 });
      tl.from(container, 1.5, {
        xPercent: -100,
        ease: Power4.out,
      });
      tl.from(image, 1.5, {
        xPercent: 100,
        scale: 1.25,
        delay: -1.5,
        ease: Power4.out,
      });
    });
  };

  const clientsReveal = function () {
    const items = document.querySelectorAll(
      "div.clients__left__copy p, section.clients div.clients__right__grid img"
    );

    const tl = new gsap.timeline({
      scrollTrigger: {
        trigger: "div.clients__headline",
        start: "top center",
      },
    });

    tl.from(items, { opacity: 0, y: "100%", stagger: 0.075 });
  };

  // RUN FUNCTIONS
  heroCopySwitch();
  heroImageSwitch();
  footerReveal();
  logoLargeScroll();
  logoSmallScroll();
  caseHeroImgScroll();
  revealCaseImages();
  featuredImageReveal();
  capabilitiesReveal();
  clientsReveal();

  // EVENTLISTENER
  navToggle.addEventListener("click", openNav);
  aboutToggle.addEventListener("click", openAbout);
}

runInit();

// BARBA PAGE TRANSITIONS
barba.hooks.before(() => {
  document.querySelector("html").classList.add("is-transitioning");
});

barba.hooks.after(() => {
  document.querySelector("html").classList.remove("is-transitioning");
  window.scrollTo(0, 0);
});

barba.init({
  transitions: [
    {
      name: "default-transition",
      async leave({ current }) {
        let done = this.async();
        const swipe = document.querySelectorAll("div.swipe");

        const leaveTl = new gsap.timeline({
          defaults: {
            ease: "SlowMo.ease.config(0.7, 0.7, false)",
          },
        });

        leaveTl
          .fromTo(swipe, 0.75, { x: "-100%" }, { x: "0%", stagger: -0.175 })
          .fromTo(
            current.container,
            1,
            { opacity: 1 },
            { opacity: 0, onComplete: done }
          );

        return leaveTl;
      },
      async enter({ next }) {
        let done = this.async();
        const swipe = document.querySelectorAll("div.swipe");

        const enterTl = new gsap.timeline({
          defaults: {
            ease: "SlowMo.ease.config(0.3, 0.7, false)",
          },
        });

        enterTl
          .fromTo(
            swipe,
            0.75,
            { x: "0%" },
            {
              x: "100%",
              stagger: 0.15,
              onComplete: runInit,
              done,
            }
          )
          .fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });

        return enterTl;
      },
    },
    {
      name: "index-transition",
      to: "home",
      async once() {
        let done = this.async();

        const navToggle = document.querySelector("#nav-toggle");
        const aboutToggle = document.querySelector("#about-toggle");
        const heroContentBox = document.querySelector(
          "section.home-hero div.home-content"
        );
        const heroContentCopy = document.querySelector(
          "section.home-hero div.home-content__copy"
        );
        const heroContentImg = document.querySelector(
          "section.home-hero div.home-content__img img"
        );

        const beforeOnceTl = new gsap.timeline({
          defaults: {
            duration: 1,
            ease: "Expo.easeOut",
          },
        });

        if (window.matchMedia("(max-width: 1024px)").matches) {
          // FIRST STEP
          // TODO: change first tween in timeline with:
          // .to('.box', {scale: 1.2})
        } else {
          beforeOnceTl
            .set(navToggle, { left: -48 }, 0)
            .set(aboutToggle, { left: -96 }, 0)
            .set(
              heroContentImg,
              { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
              0
            )
            .set(heroContentBox, { yPercent: -35 }, 0)
            .set(heroContentCopy, { yPercent: 100, opacity: 0 }, 0)
            .to(heroContentBox, { yPercent: 0, duration: 2.4 }, 1)
            .to(
              heroContentCopy,
              { yPercent: 0, opacity: 1, duration: 2, delay: 0.4 },
              1
            )
            .to(
              heroContentImg,
              {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 2,
                delay: 0.4,
              },
              1
            )
            .to(navToggle, { left: 0 }, 2)
            .to(aboutToggle, { left: 48, onComplete: done }, 2);
        }
      },
    },
  ],
  views: [
    {
      namespace: "home",
      beforeEnter() {
        hoverImageInit();
        shaderInit();
      },
    },
    {
      namespace: "case",
      afterEnter() {
        console.log("LOGO SCROLL FUNCTION STARTED");
      },
    },
  ],
});
