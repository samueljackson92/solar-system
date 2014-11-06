function Drawable(creationParams)
{
    //texture object defining look of the body
    this.shaderProgram = creationParams.shader;
    this.shaderUniforms = creationParams.shaderUniforms;

    if(this.shaderUniforms.lightingParameters === undefined)
    {
        this.shaderUniforms.lightingParameters = {};
    }

    if(this.shaderUniforms.textures === undefined)
    {
        this.shaderUniforms.textures = {};
    }

    // data arrays for vertices, normals etc.
    this.vertexPositionData = [];
    this.normalData = [];
    this.textureCoordinateData = [];
    this.indexData = [];

    this.vertexPositionBuffer = null;
    this.vertexNormalBuffer = null;
    this.vertexTextureCoordinateBuffer = null;
    this.vertexIndexBuffer = null;

    this.positionVector = vec3.fromValues(0,0,0);
    this.isBlended = (creationParams.isBlended !== undefined && creationParams.isBlended !== false);
}

Drawable.prototype.initBuffers = function()
{
    this.vertexPositionBuffer = createArrayBuffer(this.vertexPositionData, 3);
    this.vertexTextureCoordinateBuffer = createArrayBuffer(this.textureCoordinateData, 2);
    this.vertexNormalBuffer = createArrayBuffer(this.normalData, 3);
    this.vertexIndexBuffer = createElementArrayBuffer(this.indexData, 1);
}

Drawable.prototype.setPositionVector = function(position)
{
    this.positionVector = position;
}

Drawable.prototype.draw= function(shaderProgram)
{
    bindBufferToShader(this.vertexPositionBuffer, shaderProgram.vertexPositionAttribute);
    bindBufferToShader(this.vertexTextureCoordinateBuffer, shaderProgram.textureCoordAttribute);
    bindBufferToShader(this.vertexNormalBuffer, shaderProgram.vertexNormalAttribute);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function Cube(creationParams)
{
    Drawable.call(this, creationParams);

    this.vertexPositionData = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];

    this.indexData = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];

    this.textureCoordinateData = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];

    this.normalData = [
      // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

      // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

      // Top face
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

      // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

      // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

      // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
    ];
}

extend(Drawable, Cube);

function Sphere(creationParams)
{
    Drawable.call(this, creationParams);

    this.vertexTangentData = [];
    this.vertexBitangentData = [];

    this.vertexTangentBuffer = null;
    this.vertexBitangentBuffer = null;

    var latitudeBands = creationParams.dimensions.latitude;
    var longitudeBands = creationParams.dimensions.longitude;
    var radius = creationParams.dimensions.radius;

    for(var latitudeNumber = 0; latitudeNumber <= latitudeBands; latitudeNumber++)
    {
        var theta = latitudeNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for(longitudeNumber = 0; longitudeNumber <= longitudeBands; longitudeNumber++)
        {
            var phi = longitudeNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            var u = 1 - (longitudeNumber / longitudeBands);
            var v = 1 - (latitudeNumber / latitudeBands);

            this.normalData.push(x);
            this.normalData.push(y);
            this.normalData.push(z);

            this.vertexPositionData.push(radius * x);
            this.vertexPositionData.push(radius * y);
            this.vertexPositionData.push(radius * z);

            this.textureCoordinateData.push(u);
            this.textureCoordinateData.push(v);
        }
    }

    for (var latitudeNumber = 0; latitudeNumber < latitudeBands; latitudeNumber++)
    {
      for (var longitudeNumber = 0; longitudeNumber < longitudeBands; longitudeNumber++) {
        var first = (latitudeNumber * (longitudeBands + 1)) + longitudeNumber;
        var second = first + longitudeBands + 1;
        this.indexData.push(first);
        this.indexData.push(second);
        this.indexData.push(first + 1);

        this.indexData.push(second);
        this.indexData.push(second + 1);
        this.indexData.push(first + 1);
      }
    }

    this.computeTangentVectors(latitudeBands, longitudeBands);
}

Sphere.prototype.initBuffers = function()
{
    Drawable.prototype.initBuffers.call(this);

    this.vertexTangentBuffer = createArrayBuffer(this.vertexTangentData, 3);
    this.vertexBitangentBuffer = createArrayBuffer(this.vertexBitangentData, 3);
}

Sphere.prototype.getTextureVector = function(index)
{
    var u = this.textureCoordinateData[index*2];
    var v = this.textureCoordinateData[index*2+1];
    return vec2.fromValues(u,v);
}

Sphere.prototype.getVertexPositionVector = function(index)
{
    var x = this.vertexPositionData[index*3];
    var y = this.vertexPositionData[index*3+1];
    var z = this.vertexPositionData[index*3+2];
    return vec3.fromValues(x,y,z);
}

Sphere.prototype.getNormal = function(index)
{
    var x = this.normalData[index*3];
    var y = this.normalData[index*3+1];
    var z = this.normalData[index*3+2];
    return vec3.fromValues(x,y,z);
}

Sphere.prototype.generateNormalAndTangent = function(normal,v1,v2,st1,st2)
{
    var tangent = vec3.create();
    var binormal = vec3.create();

    var coef = 1.0 / (st1[0] * st2[1] - st2[0] * st1[1]);

    tangent[0] = coef * ((v1[0] * st2[1]) + (v2[0] * - st1[1]));
    tangent[1] = coef * ((v1[1] * st2[1]) + (v2[1] * - st1[1]));
    tangent[2] = coef * ((v1[2] * st2[1]) + (v2[2] * - st1[1]));

    vec3.cross(binormal, normal, tangent);

    return {'normal': normal, 'tangent': tangent, 'binormal': binormal};
}

Sphere.prototype.computeTangentVectors = function(latitudeBands, longitudeBands)
{

    for(var latitudeNumber = 0; latitudeNumber <= latitudeBands; latitudeNumber++)
    {
        var firstIndex = 0;
        for(longitudeNumber = 0; longitudeNumber <= longitudeBands; longitudeNumber++)
        {
            var index = latitudeNumber*latitudeBands + longitudeNumber;
            var adjacentIndex = index+1;

            if(longitudeNumber === 0) {
                firstIndex = index;
            }

            if(longitudeNumber === longitudeBands) {
                adjacentIndex = firstIndex;
            }

            var v0 = this.getVertexPositionVector(index);
            var v1 = this.getVertexPositionVector(index+1);

            var uv0 = this.getTextureVector(index);
            var uv1 = this.getTextureVector(index+1);

            var normal = this.getNormal(index);

            tbn = this.generateNormalAndTangent(normal,v0,v1,uv0,uv1);

            for (var j=0; j < 3; j++)
            {
                this.vertexTangentData.push(tbn.tangent[j]);
                this.vertexBitangentData.push(tbn.binormal[j]);
            }

        }
    }
};

extend(Drawable, Sphere);
