var gl;

var solarSystem;
var camera;
var textureLoader;

var perspectiveMatrix;
var mvMatrix;

var skyBox;

function webGlStart()
{
    var canvas = document.getElementById("canvas");
    initWebGL(canvas);

    perspectiveMatrix = mat4.create();
    mvMatrix = mat4.create();

    solarSystem = new SceneGraph();
    camera = new Camera();
    camera.setCameraPosition([0,0,-100]);
    textureLoader = new TextureLoader();

    keyController = new KeyController();
    document.onkeydown = function(event){
        keyController.handleKeyDown(event);
    };
    document.onkeyup = function(event){
        keyController.handleKeyUp(event);
    };

    var planetShader = makeShader("shader-vs", 'shader-fs');
    sol = new CelestialBody(60,60,50, textureLoader.textures.sun, true, false);
    sol.initShaders(planetShader);
    sol.setRotationSpeed([0,15,0]);

    // mercury = new CelestialBody(30,30, 1.7, textureLoader.textures.mercury);
    // mercury.initShaders(planetShader);
    // mercury.setOrbitParameters(0.000, 100, 0.2, 0);
    // // mercury.setOrbitTilt(3.38);
    // sol.addChild(mercury);
    // //
    // venus = new CelestialBody(30,30, 5, textureLoader.textures.venus);
    // venus.initShaders(planetShader);
    // venus.setOrbitParameters(0.000, 150, 0, 0);
    // // venus.setOrbitTilt(-5);
    // sol.addChild(venus);
    // //
    // //earth subsystem
    // earth = new CelestialBody(30,30, 5, textureLoader.textures.earth);
    // earth.initShaders(planetShader);
    // earth.setOrbitParameters(0.001, 250, 0, 0);
    // earth.setRotationSpeed([0,25,0]);
    // earth.setAxisTilt(-23);
    // earth.setOrbitTilt(-5);
    // sol.addChild(earth);
    // // //
    // moon = new CelestialBody(30,30, 1, textureLoader.textures.moon);
    // moon.initShaders(planetShader);
    // moon.setOrbitParameters(0.01, 5, 0.5, 0);
    // moon.setOrbitTilt(-45);
    // // moon.setRotationSpeed([0,35,0]);
    // earth.addChild(moon);
    // // //
    // mars = new CelestialBody(30,30, 5, textureLoader.textures.mars);
    // mars.initShaders(planetShader);
    // mars.setOrbitParameters(0.000, 350, 0, 0);
    // // mars.setOrbitTilt(-0);
    // sol.addChild(mars);
    // //
    // jupiter = new CelestialBody(30,30, 10, textureLoader.textures.jupiter);
    // jupiter.initShaders(planetShader);
    // jupiter.setOrbitParameters(0.000, 650, 0, 0);
    // // jupiter.setOrbitTilt(-20);
    // sol.addChild(jupiter);
    //
    saturn = new CelestialBody(30,30, 10, textureLoader.textures.saturn);
    saturn.initShaders(planetShader);
    saturn.setOrbitParameters(0.000, 750, 0, 0);
    // saturn.setOrbitTilt(-25);

    rings = new Rings(textureLoader.textures.saturnsRings, false, true);
    rings.initShaders(planetShader);

    saturn.addChild(rings);
    sol.addChild(saturn);
    //
    // uranus = new CelestialBody(30,30, 5, textureLoader.textures.uranus);
    // uranus.initShaders(planetShader);
    // uranus.setOrbitParameters(0.000, 850, 0, 0);
    // // uranus.setOrbitTilt(-30);
    // sol.addChild(uranus);
    // //
    // neptune = new CelestialBody(30,30, 5, textureLoader.textures.neptune);
    // neptune.initShaders(planetShader);
    // neptune.setOrbitParameters(0.000, 950, 0, 0);
    // // neptune.setOrbitTilt(-40);
    // sol.addChild(neptune);

    solarSystem.addDrawableObject(sol);

    var skyBoxShader = makeShader("basic-vs", 'basic-fs');
    skyBox = new SkyBox(textureLoader.textures.skybox);
    skyBox.initShaders(skyBoxShader);
    solarSystem.addDrawableObject(skyBox);

    solarSystem.initBuffers();

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

function makeShader(vertexShaderName, fragmentShaderName)
{
    var fragmentShader = getShader(gl, vertexShaderName);
    var vertexShader = getShader(gl, fragmentShaderName);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders!");
    }

    return shaderProgram;
}

function tick()
{
    requestAnimFrame(tick);
    resizeViewport();
    keyController.handleKeys();
    drawScene();
    animate();
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

function drawScene()
{
    resetGLWindow();
    camera.move(perspectiveMatrix);
    solarSystem.drawScene(mvMatrix);
}

function resetGLWindow()
{
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(perspectiveMatrix, 45, aspectRatio, 0.1, 20000.0);
    mat4.identity(mvMatrix);
}


var lastTime = 0;
function animate()
{
    var timeNow = new Date().getTime();
    if (lastTime !== 0)
    {
        var delta = timeNow - lastTime;
        camera.update(delta);
        //skybox should always be central to the camera.
        skyBox.setPositionVector(camera.getCameraPosition());
        solarSystem.animateScene(delta);
    }
    lastTime = timeNow;
}
