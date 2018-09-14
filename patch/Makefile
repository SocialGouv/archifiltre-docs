repo = https://github.com/jeanbaptisteassouad/cheapExp.git


# Use this to make patchs :
# diff -Naur v5 new-v5 > v5.patch
fetchAndPatch:
	rm -fr ../version
	git clone -b v5 $(repo) ../version/v5
	git clone -b v6 $(repo) ../version/v6
	git clone -b v7 $(repo) ../version/v7
	git clone -b v8 $(repo) ../version/v8
	cp ./* ../version
	patch -p 0 -d ../version -i v5.patch
	patch -p 0 -d ../version -i v6.patch
	patch -f -p 0 -d ../version -i v7.patch
	patch -f -p 0 -d ../version -i v8.patch