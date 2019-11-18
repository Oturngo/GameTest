// 計時 part
var interval = null;
var sec_count = 0.0;
var real = [];
var secondCtr = function (op = 1) {
  if (sec_count.toFixed(1) == 0 && op < 0) {
    return;
  }
  sec_count += op * 0.1;
  if (sec_count > 9.9) {
    document.querySelector('#ctr .sec').innerText = sec_count.toFixed(1);
  } else {
    document.querySelector('#ctr .sec').innerText = '0' + sec_count.toFixed(1);
  }
}
var calcResult = function () {
  let finalScore_a = 0;
  let finalScore_b = 0;
  for (let i = 0; i < 4; i++) {
    let tragetSec = parseFloat(document.querySelectorAll('.main-block  .block > .target > span').item(i).innerText);
    let realSec = real[i];
    console.log(real[i])
    let diffSec = Math.abs(tragetSec - realSec).toFixed(1);
    document.querySelectorAll('.modal-result > .score-box .user-score:not(.final-score)').item(i).innerText = diffSec + 's';
    if (i < 2) {
      finalScore_a += parseFloat(diffSec);
    } else {
      finalScore_b += parseFloat(diffSec);
    }
  }
  document.querySelectorAll('.modal-result > .score-box .final-score').item(0).innerText = finalScore_a.toFixed(1) + 's';
  document.querySelectorAll('.modal-result > .score-box .final-score').item(1).innerText = finalScore_b.toFixed(1) + 's';
  if (finalScore_a < finalScore_b) {
    document.querySelectorAll('.modal-result > .win-box .win').item(0).style.opacity = 1;
  } else {
    document.querySelectorAll('.modal-result > .win-box .win').item(1).style.opacity = 1;
  }
}

var save_sec = function () {
  if (confirm("是否記錄秒數?")) {
    real.push(sec_count.toFixed(1));
    open_modal_game(false);
    if (document.querySelectorAll('.block-bg').item(real.length)) {
      document.querySelectorAll('.block-bg').item(real.length).classList.toggle('active')
    } else {
      //開啟結果
      calcResult();
      document.querySelector('.modal-result').style.opacity = 1;
      document.querySelector('.modal-result').style.visibility = 'visible';
      document.querySelector('.bg').style.opacity = 1;
      document.querySelector('.bg').style.visibility = 'visible';
    }
    document.querySelectorAll('.main-block  .block > .real > span').item(real.length - 1).innerText = sec_count.toFixed(1);
    sec_count = 0.0;
    document.querySelector('#ctr .sec').innerText = '0' + sec_count.toFixed(1);
    interval = null;
  }
}

var click_area = function () {
  document.querySelector('.sec-hand').classList.toggle('anim-pause')
  document.querySelector('.ms-hand').classList.toggle('anim-pause')
  if (!interval) {
    interval = setInterval(secondCtr, 100);
  }
  else {
    clearInterval(interval);
    document.querySelector('.click-area').style.display = 'none';
  }
}

var open_modal_game = function (op = true) {
  if (op) {
    document.querySelector('.click-area').style.display = 'block';
    document.querySelector('.bg').style.opacity = 1;
    document.querySelector('.bg').style.visibility = 'visible';
    document.querySelector('.modal-game').style.display = 'block';
    this.disabled = true;
    this.innerText = '挑戰完成';
    this.style.backgroundColor = '#f47f6a';
  } else {
    document.querySelector('.bg').style.opacity = 0;
    document.querySelector('.bg').style.visibility = 'hidden';
    document.querySelector('.modal-game').style.display = 'none';
  }
}

document.querySelector('.click-area').addEventListener('click', click_area);
document.querySelector('#clock').addEventListener('click', save_sec);
var start_btns = document.querySelectorAll('.btn-start');
start_btns.forEach(function (item) {
  item.addEventListener('click', open_modal_game);
});


// 挑戰秒數產生 part
$(document).ready(function () {
  var tMax = 3000, // animation time, ms
    height = 280,
    speeds = [],
    r = [],
    target = [],
    reels = [
      [9.6, 20, 18.5, 24],
      [9.6, 20, 18.5, 24],
      [9.6, 20, 18.5, 24],
      [9.6, 20, 18.5, 24],
    ],
    $reels,
    start;

  function setTarget() {
    for (let i = 0; i < target.length; i++) {
      document.querySelectorAll('.main-block  .block > .target > span').item(i).innerText = reels[0][target[i] / 70];
    }
  }

  function hide_modal(modal) {
    setTimeout(function () {
      modal.style.opacity = 0;
      modal.style.visibility = 'hidden';
      document.querySelectorAll('.block-bg').item(0).classList.add('active')
      setTarget();
      document.querySelector('.bg').style.visibility = 'hidden';
      document.querySelector('.bg').style.opacity = 0;
    }, 1000);
  }

  function init() {
    $reels = $('.reel').each(function (i, el) {
      el.innerHTML = '<div class="reel-holder"><p>' + reels[i].join('</p><p>') + '</p></div><div class="reel-holder"><p>' + reels[i].join('</p><p>') + '</p></div><div class="reel-door">?</div>'
    });
    $('.modal-target button').click(action);
  }

  function action() {
    if (start !== undefined) return;
    let tempArr = reels[0].slice();
    $('.reel-door').fadeOut(100);
    for (var i = 0; i < 4; ++i) {
      speeds[i] = Math.random() + .7;
      r[i] = (Math.random() * 4 | 0) * height / 4;
      let random_index = Math.random() * tempArr.length | 0;
      let tragetIndex = reels[0].indexOf(tempArr[random_index])
      target[i] = tragetIndex * height / 4;
      tempArr.splice(random_index, 1);
    }
    animate();
  }

  function animate(now) {
    if (!start) start = now;
    var t = now - start || 0;

    for (var i = 0; i < 4; ++i)
      $reels[i].scrollTop = (speeds[i] / tMax / 2 * (tMax - t) * (tMax - t) + target[i]) % height | 0;

    if (t < tMax)
      requestAnimationFrame(animate);
    else {
      start = undefined;
      hide_modal(document.querySelector('.modal-target'))
    }
  }

  init();
});
