
// Base class for all 3D scene elements

// assumes you've imported view.js and matrix.js

function Element3D ( view ) {
    this.view = view;
    this.children = [ ];
    this.parent = null;
    this.element = null;
    this.myTransform = new Matrix();
    this.compositeTransform = new Matrix();
    this.depth = null;
}
Element3D.prototype.removeChild = function ( child ) {
    var index = this.children.indexOf( child );
    if ( index == -1 ) return;
    child.parent = null;
    this.children.splice( index, 1 );
}
Element3D.prototype.addChild = function ( child ) {
    if ( child.parent instanceof Element3D )
        child.parent.removeChild( child );
    if ( this.children.indexOf( child ) == -1 ) {
        this.children.push( child );
        child.parent = this;
    }
}
Element3D.prototype.copyChildrenTo = function ( other ) {
    for ( var i = 0 ; i < this.children.length ; i++ )
        other.addChild( this.children[i].copy() );
    return other;
}
Element3D.prototype.copy = function () {
    return this.copyChildrenTo( new Element3D( this.view ) );
}
Element3D.prototype.fill = function ( attrs ) {
    for ( var i = 0 ; i < this.children.length ; i++ )
        this.children[i].fill( attrs );
    return this;
}
Element3D.prototype.stroke = function ( attrs ) {
    for ( var i = 0 ; i < this.children.length ; i++ )
        this.children[i].stroke( attrs );
    return this;
}
Element3D.prototype.composeMatrices = function () {
    this.compositeTransform = this.myTransform.copy();
    if ( this.parent instanceof Element3D )
        this.compositeTransform.multiplyLeft(
            this.parent.compositeTransform );
    for ( var i = 0 ; i < this.children.length ; i++ )
        this.children[i].composeMatrices();
}
Element3D.prototype.translate = function ( x, y, z ) {
    if ( x instanceof Point ) {
        var P = x;
        x = P.x;
        y = P.y;
        z = P.z;
    }
    this.myTransform.translate( x, y, z );
    this.composeMatrices();
    return this;
}
Element3D.prototype.scale = function ( x, y, z ) {
    if ( x instanceof Point ) {
        var P = x;
        x = P.x;
        y = P.y;
        z = P.z;
    }
    this.myTransform.scale( x, y, z );
    this.composeMatrices();
    return this;
}
Element3D.prototype.rotateX = function ( radians ) {
    this.myTransform.rotateX( radians );
    this.composeMatrices();
    return this;
}
Element3D.prototype.rotateY = function ( radians ) {
    this.myTransform.rotateY( radians );
    this.composeMatrices();
    return this;
}
Element3D.prototype.rotateZ = function ( radians ) {
    this.myTransform.rotateZ( radians );
    this.composeMatrices();
    return this;
}
Element3D.prototype.multiplyLeft = function ( M ) {
    this.myTransform.multiplyLeft( M );
    this.composeMatrices();
    return this;
}
Element3D.prototype.multiplyLeft = function ( M ) {
    this.myTransform.multiplyLeft( M );
    this.composeMatrices();
    return this;
}
Element3D.prototype.clearTransform = function () {
    this.myTransform = new Matrix();
    this.composeMatrices();
    return this;
}
Element3D.prototype.transformPoint = function ( point ) {
    return this.compositeTransform.apply( point );
}
Element3D.prototype.transformVector = function ( vector ) {
    return this.compositeTransform.applyToVector( vector );
}
Element3D.prototype.setDepth = function ( depth ) {
    this.depth = depth;
}
Element3D.prototype.getDepth = function () { return this.depth; }
Element3D.prototype.applyDepth = function ( attrs ) {
    // don't modify the original; return a modified version
    var result = JSON.parse( JSON.stringify( attrs ) );
    // alter its z-index based on the distance from the camera
    this.element.native().style.zIndex =
        -Math.floor( this.getDepth() * 1000000 );
    // alter its stroke width based on the same datum
    if ( !result.hasOwnProperty( 'width' ) ) result.width = 1;
    var multiplier = this.view.cameraOffset / this.getDepth();
    result.width *= Math.max( 0.1, Math.min( 5.0, multiplier ) );
    // alter its color based on the same datum
    if ( !result.hasOwnProperty( 'color' ) ) result.color = '#000';
    result.color = this.view.fadeColorString( result.color,
                                              this.getDepth() );
    return result;
}
