imgFolder=$1
bayer2rgbDir=$2
inputImg=$3
outImg=$4

# cd $imgFolder
$bayer2rgbDir -i $inputImg -o $outImg fi -w 320 -v 240 -f BGGR -m NEAREST -b 8 -t

convert $outImg ${inputImg}.png

# sleep 5

rm -rf $inputImg ${inputImg}.tiff