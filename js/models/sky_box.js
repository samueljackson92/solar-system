function SkyBox(texture)
{
    Cube.call(this, texture, false);
}

SkyBox.prototype.initShaders = function(shaderProgram) {
    this.shaderProgram = shaderProgram;
}

SkyBox.prototype.draw = function(modelViewMatrix)
{
    mat4.translate(modelViewMatrix, modelViewMatrix, this.positionVector);
    mat4.scale(modelViewMatrix, modelViewMatrix, [10000,10000,10000]);

    this.shaderProgram.setUniforms({
        "modelViewMatrix": modelViewMatrix,
        "perspectiveMatrix": perspectiveMatrix,
        "lightingParameters": {
            "isLightSource": this.isLightSource,
            "lightingPosition": [0,0,0],
            "alpha": 1.0,
            "ambientColor": vec3.fromValues(0.5,0.5,0.5),
        }
    });

    Drawable.prototype.draw.call(this, this.shaderProgram);
}

SkyBox.prototype.animate = function(delta) {}

extend(Cube, SkyBox);
