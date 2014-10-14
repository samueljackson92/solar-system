var gl;
var shaderProgram;

var scene;
var perspectiveMatrix;
var modelViewMatrix;

var moon;
var miniMoon;

function webGlStart()
{
    var canvas = document.getElementById("canvas");
    initWebGL(canvas);


    scene = new SceneGraph();
    perspectiveMatrix = mat4.create();
    modelViewMatrix = mat4.create();

    var moonTexture = createTexture("img/moon.gif");
    moon = new CelestialBody(30,30, 5, false, moonTexture);
    moon.setPositionVector([0,0,-30]);
    moon.setRotationSpeed(0,10);

    miniMoon = new CelestialBody(30,30, 1, true, moonTexture);
    miniMoon.setPositionVector([10,0,0]);
    miniMoon.setRotationSpeed(-30,90);

    moon.addOribtal(miniMoon);

    initShaders();
    initBuffers();
    tick();
}

function initWebGL()
{
    try
    {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        gl = canvas.getContext('experimental-webgl');
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }
    catch (e)
    {
        alert("Could not initialize WebGL!");
    }
}

function initBuffers()
{
    moon.initBuffers();
    miniMoon.initBuffers();
}

function initShaders()
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders!");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

function tick()
{
    requestAnimFrame(tick);
    resizeViewport();
    drawScene();
    animate();
}

function drawScene()
{
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(shaderProgram.useLightingUniform, false);

    var aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(perspectiveMatrix, 45, aspectRatio, 0.1, 100.0);
    mat4.identity(scene.modelViewMatrix);

    scene.push();
    moon.draw(scene.modelViewMatrix);
    scene.pop();
}

function resizeViewport()
{
    var width = canvas.clientHeight;
    var height = Math.max(1, canvas.clientHeight);
    if (canvas.width != width || canvas.height != height) {
        // Change the size of the canvas to match the size it's being displayed
        canvas.width = width;
        canvas.height = height;
    }
}

var lastTime = 0;
function animate()
{
    var timeNow = new Date().getTime();
    if (lastTime != 0)
    {
        var delta = timeNow - lastTime;
        moon.animate(delta);
        miniMoon.animate(delta);
    }
    lastTime = timeNow;
}
