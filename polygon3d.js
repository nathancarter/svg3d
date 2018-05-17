
// Typically a leaf in the scene graph, this can be a polygon of any degree,
// but is typically a triangle or quad in practice, and typically planar.

// assumes you've imported element3d.js

function Polygon3D ( view, vertices ) {
    Element3D.call( this, view );
    if ( typeof( vertices ) == 'undefined' ) vertices = [ ];
    if ( ( vertices.length > 0 )
      && ( typeof( vertices[0] ) == 'number' ) ) {
        var newVertices = [ ];
        for ( var i = 0 ; i < vertices.length ; i += 3 )
            newVertices.push(
                [ vertices[i], vertices[i+1], vertices[i+2] ] );
        vertices = newVertices;
    }
    this.vertices = vertices.slice();
    for ( var i = 0 ; i < this.vertices.length ; i++ ) {
        if ( this.vertices[i] instanceof Array ) {
            this.vertices[i] = new Point( this.vertices[i][0],
                                          this.vertices[i][1],
                                          this.vertices[i][2] );
        } else {
            this.vertices[i] = this.vertices[i].copy();
        }
    }
    this.element = this.view.drawing.polygon();
}
// inherit...
Polygon3D.prototype = Object.create( Element3D.prototype );
Polygon3D.prototype.constructor = Polygon3D;
// now define class...
Polygon3D.prototype.copy = function () {
    return this.copyChildrenTo( new Polygon3D( this.view, this.vertices ) );
}
Polygon3D.prototype.update = function () {
    var depth = 0;
    var that = this;
    this.viewVertices = this.vertices.map( function ( vertex ) {
        var result = that.view.project( that.transformPoint( vertex ) );
        depth += result[2];
        return result.slice( 0, 2 );
    } );
    this.setDepth( depth / this.vertices.length );
    return this.element.plot( this.viewVertices );
}
Polygon3D.prototype.fill = function ( attrs ) {
    var newAttrs = this.applyDepth( attrs );
    this.update().fill( newAttrs );
    return Element3D.prototype.fill.call( this, newAttrs );
}
Polygon3D.prototype.stroke = function ( attrs ) {
    this.update();
    var newAttrs = this.applyDepth( attrs );
    if ( !newAttrs.hasOwnProperty( 'linejoin' ) )
        newAttrs.linejoin = 'round';
    if ( !newAttrs.hasOwnProperty( 'linecap' ) )
        newAttrs.linecap = 'round';
    this.element.stroke( newAttrs );
    return Element3D.prototype.fill.call( this, newAttrs );
}
