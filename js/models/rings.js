function Rings(creationParams)
{
    Cube.call(this, creationParams);
    this.rotation = vec3.fromValues(0,0,0);
    this.rotationSpeed = vec3.fromValues(0,0,0);
    this.axisTilt = 0;

    this.setRotation(creationParams.rotation);
}

Rings.prototype.draw = function(modelViewMatrix)
{
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.axisTilt), [0,1,1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [200,0.0,200]);

    //rotation about axis
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotation[0]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotation[1]);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotation[2]);

    this.shaderUniforms.modelViewMatrix = modelViewMatrix;
    this.shaderUniforms.perspectiveMatrix = perspectiveMatrix;

    this.shaderProgram.setUniforms(this.shaderUniforms);
    Drawable.prototype.draw.call(this, this.shaderProgram);
};

Rings.prototype.animate = function(delta)
{
    var deltaRotation = vec3.create();
    vec3.scale(deltaRotation, this.rotationSpeed, delta / 1000.0);
    vec3.scale(deltaRotation, deltaRotation,  Math.PI / 180);
    vec3.add(this.rotation, this.rotation, deltaRotation);
};

Rings.prototype.setRotation = function(params)
{
    if(params)
    {
        this.rotationSpeed = params.speed;
        this.axisTilt = params.tilt;
    }
};

extend(Cube, Rings);
