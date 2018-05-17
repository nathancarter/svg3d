
// Usually a leaf node in the scene graph.
// Polyline3D objects are comprised of many (usually 100's) of these.

// assumes you've imported element3d.js

function LineSegment ( view, P, Q ) {
    Element3D.call( this, view );
    this.P = P;
    this.Q = Q;
    this.element = this.view.drawing.line();
}
// inherit...
LineSegment.prototype = Object.create( Element3D.prototype );
LineSegment.prototype.constructor = LineSegment;
// now define class...
LineSegment.prototype.copy = function () {
    return this.copyChildrenTo(
        new LineSegment( this.view, this.P, this.Q ) );
}
LineSegment.prototype.update = function () {
    this.viewP = this.view.project( this.transformPoint( this.P ) );
    this.viewQ = this.view.project( this.transformPoint( this.Q ) );
    this.setDepth( ( this.viewP[2] + this.viewQ[2] ) / 2 );
    return this.element.plot( this.viewP[0], this.viewP[1],
                              this.viewQ[0], this.viewQ[1] );
}
LineSegment.prototype.fill = function ( attrs ) {
    var newAttrs = this.applyDepth( attrs );
    this.update().fill( newAttrs );
    return Element3D.prototype.fill.call( this, newAttrs );
}
LineSegment.prototype.stroke = function ( attrs ) {
    this.update();
    var newAttrs = this.applyDepth( attrs );
    if ( !newAttrs.hasOwnProperty( 'linejoin' ) )
        newAttrs.linejoin = 'round';
    if ( !newAttrs.hasOwnProperty( 'linecap' ) )
        newAttrs.linecap = 'round';
    this.element.stroke( newAttrs );
    return Element3D.prototype.fill.call( this, newAttrs );
}
LineSegment.prototype.center = function () {
    var A = this.transformPoint( this.start );
    var B = this.transformPoint( this.end );
    return A.plus( B ).scaled( 1/2 );
}
