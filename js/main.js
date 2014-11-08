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

    var planetShader = new CelestialBodyShader("shader-vs", 'shader-fs', {
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

    planetShader.init();

    sol = new CelestialBody({
        "shader": planetShader,
        "shaderUniforms": {
            "textures": {
                "texture": textureLoader.textures.sun,
            },
            "isLightSource": true
        },
        "dimensions": {
            "latitude": 60,
            "longitude": 60,
            "radius": 50,
        },
    });

    sol.setRotation({
        "speed": [0,15,0],
        "tilt": 0
    });

    earth = new CelestialBody({
        "shader": planetShader,
        "shaderUniforms": {
            "textures": {
                "texture": textureLoader.textures.earth,
                "useDarkTexture": true,
                "textureDark": textureLoader.textures.earthDark,
                "useAtmosphere": true,
                "textureAtmosphere": textureLoader.textures.earthAtmosphere,
            }
        },
        "atmosphereRotationSpeed": 0.005,
        "dimensions": {
            "latitude": 30,
            "longitude": 30,
            "radius": 5,
        }
    });

    earth.setRotation({
        "speed": [0,25,0],
        "tilt": -23
    });

    earth.setOrbit({
        "radius": 250,
        "velocity": 0.0005,
        "eccentricity": 0,
        "axis": 0,
        "tilt": -45
    });

    sol.addChild(earth);

    moon = new CelestialBody({
        "shader": planetShader,
        "shaderUniforms": {
            "textures":
            {
                "texture": textureLoader.textures.moon,
            }
        },
        "dimensions": {
            "latitude": 30,
            "longitude": 30,
            "radius": 1,
        }
    });

    moon.setRotation({
        "speed": [0,35,0],
        "tilt": 0
    });

    moon.setOrbit({
        "radius": 10,
        "velocity": 0.01,
        "eccentricity": 0.5,
        "axis": 0,
        "tilt": -45
    });

    earth.addChild(moon);

    saturn = new CelestialBody({
        "shader": planetShader,
        "shaderUniforms": {
            "textures":{
                "texture": textureLoader.textures.saturn,
            },
        },
        "dimensions": {
            "latitude": 30,
            "longitude": 30,
            "radius": 10,
        }
    });

    saturn.setOrbit({
        "radius": 750,
        "velocity": 0.0,
        "eccentricity": 0,
        "axis": 0,
        "tilt": 0
    });


    rings = new Rings({
        "shader": planetShader,
        "shaderUniforms": {
            "textures": {
                "texture": textureLoader.textures.saturnsRings
            },
            "lightingParameters": {
                "ambientColor": vec3.fromValues(1.0,1.0,1.0),
                "alpha": 0.8
            }
        },
        "isBlended": true
    });

    saturn.addChild(rings);
    sol.addChild(saturn);

    solarSystem.addDrawableObject(sol);

    camera.setFocussedObject(earth);

    var skyBoxShader = new BasicShader("basic-vs", 'basic-fs');
    skyBoxShader.init();

    skyBox = new SkyBox({
        "shader": skyBoxShader,
        "shaderUniforms": {
            "textures": {
                "texture": textureLoader.textures.skybox,
            },
            "lightingParameters": {
                "ambientColor": vec3.fromValues(0.5,0.5,0.5),
            }
        }
    });

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

function tick()
{
    requestAnimFrame(tick);
    resizeViewport();
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
