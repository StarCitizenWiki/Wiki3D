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
		$this->builderClass = new $this->builderClass();

		try {
			$this->builderClass->setParser( $this );
			$this->configureBuilder();
			$this->builderClass->addToOutput();
			$this->getOutput()->addHTML( $this->getControlsHtml() );
		}
		catch ( InvalidArgumentException $e ) {
			$this->getOutput()->addHTML( $this->msg( 'wiki3dinvalidArguments' ) );
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

		return $dbSearch->searchTitle( $this->getFileExtensionToSearch() );
	}

	protected function getFileExtensionToSearch() {
	}

	protected function getGroupName() {
		return 'other';
	}
}
