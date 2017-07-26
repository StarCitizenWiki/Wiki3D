<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class SpecialShipViewer extends SpecialPage {

	private $subPage;
	private $viewerConfig;

	public function __construct() {
		parent::__construct( 'ShipViewer' );

		$this->getOutput()->setPageTitle( $this->msg( 'wiki3d-shipviewer' ) );

		$this->viewerConfig = Wiki3D::getBaseStructure();
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
		$this->subPage = $sub;

		try {
			$this->makeConfig();
			$this->addViewerModulesToPage();
		}
		catch ( InvalidArgumentException $e ) {
			$this->addValidLinksList();
		}
	}

	private function makeConfig() {
		$defaultCtmConfig = Wiki3D::getDefaultCtmConfig();

		$file = wfFindFile( $this->subPage );
		if ( $file === false || $file->getExtension() !== 'ctm' ) {
			throw new InvalidArgumentException();
		} else {
			$defaultCtmConfig['ctm']['path'] = $file->getFullUrl();
			$defaultCtmConfig['scene']['controls']['enable'] = true;
			$defaultCtmConfig['renderer']['resolution'] = 'fullHD';
			$this->viewerConfig['w3d']['ctm']['configs'][] = $defaultCtmConfig;
		}
	}

	private function addViewerModulesToPage() {
		$out = $this->getOutput();

		$out->addModules( [
			'ext.w3d.threejs',
			'ext.w3d.ctm',
			'ext.w3d.specials.shipviewer',
		] );

		$out->addJsConfigVars( $this->viewerConfig );

		$out->addHTML( $this->getControlsHtml() );
	}

	private function getControlsHtml() {
		return <<<EOT
<div id="w3dWrapper">
    <div class="controls" id="controls">
    	<button id="toggleButton">&times;</button>
        <div class="form-group-wrapper">
            <p class="title">Ship</p>
            <div class="form-group">
                <label for="shipColor">Color</label>
                <input type="color" value="{$this->viewerConfig['w3d']['ctm']['configs'][0]['materials']['colorHexStr']}" 
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
                <button id="shipWireframe">Toggle</button>
            </div>

            <p class="title">Rotation</p>
            <div class="form-group">
                <label for="shipRotationX">X-Axis</label>
                <input type="number" name="shipRotationX" id="shipRotationX" value="0" step="0.05">
            </div>
            <div class="form-group">
                <label for="shipRotationY">Y-Axis</label>
                <input type="number" name="shipRotationY" id="shipRotationY" value="0" step="0.05">
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
                value="{$this->viewerConfig['w3d']['ctm']['configs'][0]['scene']['camera']['fov']}">
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
                <button id="sceneDownload">Download</button>
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

	private function addValidLinksList() {
		$dbSearchType = SearchEngineFactory::getSearchEngineClass( wfGetDB( DB_REPLICA ) );
		$dbSearch = new $dbSearchType();

		$dbSearch->setNamespaces( NS_FILE );
		$sr = $dbSearch->searchTitle( '.ctm' );

		try {
			$titles = $sr->extractTitles();
		}
		catch ( Exception $e ) {
			$titles = [];
		}

		foreach ( $titles as $title ) {
			$titleText = $title->getTitleValue()->getText();

			$this->getOutput()
				->addHTML( "<a href='{$this->getFullTitle()->getCanonicalURL()}/{$titleText}'>{$titleText}</a><br>" );
		}
	}

	protected function getGroupName() {
		return 'other';
	}
}


