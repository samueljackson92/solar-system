function SceneGraph()
{
    this.matrixStack = [];
    this.drawableObjects = [];
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

        currentDrawable.draw(modelViewMatrix);
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
