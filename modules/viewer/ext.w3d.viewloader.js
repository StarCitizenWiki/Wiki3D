'use strict';
$( function () {
	let w3dConfig = mw.config.get( 'w3d' );
	if ( w3dConfig !== null ) {
		if ( 'ctm' in w3dConfig ) {
			for ( let id in w3dConfig[ 'ctm' ][ 'configs' ] ) {
				w3dConfig[ 'ctm' ][ 'viewers' ].push( new mw.w3d.CtmViewer( w3dConfig[ 'ctm' ][ 'configs' ][ id ] ) );
			}
		}
		if ( 'collada' in w3dConfig ) {
			for ( let i = 0; i < w3dConfig[ 'collada' ][ 'configs' ].length; i++ ) {
				w3dConfig[ 'collada' ][ 'viewers' ].push( new mw.w3d.ColladaViewer( w3dConfig[ 'collada' ][ 'configs' ][ i ] ) );
			}
		}
	}
	mw.config.set( 'w3d', w3dConfig );
} );
