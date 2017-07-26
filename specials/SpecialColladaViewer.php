<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class SpecialColladaViewer extends SpecialPage {
	private $config;

	public function __construct() {
		parent::__construct( 'StationViewer' );

		$this->getOutput()->setPageTitle( $this->msg( 'wiki3d-shipviewer' ) );
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
		if ( !is_null( $sub ) && !empty( $sub ) ) {

			$ctmBuilder = new Wiki3DBuilderCollada( $this );
			$ctmBuilder->addPrebuildOptions( [
				'file' => strip_tags( $sub ),
				'controls' => true,
				'resolution' => 'fullHD',
				'parent' => 'w3dWrapper',
			] );
			try {
				$ctmBuilder->build();
				$this->config = $ctmBuilder->getConfig();
				$ctmBuilder->setModules( [
					'ext.w3d.threejs',
					'ext.w3d.collada',
					'ext.w3d.specials.colladaviewer',
				] );
				$ctmBuilder->addToOutput();
				$this->getOutput()->addHTML( $this->getControlsHtml() );
			}
			catch ( InvalidArgumentException $e ) {
				$this->getOutput()->addHTML( $this->msg( 'w3d-invalidArguments' ) );
			}
		} else {
			$this->addValidLinksList();
		}
	}

	private function getControlsHtml() {
		$piHalf = round( M_PI_2, 2 );

		return <<<EOT
<div id="w3dWrapper">
    <div class="controls" id="controls">
    	<button id="toggleButton">&times;</button>
        <div class="form-group-wrapper">
            <p class="title">Ship</p>

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

	private function addValidLinksList() {
		$dbSearchType = SearchEngineFactory::getSearchEngineClass( wfGetDB( DB_REPLICA ) );
		$dbSearch = new $dbSearchType();

		$dbSearch->setNamespaces( NS_FILE );
		$sr = $dbSearch->searchTitle( '.dae' );

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


