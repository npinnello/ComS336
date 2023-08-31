
// Similar to GL_example1, but adds a drop-down list to try out
// the various primitives (LINES, TRIANGLES, etc.) that are
// available in OpenGL

// vertex shader
const vshaderSource = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 4.0;
}
`;

// fragment shaders
const fshaderSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;


// Raw data for some point positions
var numPoints = 8;
var vertices = new Float32Array([
0.75, 0.0,
0.5, 0.5,
0.0, 0.75,
-0.5, 0.5,
-0.75, 0.0,
-0.5, -0.5,
0.0, -0.75,
0.5, -0.5
]
);


// A few global variables...

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexbuffer;

// handle to the compiled shader program on the GPU
var shader;


// code to actually render our geometry
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
  // choose the type of primitive based on the dropdown list selection
  var dropdown = document.getElementById('myList');
  var mode = gl.POINTS;
  switch (dropdown.value)
  {
    case "GL_LINES":
      mode = gl.LINES; break;
    case "GL_LINE_STRIP":
      mode = gl.LINE_STRIP; break;
    case "GL_LINE_LOOP":
        mode = gl.LINE_LOOP; break;
    case "GL_TRIANGLES":
      mode = gl.TRIANGLES; break;
    case "GL_TRIANGLE_STRIP":
      mode = gl.TRIANGLE_STRIP; break;
    case "GL_TRIANGLE_FAN":
      mode = gl.TRIANGLE_FAN; break;
  }

  gl.drawArrays(mode, 0, numPoints);
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

  var list = document.getElementById("myList");

  // Not needed if we use an animation loop
  //list.onchange = draw;

	  // get graphics context
  gl = getGraphicsContext("theCanvas");

  // load and compile the shader pair
  shader = createShaderProgram(gl, vshaderSource, fshaderSource);

  // load the vertex data into GPU memory
  vertexbuffer = createAndLoadBuffer(vertices);

  // specify a fill color for clearing the framebuffer
  gl.clearColor(0.0, 0.8, 0.8, 1.0);

  // we could just call draw() once to see the result, but setting up an animation
  // loop to continually update the canvas makes it easier to experiment with the
  // shaders
  //draw();

  // define an animation loop
  var animate = function() {
	draw();

	// request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate);
  };

  // start drawing!
  animate();

}
