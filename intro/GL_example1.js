
// Second WebGL example draws two triangles.

// vertex shader
const vshaderSource = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
}
`;

// fragment shaders
const fshaderSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

// Raw data for some point positions - this will be a square, consisting
// of two triangles.  We provide two values per vertex for the x and y coordinates
// (z will be zero by default).
var vertices = new Float32Array([
-0.5, -0.5,
4.5, -3.5,
0.5, 0.5,
-0.5, -0.5,
0.5, 0.5,
-0.5, 0.5
]
);


// A few global variables...

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexbuffer;

// handle to the compiled shader program on the GPU
var shader;


// Gets the graphics context from the window
function getGraphicsContext(canvasId) {
  // retrieve <canvas> element
  let canvas = document.getElementById(canvasId);

  // get graphics context - we use WebGL 1.0 rather than WebGL 2.0
  // in order to use the Chrome shader editor
  //let context = canvas.getContext("webgl2");
  let context = canvas.getContext("webgl");
  if (!context) {
    console.log('Failed to get the rendering context for WebGL');
  }
  return context;
}

// Helper function to load and compile one shader (vertex or fragment)
function loadAndCompileShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the source code
  gl.shaderSource(shader, source);

  // Compile
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Helper function compiles two shaders and creates shader program
function createShaderProgram(gl, vShaderSource, fShaderSource) {

  // Load and compile shader code
  var vertexShader = loadAndCompileShader(gl, gl.VERTEX_SHADER, vshaderSource);
  var fragmentShader = loadAndCompileShader(gl, gl.FRAGMENT_SHADER, fshaderSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

// Helper function allocates a gpu memory buffer and fills it with the given data
function createAndLoadBuffer(data)
{
  // request a handle for a chunk of GPU memory
  let buffer = gl.createBuffer();
  if (!buffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }

  // "bind" the buffer as the current array buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // load our data onto the GPU (uses the currently bound buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // now that the buffer is filled with data, we can unbind it
  // (we still have the handle, so we can bind it again when needed)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;

}

// code to actually render our geometry, typically done once per frame
function draw()
{
  // clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // bind the shader
  gl.useProgram(shader);

  // bind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(shader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // "enable" the a_position attribute
  gl.enableVertexAttribArray(positionIndex);

  // associate the data in the currently bound buffer with the a_position attribute
  // (The '2' specifies there are 2 floats per vertex in the buffer.  Don't worry about
  // the last three args just yet.)
  gl.vertexAttribPointer(positionIndex, 2, gl.FLOAT, false, 0, 0);

  // we can unbind the buffer now (not really necessary when there is only one buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // draw, specifying the type of primitive to assemble from the vertices
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // some other things to try
  //gl.drawArrays(gl.TRIANGLES, 0, 5);
  //gl.drawArrays(gl.TRIANGLES, 3, 3);
  //gl.drawArrays(gl.LINES, 0, 6);
  //gl.drawArrays(gl.LINE_STRIP, 0, 6);

  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.disableVertexAttribArray(positionIndex);
  gl.useProgram(null);

}

// entry point when page is loaded
function main() {

  // basically this function does setup that "should" only have to be done once,
  // while draw() does things that have to be repeated each time the canvas is
  // redrawn


  // window.onresize = function()
  // {
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   let size = Math.min(canvas.width, canvas.height);
  //   gl.viewport(0, 0, size, size);
  // }

  // get graphics context using its id
  gl = getGraphicsContext("theCanvas");

  // load and compile the shader pair, given ids
  shader = createShaderProgram(gl, vshaderSource, fshaderSource);

  // load the vertex data into GPU memory
  vertexbuffer = createAndLoadBuffer(vertices);

  // specify a fill color for clearing the framebuffer
  gl.clearColor(0.0, 0.8, 0.8, 1.0);

  // we could just call draw() once to see the result, but setting up an animation
  // loop to continually update the canvas makes it easier to experiment with the
  // shaders

  draw();

  // define an animation loop
  var animate = function() {
    draw();

	// request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate);
  };

  // start drawing!
  animate();


}
