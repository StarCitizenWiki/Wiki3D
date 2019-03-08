<?php
/**
 * User: Hannes
 * Date: 27.07.2017
 * Time: 09:20
 */

namespace Wiki3D\SpecialPages;

use Exception;
use InvalidArgumentException;
use SearchEngine;
use SearchEngineFactory;
use SearchResultSet;
use SpecialPage;
use Wiki3D\Builder\BaseBuilder;
use Wiki3D\Builder\BuilderFactory;

abstract class BaseSpecialPage extends SpecialPage {
	protected $type;
	protected $subPage;
	protected $config;
	protected $title;

	/**
	 * @var BaseBuilder
	 */
	private $builderClass;

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
			$this->subPage = $sub;
			$this->addViewer();
		} else {
			$this->addValidSubpagesList();
		}
	}

	private function addViewer() {
		$this->builderClass = BuilderFactory::getBuilder( $this->type );
		$this->builderClass = new $this->builderClass( $this );

		try {
			$this->getOutput()->setPageTitle( $this->title );
			$this->configureBuilder();
			$this->builderClass->addToOutput();
			$this->getOutput()->addHTML( $this->makeControlHtml() );
		}
		catch ( InvalidArgumentException $e ) {
			$this->getOutput()->addHTML( $this->msg( 'wiki3d-invalidArguments' ) );
		}
	}

	private function configureBuilder() {
		$this->builderClass->addPrebuildOptions( $this->getBuilderOptions() );
		$this->builderClass->build();
		$this->config = $this->builderClass->getConfig();
		$this->builderClass->setModules( $this->getBuilderModules() );
	}

	protected function getBuilderOptions() {
		return [];
	}

	protected function getBuilderModules() {
		return [];
	}

	private function makeControlHtml() {
		$wrapper = <<<EOT
<div id="w3dWrapper">
	<button id="fullScreen" class="hidden">&nearrow;</button>
    <div class="controls hidden" id="controls">
    	<button id="toggleButton">></button>
{$this->getControlsHtml()}
        <div class="form-group-wrapper">
            <p class="title">{$this->msg( 'wiki3d-camera' )}</p>
            <div class="form-group">
                <label for="cameraFOV">{$this->msg( 'wiki3d-camera-fov' )}</label>
                <input type="range" class="w3d" name="cameraFOV" id="cameraFOV" min="10" max="120" 
                value="{$this->config['camera']['fov']}">
            </div>
            <div class="form-group">
                <label for="cameraPositionSelect">{$this->msg( 'wiki3d-position' )}</label>
                <select id="cameraPositionSelect">
                	<option value="" selected></option>
                	<option value="top">{$this->msg( 'wiki3d-position-top' )}</option>
                	<option value="bottom">{$this->msg( 'wiki3d-position-bottom' )}</option>
                	<option value="left">{$this->msg( 'wiki3d-position-left' )}</option>
                	<option value="right">{$this->msg( 'wiki3d-position-right' )}</option>
                	<option value="front">{$this->msg( 'wiki3d-position-front' )}</option>
                	<option value="back">{$this->msg( 'wiki3d-position-back' )}</option>
                </select>
            </div>            
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">{$this->msg( 'wiki3d-enviroment' )}</p>
            <div class="form-group">
                <label for="sceneScene">{$this->msg( 'wiki3d-scene-selection' )}</label>
                <select id="sceneScene">
                </select>
            </div>
            <div class="form-group">
            	<label for="sceneDownload">{$this->msg( 'wiki3d-scene' )}</label>
                <button id="sceneDownload" class="blue">{$this->msg( 'wiki3d-download' )}</button>
            </div>
        </div> 
        
        <div class="form-group-wrapper">
            <p class="title">{$this->msg( 'wiki3d-lights' )}</p>
            <div id="lightList"></div>
        </div>
                
        <div class="form-group-wrapper">
            <p class="title">{$this->msg( 'wiki3d-renderer' )}</p>
            <div class="form-group">
                <label for="resolutionSelect">{$this->msg( 'wiki3d-resolution' )}</label>
                <select id="resolutionSelect">
                </select>
            </div>
		    <div class="form-group">
		        <label for="clearColor">{$this->msg( 'wiki3d-background-color' )}</label>
		        <input type="color" value="{$this->config['renderer']['clearColor']}" 
		        id="clearColor">
		    </div>
		    <div class="form-group">
		        <label for="opacity">{$this->msg( 'wiki3d-background-opacity' )}</label>
		        <input type="number" value="0" min="0" max="1" step="0.1" id="opacity">
		    </div>
        </div>
    </div>
</div>
EOT;

		return $wrapper;
	}

	protected function getControlsHtml() {
	}

	private function addValidSubpagesList() {
		/** @var SearchResultSet $result */
		$result = $this->searchDB();

		try {
			$titles = $result->extractTitles();
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

	private function searchDB() {
		$dbSearch = SearchEngineFactory::getSearchEngineClass( wfGetDB( DB_REPLICA ) );

		/** @var SearchEngine $dbSearch */
		$dbSearch = new $dbSearch();

		$dbSearch->setNamespaces( [ NS_FILE ] );

		$result = $dbSearch->searchTitle( $this->getFileExtensionToSearch() );

		return $result;
	}

	protected function getFileExtensionToSearch() {
	}

	protected function getGroupName() {
		return 'wiki3d';
	}
}
