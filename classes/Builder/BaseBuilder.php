<?php
/**
 * User: Hannes
 * Date: 26.07.2017
 * Time: 18:53
 */

namespace Wiki3D\Builder;

use InvalidArgumentException;
use BadMethodCallException;
use OutputPage;
use Parser;
use ParserOutput;
use PPFrame;
use SpecialPage;
use Wiki3D\Wiki3DConfig;


abstract class BaseBuilder {
	public const FILE_EXTENSION = '';

	protected $configID = '';

	/**
	 * @var OutputPage | ParserOutput
	 */
	protected $outputPage;
	/**
	 * @var PPFrame
	 */
	protected $frame;
	protected $options;

	protected $configStructure;
	protected $moduleConfig;
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
	public function __construct( &$parser, $frame = null, $args = null ) {
		$this->setParserOutput( $parser );
		if ( !is_null( $frame ) ) {
			$this->setFrame( $frame );
		}
		$this->setArgs( $args );
		$this->moduleConfig = $this->getDefaultModuleConfig();
		$this->configStructure = Wiki3DConfig::getConfigStructure( $this->configID );
	}

	/**
	 * Calls getOutput() from the provided parser and sets it to $this->outputPage
	 *
	 * @param Parser|SpecialPage $parser
	 * @throws InvalidArgumentException
	 */
	public function setParserOutput( &$parser ) {
		if ( !method_exists( $parser, 'getOutput' ) ) {
			throw new InvalidArgumentException( 'getOutput not found in ' . get_class( $parser ) );
		}
		$this->outputPage = $parser->getOutput();
	}

	/**
	 * Sets the PPFrame to use, should only be called if constructor was only with parser arg called
	 *
	 * @param PPFrame $frame
	 */
	public function setFrame( PPFrame $frame ) {
		$this->frame = $frame;
	}

	/**
	 * Array if called from ParserHook, Null if used outside Parser
	 *
	 * @param array|null $args
	 */
	public function setArgs( $args ) {
		if ( !is_null( $args ) ) {
			$this->options = $args;
		}
	}

	/**
	 * Default config for Module (Ctm, Collada, Shape) from Wiki3DConfig
	 *
	 * @return array
	 */
	protected function getDefaultModuleConfig() {
		throw new BadMethodCallException( __FUNCTION__ .
		                                  ' needs to be overwritten in extending class' );
	}

	/**
	 * Only used if not ParserHook Call
	 *
	 * @param array $modules
	 */
	public function setModules( array $modules ) {
		$this->modules = $modules;
	}

	/**
	 * Returns generated config
	 *
	 * @return mixed
	 */
	public function getConfig() {
		return $this->config;
	}

	/**
	 * Returns the wrapper div which is needed by JS to add the renderDOM
	 *
	 * @return mixed
	 */
	public function getWrapperElement() {
		return $this->output;
	}

	/**
	 * Makes the config and sets modules
	 * if prebuild options are set option parsing and extracting is skipped
	 */
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

	/**
	 * calls all config methods, merges it with default config
	 */
	private function makeConfig() {
		$this->setMainObjectFile();
		$this->makeMaterialConfig();
		$this->makeCameraConfig();
		$this->makeControlsConfig();
		$this->makeRendererConfig();
		$this->makeMainObjectConfig();
		$this->makeMainObjectRotationConfig();

		$this->config = array_replace_recursive( $this->moduleConfig, $this->config );
		$this->configStructure["w3d-$this->configID"]['configs'][] = $this->config;
	}

	private function setMainObjectFile() {
		if ( !array_key_exists( 'file', $this->options ) ) {
			throw new InvalidArgumentException( 'wiki3d-fileOptionMissing' );
		}

		$file = wfFindFile( $this->options['file'] );
		if ( $file === false ) {
			throw new InvalidArgumentException( 'wiki3d-fileNotFound' );
		}

		if ( is_array( static::FILE_EXTENSION ) ) {
			if ( !in_array( $file->getExtension(), static::FILE_EXTENSION ) ) {
				throw new InvalidArgumentException( 'wiki3d-fileNotAllowed' );
			}
		} else {
			if ( $file->getExtension() !== static::FILE_EXTENSION ) {
				throw new InvalidArgumentException( 'wiki3d-fileNotAllowed' );
			}
		}

		$this->config['mainObject']['path'] = $file->getFullUrl();
	}

	protected function makeMaterialConfig() {
		$config = [];

		if ( array_key_exists( 'color', $this->options ) ) {
			$config['color'] = intval( $this->options['color'] );
		}

		if ( array_key_exists( 'material', $this->options ) ) {
			$config['current'] = $this->options['material'];
		}

		if ( !empty( $config ) ) {
			$this->config['material'] = $config;
		}
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
			$config['enableZoom'] = true;
			$config['enablePan'] = true;
			$config['enableRotate'] = true;
			$config['enableDamping'] = true;
		}

		if ( array_key_exists( 'controls_rotate', $this->options ) ) {
			$config['enable'] = true;
			$config['enableRotate'] = true;
		}

		if ( array_key_exists( 'controls_zoom', $this->options ) ) {
			$config['enable'] = true;
			$config['enableZoom'] = true;
		}

		if ( array_key_exists( 'controls_zoom_rotate', $this->options ) ) {
			$config['enable'] = true;
			$config['enableZoom'] = true;
			$config['enableRotate'] = true;
		}

		if ( array_key_exists( 'rotateSpeed', $this->options ) ) {
			$config['rotateSpeed'] = floatval( $this->options['rotateSpeed'] );
		}

		if ( !empty( $config ) ) {
			$this->config['controls'] = $config;
		}
	}

	protected function makeRendererConfig() {
		$config = [
			'resolution' => 'sd',
			'parent' => 'w3dWrapper',
		];

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

		if ( array_key_exists( 'clear_color', $this->options ) ) {
			$config['clearColor'] = $this->options['clear_color'];
			if ( array_key_exists( 'background_opacity', $this->options ) ) {
				$config['opacity'] = floatval( $this->options['background_opacity'] );
			}
		}

		if ( !empty( $config ) ) {
			$this->config['renderer'] = $config;
		}
	}

	protected function makeMainObjectConfig() {
	}

	protected function makeMainObjectRotationConfig() {
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

	protected function setDefaultModules() {
	}

	/**
	 * Should only be called if outside ParserHook
	 *
	 * @param array $options
	 */
	public function addPrebuildOptions( array $options ) {
		$this->options = $options;
		$this->hasPrebuildOptions = true;
	}

	/**
	 * Adds JsConfig Vars, modules to output and generates div hook element
	 */
	public function addToOutput() {
		$output = $this->outputPage;

		if ( get_class( $output ) == 'ParserOutput' &&
		     array_key_exists( "w3d-$this->configID", $output->mJsConfigVars ) &&
		     count( $output->mJsConfigVars["w3d-$this->configID"]['configs'] ) > 0 ) {
			$output->mJsConfigVars["w3d-$this->configID"]['configs'][] = $this->config;
		} else {
			$output->addJsConfigVars( $this->configStructure );
		}

		$this->output =
			"<div id='{$this->config['renderer']['parent']}' class='w3d-wrapper'></div>";

		$output->addModules( $this->modules );
	}
}
