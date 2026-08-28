// Carousel needs at least two slides!
const carouselWrappers = document.getElementsByClassName("carousel-wrapper");
for (let i = 0; i < carouselWrappers.length; i++) {
    const carouselWrapper = carouselWrappers[i];
    const container = carouselWrapper.querySelector(".carousel-container");

    carouselWrapper.dataset.numberOfSlides = container.children.length;
    carouselWrapper.dataset.currentSlide = 0;

    let newHTML = container.children[container.children.length - 1].outerHTML;
    newHTML += container.innerHTML;
    newHTML += container.children[0].outerHTML;
    container.innerHTML = newHTML;
    createCarouselSelectorButtons(carouselWrapper);

    selectSlide(carouselWrapper);

    carouselWrapper.querySelector(".carousel-right-button").addEventListener("click", event => {
        changeSlideNumber(carouselWrapper, 1);
        selectSlide(carouselWrapper);
    });
    carouselWrapper.querySelector(".carousel-left-button").addEventListener("click", event => {
        changeSlideNumber(carouselWrapper, -1);
        selectSlide(carouselWrapper);
    });
}

function changeSlideNumber(carouselWrapper, amount) {
    carouselWrapper.dataset.currentSlide = parseInt(carouselWrapper.dataset.currentSlide) + amount;
    if (carouselWrapper.dataset.currentSlide < 0) {
        carouselWrapper.dataset.currentSlide = carouselWrapper.dataset.numberOfSlides - 1;
    }
    carouselWrapper.dataset.currentSlide = carouselWrapper.dataset.currentSlide % carouselWrapper.dataset.numberOfSlides;
}

function getNextSlideTimed(carouselWrapper) {
    carouselWrapper.querySelector(".carousel-right-button").click();
}

function updateCarouselSelectors(carouselWrapper, slideNumber) {
    let selectorButtonContainer = carouselWrapper.querySelector(".carousel-item-selector-container");
    let carouselContainer = carouselWrapper.querySelector(".carousel-container");
    for (let i = 0; i < selectorButtonContainer.children.length; i++) {
        let selectorButton = selectorButtonContainer.children[i];
        let carousel = carouselContainer.children[i+1];
        if (i == slideNumber) {
            selectorButton.classList.add("selected");
            carousel.classList.add("selected");
        } else {
            selectorButton.classList.remove("selected");
            carousel.classList.remove("selected");
        }
    }
}

function createCarouselSelectorButtons(carouselWrapper) {
    let carouselContainer = carouselWrapper.querySelector(".carousel-container");
    let selectorContainer = carouselWrapper.querySelector(".carousel-item-selector-container");
    for (let i = 0; i < carouselContainer.children.length - 2; i++) {
        const newButton = document.createElement("div");

        if (selectorContainer.classList.contains("preview")) {
            newButton.classList.add("carousel-item-selector-button-preview");
            if (carouselContainer.children[i+1].querySelector("img") != null) {
                newButton.innerHTML = carouselContainer.children[i+1].querySelector("img").outerHTML;
            }
        } else {
            newButton.classList.add("carousel-item-selector-button");
        }

        newButton.addEventListener("click", event => {
            selectSlide(carouselWrapper, i);
        });
        selectorContainer.appendChild(newButton);
    }
}

function selectSlide(carouselWrapper, slideNumber = carouselWrapper.dataset.currentSlide) {
    carouselWrapper.dataset.currentSlide = slideNumber;
    let carouselContainer = carouselWrapper.querySelector(".carousel-container");
    let scrollLength = carouselContainer.scrollWidth / carouselContainer.children.length;
    carouselContainer.scrollLeft = (scrollLength);
    carouselContainer.scrollLeft += (scrollLength) * (slideNumber);
    resetTimer(carouselWrapper);
    updateCarouselSelectors(carouselWrapper, slideNumber);
}

function updateCarouselTimer(carouselWrapper) {
    const lastStarted = carouselWrapper.dataset.lastViewStarted;
    const currentTime = performance.now();

    if (lastStarted) {
        const passedTime = currentTime - lastStarted;
        carouselWrapper.dataset.totalViewTime = parseFloat(carouselWrapper.dataset.totalViewTime) + passedTime;
    }
    carouselWrapper.dataset.lastViewStarted = currentTime;
}

let visibleCarouselWrappers = new Set();
let previouslyVisibleCarouselWrappers = null;
let mouseOverCarouselWrappers = new Set();

const observerOptions = {
    root: null,
    rootMargin: "2px",
    threshold: 0
};
const carouselObserver = new IntersectionObserver(
    intersectionCallback,
    observerOptions,
);

function intersectionCallback(entries) {
    entries.forEach((entry) => {
        const carouselWrapper = entry.target;

        if (entry.isIntersecting) {
            carouselWrapper.dataset.lastViewStarted = entry.time;
            visibleCarouselWrappers.add(carouselWrapper);
        } else {
            carouselWrapper.dataset.lastViewStarted = 0;
            visibleCarouselWrappers.delete(carouselWrapper);
        }
    });
}

for (let i = 0; i < carouselWrappers.length; i++) {
    carouselWrappers[i].dataset.totalViewTime = 0;
    carouselWrappers[i].dataset.lastViewStarted = 0;
    carouselObserver.observe(carouselWrappers[i]);

    carouselWrappers[i].addEventListener("mouseover", (event) => {
        handleMouseOver(carouselWrappers[i]);
    });
    carouselWrappers[i].addEventListener("mouseleave", (event) => {
        handleMouseLeave(carouselWrappers[i]);
    });
};

function handleVisibilityChange() {
    if (document.hidden) {
        if (!previouslyVisibleCarouselWrappers) {
            previouslyVisibleCarouselWrappers = visibleCarouselWrappers;
            visibleCarouselWrappers = new Set();
            previouslyVisibleCarouselWrappers.forEach((carouselWrapper) => {
                updateCarouselTimer(carouselWrapper);
                carouselWrapper.dataset.lastViewStarted = 0;
            });
        }
    } else {
        if (previouslyVisibleCarouselWrappers) {
            visibleCarouselWrappers = previouslyVisibleCarouselWrappers;
            previouslyVisibleCarouselWrappers = null;
            visibleCarouselWrappers.forEach((carouselWrapper) => {
                resetTimer(carouselWrapper);
            });
        }
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange);

function handleRefreshInterval() {
    visibleCarouselWrappers.forEach((carouselWrapper) => {
        if ( carouselWrapper.dataset.totalViewTime >= 5000 ) {
            getNextSlideTimed(carouselWrapper);
            carouselWrapper.dataset.totalViewTime = 0;
            carouselWrapper.dataset.lastViewStarted = performance.now();
        }
        updateCarouselTimer(carouselWrapper);
    });
}
const refreshIntervalID = setInterval(handleRefreshInterval, 1000);

function resetTimer(carouselWrapper) {
    carouselWrapper.dataset.totalViewTime = 0;
    carouselWrapper.dataset.lastViewStarted = performance.now();
}

function handleMouseOver(carouselWrapper) {
    mouseOverCarouselWrappers.add(carouselWrapper);
    visibleCarouselWrappers.delete(carouselWrapper);
}

function handleMouseLeave(carouselWrapper) {
    visibleCarouselWrappers.add(carouselWrapper);
    mouseOverCarouselWrappers.delete(carouselWrapper);
    resetTimer(carouselWrapper);
}