const textElement = document.getElementById('text');
const cursorElement = document.getElementById('cursor');
const text = "I am currently studying Computer Science at Santa Clara University";
let index = 0;

function type() {
  if (!textElement || !cursorElement) return;
  if (index < text.length) {
    textElement.textContent += text.charAt(index);
    index++;
    setTimeout(type, 35);
  } else {
    // keep blinking cursor (CSS handles blink). Optionally add a class when done:
    document.documentElement.classList.add('typed-complete');
  }
}

type();