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

    this.shaderProgram.setUniforms(this.shaderUniforms);
    Drawable.prototype.draw.call(this, this.shaderProgram);
}

Rings.prototype.animate = function(delta) {}

extend(Cube, Rings);
