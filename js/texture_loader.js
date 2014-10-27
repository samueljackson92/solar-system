
function TextureLoader()
{
    this.imageDirectory = "img/"
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
        // "skybox": "stars_bk.jpg",
    };

    this.textures = {};
    for (var key in this.textureFileNames)
    {
        this.textures[key] = this.createTexture(this.imageDirectory + this.textureFileNames[key]);
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
