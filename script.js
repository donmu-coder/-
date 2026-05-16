const mainDishes = [
  "辣椒炒肉",
  "葱油梭子蟹",
  "干烧梭子蟹",
  "水煮鱼头",
  "辣椒炒虾",
  "糯米笋炒肉",
  "胡萝卜炒肉",
  "香煎鲫鱼",
  "清蒸肉",
  "粉蒸肉",
  "土豆片炒肉",
  "可乐鸡翅",
  "爆炒腰花",
  "辣炒猪肝",
  "辣炒黄牛肉",
  "辣炒猪头肉",
  "辣炒肥肠",
  "辣炒黄辣丁",
  "红烧筒骨",
  "红烧肉",
  "红烧排骨",
  "黄豆烧鸡爪",
  "腐竹烧肉",
  "毛豆炒肉",
  "红烧猪蹄",
  "苦瓜炒肉",
  "茭白炒肉",
  "蒜蓉对虾"
];

const sideDishes = [
  "干锅包菜",
  "虎皮青椒",
  "冬瓜虾米汤",
  "清炒空心菜",
  "酸辣土豆丝",
  "油渣芋芳羹",
  "萝卜排骨汤",
  "清炒冬瓜",
  "清炒南瓜",
  "清炒西兰花",
  "凉拌皮蛋",
  "西红柿鸡蛋汤",
  "西红柿炒鸡蛋"
];

const dishes = mainDishes.map((meat, index) => ({
  name: `套餐 ${index + 1}`,
  mark: String(index + 1),
  meat,
  vegetableA: sideDishes[index % sideDishes.length],
  vegetableB: sideDishes[(index + 5) % sideDishes.length]
}));

const grid = document.querySelector("#dishGrid");
const startButton = document.querySelector("#startButton");
const resultText = document.querySelector("#resultText");
const statusText = document.querySelector("#statusText");
const statusDot = document.querySelector(".status-dot");

let activeIndex = 0;
let running = false;
let timer = null;

function renderDishes() {
  grid.innerHTML = dishes.map((dish, index) => `
    <article class="dish-card ${index === activeIndex ? "active" : ""}" data-index="${index}">
      <div class="dish-mark" aria-hidden="true">${dish.mark}</div>
      <h2>${dish.name}</h2>
      <ul class="menu-lines" aria-label="${dish.name}菜单">
        <li><span>荤</span>${dish.meat}</li>
        <li><span>素</span>${dish.vegetableA}</li>
        <li><span>素</span>${dish.vegetableB}</li>
      </ul>
    </article>
  `).join("");
}

function setActive(index, winner = false) {
  activeIndex = index;
  document.querySelectorAll(".dish-card").forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeIndex);
    card.classList.toggle("winner", winner && cardIndex === activeIndex);
  });
}

function pickTarget() {
  return Math.floor(Math.random() * dishes.length);
}

function buildSteps(targetIndex) {
  const minRounds = 2;
  const current = activeIndex;
  const distance = (targetIndex - current + dishes.length) % dishes.length;
  const total = minRounds * dishes.length + distance;
  const steps = [];

  for (let step = 0; step <= total; step += 1) {
    const progress = step / total;
    const eased = progress * progress * progress;
    const delay = 36 + eased * 270;
    steps.push({
      index: (current + step) % dishes.length,
      delay
    });
  }

  return steps;
}

function resultLabel(dish) {
  return `${dish.meat} + ${dish.vegetableA} + ${dish.vegetableB}`;
}

function runLottery() {
  if (running) return;

  running = true;
  startButton.disabled = true;
  statusText.textContent = "抽奖中";
  statusDot.classList.add("running");
  resultText.textContent = "正在加速";

  const target = pickTarget();
  const steps = buildSteps(target);
  let pointer = 0;

  function tick() {
    const step = steps[pointer];
    const isLast = pointer === steps.length - 1;

    setActive(step.index, isLast);
    resultText.textContent = isLast ? resultLabel(dishes[step.index]) : "正在跳动";

    if (isLast) {
      running = false;
      startButton.disabled = false;
      statusText.textContent = "结果已出";
      statusDot.classList.remove("running");
      return;
    }

    pointer += 1;
    timer = window.setTimeout(tick, step.delay);
  }

  window.clearTimeout(timer);
  tick();
}

startButton.addEventListener("click", runLottery);

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".dish-card");
  if (!card || running) return;

  setActive(Number(card.dataset.index));
  resultText.textContent = resultLabel(dishes[activeIndex]);
  statusText.textContent = "手动预览";
});

renderDishes();
