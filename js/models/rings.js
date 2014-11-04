function Rings(creationParams)
{
    Cube.call(this, creationParams);
}

Rings.prototype.draw = function(modelViewMatrix)
{
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(45), [0,1,1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [25,0.0,25]);

    this.shaderUniforms.modelViewMatrix = modelViewMatrix;
    this.shaderUniforms.perspectiveMatrix = perspectiveMatrix;

    this.shaderUniforms.lightingParameters = {};
    this.shaderUniforms.lightingParameters.ambientColor = vec3.fromValues(1.0,1.0,1.0);
    this.shaderUniforms.lightingParameters.lightingPosition = vec3.fromValues(0.0,0.0,0.0); //we only have one light source
    this.shaderUniforms.lightingParameters.alpha = 0.8;

    this.shaderProgram.setUniforms(this.shaderUniforms);
    Drawable.prototype.draw.call(this, this.shaderProgram);
}

Rings.prototype.animate = function(delta) {}

extend(Cube, Rings);
