
function logPosition(event)
{
  let canvas = document.getElementById('theCanvas');
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  console.log(x + ", " + y);
}

function getGraphicsContext() {
  // retrieve <canvas> element
  let canvas = document.getElementById('theCanvas');

  // get graphics context
  let context = canvas.getContext("webgl");
  if (!context) {
    console.log('Failed to get the rendering context for WebGL');
  }
  return context;
}

function startHere()
{
  // retrieve <canvas> element
  var canvas = document.getElementById('theCanvas');

  // attach a mouse click handler
  canvas.onclick = logPosition;

  // fill the canvas with a background so we can see it
  let gl = getGraphicsContext();

  // specify a fill color for clearing the framebuffer
  // red, green, blue, alpha (transparency?)
  gl.clearColor(1.0, 1.0, 0.0, 1.0);

  // clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);

}
