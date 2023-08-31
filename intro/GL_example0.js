// First WebGL example sets up a rendering context and canvas,
// but does not load any data to GPU for rendering.

// Gets the graphics context from the window
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

// entry point when page is loaded
function main() {

  // get graphics context
  let gl = getGraphicsContext();

  // specify a fill color for clearing the framebuffer
  // red, green, blue, alpha (transparency?)
  gl.clearColor(1.0, 0.0, 1.0, 1.0);

  // clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);
}
