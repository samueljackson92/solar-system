function Rings(texture, isLightSource, isBlended)
{
    Cube.call(this, texture, isLightSource, isBlended);
}

Rings.prototype.initShaders = function(shaderProgram) {
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

    this.shaderProgram.alphaUniform = gl.getUniformLocation(this.shaderProgram, "uAlpha");

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

Rings.prototype.draw = function(modelViewMatrix)
{
    gl.useProgram(this.shaderProgram);

    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(45), [0,1,1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [25,0.0,25]);
    gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2,0.2,0.2);

    gl.uniform1f(this.shaderProgram.alphaUniform, 0.8);
    this.setLightingUniforms();
    setMatrixUniforms(this.shaderProgram, modelViewMatrix);

    Drawable.prototype.draw.call(this, this.shaderProgram);
}

Rings.prototype.setLightingUniforms = function()
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
        gl.uniform3f(this.shaderProgram.emissiveColorUniform, 0.2,0.2,0.2);
        gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2,0.2,0.2);
    }

    gl.uniform1f(this.shaderProgram.materialShininess, 3.0);

    // gl.uniform1f(this.shaderProgram.noDirectionalLight, true);
    // gl.uniform3f(this.shaderProgram.nonDirectionalAmbientLighting, 0.2, 0.2, 0.2);

    //light attentuation factors
    gl.uniform1f(this.shaderProgram.constantLightAttenuation, 0.0001);
    gl.uniform1f(this.shaderProgram.linearLightAttenuation, 0.0001);
    gl.uniform1f(this.shaderProgram.quadraticLightAttenuation, 0.00001);
    gl.uniform1f(this.shaderProgram.alphaUniform, 1.0);
}

Rings.prototype.animate = function(delta) {}

extend(Cube, Rings);
