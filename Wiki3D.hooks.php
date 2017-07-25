<?php
/**
 * Hooks for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class Wiki3DHooks {

	public static function onParserFirstCallInit( Parser &$parser ) {
		$parser->setHook( 'PlanetViewer', 'Wiki3D::generatePlanet' );
		$parser->setHook( 'ColladaViewer', 'Wiki3D::generateCollada' );
		$parser->setHook( 'CTMViewer', 'Wiki3D::generateCTM' );

		return true;
	}
}
