
// A representation of a path in space comprised of many connected line
// segments.  Can be used to approximately graph curves, by choosing enough
// line segments so that each is too small to notice the linearity.
// Implemented by creating many LineSegment instances as child nodes.

// assumes you've imported linesegment.js

function Polyline3D ( view, points ) {
    Element3D.call( this, view );
    if ( typeof( points ) == 'undefined' ) points = [ ];
    if ( points.length > 0 ) {
        if ( typeof( points[0] ) == 'number' ) {
            var newPoints = [ ];
            for ( var i = 0 ; i < points.length ; i += 3 )
                newPoints.push( [ points[i], points[i+1], points[i+2] ] );
            points = newPoints;
        }
        if ( points[0] instanceof Array ) {
            for ( var i = 0 ; i < points.length ; i++ )
                points[i] = new Point(
                    points[i][0], points[i][1], points[i][2] );
        }
    }
    for ( var i = 0 ; i < points.length - 1 ; i++ )
        this.addChild( new LineSegment( view, points[i], points[i+1] ) );
}
// inherit...
Polyline3D.prototype = Object.create( Element3D.prototype );
Polyline3D.prototype.constructor = Polyline3D;
