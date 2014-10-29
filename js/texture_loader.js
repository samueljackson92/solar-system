
function TextureLoader()
{
    this.imageDirectory = "img/";
    this.textureFileNames = {
        "earth": "earthmap1k.jpg",
        "jupiter": "jupitermap.jpg",
        "mars": "marsmap1k.jpg",
        "mercury": "mercurymap.jpg",
        "moon": "moon.gif",
        "neptune": "neptunemap.jpg",
        "saturn_rings": "ringsRGBA.png",
        "saturn": "saturnmap.jpg",
        "sun": "sunmap.jpg",
        "uranus": "uranusmap.jpg",
        "venus": "venusmap.jpg",
        "skybox": [
           "sky/right.png", "sky/left.png",
           "sky/bottom.png", "sky/top.png",
           "sky/front.png", "sky/back.png",
        ]
    };

    this.textures = {};
    for (var key in this.textureFileNames)
    {
        if (this.textureFileNames[key] instanceof Array)
        {
            console.log(this.textureFileNames[key]);
            this.textures[key] = this.createCubeMap(this.textureFileNames[key]);
        }
        else
        {
            this.textures[key] = this.createTexture(this.imageDirectory + this.textureFileNames[key]);
        }
    }
}

TextureLoader.prototype.createTexture = function(uri)
{
    var texture = gl.createTexture();
    texture.image = new Image();
    var parent = this;
    texture.image.onload = function()
    {
        parent.handleLoadedTexture(texture);
    }
    texture.image.src = uri;
    return texture;
}

TextureLoader.prototype.createCubeMap = function(uris)
{
    var parent = this;
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
                parent.handleLoadedCubeMap(texture);
            }
        };
        image.src = this.imageDirectory + uris[i];
        texture.images.push(image);
    }

    return texture;
}

TextureLoader.prototype.handleLoadedTexture = function(texture)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

TextureLoader.prototype.handleLoadedCubeMap = function(texture)
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

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}
