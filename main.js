function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
window.addEventListener('DOMContentLoaded', () => {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar').innerHTML = data;
      });

    // Responsive floating word cloud with dynamic data
    function fetchWordsAndStartCloud() {
      fetch('words.json')
        .then(response => response.json())
        .then(wordsData => {
          // Convert [{text, weight}] to [[text, weight], ...]
          const words = wordsData.map(w => [w.text, w.weight]);
          startFloatingWordCloud(words);
        });
    }

    // Floating animated word cloud
    class FloatingWord {
      constructor(text, weight, canvasWidth, canvasHeight) {
        this.text = text;
        this.weight = weight;
        this.fontSize = 16 + weight * 1.5 + Math.random() * 6;
        this.x = canvasWidth + Math.random() * canvasWidth * 0.5;
        this.y = Math.random() * (canvasHeight - this.fontSize) + this.fontSize;
        this.speed = 0.5 + Math.random() * 1.2 + weight * 0.02;
        this.color = FloatingWord.randomColor();
        this.hovered = false;
      }
      static randomColor() {
        const palette = [
          '#3d0a78', '#e60d59', '#9a0279', '#02055a', '#C488FF', '#381753', '#ba8ee5', '#fff', '#450e0e'
        ];
        return palette[Math.floor(Math.random() * palette.length)];
      }
      draw(ctx) {
        ctx.save();
        ctx.font = `${this.hovered ? 'bold ' : ''}${this.fontSize}px Poppins, sans-serif`;
        ctx.fillStyle = this.hovered ? '#e60d59' : this.color;
        ctx.globalAlpha = this.hovered ? 1 : 0.85;
        ctx.shadowColor = this.hovered ? '#fff' : 'transparent';
        ctx.shadowBlur = this.hovered ? 10 : 0;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
      width(ctx) {
        ctx.save();
        ctx.font = `${this.fontSize}px Poppins, sans-serif`;
        const w = ctx.measureText(this.text).width;
        ctx.restore();
        return w;
      }
    }

    function startFloatingWordCloud(wordsData) {
      const canvas = document.getElementById('wordCloudCanvas');
      const ctx = canvas.getContext('2d');
      let words = [];
      let animationId;

      function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = Math.min(parent.offsetWidth, 600);
        canvas.height = Math.round(canvas.width * 0.7);
        // Recreate words on resize
        createWords();
      }

      function createWords() {
        words = [];
        for (let i = 0; i < wordsData.length; i++) {
          const w = wordsData[i];
          words.push(new FloatingWord(w.text, w.weight, canvas.width, canvas.height));
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let word of words) {
          word.x -= word.speed;
          // If word is off the left, respawn on right
          if (word.x + word.width(ctx) < 0) {
            word.x = canvas.width + Math.random() * canvas.width * 0.5;
            word.y = Math.random() * (canvas.height - word.fontSize) + word.fontSize;
            word.speed = 0.5 + Math.random() * 1.2 + word.weight * 0.02;
            word.color = FloatingWord.randomColor();
          }
          word.draw(ctx);
        }
        animationId = requestAnimationFrame(animate);
      }

      function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for (let word of words) {
          const w = word.width(ctx);
          const h = word.fontSize;
          // Simple bounding box hit test
          if (
            mouseX >= word.x && mouseX <= word.x + w &&
            mouseY >= word.y - h && mouseY <= word.y
          ) {
            word.hovered = true;
          } else {
            word.hovered = false;
          }
        }
      }

      function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for (let word of words) {
          const w = word.width(ctx);
          const h = word.fontSize;
          if (
            mouseX >= word.x && mouseX <= word.x + w &&
            mouseY >= word.y - h && mouseY <= word.y
          ) {
            alert(word.text);
            break;
          }
        }
      }

      window.addEventListener('resize', resizeCanvas);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);

      resizeCanvas();
      animate();
    }

    document.addEventListener('DOMContentLoaded', fetchWordsAndStartCloud);
});

