'use strict';
$( function () {
	if ( mw.config.get( 'w3d-ctm' ) !== null ) {
		let config;

		config = mw.config.get( 'w3d-ctm' );

		for ( let i = 0; i < config[ 'configs' ].length; i++ ) {
			config[ 'viewers' ].push( new mw.w3d.CtmViewer( config[ 'configs' ][ i ] ) );
		}

		mw.config.set( 'w3d-ctm', config );
	}

	if ( mw.config.get( 'w3d-collada' ) !== null ) {
		let config;

		config = mw.config.get( 'w3d-collada' );

		for ( let i = 0; i < config[ 'configs' ].length; i++ ) {
			config[ 'viewers' ].push( new mw.w3d.ColladaViewer( config[ 'configs' ][ i ] ) );
		}

		mw.config.set( 'w3d-collada', config );
	}

	if ( mw.config.get( 'w3d-shape' ) !== null ) {
		let config;

		config = mw.config.get( 'w3d-shape' );

		for ( let i = 0; i < config[ 'configs' ].length; i++ ) {
			config[ 'viewers' ].push( new mw.w3d.ShapeViewer( config[ 'configs' ][ i ] ) );
		}

		mw.config.set( 'w3d-shape', config );
	}
} );
