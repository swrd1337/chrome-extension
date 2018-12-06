## Installation

<br/>

Clone repository.

```git clone https://github.com/swrd1337/web-author-chrome-extension.git```

<br/>
<br/>

### Google Chrome:

<br/>

1) Go to root directory.

2) Open **cmd** | **terminal** | **bash** and run ```npm run chrome```.

3) Go to ---> ```chrome://extensions/```

4) Turn On **Developer mode**.

5) Load extension with **Load unpacked** from ```target/chrome```.

Done.

<br/>
<br/>

### Mozilla Firefox:

<br/>

1) Go to root directory.

2) Open **cmd** | **terminal** | **bash** and run ```npm run firefox``` or ```npm run fox``` (run after building).

--- If you decided only for build without running ---

3) Open **cmd** | **terminal** | **bash** in the ```targe/firefox``` and write ```web-ext run```.

Done.

<br/>
<br/>

### Both

<br/>

1) Go to root directory.

2) Open **cmd** | **terminal** | **bash** and run ```npm run pack-ext```

3) Go to ```target``` directory.

<br/>
<br/>

### Commands

<br/>

```npm run chrome``` - build chrome extension

```npm run firefox``` - build firefox extension 

```npm run fox``` - build and run firefox extension for testing 

```npm run pack-chrome``` - build and zip chrome extension

```npm run pack-firefox``` - build and zip firefox extension

```npm run pack-ext``` - build and zip both
