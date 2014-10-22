var gl;
var shaderProgram;

var solarSystem;
var camera;
var textureLoader;

var perspectiveMatrix;
var mvMatrix;

var earth;
var moon;
var sol;

// solar_system_parameters = {
//     'mercury': {
//         'radius': 1.7,
//         'orbit_parameters': {
//             'velocity': 0.00047,
//             'radius': 2.081,
//             'inclincation': 3.38,
//             'eccentrcity': 0.205,
//         }
//     }
// }

function webGlStart()
{
    var canvas = document.getElementById("canvas");
    initWebGL(canvas);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    var planetFactory = new CelestialBodyFactory();
    solarSystem = new SceneGraph();
    camera = new Camera();
    textureLoader = new TextureLoader();

    perspectiveMatrix = mat4.create();
    mvMatrix = mat4.create();

    sol = planetFactory.create(60,60,50, textureLoader.textures["sun"], true);
    sol.setPositionVector([0,0,0]);
    // sol.setRotationSpeed([0,15,0]);

    // mercury = planetFactory.create(30,30, 1.7, textureLoader.textures["mercury"]);
    // mercury.setOrbitParameters(0.00047, 2.081+500, 0.2, 0);
    // mercury.setOrbitTilt(3.38);
    // sol.addChild(mercury);

    // venus = planetFactory.create(30,30, 5, textureLoader.textures["venus"]);
    // venus.setOrbitParameters(0.0002, 250, 0, 0);
    // venus.setOrbitTilt(-5);
    // sol.addChild(venus);
    //
    //earth subsystem
    earth = planetFactory.create(30,30, 5, textureLoader.textures["earth"]);
    earth.setOrbitParameters(0.0005, 250, 0, 0);
    earth.setRotationSpeed([0,25,0]);
    earth.setAxisTilt(-23);
    earth.setOrbitTilt(-10);
    sol.addChild(earth);
    //
    moon = planetFactory.create(30,30, 1, textureLoader.textures["moon"]);
    moon.setOrbitParameters(0.01, 8, 0.5, 0);
    moon.setOrbitTilt(-5.145);
    moon.setRotationSpeed([0,35,0]);
    earth.addChild(moon);
    //
    mars = planetFactory.create(30,30, 5, textureLoader.textures["mars"]);
    mars.setOrbitParameters(0.0005, 300, 0, 0);
    mars.setOrbitTilt(-0);
    sol.addChild(mars);
    //
    // jupiter = planetFactory.create(30,30, 10, textureLoader.textures["jupiter"]);
    // jupiter.setOrbitParameters(0.0005, 650, 0, 0);
    // jupiter.setOrbitTilt(-20);
    // sol.addChild(jupiter);
    //
    // saturn = planetFactory.create(30,30, 10, textureLoader.textures["saturn"]);
    // saturn.setOrbitParameters(0.0006, 750, 0, 0);
    // saturn.setOrbitTilt(-25);
    // sol.addChild(saturn);
    //
    // uranus = planetFactory.create(30,30, 5, textureLoader.textures["uranus"]);
    // uranus.setOrbitParameters(0.0007, 850, 0, 0);
    // uranus.setOrbitTilt(-30);
    // sol.addChild(uranus);
    //
    // neptune = planetFactory.create(30,30, 5, textureLoader.textures["neptune"]);
    // neptune.setOrbitParameters(0.0008, 950, 0, 0);
    // neptune.setOrbitTilt(-40);
    // sol.addChild(neptune);

    solarSystem.addDrawableObject(sol);

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
        gl.depthFunc(gl.LESS);
    }
    catch (e)
    {
        alert("Could not initialize WebGL!");
    }
}

function initBuffers()
{
    solarSystem.initBuffers();
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
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
}

function tick()
{
    requestAnimFrame(tick);
    resizeViewport();
    handleKeys();
    drawScene();
    animate();
}

function drawScene()
{
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(shaderProgram.useLightingUniform, false);

    var aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(perspectiveMatrix, 45, aspectRatio, 0.1, 3000.0);
    mat4.identity(mvMatrix);

    //lighting
    gl.uniform1i(shaderProgram.useLightingUniform, true);
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.1, 0.1, 0.1);
    gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0, 0, 0);
    gl.uniform3f(shaderProgram.pointLightingColorUniform, 3.0, 3.0, 3.0);

    //camera corrections
    camera.move(perspectiveMatrix);
    solarSystem.drawScene(mvMatrix);
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
        camera.update(delta);
        solarSystem.animateScene(delta);
    }
    lastTime = timeNow;
}

var currentlyPressedKeys = {};

function handleKeys()
{
    camera.handleCameraKeys();
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
