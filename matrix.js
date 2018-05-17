
// A 4x4 matrix class that deals with points and vectors in
// homogeneous coordinates.

// assumes you've imported point.js

function Matrix ( entries ) {
    var identity = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    if ( !( entries instanceof Array ) )
        entries = identity;
    if ( entries.length > 16 )
        entries = entries.slice( 0, 16 );
    while ( entries.length < 16 )
        entries.push( identity[entries.length] );
    this.entries = entries;
}
Matrix.prototype.toString = function () {
    var result = '';
    for ( var i = 0 ; i < 16 ; i++ ) {
        if ( i % 4 == 0 ) result += '[ ';
        result += Number( this.entries[i] ).toFixed( 4 ) + ' ';
        if ( i % 4 == 3 ) {
            result += ']';
            if ( i < 15 ) result += '\n';
        }
    }
    return result;
}
Matrix.prototype.copy = function () {
    return new Matrix( this.entries.slice() );
}
Matrix.prototype.entry = function ( row, col ) {
    return this.entries[row*4+col];
}
Matrix.prototype.multiplyRight = function ( M ) {
    var result = [ ];
    for ( var i = 0 ; i < 4 ; i++ ) {
        for ( var j = 0 ; j < 4 ; j++ ) {
            var entry = 0;
            for ( var k = 0 ; k < 4 ; k++ )
                entry += this.entry(i,k) * M.entry(k,j);
            result.push( entry );
        }
    }
    this.entries = result;
}
Matrix.prototype.multiplyLeft = function ( M ) {
    var result = [ ];
    for ( var i = 0 ; i < 4 ; i++ ) {
        for ( var j = 0 ; j < 4 ; j++ ) {
            var entry = 0;
            for ( var k = 0 ; k < 4 ; k++ )
                entry += M.entry(i,k) * this.entry(k,j);
            result.push( entry );
        }
    }
    this.entries = result;
}
Matrix.prototype.translate = function ( x, y, z ) {
    this.multiplyLeft( new Matrix( [ 1, 0, 0, x,
                                     0, 1, 0, y,
                                     0, 0, 1, z,
                                     0, 0, 0, 1 ] ) );
}
Matrix.prototype.scale = function ( x, y, z ) {
    this.multiplyLeft( new Matrix( [ x, 0, 0, 0,
                                     0, y, 0, 0,
                                     0, 0, z, 0,
                                     0, 0, 0, 1 ] ) );
}
Matrix.prototype.rotateX = function ( radians ) {
    var s = Math.sin( radians );
    var c = Math.cos( radians );
    this.multiplyLeft( new Matrix( [ 1, 0,  0, 0,
                                     0, c, -s, 0,
                                     0, s,  c, 0,
                                     0, 0,  0, 1 ] ) );
}
Matrix.prototype.rotateY = function ( radians ) {
    var s = Math.sin( radians );
    var c = Math.cos( radians );
    this.multiplyLeft( new Matrix( [ c, 0, s, 0,
                                     0, 1, 0, 0,
                                    -s, 0, c, 0,
                                     0, 0, 0, 1 ] ) );
}
Matrix.prototype.rotateZ = function ( radians ) {
    var s = Math.sin( radians );
    var c = Math.cos( radians );
    this.multiplyLeft( new Matrix( [ c, -s, 0, 0,
                                     s,  c, 0, 0,
                                     0,  0, 1, 0,
                                     0,  0, 0, 1 ] ) );
}
Matrix.prototype.apply = function ( point ) {
    var e = this.entries;
    return new Point(
        e[0] *point.x + e[1] *point.y + e[2] *point.z + e[3],
        e[4] *point.x + e[5] *point.y + e[6] *point.z + e[7],
        e[8] *point.x + e[9] *point.y + e[10]*point.z + e[11],
        e[12]*point.x + e[13]*point.y + e[14]*point.z + e[15]
    );
}
Matrix.prototype.applyToVector = function ( vector ) {
    var e = this.entries;
    return new Point(
        e[0] *point.x + e[1] *point.y + e[2] *point.z,
        e[4] *point.x + e[5] *point.y + e[6] *point.z,
        e[8] *point.x + e[9] *point.y + e[10]*point.z,
        e[12]*point.x + e[13]*point.y + e[14]*point.z
    );
}
