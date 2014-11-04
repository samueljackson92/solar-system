function SkyBox(creationParams)
{
    Cube.call(this, creationParams);
}

SkyBox.prototype.draw = function(modelViewMatrix)
{
    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
    mat4.scale(modelViewMatrix, modelViewMatrix, [10000,10000,10000]);

    this.shaderUniforms.modelViewMatrix = modelViewMatrix;
    this.shaderUniforms.perspectiveMatrix = perspectiveMatrix;

    this.shaderProgram.setUniforms(this.shaderUniforms);
    Drawable.prototype.draw.call(this, this.shaderProgram);
}

SkyBox.prototype.animate = function(delta) {}

extend(Cube, SkyBox);
