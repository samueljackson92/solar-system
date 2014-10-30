function SkyBox(texture)
{
    Cube.call(this, texture, false);
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

    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
    mat4.scale(modelViewMatrix, modelViewMatrix, [10000,10000,10000]);

    gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2,0.2,0.2);
    setMatrixUniforms(this.shaderProgram, modelViewMatrix);
    this.drawModel(this.shaderProgram);
}

SkyBox.prototype.animate = function(delta) {}

extend(Cube, SkyBox);
