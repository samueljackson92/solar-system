function ShaderProgram(vertexShaderName, fragmentShaderName, globalUniforms)
{
    this.globalUniforms = globalUniforms;
    this.shaderProgram = this.loadShaders(vertexShaderName, fragmentShaderName);
}

ShaderProgram.prototype.loadShaders = function(vertexShaderName, fragmentShaderName)
{
    var fragmentShader = getShader(gl, vertexShaderName);
    var vertexShader = getShader(gl, fragmentShaderName);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders!");
    }

    return shaderProgram;
};

ShaderProgram.prototype.init = function()
{
    gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(this.vertexNormalAttribute);

    this.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(this.textureCoordAttribute);

    //perspective, model-view, and normal matricies
    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uNMatrix");

    //texture sampler
    this.samplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");

    //ambient lighting term
    this.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "uAmbientColor");
};

ShaderProgram.prototype.setUniforms = function(uniforms)
{
    gl.useProgram(this.shaderProgram);
    gl.uniformMatrix4fv(this.pMatrixUniform, false, uniforms.perspectiveMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, uniforms.modelViewMatrix);

    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, uniforms.modelViewMatrix);
    gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);

    gl.uniform3fv(this.ambientColorUniform, uniforms.lightingParameters.ambientColor);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(textureLoader.textures[uniforms.textures.texture].texType, textureLoader.textures[uniforms.textures.texture]);
    gl.uniform1i(this.samplerUniform, 0);
};

function BasicShader(vertexShaderName, fragmentShaderName, globalUniforms)
{
    ShaderProgram.call(this, vertexShaderName, fragmentShaderName, globalUniforms);
}

extend(ShaderProgram, BasicShader);

function CelestialBodyShader(vertexShaderName, fragmentShaderName, globalUniforms)
{
    ShaderProgram.call(this, vertexShaderName, fragmentShaderName, globalUniforms);
}

CelestialBodyShader.prototype.init = function()
{
    ShaderProgram.prototype.init.call(this);

    this.useDarkTexture = gl.getUniformLocation(this.shaderProgram, "useNightTexture");
    this.samplerDarkUniform = gl.getUniformLocation(this.shaderProgram, "uSamplerDark");

    this.useAtmosphere = gl.getUniformLocation(this.shaderProgram, "useAtmosphere");
    this.sampleAtmosphereUniform = gl.getUniformLocation(this.shaderProgram, "uSamplerAtmosphere");
    this.atmosphereRotation = gl.getUniformLocation(this.shaderProgram, "uAtmosphereRotation");

    this.alphaUniform = gl.getUniformLocation(this.shaderProgram, "uAlpha");

    //general lighting parameters
    this.emissiveColorUniform = gl.getUniformLocation(this.shaderProgram, "uEmissiveColor");
    this.materialShininess = gl.getUniformLocation(this.shaderProgram, "uMaterialShininess");

    //light attenuation parameters
    this.constantLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uConstantLightAttenuation");
    this.linearLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uLinearLightAttenuation");
    this.quadraticLightAttenuation = gl.getUniformLocation(this.shaderProgram, "uQuadraticLightAttenuation");

    //parameters for point lighting
    this.pointLightingLocationUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingLocation");
    this.pointLightingColorUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingColor");

    //parameters for turning off directional lighting on an object (e.g. the sun/skybox)
    this.noDirectionalLight = gl.getUniformLocation(this.shaderProgram, "uNoDirectionalLight");
    this.nonDirectionalAmbientLighting = gl.getUniformLocation(this.shaderProgram, "uNonDirectionalAmbientLighting");
};

CelestialBodyShader.prototype.setUniforms = function(uniforms)
{
    ShaderProgram.prototype.setUniforms.call(this, uniforms);

    //we only have one light source for now.
    gl.uniform3fv(this.pointLightingLocationUniform, this.globalUniforms.pointLightLocation);
    gl.uniform3fv(this.pointLightingColorUniform, this.globalUniforms.pointLightColor);
    gl.uniform1f(this.materialShininess, this.globalUniforms.materialShininess);
    //light attentuation factors
    gl.uniform1f(this.constantLightAttenuation, this.globalUniforms.lightAttenuation.constant);
    gl.uniform1f(this.linearLightAttenuation, this.globalUniforms.lightAttenuation.linear);
    gl.uniform1f(this.quadraticLightAttenuation, this.globalUniforms.lightAttenuation.quadratic);

    if(uniforms.isLightSource)
    {
        gl.uniform3fv(this.emissiveColorUniform, this.globalUniforms.emissiveColor);
    }
    else
    {
        gl.uniform3f(this.emissiveColorUniform, 0,0,0);
    }

    gl.uniform1i(this.shaderProgram.noDirectionalLight, uniforms.noDirectionalLight);
    gl.uniform1f(this.alphaUniform, uniforms.lightingParameters.alpha);

    //setup sampler for night side texture
    gl.uniform1i(this.useDarkTexture, uniforms.textures.useDarkTexture);
    if(uniforms.textures.useDarkTexture)
    {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(textureLoader.textures[uniforms.textures.textureDark].texType, textureLoader.textures[uniforms.textures.textureDark]);
        gl.uniform1i(this.samplerDarkUniform, 1);
    }

    //setup sampler for atmosphere texture
    gl.uniform1i(this.useAtmosphere, uniforms.textures.useAtmosphere);
    if(uniforms.textures.useAtmosphere)
    {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(textureLoader.textures[uniforms.textures.textureAtmosphere].texType, textureLoader.textures[uniforms.textures.textureAtmosphere]);
        gl.uniform1i(this.sampleAtmosphereUniform, 2);
        gl.uniform1f(this.atmosphereRotation, uniforms.atmosphereRotation);
    }
};

extend(ShaderProgram, CelestialBodyShader);
