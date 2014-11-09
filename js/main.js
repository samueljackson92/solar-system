var gl;

var config;

var solarSystem;
var camera;
var textureLoader;
var majorPlanets = [];

var shaders = {};

var perspectiveMatrix;
var mvMatrix;

var skyBox;

function init()
{
    loadJSON('config.json', function(response) {
        config = response;
        webGlStart();
    });
}

function webGlStart()
{
    var canvas = document.getElementById("canvas");
    initWebGL(canvas);

    perspectiveMatrix = mat4.create();
    mvMatrix = mat4.create();

    camera = new SphericalCamera();

    var pos = vec3.fromValues(0,0,-250);
    camera.setCameraPosition(pos);
    textureLoader = new TextureLoader();

    keyController = new KeyController();

    document.onkeydown = function(event){
        keyController.handleKeyDown(event);
    };
    document.onkeyup = function(event){
        keyController.handleKeyUp(event);
    };

    shaders.planetShader = new CelestialBodyShader("shader-vs", 'shader-fs', {
        "pointLightLocation": vec3.fromValues(0.0,0.0,0.0),
        "pointLightColor": vec3.fromValues(1.0,1.0,1.0),
        "materialShininess": 3.0,
        "lightAttenuation": {
            "constant": 0.00001,
            "linear": 0.00001,
            "quadratic": 0.00001,
        },
        "emissiveColor": vec3.fromValues(1.0,1.0,1.0)
    });
    shaders.planetShader.init();

    shaders.skyBoxShader = new BasicShader("basic-vs", 'basic-fs');
    shaders.skyBoxShader.init();

    solarSystem = new SceneGraph(config);
    solarSystem.initBuffers();

    var sol = solarSystem.drawableObjects[0];
    majorPlanets = sol.getChildren().slice(0);
    majorPlanets.unshift(sol);
    skyBox = solarSystem.drawableObjects[1];

    camera.setFocussedObject(sol);
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

function tick()
{
    requestAnimFrame(tick);
    resizeViewport();
    parseMenuOptions();
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

function parseMenuOptions()
{
    //light intensity
    var intensity = parseFloat(document.getElementById("light-intensity").value) / 100.0;
    shaders.planetShader.globalUniforms.pointLightColor = vec3.fromValues(intensity, intensity, intensity);

    //material shininess
    var shininess = parseFloat(document.getElementById("light-shininess").value);
    shaders.planetShader.globalUniforms.materialShininess = shininess;

    //light attenuation
    var constantLightAttenuation = parseFloat(document.getElementById("light-attenuation-constant").value);
    var linearLightAttenuation = parseFloat(document.getElementById("light-attenuation-linear").value);
    var quadraticLightAttenuation = parseFloat(document.getElementById("light-attenuation-quadratic").value);

    shaders.planetShader.globalUniforms.lightAttenuation.constant = constantLightAttenuation;
    shaders.planetShader.globalUniforms.lightAttenuation.linear = linearLightAttenuation;
    shaders.planetShader.globalUniforms.lightAttenuation.quadratic = quadraticLightAttenuation;
}
