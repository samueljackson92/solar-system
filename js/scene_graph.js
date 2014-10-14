function SceneGraph()
{
    this.matrixStack = [];
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
