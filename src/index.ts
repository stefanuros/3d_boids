import { Main } from './Main';

let usePlanes = true;
let main = new Main(usePlanes);

var switchButton = document.createElement("button");
switchButton.style.top = "40px";
switchButton.style.right = "10px";
switchButton.textContent = "Switch Model to Spheres";
switchButton.style.width = "100px";
switchButton.style.height = "50px";

// button.setAttribute = ("id", "but");
switchButton.style.position = "absolute";
switchButton.style.color = "black";

document.body.appendChild(switchButton);

switchButton.addEventListener("click", () => {
  switchButton.textContent = "Switch Model to " + (usePlanes ? "Planes" : "Spheres");
  main.destroy();
  usePlanes = !usePlanes;
  main = new Main(usePlanes);
});

var resetButton = document.createElement("button");
resetButton.style.top = "10px";
resetButton.style.right = "10px";
resetButton.textContent = "Reset";
resetButton.style.width = "100px";
resetButton.style.height = "20px";

// button.setAttribute = ("id", "but");
resetButton.style.position = "absolute";
resetButton.style.color = "black";

document.body.appendChild(resetButton);

resetButton.addEventListener("click", () => {
  main.destroy();
  main = new Main(usePlanes);
});
