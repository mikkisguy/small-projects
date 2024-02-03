import "./style.css";
import mikkisGuyHead from "./images/mikkisguy-head.png";
import ritualImage from "./images/ritual-image.jpeg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
 <button id="shrinkButton">Shrink</button>
  <div>
    <img src="${ritualImage}" id="ritual-image" />
    <img src="${mikkisGuyHead}" id="mikkisguy-head" />
  </div>
`;

function shrinkImage(elementId: string) {
  const element = document.getElementById(elementId)!;
  let size = 200; // initial size in pixels
  const centerX = 130;
  const centerY = 150;

  function animate() {
    size -= 3; // reduce size by 1 pixel
    element.style.width = size + "px";
    element.style.height = size + "px";

    // Calculate the new position of the center point
    const newCenterX = size / 2;
    const newCenterY = size / 2;

    // Adjust the position to keep the center point constant
    element.style.left = centerX - newCenterX + "px";
    element.style.top = centerY - newCenterY + "px";

    // Add twitching and warping animations
    const rotation = Math.sin(Date.now() / 100) * 5; // rotate slightly based on time
    const scale = 1 + Math.sin(Date.now() / 200) * 0.1; // scale up and down based on time
    const skewX = Math.sin(Date.now() / 150) * 5; // skew horizontally based on time
    const skewY = Math.cos(Date.now() / 150) * 5; // skew vertically based on time

    element.style.transform = `rotate(${rotation}deg) scale(${scale}) skewX(${skewX}deg) skewY(${skewY}deg)`;

    if (size > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

document.getElementById("shrinkButton")!.addEventListener("click", () => {
  shrinkImage("mikkisguy-head");
});

