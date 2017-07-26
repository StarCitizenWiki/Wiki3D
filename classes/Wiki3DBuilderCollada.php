<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:06
 */

class Wiki3DBuilderCollada extends Wiki3DBuilder {
	protected $arrayKey = 'collada';

	protected function setDefaultModules() {
		$this->modules = [
			'ext.w3d.threejs',
			'ext.w3d.collada',
			'ext.w3d.viewloader',
		];
	}

	protected function getDefaultConfig() {
		$config = Wiki3D::getDefaultColladaConfig();
		$config['renderer']['resolution'] = 'sd';
		$config['renderer']['parent'] = 'w3dWrapper';

		return $config;
	}

	protected function makeModuleConfig() {
		if ( !array_key_exists( 'file', $this->options ) ) {
			throw new InvalidArgumentException( 'File option is missing' );
		}

		$file = wfFindFile( $this->options['file'] );
		if ( $file === false || $file->getExtension() !== 'dae' ) {
			throw new InvalidArgumentException();
		}

		$config = [
			'rotation' => [
				'speed' => [

				],
			],
		];

		$config['path'] = $file->getFullUrl();

		if ( array_key_exists( 'scale', $this->options ) ) {
			$config['scale'] = floatval( $this->options['scale'] );
		}

		if ( array_key_exists( 'rotation_x', $this->options ) ) {
			$config['rotation']['x'] = floatval( $this->options['rotation_x'] );
		}

		if ( array_key_exists( 'rotation_y', $this->options ) ) {
			$config['rotation']['y'] = floatval( $this->options['rotation_y'] );
		}

		if ( array_key_exists( 'rotation_z', $this->options ) ) {
			$config['rotation']['z'] = floatval( $this->options['rotation_z'] );
		}

		if ( array_key_exists( 'rotation_speed_x', $this->options ) ) {
			$config['rotation']['speed']['x'] = floatval( $this->options['rotation_speed_x'] );
		}

		if ( array_key_exists( 'rotation_speed_y', $this->options ) ) {
			$config['rotation']['speed']['y'] = floatval( $this->options['rotation_speed_y'] );
		}

		if ( array_key_exists( 'rotation_speed_z', $this->options ) ) {
			$config['rotation']['speed']['z'] = floatval( $this->options['rotation_speed_z'] );
		}

		if ( empty( $config['rotation']['speed'] ) ) {
			unset( $config['rotation']['speed'] );
		}

		if ( empty( $config['rotation'] ) ) {
			unset( $config['rotation'] );
		}

		if ( !empty( $config ) ) {
			$this->config[$this->arrayKey] = $config;
		}
	}
}