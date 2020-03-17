#!/bin/bash
for f in fasta/*.fasta
do
  sed -i '' -e '$a\' $f
done
cat fasta/*.fasta > sequences.fasta
sed -i -e 's/|.*$//g' sequences.fasta
sed -i -e 's/ //g' sequences.fasta
sed -i -e 's/^>hCoV-19\//>/g' sequences.fasta
sed -i -e 's/^>hCov-19\//>/g' sequences.fasta

