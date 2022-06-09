#!/bin/bash

dir=''

while getopts 'd:' flag; do
	case "${flag}" in
		d) 
			if [ -z $OPTARG ]; then
				echo "A directory is required when using -d"
				exit 1;
			elif [ -z $3 ]; then
				echo "No URL passed"
				exit 1;
			fi

			dir=$OPTARG ;;
		*) 
			echo "Pass -d to designate a directory to move the file to."
			exit 0 ;;
	esac
done

fileName=""

if [ ! -z "$1" ] && [ ! -z "$3" ] && [ $(echo $3 | egrep '^(https:\/\/pbs\.twimg\.com\/media\/.*)') ]; then
	substring=$(echo $3 | grep -o '?format=[a-z]*')
	fileType=".${substring:8}"
	#idExtract=$(echo $3 | egrep -o "media\/..+")
	fileName="$(date +%s%3N)$fileType"

	curl --progress-bar -v $3 -o $fileName
	mv $fileName $dir

	exit 0
elif [ ! -z "$1" ] && [ ! -z "$3" ]; then
	curl --progress-bar -v $3
	mv *.{png,PNG,jpg,JPG,jpeg,JPEG} $1

	exit 0
else
	echo "No link passed/Invalid # of arguments"
	exit 1
fi
