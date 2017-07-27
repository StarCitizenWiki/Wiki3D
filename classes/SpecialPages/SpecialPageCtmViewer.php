<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

namespace Wiki3D\SpecialPages;

use Wiki3D\Builder\ShapeBuilder;

class SpecialPageCtmViewer extends BaseSpecialPage {

	public function __construct() {
		parent::__construct( 'ShipViewer' );
		$this->type = 'ctm';

		$this->getOutput()->setPageTitle( $this->msg( 'wiki3d-shipviewer' ) );
	}

	protected function getFileExtensionToSearch() {
		return '.' . ShapeBuilder::FILE_EXTENSION;
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
<div id="w3dWrapper">
    <div class="controls" id="controls">
    	<button id="toggleButton">&times;</button>
        <div class="form-group-wrapper">
            <p class="title">Ship</p>
            <div class="form-group">
                <label for="shipColor">Color</label>
                <input type="color" value="{$this->config['material']['colorHexStr']}" 
                id="shipColor">
            </div>
            <div class="form-group">
                <label for="shipMaterial">Material</label>
                <select id="shipMaterial">
                    <option value="default">Default</option>
                    <option value="normal">Normal</option>
                    <option value="rgb">RGB</option>
                    <option value="shiny">Shiny</option>
                    <option value="flat">Basic</option>
                </select>
            </div>
            <div class="form-group">
            	<label for="shipWireframe">Wireframe</label>
                <button id="shipWireframe" class="green">Toggle</button>
            </div>

            <p class="title">Rotation</p>
            <div class="form-group">
                <label for="shipRotationX">X-Axis</label>
                <input type="number" name="shipRotationX" id="shipRotationX" value="0" step="0.05">
            </div>
            <div class="form-group">
                <label for="shipRotationY">Y-Axis</label>
                <input type="number" name="shipRotationY" id="shipRotationY" value="{$piHalf}" step="0.05">
            </div>
            <div class="form-group">
                <label for="shipRotationZ">Z-Axis</label>
                <input type="number" name="shipRotationZ" id="shipRotationZ" value="0" step="0.05">
            </div>
            
            <p class="title">Position</p>
            <div class="form-group">
                <label for="shipPositionX">X-Axis</label>
                <input type="number" name="shipPositionX" id="shipPositionX" value="0" step="5">
            </div>
            <div class="form-group">
                <label for="shipPositionY">Y-Axis</label>
                <input type="number" name="shipPositionY" id="shipPositionY" value="0" step="5">
            </div>
            <div class="form-group">
                <label for="shipPositionZ">Z-Axis</label>
                <input type="number" name="shipPositionZ" id="shipPositionZ" value="0" step="5">
            </div>                  
        </div>
                
        <div class="form-group-wrapper">
            <p class="title">Camera</p>
            <div class="form-group">
                <label for="cameraFOV">Camera FOV</label>
                <input type="range" class="w3d" name="cameraFOV" id="cameraFOV" min="10" max="120" 
                value="{$this->config['camera']['fov']}">
            </div>
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">Enviroment</p>
            <div class="form-group">
                <label for="sceneScene">Scene Selection</label>
                <select id="sceneScene">
                    <option value="default">Default</option>
                    <option value="space">Space</option>
                    <option value="starcitizen">Star Citizen</option>
                </select>
            </div>
            <div class="form-group">
            	<label for="sceneDownload">Scene</label>
                <button id="sceneDownload" class="blue">Download</button>
            </div>
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">Lights</p>
            <div id="lightList"></div>
        </div>
                
        <div class="form-group-wrapper">
            <p class="title">Renderer</p>
            <div class="form-group">
                <label for="resolutionSelect">Resolution</label>
                <select id="resolutionSelect">
                </select>
            </div>
        </div> 
    </div>
</div>
EOT;
	}
}
