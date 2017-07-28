<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:06
 */

namespace Wiki3D\Builder;

use Wiki3D\Wiki3DConfig;

/** @TODO: Shape config ist derzeit nur Sphere */
class ShapeBuilder extends BaseBuilder {
	public const FILE_EXTENSION = [ 'jpg', 'png' ];

	protected $configID = 'shape';

	protected function setDefaultModules() {
		$this->modules = [
			'ext.w3d.threejs',
			'ext.w3d.shape',
			'ext.w3d.viewloader',
		];
	}

	protected function getDefaultModuleConfig() {
		$config = Wiki3DConfig::getDefaultShapeConfig();

		return $config;
	}

	protected function makeMainObjectConfig() {
		$config = [];

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