<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

namespace Wiki3D\SpecialPages;

use Wiki3D\Builder\CtmBuilder;

class SpecialPageCtmViewer extends BaseSpecialPage {

	public function __construct() {
		parent::__construct( 'ShipViewer' );
		$this->type = 'ctm';

		$this->getOutput()->setPageTitle( $this->msg( 'wiki3d-shipviewer' ) );
	}

	protected function getFileExtensionToSearch() {
		return '.' . CtmBuilder::FILE_EXTENSION;
	}

	protected function getBuilderOptions() {
		return [
			'file' => strip_tags( $this->subPage ),
			'controls' => true,
			'resolution' => 'fullHD',
			'parent' => 'w3dWrapper',
		];
	}

	protected function getBuilderModules() {
		return [
			'ext.w3d.threejs',
			'ext.w3d.ctm',
			'ext.w3d.specialpage',
		];
	}

	protected function getControlsHtml() {
		$piHalf = round( M_PI_2, 2 );

		return <<<EOT
<div class="form-group-wrapper">
    <p class="title">{$this->msg( 'wiki3d-ship' )}</p>
    <div class="form-group">
        <label for="shipColor">{$this->msg( 'wiki3d-color' )}</label>
        <input type="color" value="{$this->config['material']['colorHexStr']}" 
        id="color">
    </div>
    <div class="form-group">
        <label for="shipMaterial">{$this->msg( 'wiki3d-material' )}</label>
        <select id="material">
            <option value="default">Default</option>
            <option value="normal">Normal</option>
            <option value="rgb">RGB</option>
            <option value="shiny">Shiny</option>
            <option value="flat">Basic</option>
        </select>
    </div>
    <div class="form-group">
        <label for="wireframe">{$this->msg( 'wiki3d-wireframe' )}</label>
        <button id="wireframe" class="green">{$this->msg( 'wiki3d-toggle' )}</button>
    </div>

    <p class="title">{$this->msg( 'wiki3d-rotation' )}</p>
    <div class="form-group">
        <label for="rotationX">{$this->msg( 'wiki3d-x-axis' )}</label>
        <input type="number" name="rotationX" id="rotationX" value="0" step="0.05">
    </div>
    <div class="form-group">
        <label for="rotationY">{$this->msg( 'wiki3d-y-axis' )}</label>
        <input type="number" name="rotationY" id="rotationY" value="{$piHalf}" step="0.05">
    </div>
    <div class="form-group">
        <label for="rotationZ">{$this->msg( 'wiki3d-z-axis' )}</label>
        <input type="number" name="rotationZ" id="rotationZ" value="0" step="0.05">
    </div>
    
    <p class="title">{$this->msg( 'wiki3d-position' )}</p>
    <div class="form-group">
        <label for="positionX">{$this->msg( 'wiki3d-x-axis' )}</label>
        <input type="number" name="positionX" id="positionX" value="0" step="5">
    </div>
    <div class="form-group">
        <label for="positionY">{$this->msg( 'wiki3d-y-axis' )}</label>
        <input type="number" name="positionY" id="positionY" value="0" step="5">
    </div>
    <div class="form-group">
        <label for="positionZ">{$this->msg( 'wiki3d-z-axis' )}</label>
        <input type="number" name="positionZ" id="positionZ" value="0" step="5">
    </div>                  
</div>
EOT;
	}
}
