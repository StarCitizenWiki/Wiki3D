<?php
/**
 * User: Hannes
 * Date: 24.07.2017
 * Time: 12:16
 */

class Wiki3D {
	public static function createCtmViewer( Parser &$parser, PPFrame $frame, $args ) {
		$parsed = [];
		for ( $i = 0; $i < count( $args ); $i ++ ) {
			$parsed[] = $frame->expand( $args[$i] );
		}
		array_shift( $parsed );
		$parsed = self::extractOptions( $parsed );

		$base = Wiki3D::getBaseStructure();
		$defaultCtmConfig = Wiki3D::getDefaultCtmConfig();

		$file = wfFindFile( $parsed['file'] );
		if ( $file === false || $file->getExtension() !== 'ctm' ) {
			throw new InvalidArgumentException();
		} else {
			$defaultCtmConfig['ctm']['path'] = $file->getFullUrl();
			$defaultCtmConfig['renderer']['resolution'] = 'sd';
			$defaultCtmConfig['renderer']['parent'] = 'mw-content-text';
			$defaultCtmConfig['scene']['controls']['enable'] = $parsed['controls'] ?? false;
			$base['w3d']['ctm']['configs'][] = $defaultCtmConfig;
			$out = $parser->getOutput();

			$out->addModules( [
				'ext.w3d.threejs',
				'ext.w3d.ctm',
				'ext.w3d.viewloader',
			] );

			if ( !is_null( $out->mJsConfigVars['w3d'] ) &&
			     is_array( $out->mJsConfigVars['w3d']['ctm']['configs'] ) &&
			     count( $out->mJsConfigVars['w3d']['ctm']['configs'] ) > 0 ) {
				$out->mJsConfigVars['w3d']['ctm']['configs'][] = $defaultCtmConfig;
			} else {
				$out->addJsConfigVars( $base );
			}

		}
	}

	/**
	 * Converts an array of values in form [0] => 'name=value' into a real
	 * associative array in form [name] => value. If no = is provided,
	 * true is assumed like this: [name] => true
	 *
	 * @param array|string $options
	 *
	 * @return array $results
	 */
	private static function extractOptions( array $options ) {
		$results = [];

		foreach ( $options as $option ) {
			$pair = explode( '=', $option, 2 );
			if ( count( $pair ) === 2 ) {
				$name = trim( $pair[0] );
				$value = trim( $pair[1] );
				$results[$name] = $value;
			}

			if ( count( $pair ) === 1 ) {
				$name = trim( $pair[0] );
				$results[$name] = true;
			}
		}

		return $results;
	}

	public static function getBaseStructure() {
		return [
			'w3d' => [
				'ctm' => [
					'configs' => [],
					'viewers' => [],
				],
				'collada' => [
					'configs' => [],
					'viewers' => [],
				],
			],
		];
	}

	public static function getDefaultCtmConfig() {
		return [
			'ctm' => [
				'path' => '',
				'scale' => 1,
				'defaultSize' => 500,
				'rotation' => [
					'x' => 0,
					'y' => M_PI_2,
					'z' => 0,
					'speed' => [
						'x' => 0,
						'y' => 0,
						'z' => 0,
					],
				],
			],
			'materials' => [
				'color' => 0x32c6ff,
				'colorHexStr' => '#32c6ff',
				'current' => 'default',
			],
			'scene' => [
				'current' => 'default',
				'camera' => [
					'fov' => 60,
					'aspect' => 0,
					'near' => 1,
					'far' => 100000,
					'position' => [
						'x' => 0,
						'y' => 0,
						'z' => 500,
					],
				],
				'controls' => [
					'enable' => false,
					'enableZoom' => true,
					'enableKeys' => false,
					'enablePan' => true,
					'enableRotate' => true,
					'enableDamping' => true,
					'dampingFactor' => 0.25,
					'zoomSpeed' => 1,
					'rotateSpeed' => 0.05,
					'panSpeed' => 2,
					'minDistance' => 1,
					'maxDistance' => 5000,
				],
			],
			'renderer' => [
				'parent' => 'w3dWrapper',
				'resolution' => 'hd',
				'clearColor' => 0x000000,
				'opacity' => 0,
			],
		];
	}
}