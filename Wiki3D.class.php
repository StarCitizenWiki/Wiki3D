<?php
/**
 * User: Hannes
 * Date: 24.07.2017
 * Time: 12:16
 */

class Wiki3D {
	public const RENDER_RESOLUTIONS = [
		'sd',
		'hd',
		'fullHD',
		'fullHD4k',
	];

	public const MATERIALS = [
		'default',
		'normal',
		'rgb',
		'shiny',
		'flat',
	];

	public static function createCtmViewer( Parser &$parser, PPFrame $frame, $args ) {
		$ctmBuilder = new Wiki3DBuilderCollada( $parser, $frame, $args );
		try {
			$ctmBuilder->build();
			$ctmBuilder->addToOutput();
		}
		catch ( InvalidArgumentException $e ) {
			return wfMessage( 'w3d-invalidArguments' );
		}
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
			'material' => [
				'color' => 0x32c6ff,
				'colorHexStr' => '#32c6ff',
				'current' => 'default',
			],
			'scene' => [
				'current' => 'default',
			],
			'camera' => [
				'fov' => 60,
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
			'renderer' => [
				'parent' => 'mw-content-text',
				'resolution' => 'hd',
				'clearColor' => 0x000000,
				'opacity' => 0,
			],
		];
	}

	public static function getDefaultColladaConfig() {
		return [
			'collada' => [
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
			'material' => [
				'color' => 0x32c6ff,
				'colorHexStr' => '#32c6ff',
				'current' => 'default',
			],
			'scene' => [
				'current' => 'default',
			],
			'camera' => [
				'fov' => 60,
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
			'renderer' => [
				'parent' => 'mw-content-text',
				'resolution' => 'hd',
				'clearColor' => 0x000000,
				'opacity' => 0,
			],
		];
	}
}