function dragElement(element, direction) {
  var md; // remember mouse down info
  const first = document.getElementById("left-pane");
  const second = document.getElementById("right-pane");

  element.onmousedown = onMouseDown;

  function onMouseDown(e) {
    md = {
      e,
      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop,
      firstWidth: first.offsetWidth,
      secondWidth: second.offsetWidth
    };
    document.onmousemove = onMouseMove;
    document.onmouseup = () => {
      document.onmousemove = document.onmouseup = null;
    };
  }

  function onMouseMove(e) {
    var delta = { x: e.clientX - md.e.clientX, y: e.clientY - md.e.clientY };

    if (direction === "H") {
      // Horizontal
      // prevent negative-sized elements
      delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);
      element.style.left = md.offsetLeft + delta.x + "px";
      first.style.width = md.firstWidth + delta.x + "px";
      second.style.width = md.secondWidth - delta.x + "px";
    }
  }
}

dragElement(document.getElementById("separator"), "H");

window.addEventListener("resize", function (event) {
  if (document.querySelector(".main-view").classList.contains("hide-nav")) {
    document.getElementById("right-pane").style.width = "100%";
  } else {
    document.getElementById("left-pane").style.width = "15%";
    document.getElementById("right-pane").style.width = "85%";
  }
});

function switchViewMenu() {
  const wrapper = document.querySelector(".main-view");
  wrapper.classList.toggle("hide-nav");
  if (wrapper.classList.contains("hide-nav")) {
    document.getElementById("right-pane").style.width = "100%";
  }
}

document
  .getElementById("separator")
  .addEventListener("dblclick", function (event) {
    switchViewMenu();
  });

