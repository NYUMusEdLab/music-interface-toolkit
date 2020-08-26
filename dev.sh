#!/bin/sh
# Dev server

# Allow optional scope filter (to only build one package at a time)
if [ -z $1 ]
then lerna exec -- rollup -c -w
else
  # Build all other packages
#   lerna --ignore @musedlab/$1 exec -- rollup -c
  
  # Check for documentation flag
  if [ "$2" = "doc" ] && [ -f "packages/$1/docusaurus.config.js" ]
  then
    lerna --scope @musedlab/$1 exec -- docusaurus start
  else
    lerna --scope @musedlab/$1 exec -- rollup -c -w
  fi
fi