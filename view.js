
// An instance of this class connects a collection of Element3D instances
// (each of which must be given this view at construction time) to an SVG.js
// drawing instance, and can do projection from 3D space onto that drawing;
// the drawing is the first parameter.
// It is assumed that the camera is located at (0,0,-C) for some C>0, which
// is the first parameter to the constructor.
// Furthermore, we assume that some scaling needs to be done to zoom the
// camera in/out as much as the // client prefers; this is the second
// parameter.  Only its X and Y values matter.

// assumes you've imported point.js

function View ( drawing, cameraOffset, scaling ) {
    if ( typeof( drawing ) == 'undefined' )
        drawing = null;
    if ( typeof( cameraOffset ) == 'undefined' )
        cameraOffset = 5;
    if ( typeof( scaling ) == 'undefined' )
        scaling = new Point( 50, 50, 1 );
    this.cameraOffset = cameraOffset;
    this.scaling = scaling;
    this.drawing = drawing;
    this.pendingSortByZ = null;
}
View.prototype.project = function ( point ) {
    // assumes camera is at (0,0,cameraOffset),
    // looking towards the origin, with <0,1,0> being up.
    // returns a point in the xy plane on the line between
    // the camera and the given point.  clip as you like.
    var zdist = point.z + this.cameraOffset;
    var ratio = this.cameraOffset / zdist;
    var depth = point.minus( new Point( 0, 0, -this.cameraOffset ) )
                     .length();
    var simple = new Point( point.x * ratio, point.y * ratio, depth );
    var scaled = simple.scaled( this.scaling );
    scaled.y = -scaled.y;
    var centered = scaled.plus( new Point( this.drawing.width() / 2,
                                           this.drawing.height() / 2, 0 ) );
    if ( !this.pendingSortByZ ) {
        var that = this;
        this.pendingSortByZ = setTimeout( function () {
            that.sortByZ();
            that.pendingSortByZ = null;
        }, 0 );
    }
    return [ centered.x, centered.y, depth ];
}
View.prototype.sortByZ = function () {
    var elements = this.drawing.select( '*' ).valueOf();
    function depth ( element ) {
        return element.native().style.zIndex ?
               parseInt( element.native().style.zIndex ) : 0;
    }
    elements.sort( function compare ( a, b ) {
        return depth( a ) - depth( b );
    } );
    elements.map( function ( element ) { element.front(); } );
}
View.sixHexToRGB = function ( sixHex ) {
    return [ parseInt( sixHex.substring( 0, 2 ), 16 ),
             parseInt( sixHex.substring( 2, 4 ), 16 ),
             parseInt( sixHex.substring( 4, 6 ), 16 ) ];
}
View.colorStringToRGB = function ( colorString ) {
    var context = document.createElement( 'canvas' ).getContext( '2d' );
    context.fillStyle = colorString;
    return View.sixHexToRGB( context.fillStyle.substring( 1 ) );
}
View.RGBToColorString = function ( r, g, b ) {
    function pad ( x ) { return ( x.length == 1 ) ? ( '0' + x ) : x; }
    if ( r instanceof Array ) {
        var tmp = r;
        r = tmp[0];
        g = tmp[1];
        b = tmp[2];
    }
    return '#' + pad( Number( Math.floor( r + 0.5 ) ).toString( 16 ) )
               + pad( Number( Math.floor( g + 0.5 ) ).toString( 16 ) )
               + pad( Number( Math.floor( b + 0.5 ) ).toString( 16 ) );
}
View.prototype.fadeColorString =
function ( colorString, depth, fadeColorString ) {
    if ( typeof( fadeColorString ) == 'undefined' )
        fadeColorString = '#fff';
    var minDepth = this.cameraOffset / 2;
    var maxDepth = this.cameraOffset * 2;
    var index = ( depth - minDepth ) / ( maxDepth - minDepth );
    index = Math.min( 1.0, Math.max( 0.0, index ) );
    var color = View.colorStringToRGB( colorString );
    var fade = View.colorStringToRGB( fadeColorString );
    var result = View.RGBToColorString(
        ( 1 - index ) * color[0] + index * fade[0],
        ( 1 - index ) * color[1] + index * fade[1],
        ( 1 - index ) * color[2] + index * fade[2] );
    return result;
}
