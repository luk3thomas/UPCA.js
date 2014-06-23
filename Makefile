.PHONY: test build

test:
	./node_modules/karma/bin/karma start test/karma.conf.js

server:
	python -m SimpleHTTPServer 

build: clean
	@cat src/*.js src/vendor/* | grep -v '__remove__' > build/UPCA.js
	@cp src/*.css build/
	@echo build complete!

clean:
	@rm -rf build/*

setup:
	@npm install

# Alias
t: test
s: server
b: build
