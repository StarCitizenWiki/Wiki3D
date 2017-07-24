<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class SpecialShipViewer extends SpecialPage {
    public function __construct() {
        parent::__construct( 'ShipViewer' );
    }

    /**
     * Show the page to the user
     *
     * @param string $sub The subpage string argument (if any).
     *                    [[Special:HelloWorld/subpage]].
     *
     * @return void|string
     */
    public function execute( $sub ) {
        $out = $this->getOutput();
        $out->setPageTitle($this->msg('wiki3d-shipviewer'));
        $jsConfig = Wiki3D::getBaseStructure();

        $viewerConfig = Wiki3D::getDefaultCTMConfig();

        $out->addModules([
            'ext.w3d.threejs',
            'ext.w3d.ctm',
            'ext.w3d.viewer',
            'ext.w3d.shipviewer',
        ]);



        $file = wfFindFile($sub);
        if ($file === false || $file->getExtension() !== 'ctm') {
            $out->addHTML('Only .ctm Files are supported');
        } else {
            $viewerConfig['ctm']['path'] = $file->getFullUrl();
            $viewerConfig['scene']['controls']['enable'] = true;
            $viewerConfig['scene']['camera']['position']['z'] = 200;
        }

        $jsConfig['w3d']['ctm']['configs'][] = $viewerConfig;

        $out->addJsConfigVars($jsConfig);

        $form = <<<EOF
<div id="w3dWrapper">
    <div class="controls">
        <div class="form-group-wrapper">
            <p class="title">Ship</p>
            <div class="form-group">
                <label for="shipColor">Ship Color</label>
                <input type="color" value="{$viewerConfig['materials']['color_hex_str']}" id="shipColor">
            </div>
            <div class="form-group">
                <label for="shipMaterial">Ship Material</label>
                <select id="shipMaterial">
                    <option value="default">Default</option>
                    <option value="normal">Normal</option>
                    <option value="rgb">RGB</option>
                    <option value="shiny">Shiny</option>
                    <option value="flat">Basic</option>
                </select>
            </div>
            <div class="form-group">
                <button id="shipWireframe">Toggle Wireframe</button>
            </div>
        </div>
        
        <div class="form-group-wrapper">
            <p class="title">Ship Rotation</p>
            <div class="form-group">
                <label for="shipRotationX">Ship Rotation X-Axis</label>
                <input type="number" name="shipRotationX" id="shipRotationX" value="0" step="0.05">
            </div>
            <div class="form-group">
                <label for="shipRotationY">Ship Rotation Y-Axis</label>
                <input type="number" name="shipRotationY" id="shipRotationY" value="0" step="0.05">
            </div>
            <div class="form-group">
                <label for="shipRotationZ">Ship Rotation Z-Axis</label>
                <input type="number" name="shipRotationZ" id="shipRotationZ" value="0" step="0.05">
            </div>
            
            <p class="title">Ship Position</p>
            <div class="form-group">
                <label for="shipPositionX">Ship Position X-Axis</label>
                <input type="number" name="shipPositionX" id="shipPositionX" value="0" step="5">
            </div>
            <div class="form-group">
                <label for="shipPositionY">Ship Position Y-Axis</label>
                <input type="number" name="shipPositionY" id="shipPositionY" value="0" step="5">
            </div>
            <div class="form-group">
                <label for="shipPositionZ">Ship Position Z-Axis</label>
                <input type="number" name="shipPositionZ" id="shipPositionZ" value="0" step="5">
            </div>            
        </div>
        
        <div class="form-group-wrapper">
            <p class="title">Camera</p>
            <div class="form-group">
                <label for="cameraFOV">Camera FOV</label>
                <input type="range" name="cameraFOV" id="cameraFOV" min="10" max="120" value="{$viewerConfig['camera']['fov']}">
            </div>
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">Scene</p>
            <div class="form-group">
                <label for="sceneScene">Scene Selection</label>
                <select id="sceneScene">
                    <option value="default">Default</option>
                    <option value="space">Space</option>
                    <option value="starcitizen">Star Citizen</option>
                </select>
            </div>
            <div class="form-group">
                <button id="sceneDownload">Save Scene as Image</button>
            </div>
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">Lights</p>
            <div class="form-group">
                <button id="lightsHemisphereToggle">Toggle Hemisphere Light</button>
            </div>
            <div class="form-group">
                <button id="lightsDirectional1Toggle">Toggle Directional Light 1</button>
            </div>
            <div class="form-group">
                <button id="lightsDirectional2Toggle">Toggle Directional Light 1</button>
            </div>
        </div>
                
        <div class="form-group-wrapper">
            <p class="title">Renderer</p>
            <div class="form-group">
                <label for="resolutionSelect">Resolution</label>
                <select id="resolutionSelect">
                    <option value="hd">HD (720p)</option>
                    <option value="fullhd">FullHD (1080p)</option>
                    <option value="ultrahd_4k">UltraHD (4k)</option>
                </select>
            </div>
        </div> 
    </div>
</div>
EOF;

        $out->addHTML($form);
    }

    protected function getGroupName() {
        return 'other';
    }
}


