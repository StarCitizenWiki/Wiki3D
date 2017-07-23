# Wiki3D

Interact with 3D Files

## Features


 * [Parser hook](https://www.mediawiki.org/wiki/Manual:Parser_functions) (Wiki3D/Wiki3D.hooks.php)


## Development on Linux (OS X anyone?)
To take advantage of this automation, use the Makefile: `make help`. To start,
run `make install` and follow the instructions.

## Development on Windows
Since you cannot use the `Makefile` on Windows, do the following:

  # Install nodejs, npm, and PHP composer
  # Change to the extension's directory
  # npm install
  # composer install

Once set up, running `npm test` and `composer test` will run automated code checks.
