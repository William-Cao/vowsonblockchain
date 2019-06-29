const skyStar = function () {
  window.requestAnimFrame = (function () { return window.requestAnimationFrame })()
  let canvas = document.getElementById('skyStar')
  let c = canvas.getContext('2d')
  let numStars = 1000
  let radius = '0.' + Math.floor(Math.random() * 9) + 1
  let focalLength = canvas.width * 2
  let warp = 0
  let centerX, centerY
  let stars = []
  let star
  let i
  let animate = true

  initializeStars()

  function executeFrame () {
    if (animate) {
      window.requestAnimFrame(executeFrame)
    }
    moveStars()
    drawStars()
  }

  function initializeStars () {
    centerX = canvas.width / 2
    centerY = canvas.height / 2

    stars = []
    for (i = 0; i < numStars; i++) {
      star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: '0.' + Math.floor(Math.random() * 99) + 1
      }
      stars.push(star)
    }
  }

  function moveStars () {
    for (i = 0; i < numStars; i++) {
      star = stars[i]
      star.z--
      if (star.z <= 0) {
        star.z = canvas.width
      }
    }
  }

  function drawStars () {
    let pixelX, pixelY, pixelRadius
    c.clearRect(0, 0, canvas.width, canvas.height)
    if (canvas.width !== window.innerWidth || canvas.width !== window.innerWidth) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeStars()
    }
    if (warp === 0) {
      // c.fillStyle = 'rgba(0,10,20,0)'
      c.fillStyle = 'transparent'
      c.fillRect(0, 0, canvas.width, canvas.height)
    }
    c.fillStyle = 'rgba(255, 255, 255, ' + radius + ')'
    for (i = 0; i < numStars; i++) {
      star = stars[i]
      pixelX = (star.x - centerX) * (focalLength / star.z)
      pixelX += centerX
      pixelY = (star.y - centerY) * (focalLength / star.z)
      pixelY += centerY
      // pixelRadius = 1 * (focalLength / star.z)
      pixelRadius = 1 * (focalLength / 0.8 / star.z)
      c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius)
      // c.fillStyle = 'rgba(255, 255, 255, ' + star.o + ')'
      c.fillStyle = 'rgb(255, 255, 255)'
    }
  }
  executeFrame()
}

export default skyStar
