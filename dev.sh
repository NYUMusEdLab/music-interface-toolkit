#!/bin/sh
# Dev server

# This trap allows us to run the "postdev" script on Ctrl+C
trap 'exit 0' INT

# Allow optional scope filter (to only build one package at a time)
if [ -z $1]
then lerna exec -- rollup -c -w
else lerna --scope @musedlab/$1 exec -- rollup -c -w
fi