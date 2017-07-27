<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:06
 */

namespace Wiki3D\Builder;

use InvalidArgumentException;
use Wiki3D\Wiki3DConfig;

class CtmBuilder extends BaseBuilder {
	public const FILE_EXTENSION = 'ctm';

	protected $arrayKey = 'ctm';

	protected function setDefaultModules() {
		$this->modules = [
			'ext.w3d.threejs',
			'ext.w3d.ctm',
			'ext.w3d.viewloader',
		];
	}

	protected function getDefaultConfig() {
		$config = Wiki3DConfig::getDefaultCtmConfig();
		$config['renderer']['resolution'] = 'sd';
		$config['renderer']['parent'] = 'w3dWrapper';

		return $config;
	}

	protected function makeModuleConfig() {
		if ( !array_key_exists( 'file', $this->options ) ) {
			throw new InvalidArgumentException( 'wiki3d-fileOptionMissing' );
		}

		$file = wfFindFile( $this->options['file'] );
		if ( $file === false || $file->getExtension() !== self::FILE_EXTENSION ) {
			throw new InvalidArgumentException( 'wiki3d-fileNotFoundOrWrongType' );
		}

		$config = [];

		$config['path'] = $file->getFullUrl();

		if ( array_key_exists( 'scale', $this->options ) ) {
			$config['scale'] = floatval( $this->options['scale'] );
		}

		if ( !empty( $config ) ) {
			$this->config['mainObject'] = $config;
		}
	}
}