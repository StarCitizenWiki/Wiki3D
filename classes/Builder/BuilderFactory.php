<?php
/**
 * User: Hannes
 * Date: 27.07.2017
 * Time: 09:26
 */

namespace Wiki3D\Builder;

use InvalidArgumentException;

class BuilderFactory {
	public static function getBuilder( $className ) {
		switch ( $className ) {
			case 'ctm':
				return 'Wiki3D\Builder\CtmBuilder';
				break;

			case 'collada':
				return 'Wiki3D\Builder\ColladaBuilder';
				break;

			case 'shape':
				return 'Wiki3D\Builder\ShapeBuilder';
				break;

			default:
				throw new InvalidArgumentException( 'wiki3d-unknownClass' );
				break;
		}
	}
}
