function CelestialBodyFactory(){}

CelestialBodyFactory.prototype.create = function(latitudeBands, longitudeBands, radius, texture)
{
    this.latitudeBands = latitudeBands;
    this.longitudeBands = longitudeBands;
    this.radius = radius;
    this.texture = texture;

    var newBody = new CelestialBody(this.texture);
    return this.makeVertexData(newBody);
}

CelestialBodyFactory.prototype.makeVertexData = function(newBody)
{
    for(var latitudeNumber = 0; latitudeNumber <= this.latitudeBands; latitudeNumber++)
    {
        var theta = latitudeNumber * Math.PI / this.latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for(longitudeNumber = 0; longitudeNumber <= this.longitudeBands; longitudeNumber++)
        {
            var phi = longitudeNumber * 2 * Math.PI / this.longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            var u = 1 - (longitudeNumber / this.longitudeBands);
            var v = 1 - (latitudeNumber / this.latitudeBands);

            newBody.normalData.push(x);
            newBody.normalData.push(y);
            newBody.normalData.push(z);

            newBody.vertexPositionData.push(this.radius * x);
            newBody.vertexPositionData.push(this.radius * y);
            newBody.vertexPositionData.push(this.radius * z);

            newBody.textureCoordinateData.push(u);
            newBody.textureCoordinateData.push(v);
        }
    }

    for (var latitudeNumber = 0; latitudeNumber < this.latitudeBands; latitudeNumber++)
    {
      for (var longitudeNumber = 0; longitudeNumber < this.longitudeBands; longitudeNumber++) {
        var first = (latitudeNumber * (this.longitudeBands + 1)) + longitudeNumber;
        var second = first + this.longitudeBands + 1;
        newBody.indexData.push(first);
        newBody.indexData.push(second);
        newBody.indexData.push(first + 1);

        newBody.indexData.push(second);
        newBody.indexData.push(second + 1);
        newBody.indexData.push(first + 1);
      }
    }

    return newBody;
}

function CelestialBody(texture)
{
    //texture object defining look of the body
    this.texture = texture;

    // data arrays for vertices, normals etc.
    this.vertexPositionData = [];
    this.normalData = [];
    this.textureCoordinateData = [];
    this.indexData = [];

    this.positionVector = vec3.fromValues(0,0,0);
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

CelestialBody.prototype.initBuffers = function()
{
    this.vertexPositionBuffer = createArrayBuffer(this.vertexPositionData, 3);
    this.vertexTextureCoordinateBuffer = createArrayBuffer(this.textureCoordinateData, 2);
    this.vertexNormalBuffer = createArrayBuffer(this.normalData, 3);
    this.vertexIndexBuffer = createElementArrayBuffer(this.indexData, 1);
}

CelestialBody.prototype.drawSubSystem = function(modelViewMatrix)
{
    //tilt subsystem about it's orbital axis
    if (this.orbitTilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.orbitTilt), [0,0,1]);
    }

    //orbit rotation
    var orbitVector = vec3.create();
    orbitVector[(this.orbitalAxis+1) % 3] = 1;
    mat4.rotate(modelViewMatrix, modelViewMatrix, this.theta, orbitVector);

    //move body to position in scene
    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
}

CelestialBody.prototype.drawBody = function(modelViewMatrix)
{
    if (this.axisTilt != 0)
    {
        mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.axisTilt), [0,0,1]);
    }

    //rotation about axis
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotation[0]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotation[1]);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotation[2]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    bindBufferToShader(this.vertexPositionBuffer, shaderProgram.vertexPositionAttribute);
    bindBufferToShader(this.vertexTextureCoordinateBuffer, shaderProgram.textureCoordAttribute);
    bindBufferToShader(this.vertexNormalBuffer, shaderProgram.vertexNormalAttribute);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    setMatrixUniforms(modelViewMatrix);
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

CelestialBody.prototype.getChildren = function()
{
    return this.orbitals;
}

CelestialBody.prototype.animate = function(delta)
{
    var deltaRotation = vec3.create();
    vec3.scale(deltaRotation, this.rotationSpeed, delta / 1000.0);
    vec3.scale(deltaRotation, deltaRotation,  Math.PI / 180);
    vec3.add(this.rotation, this.rotation, deltaRotation);

    this.orbit(delta);
}

CelestialBody.prototype.orbit = function(delta)
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

CelestialBody.prototype.setPositionVector = function(position)
{
    this.positionVector = position;
}

CelestialBody.prototype.addOribtal = function(orbital)
{
    this.orbitals.push(orbital);
}
