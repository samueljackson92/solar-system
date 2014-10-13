//global variable to store the WebGL content
var gl;

function webGlStart()
{
    var canvas = document.getElementById("canvas");
    initWebGL(canvas);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

function initWebGL()
{
    try
    {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        gl = canvas.getContext('experimental-webgl');
    }
    catch (e)
    {
        alert("Could not initialize WebGL!");
    }
}

function tick()
{
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    requestAnimFrame(tick);
    drawScene();
    // animate();
}

function drawScene()
{
    gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
