<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:06
 */

namespace Wiki3D\Builder;

use Wiki3D\Wiki3DConfig;

class ColladaBuilder extends BaseBuilder {
	public const FILE_EXTENSION = 'dae';

	protected $configID = 'collada';

	protected function getDefaultModuleConfig() {
		$config = Wiki3DConfig::getDefaultColladaConfig();

		return $config;
	}

	protected function setDefaultModules() {
		$this->modules = [
			'ext.w3d.threejs',
			'ext.w3d.collada',
			'ext.w3d.viewloader',
		];
	}

	protected function makeMainObjectConfig() {
		$config = [];

		if ( array_key_exists( 'scale', $this->options ) ) {
			$config['scale'] = floatval( $this->options['scale'] );
		}

		if ( !empty( $config ) ) {
			$this->config['mainObject'] = $config;
		}
	}
}