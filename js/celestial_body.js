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
    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);

    this.shaderProgram.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    //perspective, model-view, and normal matricies
    this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uNMatrix");

    //texture sampler
    this.shaderProgram.samplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");

    //general lighting parameters
    this.shaderProgram.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "uAmbientColor");
    this.shaderProgram.emissiveColorUniform = gl.getUniformLocation(this.shaderProgram, "uEmissiveColor");
    this.shaderProgram.materialShininess = gl.getUniformLocation(this.shaderProgram, "uMaterialShininess");

    //light attenuation parameters
    this.shaderProgram.constantLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uConstantLightAttenuation");
    this.shaderProgram.linearLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uLinearLightAttenuation");
    this.shaderProgram.quadraticLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uQuadraticLightAttenuation");

    //parameters for point lighting
    this.shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingLocation");
    this.shaderProgram.pointLightingColorUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingColor");

    //parameters for turning off directional lighting on an object (e.g. the sun/skybox)
    this.shaderProgram.noDirectionalLight = gl.getUniformLocation(this.shaderProgram, "uNoDirectionalLight");
    this.shaderProgram.nonDirectionalAmbientLighting = gl.getUniformLocation(this.shaderProgram, "uNonDirectionalAmbientLighting");

    gl.uniform1i(this.shaderProgram.useLightingUniform, true);
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
    gl.useProgram(this.shaderProgram);

    if (this.axisTilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.axisTilt), [0,0,1]);
    }

    //rotation about axis
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotation[0]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotation[1]);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotation[2]);

    this.setLightingUniforms();
    setMatrixUniforms(this.shaderProgram, modelViewMatrix);
    this.drawModel(this.shaderProgram);
}

CelestialBody.prototype.setLightingUniforms = function()
{
    gl.uniform1i(this.shaderProgram.noDirectionalLight, false);

    if(this.isLightSource)
    {
        gl.uniform3fv(this.shaderProgram.pointLightingLocationUniform, this.positionVector);
        gl.uniform3f(this.shaderProgram.pointLightingColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(this.shaderProgram.emissiveColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(this.shaderProgram.ambientColorUniform, 1,1,1);
    }
    else
    {
        gl.uniform3f(this.shaderProgram.emissiveColorUniform, 0,0,0);
        gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2,0.2,0.2);
    }

    gl.uniform1f(this.shaderProgram.materialShininess, 3.0);

    //light attentuation factors
    gl.uniform1f(this.shaderProgram.constantLightAttenuation, 0.0001);
    gl.uniform1f(this.shaderProgram.linearLightAttenuation, 0.0001);
    gl.uniform1f(this.shaderProgram.quadraticLightAttenuation, 0.00001);
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
