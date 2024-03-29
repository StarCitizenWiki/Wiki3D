<?php
/**
 * Hooks for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class Wiki3DHooks {

	public static function onParserFirstCallInit( Parser &$parser ) {
		$parser->setFunctionHook(
			'shape_viewer',
			'Wiki3D\Wiki3D::createShapeViewer',
			Parser::SFH_OBJECT_ARGS
		);

		$parser->setFunctionHook(
			'collada_viewer',
			'Wiki3D\Wiki3D::createColladaViewer',
			Parser::SFH_OBJECT_ARGS
		);

		$parser->setFunctionHook(
			'ctm_viewer',
			'Wiki3D\Wiki3D::createCtmViewer',
			Parser::SFH_OBJECT_ARGS
		);

		return true;
	}
}
