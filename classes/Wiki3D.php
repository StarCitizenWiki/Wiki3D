<?php
/**
 * User: Hannes
 * Date: 24.07.2017
 * Time: 12:16
 */

namespace Wiki3D;

use Parser;
use PPFrame;
use InvalidArgumentException;
use Wiki3D\Builder\BaseBuilder;
use Wiki3D\Builder\ColladaBuilder;
use Wiki3D\Builder\CtmBuilder;
use Wiki3D\Builder\ShapeBuilder;

class Wiki3D {
	public static function createCtmViewer( Parser &$parser, PPFrame $frame, $args ) {
		$builder = new CtmBuilder( $parser, $frame, $args );
		return self::build( $builder );
	}

	public static function createColladaViewer( Parser &$parser, PPFrame $frame, $args ) {
		$builder = new ColladaBuilder( $parser, $frame, $args );
		return self::build( $builder );
	}

	public static function createShapeViewer( Parser &$parser, PPFrame $frame, $args ) {
		$builder = new ShapeBuilder( $parser, $frame, $args );
		return self::build( $builder );
	}

	private static function build( BaseBuilder $builder ) {
		try {
			$builder->build();
			$builder->addToOutput();
			return $builder->getOutput();
		}
		catch ( InvalidArgumentException $e ) {
			return wfMessage( $e->getMessage() );
		}
	}
}