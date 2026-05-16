const dishes = [
  { name: "家常一号", mark: "1", meat: "青椒炒肉丝", vegetable: "蒜蓉空心菜", soup: "番茄蛋花汤" },
  { name: "下饭二号", mark: "2", meat: "小炒黄牛肉", vegetable: "清炒西兰花", soup: "紫菜虾皮汤" },
  { name: "香辣三号", mark: "3", meat: "宫保鸡丁", vegetable: "醋溜土豆丝", soup: "冬瓜丸子汤" },
  { name: "清爽四号", mark: "4", meat: "木耳炒鸡蛋", vegetable: "蚝油生菜", soup: "丝瓜菌菇汤" },
  { name: "浓香五号", mark: "5", meat: "回锅肉", vegetable: "干煸四季豆", soup: "玉米排骨汤" },
  { name: "鲜嫩六号", mark: "6", meat: "葱爆羊肉", vegetable: "香菇油菜", soup: "萝卜牛肉汤" },
  { name: "酸甜七号", mark: "7", meat: "糖醋里脊", vegetable: "蒜香娃娃菜", soup: "海带豆腐汤" },
  { name: "川味八号", mark: "8", meat: "鱼香肉丝", vegetable: "炝炒包菜", soup: "酸辣汤" },
  { name: "轻盈九号", mark: "9", meat: "芹菜炒虾仁", vegetable: "荷塘小炒", soup: "山药鸡汤" },
  { name: "经典十号", mark: "10", meat: "番茄炒牛肉", vegetable: "清炒莴笋", soup: "裙带菜蛋汤" },
  { name: "暖胃十一号", mark: "11", meat: "土豆烧鸡块", vegetable: "蒜苗炒香干", soup: "白菜豆腐汤" },
  { name: "满足十二号", mark: "12", meat: "黑椒杏鲍菇牛柳", vegetable: "清炒油麦菜", soup: "莲藕花生汤" }
];

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
        <li><span>素</span>${dish.vegetable}</li>
        <li><span>汤</span>${dish.soup}</li>
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
  const minRounds = 3;
  const current = activeIndex;
  const distance = (targetIndex - current + dishes.length) % dishes.length;
  const total = minRounds * dishes.length + distance;
  const steps = [];

  for (let step = 0; step <= total; step += 1) {
    const progress = step / total;
    const eased = progress * progress * progress;
    const delay = 42 + eased * 285;
    steps.push({
      index: (current + step) % dishes.length,
      delay
    });
  }

  return steps;
}

function resultLabel(dish) {
  return `${dish.name}：${dish.meat} + ${dish.vegetable} + ${dish.soup}`;
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
