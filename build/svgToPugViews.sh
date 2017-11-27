#!/bin/bash
cd src/app/views/icons

for file in *.svg; do
  html2pug --fragment=false < $file | sed -e '1,3d' | (echo 'svg(viewBox="0 0 32 32")' && cat) | (echo '---' && cat) > $file.pug
  rename -v 's/\.svg//' *.pug
done

rm *.svg

