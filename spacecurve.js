
// A specialization of Polyline3D that just makes it easy to graph a
// parameterized curve in space.

// assumes you've imported polyline3d.js

function SpaceCurve ( view, f, a, b, n ) {
    if ( typeof( a ) == 'undefined' ) a = 0;
    if ( typeof( b ) == 'undefined' ) b = 1;
    if ( typeof( n ) == 'undefined' ) n = 100;
    var points = [ ];
    for ( var i = 0 ; i < n ; i++ ) {
        var t = a + ( b - a ) * i / ( n - 1 );
        points.push( f( t ) );
    }
    Polyline3D.call( this, view, points );
}
// inherit...
SpaceCurve.prototype = Object.create( Polyline3D.prototype );
SpaceCurve.prototype.constructor = SpaceCurve;
