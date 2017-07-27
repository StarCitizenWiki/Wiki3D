<?php
/**
 * User: Hannes
 * Date: 27.07.2017
 * Time: 10:17
 */

namespace Wiki3D;

class Wiki3DConfig {
	public const RENDER_RESOLUTIONS = [
		'square250',
		'square500',
		'ships',
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

	public static function getBaseStructure( $type ) {

		return [
			"w3d-$type" => [
				'configs' => [],
				'viewers' => [],
			],
		];
	}

	public static function getDefaultCtmConfig() {
		return self::getDefaultConfig();
	}

	private static function getDefaultConfig() {
		return [
			'mainObject' => [
				'scale' => 1,
				'defaultSize' => 500,
				'rotation' => [
					'x' => 0,
					'y' => M_PI_2,
					'z' => 0,
					'speed' => [
						'x' => 0,
						'y' => 25,
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
		return self::getDefaultConfig();
	}

	public static function getDefaultShapeConfig() {
		$config = self::getDefaultConfig();

		$config['mainObject']['type'] = 'sphere';
		$config['mainObject']['config'] = [
			'radius' => 32,
			'widthSegments' => 32,
			'heightSegments' => 32,
		];

		return $config;
	}

}