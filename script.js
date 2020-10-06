//Getting all the elements
let slide = document.querySelectorAll(".slide");
slide = Array.from(slide);
let slideSize = slide[0].offsetWidth;
let slides = document.querySelector(".slides");
let radio = document.querySelector(".radio");

//Sending all the DOM elements into the function
slider(slides, slide, radio);

//This function will be called when the script will be loaded

function slider(slides, slide, controls) {
  let index = 1,
    firstSlide = slide[0],
    lastSlide = slide[slide.length - 1],
    cloneFirst = firstSlide.cloneNode(true),
    cloneLast = lastSlide.cloneNode(true),
    slideLength = slide.length,
    posX1 = 0,
    posX2 = 0,
    positionInitial,
    positionFinal,
    threshold = 100,
    auto = true;

  //For creating the circular effect
  slides.appendChild(cloneFirst);
  slides.insertBefore(cloneLast, firstSlide);

  //changing the width of the slides element to the (no. of slide)*100%
  slides.style.width = `${slides.childElementCount * 100}%`;

  //setting eventListener on slides - onmousedown
  slides.onmousedown = dragStart;

  //adding touch eventListeners for making it interactive on touch devices
  slides.addEventListener("touchstart", dragStart);
  slides.addEventListener("touchend", dragEnd);
  slides.addEventListener("touchmove", dragAction);

  //This eventListener will be triggered after every transiton is finished.
  slides.addEventListener("transitionend", () => {
    checkIndex();
  });

  //EventListeners for click on the buttons, example of Event bubbling
  controls.addEventListener("click", (e) => {
    auto = false;
    //figuring out which element was clicked
    let radioId = e.target.id;
    radioId = radioId.split("-")[1] * 1;
    index = radioId;
    //This function shift the slide to the desired index
    shiftSlide(undefined, index);
  });

  function dragStart(e) {
    //Changing the cursor
    document.querySelector(".wrapper").style.cursor = "-webkit-grabbing";
    //Turn off auto rotation
    auto = false;

    e = e || window.event;
    e.preventDefault();

    positionInitial = slides.offsetLeft;

    if (e.type == "touchstart") {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }

    // console.log("dragStart", positionInitial, posX1);
  }

  function dragAction(e) {
    e = e || window.event;
    auto = false;
    if (e.type == "touchmove") {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    slides.style.left = slides.offsetLeft - posX2 + "px";
  }

  function dragEnd() {
    auto = false;
    document.querySelector(".wrapper").style.cursor = "-webkit-grab";

    positionFinal = slides.offsetLeft;
    if (positionFinal - positionInitial < -threshold) {
      shiftSlide(1, undefined);
    } else if (positionFinal - positionInitial > threshold) {
      shiftSlide(-1, undefined);
    } else {
      slides.style.left = positionInitial + "px";
    }

    // console.log("dragEnd", positionInitial, positionFinal);

    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, i) {
    slides.classList.add("sliding");
    if (dir === -1) {
      index--;
    } else if (dir === 1) {
      index++;
    }
    if (!i) i = index;
    slides.style.left = `-${i * 100}%`;
  }

  //This is where magic happens
  function checkIndex() {
    slides.classList.remove("sliding");

    if (index === 0) {
      slides.style.left = `-${slideLength * 100}%`;
      index = slideLength;
    } else if (index === slideLength + 1) {
      slides.style.left = `-${100}%`;
      index = 1;
    }

    removeActive();
    document.getElementById(`dot-${index}`).classList.add("dots--active");

    if (auto) {
      setTimeout(() => {
        shiftSlide(1, undefined);
      }, 10000);
    }
  }

  function removeActive() {
    document.getElementById("dot-1").classList.remove("dots--active");
    document.getElementById("dot-2").classList.remove("dots--active");
    document.getElementById("dot-3").classList.remove("dots--active");
    document.getElementById("dot-4").classList.remove("dots--active");
    document.getElementById("dot-5").classList.remove("dots--active");
  }

  setTimeout(() => {
    shiftSlide(1, undefined);
  }, 10000);
}
