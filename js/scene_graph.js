function SceneGraph()
{
    this.matrixStack = [];
    this.drawableObjects = [];

    this.blendedObjects = [];
    this.blendedMatrices = [];
}

SceneGraph.prototype.push = function(matrix)
{
    var copy = mat4.clone(matrix);
    this.matrixStack.push(copy);
}

SceneGraph.prototype.pop = function()
{
    if(this.matrixStack.length == 0)
    {
        throw "SceneGraph: Matrix stack is empty!";
    }
    return this.matrixStack.pop();
}

SceneGraph.prototype.addDrawableObject = function(drawable)
{
    this.drawableObjects.push(drawable);
}

SceneGraph.prototype.drawScene = function(modelViewMatrix)
{
    this.drawObjects(this.drawableObjects, modelViewMatrix);

    while (this.blendedObjects.length > 0)
    {
        var blendedItem = this.blendedObjects.pop();
        modelViewMatrix = this.blendedMatrices.pop();

        // gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.depthFunc(gl.LESS);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        blendedItem.draw(modelViewMatrix);

        gl.disable(gl.BLEND);
        // gl.enable(gl.DEPTH_TEST);
    }
}

SceneGraph.prototype.drawObjects = function(drawList, modelViewMatrix)
{
    for (var i=0; i < drawList.length; i++)
    {
        this.push(modelViewMatrix);
        var currentDrawable = drawList[i];

        //check if this is a celestial body and needs further drawing operations
        if(currentDrawable instanceof CelestialBody)
        {
            currentDrawable.subSystemTransforms(modelViewMatrix);

            this.push(modelViewMatrix);
            var children = currentDrawable.getChildren();
            this.drawObjects(children, modelViewMatrix);
            modelViewMatrix = this.pop();
        }

        if(currentDrawable.isBlended)
        {
            this.blendedObjects.push(currentDrawable);
            this.blendedMatrices.push(mat4.clone(modelViewMatrix));
        }
        else
        {
            currentDrawable.draw(modelViewMatrix);
        }
        modelViewMatrix = this.pop();
    }
}

SceneGraph.prototype.animateScene = function(delta)
{
    this.doAnimate(this.drawableObjects, delta);
}

SceneGraph.prototype.doAnimate = function(drawList, delta)
{
    for (var i=0; i < drawList.length; i++)
    {
        drawList[i].animate(delta);
        if(typeof drawList[i].getChildren === 'function')
        {
            var children = drawList[i].getChildren();
            this.doAnimate(children, delta);
        }
    }
}

SceneGraph.prototype.initBuffers = function()
{
    this.doInitBuffers(this.drawableObjects);
}

SceneGraph.prototype.doInitBuffers = function(drawList)
{
    for (var i=0; i < drawList.length; i++)
    {
        drawList[i].initBuffers();
        if(typeof drawList[i].getChildren === 'function')
        {
            var children = drawList[i].getChildren();
            this.doInitBuffers(children);
        }
    }
}
