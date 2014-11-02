function CelestialBody(latitudeBands, longitudeBands, radius, texture, isLightSource)
{
    Sphere.call(this, latitudeBands, longitudeBands, radius, texture, isLightSource);

    this.rotation = vec3.fromValues(0,0,0);
    this.rotationSpeed = vec3.fromValues(0,0,0);

    this.theta = 0;

    this.initalOrbitalRadius = 0;
    this.currentOrbitalRadius = 0;
    this.angularVelocity = 0;
    this.orbitEccentricity = 0;
    this.orbitalAxis = 0;

    this.axisTilt = 0;
    this.orbitTilt = 0;
    this.orbitals = [];
}

CelestialBody.prototype.initShaders = function(shaderProgram)
{
    this.shaderProgram = shaderProgram;
}

CelestialBody.prototype.subSystemTransforms = function(modelViewMatrix)
{
    // tilt subsystem about it's orbital axis
    if (this.orbitTilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.orbitTilt), [0,0,1]);
    }

    // orbit rotation
    var orbitVector = vec3.create();
    orbitVector[(this.orbitalAxis+1) % 3] = 1;
    mat4.rotate(modelViewMatrix, modelViewMatrix, this.theta, orbitVector);

    //move body to position in scene
    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
}

CelestialBody.prototype.draw = function(modelViewMatrix)
{
    if (this.axisTilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.axisTilt), [0,0,1]);
    }

    //rotation about axis
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotation[0]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotation[1]);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotation[2]);

    this.shaderProgram.setUniforms({
        "modelViewMatrix": modelViewMatrix,
        "perspectiveMatrix": perspectiveMatrix,
        "lightingParameters": {
            "isLightSource": this.isLightSource,
            "lightingPosition": [0,0,0],
            "alpha": 1.0,
            "ambientColor": vec3.fromValues(0.2,0.2,0.2),
        },
    });


    Drawable.prototype.draw.call(this, this.shaderProgram);
}

CelestialBody.prototype.animate = function(delta)
{
    var deltaRotation = vec3.create();
    vec3.scale(deltaRotation, this.rotationSpeed, delta / 1000.0);
    vec3.scale(deltaRotation, deltaRotation,  Math.PI / 180);
    vec3.add(this.rotation, this.rotation, deltaRotation);

    this.animateOrbit(delta);
}

CelestialBody.prototype.addChild = function(orbital)
{
    this.orbitals.push(orbital);
}

CelestialBody.prototype.getChildren = function()
{
    return this.orbitals;
}

CelestialBody.prototype.animateOrbit = function(delta)
{
    if(this.angularVelocity != 0)
    {
        this.currentOrbitalRadius = (this.initalOrbitalRadius * (1 + this.orbitEccentricity)) / (1 + this.orbitEccentricity * Math.cos(this.theta));
        var deltaTheta = (delta*this.initalOrbitalRadius*this.initalOrbitalRadius*this.angularVelocity) / (this.currentOrbitalRadius*this.currentOrbitalRadius);
        this.theta += deltaTheta;

        this.positionVector[this.orbitalAxis] = this.currentOrbitalRadius;
    }
}

CelestialBody.prototype.setRotationSpeed = function(rotationSpeedVector)
{
    this.rotationSpeed = rotationSpeedVector;
}

CelestialBody.prototype.setOrbitParameters = function(angularVelocity, initialRadius, eccentricity, axis)
{
    this.angularVelocity = angularVelocity;
    this.initalOrbitalRadius = initialRadius;
    this.currentOrbitalRadius = initialRadius;
    this.orbitEccentricity = eccentricity;
    this.orbitalAxis = axis;
    this.positionVector[this.orbitalAxis] = this.currentOrbitalRadius;
}

CelestialBody.prototype.setAxisTilt = function(tilt)
{
    this.axisTilt = tilt;
}

CelestialBody.prototype.setOrbitTilt = function(tilt)
{
    this.orbitTilt = tilt;
}

CelestialBody.prototype.setOrbitRotationSpeed = function(rotationSpeedVector)
{
    this.orbitRotationSpeed = rotationSpeedVector;
}

extend(Sphere, CelestialBody);
