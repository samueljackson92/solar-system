function Rings(creationParams)
{
    Cube.call(this, creationParams);
}

Rings.prototype.draw = function(modelViewMatrix)
{
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(45), [0,1,1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [25,0.0,25]);

    this.shaderProgram.setUniforms({
        "modelViewMatrix": modelViewMatrix,
        "perspectiveMatrix": perspectiveMatrix,
        "lightingParameters": {
            "isLightSource": this.isLightSource,
            "lightingPosition": [0,0,0],
            "alpha": 0.8,
            "ambientColor": vec3.fromValues(1.0,1.0,1.0),
        },
        "texture": this.texture,
        "useDarkTexture": false
    });

    Drawable.prototype.draw.call(this, this.shaderProgram);
}

Rings.prototype.animate = function(delta) {}

extend(Cube, Rings);
