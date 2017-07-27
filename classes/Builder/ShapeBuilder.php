<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:06
 */

namespace Wiki3D\Builder;

use InvalidArgumentException;
use Wiki3D\Wiki3DConfig;

class ShapeBuilder extends BaseBuilder {
	public const FILE_EXTENSION = [ 'jpg', 'png' ];

	protected $arrayKey = 'shape';

	protected function setDefaultModules() {
		$this->modules = [
			'ext.w3d.threejs',
			'ext.w3d.shape',
			'ext.w3d.viewloader',
		];
	}

	protected function getDefaultConfig() {
		$config = Wiki3DConfig::getDefaultShapeConfig();
		$config['renderer']['resolution'] = 'sd';
		$config['renderer']['parent'] = 'w3dWrapper';

		return $config;
	}

	protected function makeModuleConfig() {
		if ( !array_key_exists( 'file', $this->options ) ) {
			throw new InvalidArgumentException( 'wiki3d-fileOptionMissing' );
		}

		$file = wfFindFile( $this->options['file'] );
		if ( $file === false || !in_array( $file->getExtension(), self::FILE_EXTENSION ) ) {
			throw new InvalidArgumentException( 'wiki3d-fileNotFoundOrWrongType' );
		}

		$config = [];

		$config['path'] = $file->getFullUrl();

		if ( array_key_exists( 'scale', $this->options ) ) {
			$config['scale'] = floatval( $this->options['scale'] );
		}

		if ( array_key_exists( 'type', $this->options ) ) {
			$config['type'] = floatval( $this->options['type'] );
		}

		if ( array_key_exists( 'radius', $this->options ) ) {
			$config['config']['radius'] = floatval( $this->options['config']['radius'] );
		}

		if ( !empty( $config ) ) {
			$this->config['mainObject'] = $config;
		}
	}
}