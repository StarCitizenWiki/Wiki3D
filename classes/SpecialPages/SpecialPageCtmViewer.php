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
			'ext.w3d.specials.shipviewer',
		];
	}

	protected function getControlsHtml() {
		$piHalf = round( M_PI_2, 2 );

		return <<<EOT
<div class="form-group-wrapper">
    <p class="title">{$this->msg('wiki3d-ship')}</p>
    <div class="form-group">
        <label for="shipColor">{$this->msg('wiki3d-color')}</label>
        <input type="color" value="{$this->config['material']['colorHexStr']}" 
        id="shipColor">
    </div>
    <div class="form-group">
        <label for="shipMaterial">{$this->msg('wiki3d-material')}</label>
        <select id="shipMaterial">
            <option value="default">Default</option>
            <option value="normal">Normal</option>
            <option value="rgb">RGB</option>
            <option value="shiny">Shiny</option>
            <option value="flat">Basic</option>
        </select>
    </div>
    <div class="form-group">
        <label for="shipWireframe">{$this->msg('wiki3d-wireframe')}</label>
        <button id="shipWireframe" class="green">{$this->msg('wiki3d-toggle')}</button>
    </div>

    <p class="title">{$this->msg('wiki3d-rotation')}</p>
    <div class="form-group">
        <label for="shipRotationX">{$this->msg('wiki3d-x-axis')}</label>
        <input type="number" name="shipRotationX" id="shipRotationX" value="0" step="0.05">
    </div>
    <div class="form-group">
        <label for="shipRotationY">{$this->msg('wiki3d-y-axis')}</label>
        <input type="number" name="shipRotationY" id="shipRotationY" value="{$piHalf}" step="0.05">
    </div>
    <div class="form-group">
        <label for="shipRotationZ">{$this->msg('wiki3d-z-axis')}</label>
        <input type="number" name="shipRotationZ" id="shipRotationZ" value="0" step="0.05">
    </div>
    
    <p class="title">{$this->msg('wiki3d-position')}</p>
    <div class="form-group">
        <label for="shipPositionX">{$this->msg('wiki3d-x-axis')}</label>
        <input type="number" name="shipPositionX" id="shipPositionX" value="0" step="5">
    </div>
    <div class="form-group">
        <label for="shipPositionY">{$this->msg('wiki3d-y-axis')}</label>
        <input type="number" name="shipPositionY" id="shipPositionY" value="0" step="5">
    </div>
    <div class="form-group">
        <label for="shipPositionZ">{$this->msg('wiki3d-z-axis')}</label>
        <input type="number" name="shipPositionZ" id="shipPositionZ" value="0" step="5">
    </div>                  
</div>
EOT;
	}
}
