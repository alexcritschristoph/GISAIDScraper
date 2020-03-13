Requirements:

* puppeteer
* metadata.tsv file from ncov repository

To run:

```
$ mkdir fasta
$ GISAID_USER=myuser GISAID_PWD=mypassword node scrape.js
```

Sequences will be stored in `fasta/` directory.

To postprocess these sequences for use with ncov, run

```
for f in fasta/*.fasta
do
  sed -i '' -e '$a\' $f
done
cat fasta/*.fasta > sequences.fasta
sed -i -e 's/^>hCoV-19\//>/g' sequences.fasta
sed -i -e 's/|.*$//g' sequences.fasta
sed -i -e 's/> />/g' sequences.fasta
sed -i -e 's/_*$//g' sequences.fasta
sed -i -e 's/ /_/g' sequences.fasta
```
