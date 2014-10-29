function SkyBox(textureName)
{
    var texture = this.createTexture(textureName);
    Drawable.call(this, texture);

    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositionData), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 24;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this.indexData = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;

    this.vertexTextureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinateData), gl.STATIC_DRAW);
    this.vertexTextureCoordinateBuffer.itemSize = 2;
    this.vertexTextureCoordinateBuffer.numItems = 24;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 24;
    this.fullyLit = true;
}

SkyBox.prototype.initShaders = function(shaderProgram) {
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

    //ambient lighting terms
    this.shaderProgram.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "uAmbientColor");
}

SkyBox.prototype.draw = function(modelViewMatrix)
{
    gl.useProgram(this.shaderProgram);

    //move body to position in scene
    vec3.scale(this.positionVector, this.positionVector, -1);

    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
    mat4.scale(modelViewMatrix, modelViewMatrix, [2000,2000,2000]);

    gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.3,0.3,0.3);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    gl.uniform1i(this.shaderProgram.samplerUniform, 0);

    bindBufferToShader(this.vertexPositionBuffer, this.shaderProgram.vertexPositionAttribute);
    bindBufferToShader(this.vertexTextureCoordinateBuffer, this.shaderProgram.textureCoordAttribute);
    bindBufferToShader(this.vertexNormalBuffer, this.shaderProgram.vertexNormalAttribute);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    setMatrixUniforms(this.shaderProgram, modelViewMatrix);
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

SkyBox.prototype.animate = function(delta) {}

SkyBox.prototype.createTexture = function(uris)
{
    var texture = gl.createTexture();
    var numberOfLoadedTextures = 0;
    texture.images = [];

    for (var i=0; i < uris.length; i++)
    {
        var image = new Image();
        image.onload = function()
        {
            numberOfLoadedTextures++;

            if (numberOfLoadedTextures === 6)
            {
                var targets = [
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];

                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

                for (var j = 0; j < targets.length; j++)
                {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }

                // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                // gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            }
        };
        image.src = uris[i];
        texture.images.push(image);
    }

    return texture;
}

SkyBox.prototype.handleLoadedTexture = function(texture, i)
{

}

extend(Drawable, SkyBox);
