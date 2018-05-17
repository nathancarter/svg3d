
// A class for representing a 3D point (or a 3D vector; we won't be picky
// about the distinction here)

function Point ( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
}
Point.prototype.toString = function () {
    return '(' + Number( this.x ).toFixed( 4 )
         + ',' + Number( this.y ).toFixed( 4 )
         + ',' + Number( this.z ).toFixed( 4 ) + ')';
}
Point.prototype.copy = function () {
    return new Point( this.x, this.y, this.z );
}
Point.prototype.length = function () {
    return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );
}
Point.prototype.plus = function ( Q ) {
    return new Point( this.x+Q.x, this.y+Q.y, this.z+Q.z );
}
Point.prototype.scaled = function ( v ) {
    if ( typeof( v ) == 'number' ) v = new Point( v, v, v );
    return new Point( this.x*v.x, this.y*v.y, this.z*v.z );
}
Point.prototype.rotatedX = function ( radians ) {
    return new Point( this.x,
                      this.y*Math.cos(radians) - this.z*Math.sin(radians),
                      this.y*Math.sin(radians) + this.z*Math.cos(radians) );
}
Point.prototype.rotatedY = function ( radians ) {
    return new Point( this.x*Math.cos(radians) + this.z*Math.sin(radians),
                      this.y,
                     -this.x*Math.sin(radians) + this.z*Math.cos(radians) );
}
Point.prototype.rotatedZ = function ( radians ) {
    return new Point( this.x*Math.cos(radians) - this.y*Math.sin(radians),
                      this.x*Math.sin(radians) + this.y*Math.cos(radians),
                      this.z );
}
Point.prototype.negated = function () { return this.scaled( -1 ); }
Point.prototype.minus = function ( Q ) { return this.plus( Q.negated() ); }
Point.prototype.unit = function () {
    var len = this.length();
    return ( len == 0 ) ? this.copy() : this.scaled( 1/len );
}
Point.prototype.dot = function ( v ) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
}
Point.prototype.cross = function ( v ) {
    return new Point( this.y*v.z - this.z*v.y,
                      -( this.x*v.z - this.z*v.x ),
                      this.x*v.y - this.y*v.x );
}
