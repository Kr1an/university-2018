Main.exe:
	mcs Main.cs

clean:
	rm Main.exe || true

build: clean Main.exe
run: build
	mono Main.exe
