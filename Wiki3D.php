<?php

if ( function_exists( 'wfLoadExtension' ) ) {
	wfLoadExtension( 'Wiki3D' );
	// Keep i18n globals so mergeMessageFileList.php doesn't break
	$wgMessagesDirs['Wiki3D'] = __DIR__ . '/i18n';
	$wgExtensionMessagesFiles['Wiki3DAlias'] = __DIR__ . '/Wiki3D.i18n.alias.php';
	$wgExtensionMessagesFiles['Wiki3DMagic'] = __DIR__ . '/Wiki3D.i18n.magic.php';
	wfWarn(
		'Deprecated PHP entry point used for Wiki3D extension. Please use wfLoadExtension ' .
		'instead, see https://www.mediawiki.org/wiki/Extension_registration for more details.'
	);
	return true;
} else {
	die( 'This version of the Wiki3D extension requires MediaWiki 1.25+' );
}
