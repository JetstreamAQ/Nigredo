#!/bin/bash

if [ -z "$1" ] || [ -z "$3" ]; then
	echo "No link passed/Invalid # of arguments"
	exit 1
fi

dir=''

while getopts 'd:' flag; do
	case "${flag}" in
		d) 
			if [ -z $OPTARG ]; then
				echo "A directory is required when using -d"
				exit 1
			elif [ -z $3 ]; then
				echo "No URL passed"
				exit 1
			fi

			dir=$OPTARG ;;
		*) 
			echo "Pass -d to designate a directory to move the file to."
			exit 0 ;;
	esac
done

fileName=""

if ! curl --head --silent --fail $3 2> /dev/null; then
	echo "Passed webpage DNE."
	exit 1
fi

if [ $(echo $3 | egrep '^(https:\/\/pbs\.twimg\.com\/media\/.*)') ]; then
	substring=$(echo $3 | grep -o '?format=[a-z]*')
	fileType=".${substring:8}"
	fileName="$(date +%s%3N)$fileType"

	curl --progress-bar -v $3 -o "$dir/$fileName"

	exit 0
else
	curl --progress-bar -O $3
	mv *.{png,PNG,jpg,JPG,jpeg,JPEG} $dir

	exit 0
fi
