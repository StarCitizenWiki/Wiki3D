<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:53
 */

namespace Wiki3D\Builder;

use OutputPage, ParserOutput, PPFrame, Parser, SpecialPage;
use Wiki3D\Wiki3DConfig;


abstract class BaseBuilder {

	protected $arrayKey = '';

	/**
	 * @var OutputPage | ParserOutput
	 */
	protected $outputPage;
	/**
	 * @var PPFrame
	 */
	protected $frame;
	protected $options;

	protected $baseStructure;
	protected $defaultConfig;
	protected $config;
	protected $modules;

	protected $output;

	private $hasPrebuildOptions = false;

	/**
	 * Wiki3DBuilder constructor.
	 * @param Parser|SpecialPage $parser
	 * @param PPFrame|null $frame
	 * @param null $args
	 */
	public function __construct( &$parser = null, $frame = null, $args = null ) {
		$this->setParser( $parser );
		if ( !is_null( $frame ) ) {
			$this->setFrame( $frame );
		}
		$this->setArgs( $args );
		$this->defaultConfig = $this->getDefaultConfig();
		$this->baseStructure = Wiki3DConfig::getBaseStructure( $this->arrayKey );
	}

	/**
	 * @param Parser|SpecialPage $parser
	 */
	public function setParser( &$parser ) {
		if ( !is_null( $parser ) ) {
			$this->outputPage = $parser->getOutput();
		}
	}

	public function setFrame( PPFrame $frame ) {
		$this->frame = $frame;
	}

	public function setArgs( $args ) {
		if ( !is_null( $args ) ) {
			$this->options = $args;
		}
	}

	protected function getDefaultConfig() {
		return null;
	}

	public function addPrebuildOptions( array $options ) {
		$this->options = $options;
		$this->hasPrebuildOptions = true;
	}

	public function getConfig() {
		return $this->config;
	}

	public function build() {
		if ( !$this->hasPrebuildOptions ) {
			$this->parseOptions();
			$this->extractOptions();
		}
		$this->makeConfig();
		$this->setDefaultModules();
	}

	private function parseOptions() {
		$parsed = [];
		for ( $i = 0; $i < count( $this->options ); $i ++ ) {
			$parsed[] = strip_tags( $this->frame->expand( $this->options[$i] ) );
		}
		array_shift( $parsed );

		$this->options = $parsed;
	}

	/**
	 * Converts an array of values in form [0] => 'name=value' into a real
	 * associative array in form [name] => value. If no = is provided,
	 * true is assumed like this: [name] => true
	 */
	private function extractOptions() {
		$results = [];

		foreach ( $this->options as $option ) {
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

		$this->options = $results;
	}

	private function makeConfig() {
		$this->makeModuleConfig();
		$this->makeRotationConfig();
		$this->makeMaterialConfig();
		$this->makeCameraConfig();
		$this->makeControlsConfig();
		$this->makeRendererConfig();

		$this->config = array_replace_recursive( $this->defaultConfig, $this->config );
		$this->baseStructure["w3d-$this->arrayKey"]['configs'][] = $this->config;
	}

	protected function makeModuleConfig() {
	}

	protected function makeRotationConfig() {
		$config = [
			'speed' => [],
		];

		if ( array_key_exists( 'rotation_x', $this->options ) ) {
			$config['x'] = floatval( $this->options['rotation_x'] );
		}

		if ( array_key_exists( 'rotation_y', $this->options ) ) {
			$config['y'] = floatval( $this->options['rotation_y'] );
		}

		if ( array_key_exists( 'rotation_z', $this->options ) ) {
			$config['z'] = floatval( $this->options['rotation_z'] );
		}

		if ( array_key_exists( 'rotation_speed_x', $this->options ) ) {
			$config['speed']['x'] = floatval( $this->options['rotation_speed_x'] );
		}

		if ( array_key_exists( 'rotation_speed_y', $this->options ) ) {
			$config['speed']['y'] = floatval( $this->options['rotation_speed_y'] );
		}

		if ( array_key_exists( 'rotation_speed_z', $this->options ) ) {
			$config['speed']['z'] = floatval( $this->options['rotation_speed_z'] );
		}

		if ( empty( $config['speed'] ) ) {
			unset( $config['speed'] );
		}

		if ( !empty( $config ) ) {
			$this->config['mainObject']['rotation'] = $config;
		}
	}

	protected function makeMaterialConfig() {
		$config = [];

		if ( array_key_exists( 'color', $this->options ) &&
		     $this->checkIfValidHexColor( $this->options['color'] ) ) {

			$color = $this->options['color'];
			$color = ltrim( $color, '#' );

			$config['color'] = intval( $color );
			$config['colorHexStr'] = '#' . $color;
		}

		if ( array_key_exists( 'material', $this->options ) ) {
			$config['current'] = $this->options['material'];
		}

		if ( !empty( $config ) ) {
			$this->config['material'] = $config;
		}
	}

	private function checkIfValidHexColor( $color ) {
		$color = ltrim( $color, '#' );

		if ( ctype_xdigit( $color ) && ( strlen( $color ) === 6 || strlen( $color ) === 3 ) ) {
			return true;
		}

		return false;
	}

	protected function makeCameraConfig() {
		$config = [
			'position' => [],
		];

		if ( array_key_exists( 'camera_fov', $this->options ) ) {
			$config['fov'] = intval( $this->options['camera_fov'] );
		}

		if ( array_key_exists( 'camera_near', $this->options ) ) {
			$config['near'] = intval( $this->options['camera_near'] );
		}

		if ( array_key_exists( 'camera_far', $this->options ) ) {
			$config['far'] = intval( $this->options['camera_far'] );
		}

		if ( array_key_exists( 'camera_position_x', $this->options ) ) {
			$config['position']['x'] = intval( $this->options['camera_position_x'] );
		}

		if ( array_key_exists( 'camera_position_y', $this->options ) ) {
			$config['position']['y'] = intval( $this->options['camera_position_y'] );
		}

		if ( array_key_exists( 'camera_position_z', $this->options ) ) {
			$config['position']['z'] = intval( $this->options['camera_position_z'] );
		}

		if ( empty( $config['position'] ) ) {
			unset( $config['position'] );
		}

		if ( !empty( $config ) ) {
			$this->config['camera'] = $config;
		}
	}

	protected function makeControlsConfig() {
		$config = [];

		if ( array_key_exists( 'controls', $this->options ) ) {
			$config['enable'] = true;
		}

		if ( !empty( $config ) ) {
			$this->config['controls'] = $config;
		}
	}

	protected function makeRendererConfig() {
		$config = [];

		if ( !is_null( $this->frame ) ) {
			$config['parent'] = 'w3d' . wfRandomString( 4 );
		} else {
			if ( array_key_exists( 'parent', $this->options ) ) {
				$config['parent'] = $this->options['parent'];
			}
		}

		if ( array_key_exists( 'resolution', $this->options ) ) {
			$config['resolution'] = $this->options['resolution'];
		}

		if ( !empty( $config ) ) {
			$this->config['renderer'] = $config;
		}
	}

	protected function setDefaultModules() {
	}

	public function addToOutput() {
		$output = $this->outputPage;

		if ( get_class( $output ) == 'ParserOutput' &&
		     array_key_exists( "w3d-$this->arrayKey", $output->mJsConfigVars ) &&
		     count( $output->mJsConfigVars["w3d-$this->arrayKey"]['configs'] ) > 0 ) {
			$output->mJsConfigVars["w3d-$this->arrayKey"]['configs'][] = $this->config;
		} else {
			$output->addJsConfigVars( $this->baseStructure );
		}

		$this->output = "<div id='{$this->config['renderer']['parent']}'></div>";

		$output->addModules( $this->modules );
	}

	public function getOutput() {
		return $this->output;
	}

	public function setModules( array $modules ) {
		$this->modules = $modules;
	}
}
