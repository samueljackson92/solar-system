function CelestialBody(latitudeBands, longitudeBands, radius, orbit, texture)
{
    //long, lat and radius defining the sphere
    this.latitudeBands = latitudeBands;
    this.longitudeBands = longitudeBands;
    this.radius = radius;

    //texture object defining look of the body
    this.texture = texture;

    // data arrays for vertices, normals etc.
    this.vertexPositionData = [];
    this.normalData = [];
    this.textureCoordinateData = [];
    this.indexData = [];

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.rotXSpeed = 0;
    this.rotYSpeed = 0;

    this.orbit = orbit;
    this.orbitTheta = 0;

    this.orbitals = [];
}

CelestialBody.prototype.initBuffers = function()
{
    this.makeVertexData();

    this.vertexPositionBuffer = createArrayBuffer(this.vertexPositionData, 3);
    this.vertexTextureCoordinateBuffer = createArrayBuffer(this.textureCoordinateData, 2);
    this.vertexNormalBuffer = createArrayBuffer(this.normalData, 3);
    this.vertexIndexBuffer = createElementArrayBuffer(this.indexData, 1);
}

CelestialBody.prototype.draw = function(modelViewMatrix)
{

    if (this.orbit)
    {
        mat4.rotateY(modelViewMatrix, modelViewMatrix, this.orbitTheta);
    }

    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);

    scene.push();
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotX);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotY);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    bindBufferToShader(this.vertexPositionBuffer, shaderProgram.vertexPositionAttribute);
    bindBufferToShader(this.vertexTextureCoordinateBuffer, shaderProgram.textureCoordAttribute);
    bindBufferToShader(this.vertexNormalBuffer, shaderProgram.vertexNormalAttribute);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    setMatrixUniforms(modelViewMatrix);
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    scene.pop();

    this.drawOrbitals(modelViewMatrix);
}

CelestialBody.prototype.drawOrbitals = function(modelViewMatrix)
{
    for(var i=0; i<this.orbitals.length; i++)
    {
        this.orbitals[i].draw(modelViewMatrix);
    }
}

CelestialBody.prototype.animate = function(delta)
{
    this.rotX += degToRad((this.rotXSpeed*delta) / 1000.0);
    this.rotY += degToRad((this.rotYSpeed*delta) / 1000.0);

    if(this.orbit)
    {
        this.orbitTheta += degToRad((45*delta) / 1000.0);
    }
}

CelestialBody.prototype.setRotationSpeed = function(x,y)
{
    this.rotXSpeed = x;
    this.rotYSpeed = y;
}

CelestialBody.prototype.setPositionVector = function(position)
{
    this.positionVector = position;
}

CelestialBody.prototype.addOribtal = function(orbital)
{
    this.orbitals.push(orbital);
}

CelestialBody.prototype.makeVertexData = function()
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

            this.normalData.push(x);
            this.normalData.push(y);
            this.normalData.push(z);

            this.vertexPositionData.push(this.radius * x);
            this.vertexPositionData.push(this.radius * y);
            this.vertexPositionData.push(this.radius * z);

            this.textureCoordinateData.push(u);
            this.textureCoordinateData.push(v);
        }
    }

    for (var latitudeNumber = 0; latitudeNumber < this.latitudeBands; latitudeNumber++)
    {
      for (var longitudeNumber = 0; longitudeNumber < this.longitudeBands; longitudeNumber++) {
        var first = (latitudeNumber * (this.longitudeBands + 1)) + longitudeNumber;
        var second = first + this.longitudeBands + 1;
        this.indexData.push(first);
        this.indexData.push(second);
        this.indexData.push(first + 1);

        this.indexData.push(second);
        this.indexData.push(second + 1);
        this.indexData.push(first + 1);
      }
    }
}
