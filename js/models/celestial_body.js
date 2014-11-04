function CelestialBody(creationParams)
{
    Sphere.call(this, creationParams);

    this.atmosphereRotationSpeed = creationParams.atmosphereRotationSpeed;
    this.atmosphereTheta = 0;
    this.rotation = vec3.fromValues(0,0,0);
    this.rotationSpeed = vec3.fromValues(0,0,0);
    this.axisTilt = 0;

    this.orbit = {};
    this.orbit.theta = 0;

    this.orbit.radius = 0;
    this.orbit.currentRadius = 0;
    this.orbit.velocity = 0;
    this.orbit.eccentricity = 0;
    this.orbit.axis = 0;
    this.orbit.tilt = 0;

    this.orbitals = [];
}

CelestialBody.prototype.subSystemTransforms = function(modelViewMatrix)
{
    // tilt subsystem about it's orbital axis
    if (this.orbit.tilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.orbit.tilt), [0,0,1]);
    }

    // orbit rotation
    var orbitVector = vec3.create();
    orbitVector[(this.orbit.axis+1) % 3] = 1;
    mat4.rotate(modelViewMatrix, modelViewMatrix, this.orbit.theta, orbitVector);

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

    this.shaderUniforms.modelViewMatrix = modelViewMatrix;
    this.shaderUniforms.perspectiveMatrix = perspectiveMatrix;
    this.shaderUniforms.atmosphereRotation = this.atmosphereTheta;

    this.shaderUniforms.lightingParameters.ambientColor = vec3.fromValues(0.2,0.2,0.2);
    this.shaderUniforms.lightingParameters.lightingPosition = vec3.fromValues(0.0,0.0,0.0); //we only have one light source
    this.shaderUniforms.lightingParameters.alpha = 1.0;

    this.shaderProgram.setUniforms(this.shaderUniforms);

    bindBufferToShader(this.vertexTangentBuffer, this.shaderProgram.vertexTangentAttribute);
    bindBufferToShader(this.vertexBitangentBuffer, this.shaderProgram.vertexBitangentAttribute);

    Drawable.prototype.draw.call(this, this.shaderProgram);
}

CelestialBody.prototype.animate = function(delta)
{
    var deltaRotation = vec3.create();
    vec3.scale(deltaRotation, this.rotationSpeed, delta / 1000.0);
    vec3.scale(deltaRotation, deltaRotation,  Math.PI / 180);
    vec3.add(this.rotation, this.rotation, deltaRotation);

    this.atmosphereTheta += this.atmosphereRotationSpeed;

    this.animateOrbit(delta);
}


CelestialBody.prototype.getChildren = function()
{
    return this.orbitals;
}

CelestialBody.prototype.animateOrbit = function(delta)
{
    if(this.orbit.velocity !== 0)
    {
        this.orbit.currentRadius = (this.orbit.radius * (1 + this.orbit.eccentricity)) / (1 + this.orbit.eccentricity * Math.cos(this.orbit.theta));
        var deltaTheta = (delta*this.orbit.radius*this.orbit.radius*this.orbit.velocity) / (this.orbit.currentRadius*this.orbit.currentRadius);
        this.orbit.theta += deltaTheta;

        this.positionVector[this.orbit.axis] = this.orbit.currentRadius;
    }
}

CelestialBody.prototype.addChild = function(orbital)
{
    this.orbitals.push(orbital);
};

CelestialBody.prototype.setRotation = function(params)
{
    this.rotationSpeed = params.speed;
    this.axisTilt = params.tilt;
};

CelestialBody.prototype.setOrbit = function(params)
{
    this.orbit = params;
    this.orbit.theta = 0;
    this.orbit.currentRadius = params.radius;
    this.positionVector[this.orbit.axis] = this.orbit.radius;
};

extend(Sphere, CelestialBody);
