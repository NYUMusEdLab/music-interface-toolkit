#!/bin/sh
# Build documentation

lerna exec -- if [ -f "./docusaurus.config.js" ]\; \
  then docusaurus build --out-dir "\$LERNA_ROOT_PATH/docs/\$(echo \$LERNA_PACKAGE_NAME | cut -d'/' -f 2)"\; fi